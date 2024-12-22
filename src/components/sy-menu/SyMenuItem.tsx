import {
    Button
  } from "antd";
  import * as React from "react";
  import { useNavigate, useLocation } from "react-router-dom";
  
  export interface SyMenuItemProps {
    path?: string;
    title?: string;
    icon?: React.ReactNode;
    className?: string;
    onClick?: () => void;
  }

  export const SyMenuItem = (props: SyMenuItemProps) => {
    const location = useLocation();
    const navigate = useNavigate();
  
    return (
        <Button 
        icon={props.icon}
        className={
            "sy-layout-menu-btn" +
            (location.pathname === props.path
              ? " sy-layout-menu-btn-active "
              : " ") +
            props.className
        }
        onClick={()=> {
            if (props.onClick) {
                props.onClick();
            }
            props.path && navigate(props.path);
        }}>
        {props.title}
        </Button>
    );
  };
  export default SyMenuItem;
  