import React from "react";
import { makeStyles, Button } from "@fluentui/react-components";
import { rootState } from "../../../store";
import { useDispatch, useSelector } from "react-redux";
import { IUserActionType } from "../../../utils/constant";

const useStyles = makeStyles({
  wrapper: {
    columnGap: "15px",
    display: "flex",
  },
});

function Chat() {
  const styles = useStyles();

  const { user } = useSelector((state: rootState) => state.user);
  const dispatch = useDispatch();
  const handleChangeName = () => {
    dispatch({
      type: IUserActionType.CHANGE,
      payload: { user: { name: "abcd" + Date.now() } },
    });
  };

  return (
    <div className="App">
      <h2>Chat {user.name}</h2>
      <Button onClick={handleChangeName}>Click</Button>
    </div>
  );
}

export default Chat;
