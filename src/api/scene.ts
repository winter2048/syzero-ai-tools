import { request } from "../utils/request";

export function CreateScene(dto: SceneDto): Promise<RequestResult<SceneDto>> {
  return request.post<SceneDto>("/api/SyZero.AI/Scene", dto);
}

export function DeleteScene(sceneId: string): Promise<RequestResult<boolean>> {
  return request.delete<boolean>(`/api/SyZero.AI/Scene/${sceneId}`);
}

export function PutScene(
  sceneId: string,
  dto: SceneDto
): Promise<RequestResult<boolean>> {
  return request.put<boolean>(`/api/SyZero.AI/Scene/${sceneId}`, dto);
}

export function GetScene(sceneId: string): Promise<RequestResult<SceneDto>> {
  return request.get<SceneDto>(`/api/SyZero.AI/Scene/${sceneId}`);
}

export function SceneList(): Promise<RequestResult<SceneDto[]>> {
  return request.get<SceneDto[]>("/api/SyZero.AI/Scene");
}
