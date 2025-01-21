import { RouteObject, useRoutes, useNavigate, useLocation } from "react-router-dom";
import React, { lazy, useEffect } from "react";
import { Spin } from "antd";
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
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname == "/" && routes.appIn.find((p) => p.default)?.path) {
      navigate(routes.appIn.find((p) => p.default)?.path || "/");
    }
  }, [location.pathname, navigate]);

  return (
    useRoutes(router)
  );
}

export default Routes;
