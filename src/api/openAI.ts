import { request } from "../utils/request";

export function CreateSession(): Promise<RequestResult<string>> {
  return request.post<string>(
    "/api/SyZero.AI/Chat/Session"
  );
}

export function DeleteSession(
  sessionId: string
): Promise<RequestResult<boolean>> {
  return request.delete<boolean>(
    `/api/SyZero.AI/Chat/Session/${sessionId}`
  );
}

export function PutSession(
  sessionId: string,
  messages: Array<ChatMessageDto>
): Promise<RequestResult<boolean>> {
  return request.put<boolean>(
    `/api/SyZero.AI/Chat/Session/${sessionId}`, messages
  );
}

export function GetSession(
  sessionId: string
): Promise<RequestResult<ChatSessionDto>> {
  return request.get<ChatSessionDto>(
    `/api/SyZero.AI/Chat/Session/${sessionId}`
  );
}

export function SessionList(): Promise<RequestResult<ChatSessionDto[]>> {
  return request.get<Array<ChatSessionDto>>(
    "/api/SyZero.AI/Chat/Sessions"
  );
}

export function SendMessage(
  data: SendMessageDto
): Promise<RequestResult<string>> {
  return request.post<string>(
    "/api/SyZero.AI/Chat/SendMessage",data
  );
}

export function GetModels(): Promise<RequestResult<any>> {
  return request.get<any>(
    "/api/SyZero.AI/Chat/Models"
  );
}