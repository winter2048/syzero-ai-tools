import { IActionType } from "../../utils/constant";

const initConfig: IConfig = {
    SERVER_URL: "sssssssss"
};

const config = (
  state: IConfig = initConfig,
  action: { type: IActionType; payload: any }
) => {
  switch (action.type) {
    case IActionType.ConfigInit:
      return state;
    case IActionType.ConfigChange:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
export default config;