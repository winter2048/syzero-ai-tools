import { request } from "../utils/request";

export function Login(name: string, pwd: string) {
  return request.post<string>(
    "/api/SyZero.Authorization/Auth/Login",
    {
      userName: name,
      passWord: pwd,
      type: 0,
    }
  );
}

export function LogOut() {
  return request.post<boolean>(
    "/api/SyZero.Authorization/Auth/LogOut"
  );
}

export function GetUserInfo() {
  return request.get<UserDto>(
    "/api/SyZero.Authorization/User/UserInfo"
  );
}

export function PutUserInfo(user: UserDto) {
  return request.put<UserDto>(
    "/api/SyZero.Authorization/User/UserInfo",
    user
  );
}
