import {
  Tab,
  TabList,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  SelectTabData,
  SelectTabEvent,
} from "@fluentui/react-components";
import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Authorization } from "../../api";
import { useSelector } from 'react-redux';

export const Header = () => {
  const defaultMenu = "/chat";
  const location = useLocation();
  const navigate = useNavigate();
  const [tab, setTab] = React.useState(location.pathname);
  const userName = useSelector((state: any) => state.user.name);
  const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    navigate(data.value as string);
    setTab(data.value as string);
  };
  const onLogOut = async () => {
    await Authorization.LogOut();
    window.localStorage.setItem("token", "");
    navigate("/login");
  };

  React.useEffect(() => {
    if (location.pathname === "/") {
      navigate(defaultMenu);
      setTab(defaultMenu);
    }
  }, [location.pathname, navigate]);

  return (
    <div className="sy-header">
      <TabList
        defaultSelectedValue={defaultMenu}
        onTabSelect={onTabSelect}
        selectedValue={tab}
      >
        <Tab value="/chat">聊天</Tab>
        <Tab value="/image">图片</Tab>
        <Tab value="/setting">设置</Tab>
        <Tab value="/text">管理</Tab>
      </TabList>

      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <MenuButton appearance="subtle">你好，{ userName }</MenuButton>
        </MenuTrigger>

        <MenuPopover>
          <MenuList>
            <MenuItem>个人中心</MenuItem>
            <MenuItem onClick={onLogOut}>注销</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
    </div>
  );
};
export default Header;
