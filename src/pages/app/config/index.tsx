import { Flex, Tabs } from "antd";
import IconFont from "../../../components/icon-font";
import {SyPage, SyPageHeader} from "../../../components/sy-page";
import BasicSetting from "./basic-config";
import DocSync from "./doc-config";
import AISetting from "./ai-config";

function Setting() {
  const settingItems = [
    {
      title: "基础设置",
      component: BasicSetting,
    },
    {
      title: "文档同步",
      component: DocSync,
    },
    {
      title: "AI配置",
      component: AISetting,
    },
  ];

  return (
    <SyPage>
       <Tabs
        className="sy-content-tabs"
        defaultActiveKey="1"
        tabPosition={"left"}
        items={settingItems.map((item) => {
          return {
            label: item.title,
            key: item.title,
            icon: <IconFont type="icon-icons-sun" />,
            children: <item.component title={item.title}></item.component>,
          };
        })}
        tabBarExtraContent={{
          left: (
            <SyPageHeader title="设置"></SyPageHeader>
          ),
        }}
      />
    </SyPage>
  );
}

export default Setting;
