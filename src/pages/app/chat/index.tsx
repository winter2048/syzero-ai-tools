/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useRef } from "react";
import SyChatMessage from "../../../components/sy-chat/sy-chat-message";
import SyChatSession from "../../../components/sy-chat/sy-chat-session";
import SyScrollList from "../../../components/sy-scroll-list";
import { OpenAI, Scene } from "../../../api";
import { weChatDate } from "../../../utils/date";
import useSignalR from "../../../utils/useSignalR";
import {
  MoreOutlined,
  AppstoreOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
  PlusCircleOutlined,
  EditOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Input,
  Select,
  Tooltip,
  Flex,
  Switch,
  Modal,
  Dropdown,
} from "antd";
import { Space, Table } from "antd";
import type { TableColumnsType } from "antd";
import {
  SyPage,
  SyPageHeader,
  SyPageContent,
} from "../../../components/sy-page";
import SySider from "../../../components/sy-sider";
import store from "../../../store";
import "../../../style/chat.css";

function Chat() {
  const chatBoxRef = React.useRef<any>(null);
  const [bottomColor, setBottomColor] = useState("var(--ant-layout-body-bg)");
  const [sessionList, setSessionList] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isConnection, setIsConnection] = useState(true);
  const [isWebsocket, setIsWebsocket] = useState(true);
  const [isShowDefaultScene, setIsShowDefaultScene] = useState(false);
  const [isShowSceneEdit, setIsShowSceneEdit] = useState(false);
  const [sceneList, setSceneList] = useState<SceneDto[]>([]);
  const [scene, setScene] = useState<SceneDto>();
  const [gptModel, setGptModel] = useState<string>("gpt-4o-mini");
  const [aiModels, setAiModels] = useState<any>({});
  const [isClose, setIsClose] = React.useState(false);
  const currentSessionRef = useRef(currentSession);
  const [modal, contextHolder] = Modal.useModal();
  currentSessionRef.current = currentSession;

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

  const GPTModelOptions = [
    { key: "mymodel-1", value: "ollama:mymodel-1" },
    { key: "nezahatkorkmaz/deepseek-v3", value: "ollama:nezahatkorkmaz/deepseek-v3" },
    { key: "GPT3.5", value: "gpt-3.5-turbo" },
    { key: "GPT4", value: "gpt-4-1106-preview" },
    { key: "GPT4-Vision", value: "gpt-4-vision-preview" },
    { key: "GPT4O-Mini", value: "gpt-4o-mini" },
  ];

  const onInputFocus = () => {
    setBottomColor("var(--ant-layout-light-sider-bg)");
  };

  const onInputBlur = () => {
    setBottomColor("var(--ant-layout-body-bg)");
  };

  const onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
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
        Model: gptModel,
      });
    } else {
      await OpenAI.SendMessage({
        sessionId: currentSessionRef.current,
        message: msg,
        model: gptModel,
      });
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
    await OpenAI.PutSession(currentSessionRef.current, []).catch((res) =>
      console.log(res.msg)
    );
    await updateData();
  };

  const onKeyDown = async (e: any) => {
    if (e.key === "Enter" && e.ctrlKey) {
      await onClickSend();
    }
  };

  const onClickScene = async (item: SceneDto) => {
    await OpenAI.PutSession(currentSessionRef.current, item.content).catch(
      (res) => console.log(res.msg)
    );
    await updateData();
    setIsShowDefaultScene(false);
  };

  const onClickDelScene = async (item: SceneDto) => {
    await Scene.DeleteScene(item.id).catch((res) => console.log(res.msg));
    setIsShowDefaultScene(false);
  };

  const onClickEditScene = async (item: SceneDto) => {
    setIsShowDefaultScene(false);
    setIsShowSceneEdit(true);
    setScene(item);
  };

  const onClickSaveScene = async () => {
    if (scene) {
      if (scene.id) {
        await Scene.PutScene(scene.id, scene).catch((res) =>
          console.log(res.msg)
        );
        setIsShowSceneEdit(false);
      } else {
        await Scene.CreateScene(scene).catch((res) => console.log(res.msg));
        setIsShowSceneEdit(false);
      }
    }
  };

  const onClickSaveAsScene = () => {
    setScene({
      name: "",
      describe: "",
      content:
        sessionList.find((p) => p.id === currentSessionRef.current)?.messages ||
        [],
      isDefault: false,
      id: "",
    });
    setIsShowSceneEdit(true);
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

    OpenAI.GetModels().then((res) => {
      setAiModels(res.data);
    });
    fun();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: TableColumnsType<SceneDto> = [
    {
      title: "场景",
      dataIndex: "name",
      key: "name",
      width: 130,
    },
    {
      title: "描述",
      dataIndex: "describe",
      key: "describe",
      ellipsis: {
        showTitle: false,
      },
      render: (describe) => (
        <Tooltip placement="topLeft" title={describe}>
          {describe}
        </Tooltip>
      ),
    },
    {
      title: "操作",
      key: "action",
      width: 60,
      render: (_, record) =>
        record.isDefault ? (
          "预设"
        ) : (
          <Space size="small">
            <Dropdown
              menu={{
                items: [
                  {
                    key: "1",
                    label: "修改",
                    icon: <EditOutlined />,
                    onClick: (e) => {
                      e.domEvent.stopPropagation();
                      onClickEditScene(record);
                    },
                  },
                  {
                    key: "2",
                    label: "删除",
                    icon: <DeleteOutlined />,
                    onClick: (e) => {
                      e.domEvent.stopPropagation();
                      onClickDelScene(record);
                    },
                  },
                ],
              }}
              placement="bottomLeft"
              arrow
            >
              <a onClick={(e) => e.stopPropagation()}>
                <Space>
                  <MoreOutlined rotate={90} />
                </Space>
              </a>
            </Dropdown>
          </Space>
        ),
    },
  ];

  return (
    <SyPage>
      <SyPageHeader title="聊天"></SyPageHeader>
      <SyPageContent>
        <div className="sy-chat">
          {contextHolder}
          <Modal
            title="错误"
            open={!isConnection && isWebsocket}
            onOk={reConnection}
            okText="重新连接"
            centered={true}
            closable={false}
            footer={(_, { OkBtn, CancelBtn }) => (
              <>
                <OkBtn />
              </>
            )}
          >
            Websocket 已断开连接。
          </Modal>

          <Modal
            open={isShowDefaultScene}
            title="场景"
            footer={null}
            centered={true}
            onCancel={() => setIsShowDefaultScene(false)}
            width={800}
          >
            <Table<SceneDto>
              columns={columns}
              dataSource={sceneList}
              pagination={{ pageSize: 8 }}
              onRow={(record) => ({
                onClick: () => onClickScene(record),
              })}
            />
          </Modal>

          <Modal
            open={isShowSceneEdit}
            title={scene?.id ? "编辑场景" : "保存新场景"}
            okText="保存"
            cancelText="取消"
            centered={true}
            onOk={() => {
              // it is the users responsibility to react accordingly to the open state change
              setIsShowSceneEdit(true);
              onClickSaveScene();
            }}
            onCancel={() => {
              // it is the users responsibility to react accordingly to the open state change
              setIsShowSceneEdit(false);
            }}
            width={800}
          >
            <div>
              <div className="sy-scence-edit-msg-list">
                {scene?.content.map((item) => (
                  <div className="sy-scence-edit-msg-item">
                    <Select
                      className="sy-scence-edit-msg-item-left"
                      value={item.role}
                      options={[
                        { value: 0, label: "User" },
                        { value: 1, label: "Assistant" },
                        { value: 2, label: "System" },
                      ]}
                      onChange={(value) => {
                        item.role = parseInt(`${value}`);
                        setScene({ ...scene });
                      }}
                    />
                    <Input.TextArea
                      className="sy-scence-edit-msg-item-content"
                      value={item.content}
                      onChange={(e) => {
                        item.content = e.target.value;
                        setScene({ ...scene });
                      }}
                    />
                    <Button
                      size="small"
                      shape="circle"
                      icon={<CloseOutlined />}
                      className="sy-scence-edit-msg-item-del"
                      onClick={() => {
                        scene.content.splice(scene.content.indexOf(item), 1);
                        setScene({ ...scene });
                      }}
                    />
                  </div>
                ))}
                <div className="sy-scence-edit-msg-add">
                  <Button
                    className="sy-scence-edit-msg-add-btn"
                    icon={<PlusCircleOutlined />}
                    onClick={() => {
                      scene?.content.push({ role: 0, content: "", date: "" });
                      scene && setScene({ ...scene });
                    }}
                  >
                    添加对话
                  </Button>
                </div>
              </div>
              <div className="sy-scence-edit-form">
                <label className="sy-scence-edit-form-label">名称</label>
                <Input
                  className="sy-scence-edit-form-input"
                  value={scene?.name}
                  onChange={(e) => {
                    scene && (scene.name = e.target.value);
                    scene && setScene({ ...scene });
                  }}
                />
              </div>
              <div className="sy-scence-edit-form">
                <label className="sy-scence-edit-form-label">描述</label>
                <Input
                  className="sy-scence-edit-form-input"
                  value={scene?.describe}
                  onChange={(e) => {
                    scene && (scene.describe = e.target.value);
                    scene && setScene({ ...scene });
                  }}
                />
              </div>
              <div className="sy-scence-edit-form">
                <label className="sy-scence-edit-form-label">预设</label>
                <Checkbox
                  checked={scene?.isDefault}
                  onChange={(e) => {
                    scene && (scene.isDefault = e.target.checked as boolean);
                    scene && setScene({ ...scene });
                  }}
                />
              </div>
            </div>
          </Modal>
          <SySider siderWidth={340} onChange={(isClose) => setIsClose(isClose)}>
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
              <div style={{ width: 155 }}>
                <Tooltip title="选择模型">
                  <Select
                    style={{ width: 155 }}
                    size="small"
                    value={gptModel}
                    options={Object.keys(aiModels).map((key) => ({
                      value: aiModels[key],
                      label: key,
                    }))}
                    onChange={(value) => {
                      setGptModel(value);
                    }}
                  />
                </Tooltip>
              </div>
              <Tooltip title="WebSocket 状态">
                <Switch
                  checkedChildren="WS开启"
                  unCheckedChildren="WS关闭"
                  checked={isWebsocket}
                  onChange={(checked, e) => {
                    setIsWebsocket(checked);
                  }}
                />
              </Tooltip>
            </div>
          </div>
          </SySider>
          <div className="sy-chat-room" style={{width: isClose ? "100%" : "calc(100% - 250px)"}}>
            <div className="sy-chat-room-top">
              <div className="sy-chat-room-top-title">
                {sessionList.find((p) => p.id === currentSession)?.title}
              </div>
              <div className="sy-chat-room-top-more">
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "1",
                        label: "刷新",
                        icon: <ReloadOutlined />,
                        onClick: () => onClickRefresh(),
                      },
                      {
                        key: "2",
                        label: "删除",
                        icon: <DeleteOutlined />,
                        onClick: () => onClickDelete(),
                      },
                    ],
                  }}
                  placement="bottomLeft"
                  arrow
                >
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      <MoreOutlined rotate={90} />
                    </Space>
                  </a>
                </Dropdown>
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
                <Flex vertical gap="middle">
                  <Flex gap="0" wrap>
                    <Tooltip title="场景">
                      <Button
                        aria-label="场景"
                        type="text"
                        size="middle"
                        icon={<AppstoreOutlined />}
                        onClick={async () => {
                          setIsShowDefaultScene(true);
                          setSceneList((await Scene.SceneList()).data);
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="清除聊天">
                      <Button
                        aria-label="清除聊天"
                        type="text"
                        size="middle"
                        icon={<DeleteOutlined />}
                        onClick={onCleanUpMsg}
                      />
                    </Tooltip>
                    <Tooltip title="保存为新场景">
                      <Button
                        aria-label="保存为新场景"
                        type="text"
                        size="middle"
                        icon={<SaveOutlined />}
                        onClick={onClickSaveAsScene}
                      />
                    </Tooltip>
                  </Flex>
                </Flex>
              </div>
              <Input.TextArea
                size="large"
                style={{
                  backgroundColor: bottomColor,
                }}
                className="sy-chat-room-input"
                onFocus={onInputFocus}
                onBlur={onInputBlur}
                onChange={onInputChange}
                onKeyDown={onKeyDown}
                value={inputValue}
              />

              <div className="sy-chat-room-send">
                <Tooltip title="Ctrl + Enter 发送">
                  <Button type="primary" onClick={onClickSend}>
                    发送
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </SyPageContent>
    </SyPage>
  );
}

export default Chat;
