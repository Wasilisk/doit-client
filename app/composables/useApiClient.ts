interface ApiResponse<T> {
    data: T
}

type RequestBody =
    | BodyInit
    | Record<string, any>
    | null
    | undefined

export const useApiClient = () => {
    const { $api } = useNuxtApp()

    const get = async <TRes>(url: string) =>
        $api<ApiResponse<TRes>>(url).then(r => r.data)

    const post = async <TReq extends RequestBody, TRes>(
        url: string,
        body: TReq
    ) =>
        $api<ApiResponse<TRes>>(url, {
            method: 'POST',
            body,
        }).then(r => r.data)

    const put = async <TReq extends RequestBody, TRes>(
        url: string,
        body: TReq
    ) =>
        $api<ApiResponse<TRes>>(url, {
            method: 'PUT',
            body,
        }).then(r => r.data)

    const patch = async <TReq extends RequestBody, TRes>(
        url: string,
        body: TReq
    ) =>
        $api<ApiResponse<TRes>>(url, {
            method: 'PATCH',
            body,
        }).then(r => r.data)

    const del = async <TRes>(url: string) =>
        $api<ApiResponse<TRes>>(url, {
            method: 'DELETE',
        }).then(r => r.data)

    return { get, post, put, patch, del }
}