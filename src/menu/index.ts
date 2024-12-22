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
  }
];

export default menus;
