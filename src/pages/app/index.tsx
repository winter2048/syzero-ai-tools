import React from "react";
import Header from "../../components/header";
import Content from "../../components/content";
import { Outlet } from "react-router-dom";
import "../../style/App.css";
import { useDispatch } from "react-redux";
import { IActionType } from "../../utils/constant";
import { Authorization } from "../../api";

function App() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    (async function fn(){
      const userInfo = await Authorization.GetUserInfo();
      dispatch({
        type: IActionType.UserChange,
        payload: { name: userInfo.data.nickName },
      });
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
