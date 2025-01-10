import React from "react";
import { Tooltip } from "antd";
import { RightOutlined } from "@ant-design/icons";
import "./style/index.css";

export interface SySiderProps {
  children?: JSX.Element | JSX.Element[] | undefined;
  className?: string;
  siderWidth: number;
  onChange?: (isClose: boolean) => void;
}

const SySider = (props: SySiderProps) => {
  const [isClose, setIsClose] = React.useState(false);

  React.useEffect(() => {
    if (props.onChange) {
      props.onChange(isClose);
    }
  }, [isClose, props]);
  
  return (
    <div
      className={`sy-sider ${isClose ? "sy-sider-close" : ""}`}
      style={{
        transform: isClose ? `translate(-${props.siderWidth}px, 0px)` : "",
      }}
    >
      <div
        className="sy-sider-oc"
        style={{ left: isClose ? `${props.siderWidth}px` : "" }}
        onClick={() => setIsClose(!isClose)}
      >
        <Tooltip
          placement="bottomLeft"
          title={isClose ? "打开菜单" : "关闭菜单"}
        >
          <RightOutlined />
        </Tooltip>
      </div>
      {props.children}
    </div>
  );
};

export default SySider;
