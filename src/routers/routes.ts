const routes: Route = {
  appIn: [
    {
      title: "聊天",
      path: "/chat",
      auth: true,
      component: import("../pages/app/chat"),
    },
    {
      title: "图片",
      path: "/image",
      auth: true,
      component: import("../pages/app/image"),
    }
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
