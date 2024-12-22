import { Flex, Layout } from "antd";
import "./style/index.css"
const { Header } = Layout;

export interface SyPageHeaderProps {
  children?: JSX.Element | string;
  className?: string;
  title?: string;
  subTitle?: string;
}
export const SyPageHeader = (props: SyPageHeaderProps) => {
  return (
    <Header className={`sy-page-header ${props.className}`}>
      {
        props.title && (
          <span className="sy-page-header-title">{props.title}</span>
        )
      }
      {
        props.subTitle && (
          <span className="sy-page-header-sub-title">{props.subTitle}</span>
        )
      }
      {props.children}
    </Header>
  );
};
export default SyPageHeader;
