import {
  SearchOutlined,
  MessageOutlined,
  WalletOutlined,
  ReadOutlined,
  SettingOutlined,
  UserOutlined
} from "@ant-design/icons";

const menus: MenuItem[] = [
  {
    title: "聊天",
    icon: MessageOutlined,
    path: "/chat",
  },
  {
    title: "图片",
    icon: WalletOutlined,
    path: "/image",
  },
  {
    title: "文库",
    icon: ReadOutlined,
    path: "/document",
  },
  {
    title: "设置",
    icon: SettingOutlined,
    path: "/config",
  }
];

export default menus;
