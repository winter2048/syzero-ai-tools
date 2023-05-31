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
import { useNavigate, useLocation} from 'react-router-dom';

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const defaultMenu = location.pathname;
  const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    navigate(data.value as string)
  };
  const onLogOut = () => {
    window.localStorage.setItem("token", "");
    navigate("/login");
  };

  return (
    <div className="sy-header">
      <TabList defaultSelectedValue={defaultMenu} onTabSelect={onTabSelect}>
        <Tab value="/app/chat" >Chat</Tab>
        <Tab value="/app/image" >Image</Tab>
        <Tab value="/app/text">Text</Tab>
        <Tab value="/app/setting">Setting</Tab>
      </TabList>

      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <MenuButton appearance="subtle" >
            你好，SYZERO
          </MenuButton>
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
