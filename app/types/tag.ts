export interface Tag {
    id: string
    name: string
    color: string
    task_count: number
    created_at: string
}

export interface CreateTagRequest {
    name: string
    color: string
}

export interface UpdateTagRequest {
    name?: string
    color?: string
}
