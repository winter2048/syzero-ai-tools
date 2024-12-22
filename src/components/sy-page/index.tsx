import { Flex, Layout } from "antd";
import SyPageHeader from "./sy-page-header";
import SyPageContent from "./sy-page-content";
import SyPageFooter from "./sy-page-footer";
import "./style/index.css";

export interface SyPageProps {
  children: JSX.Element | JSX.Element[];
  className?: string;
}

const SyPage = (props: SyPageProps) => {
  return (
    <Layout className={`sy-page ${props.className}`}>
      {props.children}
    </Layout>
  );
};

export { SyPage, SyPageHeader, SyPageContent, SyPageFooter };

export default SyPage;
