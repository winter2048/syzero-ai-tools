import React from "react";
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
} from "@fluentui/react-components";
import { rootState } from "../../../store";
import SyChatMessage from "../../../components/sy-chat/sy-chat-message";
import SyChatSession from "../../../components/sy-chat/sy-chat-session";
import { OpenAI } from "../../../api";
import { weChatDate } from "../../../utils/date";
import { useDispatch, useSelector } from "react-redux";
import { MoreHorizontal24Filled } from "@fluentui/react-icons";
import "../../../style/chat.css";

function Chat() {
  const chatBoxRef = React.useRef<HTMLDivElement>(null);
  const [bottomColor, setBottomColor] = React.useState("#f5f5f5");
  const [sessionList, setSessionList] = React.useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = React.useState("");
  const [inputValue, setInputValue] = React.useState("");

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
    await OpenAI.SendMessage({ sessionId: currentSession, message: msg });
    await updateData();
  };

  const onClickAddSession = async () => {
    const sessionId = await OpenAI.CreateSession();
    await updateData();
    setCurrentSession(sessionId.data);
  };

  const updateData = async () => {
    const sessions = await OpenAI.SessionList();
    const data = sessions.data.map((s) => {
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
    setSessionList(data);
    return data;
  };

  const chatScrollToBottom = () => {
    const chatBox = chatBoxRef.current;
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
  }, []);

  return (
    <div className="sy-chat">
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
        <div
          className="sy-chat-room-center sy-list-hover-scroll"
          ref={chatBoxRef}
        >
          {sessionList
            .find((p) => p.id === currentSession)
            ?.messages.map((d) => (
              <SyChatMessage
                role={d.role}
                name={d.role === 1 ? "AI" : ""}
                text={d.content}
              />
            ))}
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
