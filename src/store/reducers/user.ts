import { IUserActionType } from "../../utils/constant";

const initUserState: IState = {
  user: {
    id: 0,
    name: "",
  },
};

const user = (
  state: IState = initUserState,
  action: { type: IUserActionType; payload: any }
) => {
  switch (action.type) {
    case IUserActionType.INIT:
      return state;
    case IUserActionType.CHANGE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
export default user;
