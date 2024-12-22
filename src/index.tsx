import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { HashRouter } from "react-router-dom";
import Routes from "./routers";
import { Provider as StoreProvider } from "react-redux";
import store from "./store";
import { initState } from "./store/reducers/config";
import { useAppDispatch, useAppSelector } from "./hooks/useAppStore";
import axios from "axios";
import { ConfigProvider, theme } from "antd";
import "./style/index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const RootElement = (props: { env: any }) => {
  const dispatch = useAppDispatch();
  dispatch(initState({ ...props.env }));
  const { THEME } = useAppSelector((state) => state.config);
  return (
    <div className="App" data-theme={THEME ?  THEME:"light"}>
      <HashRouter>
        <ConfigProvider
          theme={{
            algorithm:
              THEME === "dark" ? theme.darkAlgorithm : undefined,
            cssVar: true,
          }}
        >
          <Routes />
        </ConfigProvider>
      </HashRouter>
    </div>
  );
};

axios.get("/config.json").then((res) => {
  const env = {...res.data.COMMON,...res.data[res.data.UI_ENVIRONMENT]};
  root.render(
    <StoreProvider store={store}>
      <RootElement env={env} />
    </StoreProvider>
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
