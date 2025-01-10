import { Flex, Layout } from "antd";
import "./style/index.css";
const { Content } = Layout;

export interface SyPageContentProps {
  children: JSX.Element;
  className?: string;
}
export const SyPageContent = (props: SyPageContentProps) => {
  return (
    <Content className={`sy-page-content ${props.className}`}>
      {props.children}
    </Content>
  );
};
export default SyPageContent;
