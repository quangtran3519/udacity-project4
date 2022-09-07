/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateTodoRequest {
  dueDate: string
  title: string
  content: boolean
  urlImage?: string
}