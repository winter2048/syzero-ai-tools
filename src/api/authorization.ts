import { request } from "../utils/request";

export function Login(name: string, pwd: string) {
  return request.post<string>(
    "http://192.168.2.130:5001/api/SyZero.Authorization/Auth/Login",
    {
      userName: name,
      passWord: pwd,
      type: 0,
    }
  );
}

export function LogOut() {
  return request.post<boolean>(
    "http://192.168.2.130:5001/api/SyZero.Authorization/Auth/LogOut"
  );
}

export function GetUserInfo() {
  return request.get<UserDto>(
    "http://192.168.2.130:5001/api/SyZero.Authorization/User/UserInfo"
  );
}

export function PutUserInfo(user: UserDto) {
  return request.put<UserDto>(
    "http://192.168.2.130:5001/api/SyZero.Authorization/User/UserInfo",
    user
  );
}
