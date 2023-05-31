import * as React from "react";
import { useNavigate, useLocation} from 'react-router-dom';
export interface ContentProps {
  children: JSX.Element;
}
export const Content = (props: ContentProps) => {
  return (
    <div className="sy-content">
     { props.children }
    </div>
  );
};
export default Content;
