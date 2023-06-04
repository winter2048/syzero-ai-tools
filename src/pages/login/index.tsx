import React from "react";
import {
  makeStyles,
  shorthands,
  useId,
  Body1,
  Button,
  Input,
  Label,
  Text,
  ButtonProps,
  InputProps,
  InputOnChangeData,
  Field,
} from "@fluentui/react-components";
import { PersonRegular, PasswordRegular } from "@fluentui/react-icons";
import { useNavigate, useLocation } from "react-router-dom";
import { Authorization } from "../../api";
import "../../style/login.css";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap("20px"),
    // Prevent the example from taking the full width of the page (optional)
    maxWidth: "400px",
    // Stack the label above the field (with 2px gap per the design system)
    "> div": {
      display: "flex",
      flexDirection: "column",
      ...shorthands.gap("2px"),
    },
  },
});

function Login() {
  const styles = useStyles();
  const userId = useId("content-user");
  const passwordId = useId("input-password");
  const navigate = useNavigate();
  const [userName, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordMsg, setPasswordMsg] = React.useState("");
  const [userNameMsg, setUserNameMsg] = React.useState("");
  const onUserNameChange: InputProps["onChange"] = (
    ev: React.ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) => {
    setUserNameMsg("");
    setUserName(data.value);
  };
  const onPasswordChange: InputProps["onChange"] = (
    ev: React.ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) => {
    setPasswordMsg("");
    setPassword(data.value);
  };

  const onLoginClick = async () => {
    if (!userName) {
      setUserNameMsg("请输入用户名！");
      return;
    }
    if (!password) {
      setPasswordMsg("请输入密码！");
      return;
    }

    const token = await Authorization.Login(userName, password).catch(
      (res) => res
    );
    if (token.msg) {
      setPasswordMsg(token.msg);
      return;
    }

    window.localStorage.setItem("token", token.data);
    navigate("/chat");
  };

  return (
    <div className="container">
      <div className="login-wrapper">
        <div className="header">AI Tools</div>
        <div className="header-subtitle">登录</div>
        <div className="form-wrapper">
          <div className="input-item">
            <Field validationMessage={userNameMsg}>
              <Input
                contentBefore={<PersonRegular />}
                id={userId}
                value={userName}
                onChange={onUserNameChange}
                placeholder="用户名"
                style={{
                  border: "none",
                  borderBottom: "1px solid rgb(128, 125, 125)",
                }}
              />
            </Field>
          </div>
          <div className="input-item">
            <Field validationMessage={passwordMsg}>
              <Input
                type="password"
                contentBefore={<PasswordRegular />}
                id={passwordId}
                value={password}
                onChange={onPasswordChange}
                placeholder="密码"
                style={{
                  border: "none",
                  borderBottom: "1px solid rgb(128, 125, 125)",
                }}
              />
            </Field>
          </div>
          <Button onClick={onLoginClick} className="btn">
            登录
          </Button>
        </div>
        <div className="msg">
          没有帐户
          <a href="#" style={{ marginLeft: "5px" }}>
            注册
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
