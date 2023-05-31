import React from 'react';
import logo from '../../assets/logo.svg';
import { makeStyles, Button } from "@fluentui/react-components";

const useStyles = makeStyles({
  wrapper: {
    columnGap: "15px",
    display: "flex",
  },
});

function App() {
  const styles = useStyles();
  return (
    <div className="App">
      <h2>Text</h2>
    </div>
  );
}

export default App;
