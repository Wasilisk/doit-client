type RequestBody = BodyInit | Record<string, any> | null | undefined;

export const useApiClient = () => {
  const { $api } = useNuxtApp();

  const get = async <TRes>(url: string) => $api<TRes>(url);

  const post = async <TReq extends RequestBody, TRes>(
    url: string,
    body: TReq,
  ) => $api<TRes>(url, { method: "POST", body });

  const put = async <TReq extends RequestBody, TRes>(url: string, body: TReq) =>
    $api<TRes>(url, { method: "PUT", body });

  const patch = async <TReq extends RequestBody, TRes>(
    url: string,
    body: TReq,
  ) => $api<TRes>(url, { method: "PATCH", body });

  const del = async <TRes>(url: string) =>
    $api<TRes>(url, { method: "DELETE" });

  return { get, post, put, patch, del };
};
