import * as React from "react";
import { useNavigate, useLocation} from 'react-router-dom';
import userSvg from '../../assets/user.svg';
import aiSvg from '../../assets/ai.svg';
import OmsViewMarkdown from '../markdown/OmsViewMarkdown';

export interface ContentProps {
  role: number;
  name?: string;
  text: string;
}

export const SyChatMessage = (props: ContentProps) => {
  if (props.role === 1) {
    return (
      <div className="sy-chat-room-center-left">
        <div className="sy-chat-room-center-img"><img src={ aiSvg }></img></div>
        <div className="sy-chat-room-center-content">
          <div className="sy-chat-room-center-content-name">{props.name}</div>
          <div className="sy-chat-room-center-content-text">
            <div className="sy-chat-room-text">
            <OmsViewMarkdown textContent={props.text}  darkMode={true} />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="sy-chat-room-center-right">
        <div className="sy-chat-room-center-img"><img src={ userSvg }></img></div>
        <div className="sy-chat-room-center-content">
          <div className="sy-chat-room-center-content-text">
            <div className="sy-chat-room-text">
            {props.text}
             </div>
          </div>
        </div>
      </div>
    );
  }
};
export default SyChatMessage;
