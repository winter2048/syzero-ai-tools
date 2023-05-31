import { RouteObject, useRoutes } from "react-router-dom";
import React, { lazy } from "react";
import RequireAuth from "../components/requireAuth";
// react懒加载
const App = lazy(() => import("../pages/app"));
const Chat = lazy(() => import("../pages/app/chat"));
const Image = lazy(() => import("../pages/app/image"));
const Text = lazy(() => import("../pages/app/text"));
const Login = lazy(() => import("../pages/login"));

const router: Array<RouteObject> = [
  {
    path: "/app",
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <RequireAuth>
          <App />
        </RequireAuth>
      </React.Suspense>
    ),
    children: [
      {
        path: "chat",
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <Chat />
          </React.Suspense>
        ),
      },
      {
        path: "image",
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <Image />
          </React.Suspense>
        ),
      },
      {
        path: "text",
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <Text />
          </React.Suspense>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <Login />
      </React.Suspense>
    ),
  },
];

function Routes() {
  return useRoutes(router);
}

export default Routes;
