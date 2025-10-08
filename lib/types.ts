export interface Team {
  id: string
  name: string
  code: string
  description: string
  email: string
  entity: string
  manager: {
    name: string
    initials: string
    avatar?: string
  }
}

export type SortField = "name" | "code" | "entity" | "manager"
export type SortOrder = "asc" | "desc"
