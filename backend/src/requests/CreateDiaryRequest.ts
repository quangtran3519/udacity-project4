/**
 * Fields in a request to create a single TODO item.
 */
export interface CreateTodoRequest {
  userId: string
  diaryId: string
  createdAt: string
  title: string
  dueDate: string
  content: boolean
  urlImage?: string
}
