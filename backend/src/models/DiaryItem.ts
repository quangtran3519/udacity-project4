export interface DiaryItem {
  userId: string
  diaryId: string
  createdAt: string
  title: string
  dueDate: string
  content: boolean
  urlImage?: string
}
