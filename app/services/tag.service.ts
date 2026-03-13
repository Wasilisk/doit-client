import { useApiClient } from "~/composables/useApiClient";
import type { Tag, CreateTagRequest, UpdateTagRequest } from "~/types/tag";

export const useTagService = () => {
  const api = useApiClient();

  const fetchTags = () => api.get<Tag[]>("/api/tags");

  const createTag = (payload: CreateTagRequest) =>
    api.post<CreateTagRequest, Tag>("/api/tags", payload);

  const updateTag = (id: string, payload: UpdateTagRequest) =>
    api.patch<UpdateTagRequest, Tag>(`/api/tags/${id}`, payload);

  const deleteTag = (id: string) => api.del<void>(`/api/tags/${id}`);

  return { fetchTags, createTag, updateTag, deleteTag };
};
