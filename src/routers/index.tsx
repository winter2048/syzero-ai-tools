import { RouteObject, useRoutes } from "react-router-dom";
import React, { lazy } from "react";
import { Spin } from 'antd';
import RequireAuth from "../components/requireAuth";
import routes from "./routes";
const App = lazy(() => import("../pages/app"));

const router: Array<RouteObject> = [
  {
    path: "/",
    element: (
      <React.Suspense fallback={<Spin size="large" className="sy-common-center" />}>
        <App />
      </React.Suspense>
    ),
    children: [
      ...routes.appIn.map((route) => {
        const Component = lazy(() => route.component);
        return {
          path: route.path,
          element: (
            <React.Suspense fallback={<Spin size="large" className="sy-common-center" />}>
              {route.auth ? (
                <RequireAuth>
                   <Component />
                </RequireAuth>
              ) : (
                <Component />
              )}
            </React.Suspense>
          ),
        };
      }),
    ],
  },
  ...routes.appOut.map((route) => {
    const Component = lazy(() => route.component);
    return {
      path: route.path,
      element: (
        <React.Suspense fallback={<Spin size="large" className="sy-common-center" />}>
          {route.auth ? (
            <RequireAuth>
              <Component />
            </RequireAuth>
          ) : (
            <Component />
          )}
        </React.Suspense>
      ),
    };
  }),
];

function Routes() {
  return useRoutes(router);
}

export default Routes;
