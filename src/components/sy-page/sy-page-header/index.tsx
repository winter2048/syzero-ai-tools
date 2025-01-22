import { Flex, Layout } from "antd";
import "./style/index.css";
const { Header } = Layout;

export interface SyPageHeaderProps {
  children?: JSX.Element | string;
  className?: string;
  title?: string;
  subTitle?: string;
  size?: number;
}
export const SyPageHeader = (props: SyPageHeaderProps) => {
  return (
    <Header className={`sy-page-header ${props.className}`}>
      {
        props.title && (
          <span className="sy-page-header-title" style={{fontSize: props.size}}>{props.title}</span>
        )
      }
      {
        props.subTitle && (
          <span className="sy-page-header-sub-title" style={{fontSize: props.size}}>{props.subTitle}</span>
        )
      }
      {props.children}
    </Header>
  );
};
export default SyPageHeader;
