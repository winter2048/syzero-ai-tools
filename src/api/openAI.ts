import { request } from "../utils/request";

export function CreateSession(): Promise<RequestResult<string>> {
  return request.post<string>(
    "http://192.168.2.130:5002/api/SyZero.OpenAI/Chat/Session"
  );
}

export function DeleteSession(
  sessionId: string
): Promise<RequestResult<boolean>> {
  return request.delete<boolean>(
    `http://192.168.2.130:5002/api/SyZero.OpenAI/Chat/Session/${sessionId}`
  );
}

export function GetSession(
  sessionId: string
): Promise<RequestResult<ChatSessionDto>> {
  return request.get<ChatSessionDto>(
    `http://192.168.2.130:5002/api/SyZero.OpenAI/Chat/Session/${sessionId}`
  );
}

export function SessionList(): Promise<RequestResult<ChatSessionDto[]>> {
  return request.get<Array<ChatSessionDto>>(
    `http://192.168.2.130:5002/api/SyZero.OpenAI/Chat/Sessions`
  );
}

export function SendMessage(
  data: SendMessageDto
): Promise<RequestResult<string>> {
  return request.post<string>(
    "http://192.168.2.130:5002/api/SyZero.OpenAI/Chat/SendMessage",data
  );
}
