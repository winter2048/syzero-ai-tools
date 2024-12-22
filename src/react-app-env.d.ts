/// <reference types="react-scripts" />

interface IUser {
  id: number;
  userName: string;
  token: string;
}

interface IConfig{
  SERVER_URL?: string;
  SERVER_URL_LOGIN?: string;
  APP_TITLE?: string;
  THEME?: string; 
  ICON_URL?: string[];
  GITHUB_URL?: string;
}

interface MenuItem {
  title: string;
  path?: string;
  icon?: string | React.Element;
  children?: MenuItem[];
}


interface Route {
  /** 在应用内显示 */
  appIn: RouteItem[];
  /** 在应用外显示 */
  appOut: RouteItem[];
}

interface RouteItem {
  path: string;
  title: string;
  auth?: boolean;
  component: Promise<any>;
  lazy?: boolean;
}


interface RequestResult<T> {
  code: number;
  data: T;
  msg?: string;
}

interface UserDto {
    id: string;
    name: string;
    mail: string;
    phone: string;
    sex: number;
    createTime: string;
    lastTime: string;
    lastIP: string;
    type: number;
    status: number;
    nickName: string;
    level: number;
    pictureUrl: string;
    description: string;
}

interface ChatSessionDto {
  id: string;
  messages: Array<ChatMessageDto>;
}

interface ChatMessageDto {
  role: number;
  content: string;
  date: string;
}

interface SendMessageDto{
  sessionId: string;
  message: string;
  model?: string;
}

interface ChatSession {
  id: string;
  title: string;
  text: string;
  date: string;
  messages: Array<ChatMessageDto>;
}

interface SceneDto {
  id: string;
  name: string;
  describe: string;
  content: Array<ChatMessageDto>;
  createTime?: string;
  isDefault: boolean
}