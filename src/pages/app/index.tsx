import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header";
import Content from "../../components/content";
import { Outlet } from "react-router-dom";
import "../../style/App.css";
import { useDispatch } from "react-redux";
import { IActionType } from "../../utils/constant";
import { Authorization } from "../../api";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    (async function fn(){
      const userInfo = await Authorization.GetUserInfo().catch(res => {
        if (res.code === -3) {
          navigate("/login");
        }
      });
      dispatch({
        type: IActionType.UserChange,
        payload: { name: userInfo?.data.nickName },
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
