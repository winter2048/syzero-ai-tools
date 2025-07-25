import { createSlice } from "@reduxjs/toolkit";

const initialState: IConfig = {
  SERVER_URL: "",
  THEME: "",
};

// 定义初始值和 reducer
const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    changeTheme: (state, actions) => {
      localStorage.setItem("config_theme", `${actions.payload.THEME}`);
      state.THEME = actions.payload.THEME;
    },
    initState: (state, actions) => {
      const { SERVER_URL, APP_TITLE, ICON_URL, GITHUB_URL } = actions.payload;
      state.SERVER_URL = SERVER_URL;
      if (window.location.hostname.endsWith(".cn")) {
        state.SERVER_URL = SERVER_URL.replace(".com", ".cn");
      }
      state.APP_TITLE = APP_TITLE;
      state.ICON_URL = ICON_URL;
      state.GITHUB_URL = GITHUB_URL;
      state.THEME = localStorage.getItem("config_theme") || "";
    },
  },
});
// 暴露 actions
export const { changeTheme, initState } = configSlice.actions;
// 导入注册reducer
export default configSlice.reducer;
