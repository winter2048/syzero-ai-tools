import React from "react";
import Header from "../../components/header";
import Content from "../../components/content";
import { useNavigate, Outlet } from "react-router-dom";
import "../../style/App.css";

export interface ContentProps {
  children: React.ReactNode;
}
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
