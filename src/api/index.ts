import { request } from "../utils/request";

export function getUserInfo(id: string) {
  return request.get<string>("", { id });
}
