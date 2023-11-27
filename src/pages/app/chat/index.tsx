import React, { useState, useRef } from "react";
import { 
  Checkbox,  
  Input,
  Label,
  Select,
  useScrollbarWidth,
  useFluent,
  createTableColumn,
  TableColumnDefinition,
  DialogTrigger,
  Button,
  Toolbar,
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
  Tooltip,
  TableColumnSizingOptions
} from "@fluentui/react-components";
import {
  DataGridBody,
  DataGrid,
  DataGridRow,
  DataGridHeader,
  DataGridCell,
  DataGridHeaderCell,
  RowRenderer
} from '@fluentui-contrib/react-data-grid-react-window';
import SyChatMessage from "../../../components/sy-chat/sy-chat-message";
import SyChatSession from "../../../components/sy-chat/sy-chat-session";
import SyScrollList from "../../../components/sy-scroll-list";
import { OpenAI, Scene } from "../../../api";
import { weChatDate } from "../../../utils/date";
import useSignalR from "../../../utils/useSignalR";
import { MoreHorizontal24Filled, Clover24Regular, Delete24Regular, Save24Regular, Dismiss24Regular,EditRegular, AddCircle24Regular  } from "@fluentui/react-icons";
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
  const [isShowDefaultScene, setIsShowDefaultScene] = useState(false);
  const [isShowSceneEdit, setIsShowSceneEdit] = useState(false);
  const [sceneList, setSceneList] = useState<SceneDto[]>([]);
  const [scene, setScene] = useState<SceneDto>();
  const currentSessionRef = useRef(currentSession)
  currentSessionRef.current = currentSession

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
      if (!s.messages || s.messages.length === 0) {
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
    await OpenAI.DeleteSession(currentSessionRef.current);
    const sessions = await updateData();
    setCurrentSession(sessions[0].id);
  };

  const onClickRefresh = async () => {
    await updateData();
  };

  const onClickSend = async () => {
    const msg = inputValue;
    sessionList
      .find((p) => p.id === currentSessionRef.current)
      ?.messages.push({
        role: 0,
        content: inputValue,
        date: "",
      });
    setSessionList(JSON.parse(JSON.stringify(sessionList)));
    setInputValue("");
    if (isWebsocket) {
      await connection?.invoke("SendMessage", {
        SessionId: currentSessionRef.current,
        Message: msg,
      });
    } else {
      await OpenAI.SendMessage({ sessionId: currentSessionRef.current, message: msg });
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

  const onCleanUpMsg = async () => {
    await OpenAI.PutSession(currentSessionRef.current,[]).catch(res=>console.log(res.msg));
    await updateData();
  }

  const onKeyDown = async (e: any) => {
    if(e.key === 'Enter' && e.ctrlKey) {
      await onClickSend();
    }
  };

  const onClickScene = async (item: SceneDto) =>{
    await OpenAI.PutSession(currentSessionRef.current,item.content).catch(res=>console.log(res.msg));
    await updateData();
    setIsShowDefaultScene(false);
  }

  const onClickDelScene = async (item: SceneDto) =>{
    await Scene.DeleteScene(item.id).catch(res=>console.log(res.msg));
    setIsShowDefaultScene(false);
  }

  const onClickEditScene = async (item: SceneDto) =>{
    setIsShowDefaultScene(false);
    setIsShowSceneEdit(true);
    setScene(item);
  }

  const onClickSaveScene = async () =>{
    if (scene) {
      if (scene.id) {
        await Scene.PutScene(scene.id, scene).catch(res=>console.log(res.msg));
        setIsShowSceneEdit(false);
      }else{
        await Scene.CreateScene(scene).catch(res=>console.log(res.msg));
        setIsShowSceneEdit(false);
      }
    }
  }

  const onClickSaveAsScene = () =>{
    setScene({
      name: "",
      describe: "",
      content: sessionList.find((p) => p.id === currentSessionRef.current)?.messages||[],
      isDefault: false,
      id: ""
    });
    setIsShowSceneEdit(true);
  }

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

  const [columns] = React.useState<TableColumnDefinition<SceneDto>[]>([
    createTableColumn({
      columnId: "name",
      renderHeaderCell: () => <>场景</>,
      renderCell: (item) => <><div onClick={()=>onClickScene(item)}>{item.name}</div></>
    }),
    createTableColumn({
      columnId: "describe",
      renderHeaderCell: () => <>描述</>,
      renderCell: (item) => <><div onClick={()=>onClickScene(item)}>{item.describe}</div></>
    }),
    createTableColumn({
      columnId: "option",
      renderHeaderCell: () => <>操作</>,
      renderCell: (item) => <>{item.isDefault?"预设":
      <Menu>
        <MenuTrigger>
          <ToolbarButton aria-label="More" icon={<MoreHorizontal24Filled />} />
        </MenuTrigger>

        <MenuPopover>
          <MenuList>
            <MenuItem icon={<EditRegular />} onClick={()=> onClickEditScene(item)} >修改</MenuItem>
            <MenuItem icon={<Delete24Regular />} onClick={()=>{onClickDelScene(item)}}>删除</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>}
      </>
    })
  ]);

  const columnSizingOptions:TableColumnSizingOptions = {
    name: {
      idealWidth: 130
    },
    describe: {
      defaultWidth: 350,
      minWidth: 350,
    },
    option: {
      idealWidth: 30
    },
  };

  const renderRow: RowRenderer<SceneDto> = ({ item, rowId }, style) => (
    <DataGridRow<SceneDto> key={rowId} style={style}>
      {({ renderCell }) => <DataGridCell className="sy-scene-des">{renderCell(item)}</DataGridCell>}
    </DataGridRow>
  );
  
   const VirtualizedDataGrid = () => {
    const { targetDocument } = useFluent();
    const scrollbarWidth = useScrollbarWidth({ targetDocument });
  
    return (
      <div style={{ overflowX: "hidden" }}>
        <DataGrid
        items={sceneList}
        columns={columns}
        focusMode="cell"
        resizableColumns
        columnSizingOptions={columnSizingOptions}
      >
        <DataGridHeader style={{ paddingRight: scrollbarWidth }}>
          <DataGridRow>
            {({ renderHeaderCell }) => (
              <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
            )}
          </DataGridRow>
        </DataGridHeader>
        <DataGridBody<any> itemSize={50} height={400}>
          {renderRow}
        </DataGridBody>
      </DataGrid>
      </div>
    );
            }

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

      <Dialog
        open={isShowDefaultScene}
        onOpenChange={(event, data) => {
          // it is the users responsibility to react accordingly to the open state change
          setIsShowDefaultScene(data.open);
        }}
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle
              action={
                <DialogTrigger action="close">
                  <Button
                    appearance="subtle"
                    aria-label="close"
                    icon={<Dismiss24Regular />}
                  />
                </DialogTrigger>
              }
            >
              场景
            </DialogTitle>
            <DialogContent>
              <VirtualizedDataGrid></VirtualizedDataGrid>
            </DialogContent>
          </DialogBody>
        </DialogSurface>
      </Dialog>

      <Dialog
        open={isShowSceneEdit}
        onOpenChange={(event, data) => {
          // it is the users responsibility to react accordingly to the open state change
          setIsShowSceneEdit(data.open);
        }}
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle
              action={
                <DialogTrigger action="close">
                  <Button
                    appearance="subtle"
                    aria-label="close"
                    icon={<Dismiss24Regular />}
                  />
                </DialogTrigger>
              }
            >
              {scene?.id?"编辑场景":"保存新场景"}
            </DialogTitle>
            <DialogContent>
              <div>
                <div className="sy-scence-edit-msg-list">
                  {scene?.content.map(item=>(
                      <div className="sy-scence-edit-msg-item">
                      <Select className="sy-scence-edit-msg-item-left" value={item.role} onChange={(e,d)=>{item.role = parseInt(`${d.value}`); setScene({...scene});}}>
                        <option value={"0"} key="User">User</option>
                        <option value={"1"} key="Assistant">Assistant</option>
                        <option value={"2"} key="System">System</option>
                      </Select>
                      <Textarea className="sy-scence-edit-msg-item-content" value={item.content} onChange={(e,d)=>{item.content = d.value; setScene({...scene});}} />
                      <Button
                        size="small"
                        shape="circular"
                        icon={<Dismiss24Regular />}
                        className="sy-scence-edit-msg-item-del"
                        onClick={()=>{scene.content.splice(scene.content.indexOf(item), 1); setScene({...scene}) }}
                      />
                    </div>
                  ))}
                  <div className="sy-scence-edit-msg-add">
                    <Button className="sy-scence-edit-msg-add-btn" icon={<AddCircle24Regular />} onClick={()=>{scene?.content.push({role: 0, content:"", date: ""}); scene && setScene({...scene});}}>添加对话</Button>
                  </div>
                </div>
                <div className="sy-scence-edit-form">
                  <Label className="sy-scence-edit-form-label">名称</Label>
                  <Input className="sy-scence-edit-form-input" value={scene?.name} onChange={(e,d)=>{ scene && (scene.name = d.value); scene && setScene({...scene});}} />
                </div>
                <div className="sy-scence-edit-form">
                  <Label className="sy-scence-edit-form-label">描述</Label>
                  <Input className="sy-scence-edit-form-input" value={scene?.describe} onChange={(e,d)=>{ scene && (scene.describe = d.value); scene && setScene({...scene});}} />
                </div>
                <div className="sy-scence-edit-form">
                  <Label className="sy-scence-edit-form-label">预设</Label>
                  <Checkbox checked={scene?.isDefault} onChange={(e,d)=>{ scene && (scene.isDefault = d.checked as boolean ); scene && setScene({...scene});}} />
                </div>
              </div>
            </DialogContent>
            <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">取消</Button>
            </DialogTrigger>
            <Button appearance="primary" onClick={onClickSaveScene} >保存</Button>
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
              key={p.id}
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
                  key={d.content}
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
          <div className="sy-chat-room-toolbar">
            <Toolbar>
              <Tooltip content="场景" relationship="label" withArrow>
                <ToolbarButton
                  aria-label="场景"
                  icon={<Clover24Regular />}
                  onClick={async () => {
                    setIsShowDefaultScene(true);
                    setSceneList((await Scene.SceneList()).data);
                  }}
                />
              </Tooltip>
              <Tooltip content="清除聊天" relationship="label" withArrow>
                <ToolbarButton
                  aria-label="清除聊天"
                  icon={<Delete24Regular />}
                  onClick={onCleanUpMsg}
                />
              </Tooltip>
              <Tooltip content="保存为新场景" relationship="label" withArrow>
                <ToolbarButton
                  aria-label="保存为新场景"
                  icon={<Save24Regular />}
                  onClick={onClickSaveAsScene}
                />
              </Tooltip>
            </Toolbar>
          </div>
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
              onKeyDown={onKeyDown}
              value={inputValue}
            />
          </div>
          <div className="sy-chat-room-send">
            <Tooltip content="Ctrl + Enter 发送" relationship="label" withArrow>
              <Button onClick={onClickSend}>发送</Button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
