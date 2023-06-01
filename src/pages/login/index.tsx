import React from 'react';
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
  InputOnChangeData
} from "@fluentui/react-components";
import { PersonRegular, PasswordRegular } from "@fluentui/react-icons";
import { useNavigate, useLocation} from 'react-router-dom';

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
  const [user, setUser] = React.useState("");
  const [password, setPassword] = React.useState("");
  const onUserChange: InputProps["onChange"] = (ev: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
    console.log(`New value: "${data.value}"`);
    setUser(data.value)
  };
  const onPasswordChange: InputProps["onChange"] = (ev: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
    console.log(`New value: "${data.value}"`);
    setPassword(data.value)
  };

  const onLoginClick = () => {
    console.log(`User: "${user}"  Password:"${password}"`);
    window.localStorage.setItem("token", "sssss");
    navigate("/chat");
  };

  return (
    <div  className={styles.root} >
     <h1>Login</h1>
     <div>
        <Label htmlFor={userId}>用户名</Label>
        <Input contentBefore={<PersonRegular />} id={userId} value={user} onChange={onUserChange} />
      </div>
      <div>
        <Label htmlFor={passwordId}>密码</Label>
        <Input type='password' contentBefore={<PasswordRegular />} id={passwordId} value={password} onChange={onPasswordChange} />
      </div>
      <Button onClick={onLoginClick}>登录</Button>
    </div>
  );
}

export default Login;