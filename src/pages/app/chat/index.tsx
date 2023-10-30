import React, { useState } from "react";
import {
  Button,
  ToolbarButton,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  Textarea,
  TextareaProps,
  TextareaOnChangeData,
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  Switch,
  SwitchProps,
  SwitchOnChangeData,
} from "@fluentui/react-components";
import SyChatMessage from "../../../components/sy-chat/sy-chat-message";
import SyChatSession from "../../../components/sy-chat/sy-chat-session";
import SyScrollList from "../../../components/sy-scroll-list";
import { OpenAI } from "../../../api";
import { weChatDate } from "../../../utils/date";
import useSignalR from "../../../utils/useSignalR";
import { MoreHorizontal24Filled } from "@fluentui/react-icons";
import store from "../../../store";
import "../../../style/chat.css";

function Chat() {
  const chatBoxRef = React.useRef<any>(null);
  const [bottomColor, setBottomColor] = useState("#f5f5f5");
  const [sessionList, setSessionList] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isConnection, setIsConnection] = useState(true);
  const [isWebsocket, setIsWebsocket] = useState(true);
  const [connection] = useSignalR({
    url: `${store.getState().config.SERVER_URL}/chathub`,
  });

  connection?.on("ReceiveMessage", (sessions: ChatSessionDto[]) => {
    const data = sessionMap(sessions);
    setSessionList(data);
  });

  connection?.on("Disconnect", function () {
    setIsConnection(false);
  });

  const reConnection = async () => {
    await connection?.stop();
    setIsConnection(true);
  };

  const onChangeIsWebsocket: SwitchProps["onChange"] = (
    ev: React.ChangeEvent<HTMLInputElement>,
    data: SwitchOnChangeData
  ) => {
    setIsWebsocket(data.checked);
  };

  const sessionMap = (sessions: ChatSessionDto[]) => {
    return sessions.map((s) => {
      if (s.messages.length === 0) {
        return {
          id: s.id,
          title: "新会话",
          text: "",
          date: "",
          messages: [],
        };
      } else {
        const title = s.messages[0].content;
        const text = s.messages[s.messages.length - 1].content;
        const date = weChatDate(s.messages[s.messages.length - 1].date);
        return {
          id: s.id,
          title,
          text,
          date,
          messages: s.messages,
        };
      }
    });
  };

  const onInputFocus = () => {
    setBottomColor("#fff");
  };

  const onInputBlur = () => {
    setBottomColor("#f5f5f5");
  };

  const onInputChange: TextareaProps["onChange"] = (
    ev: React.ChangeEvent<HTMLTextAreaElement>,
    data: TextareaOnChangeData
  ) => {
    setInputValue(data.value);
  };

  const onClickSession = (sessionId: string) => {
    setCurrentSession(sessionId);
  };

  const onClickDelete = async () => {
    await OpenAI.DeleteSession(currentSession);
    const sessions = await updateData();
    setCurrentSession(sessions[0].id);
  };

  const onClickRefresh = async () => {
    await updateData();
  };

  const onClickSend = async () => {
    const msg = inputValue;
    sessionList
      .find((p) => p.id === currentSession)
      ?.messages.push({
        role: 0,
        content: inputValue,
        date: "",
      });
    setSessionList(JSON.parse(JSON.stringify(sessionList)));
    setInputValue("");
    if (isWebsocket) {
      await connection?.invoke("SendMessage", {
        SessionId: currentSession,
        Message: msg,
      });
    } else {
      await OpenAI.SendMessage({ sessionId: currentSession, message: msg });
      await updateData();
    }
  };

  const onClickAddSession = async () => {
    const sessionId = await OpenAI.CreateSession();
    await updateData();
    setCurrentSession(sessionId.data);
  };

  const updateData = async () => {
    const sessions = await OpenAI.SessionList();
    const data = sessionMap(sessions.data);
    setSessionList(data);
    return data;
  };

  const chatScrollToBottom = () => {
    const chatBox = chatBoxRef.current.parentRef.current;
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight - chatBox.clientHeight;
    }
  };

  React.useEffect(() => {
    chatScrollToBottom();
  }, [sessionList, currentSession]);

  React.useEffect(() => {
    const fun = async () => {
      const sessions = await updateData();
      if (sessions.length === 0) {
        await onClickAddSession();
      } else {
        setCurrentSession(sessions[0].id);
      }
    };
    fun();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="sy-chat">
      <Dialog modalType="alert" open={!isConnection && isWebsocket}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>错误</DialogTitle>
            <DialogContent>已断开连接。</DialogContent>
            <DialogActions>
              <Button appearance="primary" onClick={reConnection}>
                重新连接
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
      <div className="sy-chat-session">
        <div className="sy-chat-session-add" onClick={onClickAddSession}>
          +
        </div>
        <div className="sy-chat-session-list sy-list-hover-scroll">
          {sessionList.map((p) => (
            <SyChatSession
              title={p.title}
              text={p.text}
              date={p.date}
              onClick={() => {
                onClickSession(p.id);
              }}
              select={p.id === currentSession}
            />
          ))}
        </div>
        <div className="sy-chat-session-switch">
          <Switch
            label="开启websocket"
            checked={isWebsocket}
            onChange={onChangeIsWebsocket}
          />
        </div>
      </div>
      <div className="sy-chat-room">
        <div className="sy-chat-room-top">
          <div className="sy-chat-room-top-title">
            {sessionList.find((p) => p.id === currentSession)?.title}
          </div>
          <div className="sy-chat-room-top-more">
            <Menu>
              <MenuTrigger>
                <ToolbarButton
                  aria-label="More"
                  icon={<MoreHorizontal24Filled />}
                />
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  <MenuItem onClick={onClickRefresh}>刷新</MenuItem>
                  <MenuItem onClick={onClickDelete}>删除</MenuItem>
                </MenuList>
              </MenuPopover>
            </Menu>
          </div>
        </div>
        <div className="sy-chat-room-center">
          <SyScrollList ref={chatBoxRef}>
            {sessionList
              .find((p) => p.id === currentSession)
              ?.messages.map((d) => (
                <SyChatMessage
                  role={d.role}
                  name={d.role === 1 ? "AI" : ""}
                  text={d.content}
                />
              ))}
          </SyScrollList>
        </div>
        <div
          className="sy-chat-room-bottom"
          style={{ backgroundColor: bottomColor }}
        >
          <div className="sy-chat-room-input">
            <Textarea
              size="large"
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                backgroundColor: bottomColor,
              }}
              onFocus={onInputFocus}
              onBlur={onInputBlur}
              onChange={onInputChange}
              value={inputValue}
            />
          </div>
          <div className="sy-chat-room-send">
            <Button onClick={onClickSend}>发送</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
