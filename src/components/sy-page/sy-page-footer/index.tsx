import { Flex, Layout } from "antd";
import "./style/index.css";
const { Footer } = Layout;

export interface SyPageFooterProps {
  children: JSX.Element;
  className?: string;
}
export const SyPageFooter = (props: SyPageFooterProps) => {
  return (
    <Footer className={`sy-page-footer ${props.className}`}>
      {props.children}
    </Footer>
  );
};
export default SyPageFooter;
