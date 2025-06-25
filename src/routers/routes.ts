const routes: Route = {
  appIn: [
    {
      title: "聊天",
      path: "/chat",
      auth: true,
      default: true,
      component: import("../pages/app/chat"),
    },
    {
      title: "图片",
      path: "/image",
      auth: true,
      component: import("../pages/app/image"),
    },
    {
      title: "文库",
      path: "/document",
      auth: true,
      component: import("../pages/app/document"),
    },
    {
      title: "设置",
      path: "/config",
      auth: true,
      component: import("../pages/app/config"),
    },
  ],
  appOut: [
    {
      title: "登录",
      path: "/login",
      component: import("../pages/login"),
    },
  ],
};

export default routes;
