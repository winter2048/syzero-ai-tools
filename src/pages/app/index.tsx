import React from "react";
import Header from "../../components/header";
import Content from "../../components/content";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import "../../style/App.css";

function App() {
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
