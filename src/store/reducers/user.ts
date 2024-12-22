import { createSlice, createAsyncThunk  } from "@reduxjs/toolkit";
import { Authorization } from "../../api";
import { useNavigate, useLocation, redirect } from "react-router-dom";

const initialState: IUser = {
  id: 0,
  userName: "",
  token: window.localStorage.getItem("token") as string
};

export const logOut = createAsyncThunk('user/logOut',
  async () => {
    await Authorization.LogOut();
  }
) as any;

// 定义初始值和 reducer
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    changeName: (state, actions) => {
      state.userName = actions.payload.userName;
    },
    setToken: (state, actions) => {
      state.token = actions.payload.token;
    },
    initState: (state, actions) => {
      state.id = actions.payload.SERVERid_URL;
      state.userName = actions.payload.userName;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logOut.fulfilled, (state, action) => {
      window.localStorage.setItem("token", "");
      state.token = "";
    });
    builder.addCase(logOut.rejected, (state, action) => {
      window.localStorage.setItem("token", "");
      state.token = "";
    })
  }
});

// 暴露 actions
export const { changeName, initState, setToken} = userSlice.actions;
// 导入注册reducer
export default userSlice.reducer;
