import React from "react";
import { Button, Flex, Avatar, Tooltip, Layout } from "antd";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppStore";
import { changeTheme } from "../../store/reducers/config";
import { logOut } from "../../store/reducers/user";
import menus from "../../menu";
import { GithubOutlined, RightOutlined, LeftOutlined } from "@ant-design/icons";
import SyMenuItem from "./SyMenuItem";
import IconFont from "../icon-font";
const { Sider } = Layout;

export const SyMenu = () => {
  const dispatch = useAppDispatch();
  const { THEME, GITHUB_URL } = useAppSelector((state) => state.config);
  const { userName } = useAppSelector((state) => state.user);
  const [isClose, setIsClose] = React.useState(false);

  return (
    <Sider
      width={60}
      className={`sy-layout-menu ${isClose ? "sy-layout-menu-close" : ""}`}
    >
      <Flex
        vertical={true}
        align={"center"}
        style={{ height: "100%" }}
        justify={"space-between"}
      >
        <Flex vertical={true} align={"center"}>
          <div className="sy-layout-menu-avatar">
            <Avatar size={32}>{userName}</Avatar>
          </div>
          {menus.map((menu) => (
            <SyMenuItem
              path={menu.path}
              title={menu.title}
              icon={
                typeof menu.icon === "string" ? (
                  <IconFont type={menu.icon} />
                ) : (
                  <menu.icon />
                )
              }
              key={menu.path}
            ></SyMenuItem>
          ))}
        </Flex>

        <Flex vertical={true} align={"center"}>
          <Tooltip placement="right" title="退出登录">
            <Button
              className="sy-layout-menu-btn"
              icon={<IconFont type="icon-tuichudenglu" />}
              onClick={() => {
                dispatch(logOut());
              }}
            ></Button>
          </Tooltip>
          <Tooltip
            placement="right"
            title={THEME === "dark" ? "亮色模式" : "暗色模式"}
          >
            <Button
              className="sy-layout-menu-btn"
              icon={
                <IconFont
                  type={
                    THEME === "dark" ? "icon-icons-sun" : "icon-yejianmoshi"
                  }
                />
              }
              onClick={() => {
                dispatch(
                  changeTheme({ THEME: THEME === "dark" ? "light" : "dark" })
                );
              }}
            ></Button>
          </Tooltip>
          <Tooltip placement="right" title="GitHub">
            <Button
              className="sy-layout-menu-btn"
              icon={<GithubOutlined />}
              onClick={() => {
                window.open(GITHUB_URL, "_blank");
              }}
            ></Button>
          </Tooltip>
        </Flex>

        <div className="sy-layout-menu-oc" onClick={() => setIsClose(!isClose)}>
          <Tooltip
            placement="bottomLeft"
            title={isClose ? "打开菜单" : "关闭菜单"}
          >
            {isClose ? <RightOutlined /> : <LeftOutlined />}
          </Tooltip>
        </div>
      </Flex>
    </Sider>
  );
};

export default SyMenu;
