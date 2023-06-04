import React from "react";
import Header from "../../components/header";
import Content from "../../components/content";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import "../../style/App.css";
import { useDispatch, useSelector } from "react-redux";
import { IUserActionType } from "../../utils/constant";
import { Authorization } from "../../api";

function App() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    (async function fn(){
      const userInfo = await Authorization.GetUserInfo();
      dispatch({
        type: IUserActionType.CHANGE,
        payload: { user: { name: userInfo.data.nickName } },
      });
    })();
  }, []);

  return (
    <div className="App">
      <Header></Header>
      <Content>
        <Outlet />
      </Content>
    </div>
  );
}

export default App;
