import { Flex, Tabs } from "antd";
import IconFont from "../../../../components/icon-font";
import {
  SyPage,
  SyPageHeader,
  SyPageContent,
} from "../../../../components/sy-page";

function Setting(props: { title: string }) {
  return (
    <>
      <SyPageHeader title={props.title} size={16}></SyPageHeader>
      <SyPageContent>
        <div>xxxxxxxxxx</div>
      </SyPageContent>
    </>
  );
}

export default Setting;
