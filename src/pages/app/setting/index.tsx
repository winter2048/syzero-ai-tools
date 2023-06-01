import React from 'react';
import logo from '../../assets/logo.svg';
import { makeStyles, Button } from "@fluentui/react-components";

const useStyles = makeStyles({
  wrapper: {
    columnGap: "15px",
    display: "flex",
  },
});

function Setting() {
  const styles = useStyles();
  return (
    <div className="App">
      <h2>Setting</h2>
    </div>
  );
}

export default Setting;
