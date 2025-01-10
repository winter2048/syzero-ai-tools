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
      state.THEME = actions.payload.THEME;
    },
    initState: (state, actions) => {
      const { SERVER_URL, SERVER_URL_LOGIN, APP_TITLE, ICON_URL, GITHUB_URL } =
        actions.payload;
      state.SERVER_URL = SERVER_URL;
      state.SERVER_URL_LOGIN = SERVER_URL_LOGIN;
      state.APP_TITLE = APP_TITLE;
      state.ICON_URL = ICON_URL;
      state.GITHUB_URL = GITHUB_URL;
    },
  },
});
// 暴露 actions
export const { changeTheme, initState } = configSlice.actions;
// 导入注册reducer
export default configSlice.reducer;
