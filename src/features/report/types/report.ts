export type ReportSummary = {
  totalAmount: number
  averagePerPerson: number
  paymentCount: number
}

export type ReportCategoryExpense = {
  category: string
  categoryName: string
  amount: number
  percentage: number
}

export type ReportDailyExpense = {
  date: string
  amount: number
}

export type ReportMemberExpense = {
  tripMemberId: number
  name: string
  paidAmount: number
  shareAmount: number
}

export type TripReport = {
  tripId: number
  tripName: string
  summary: ReportSummary
  categories: ReportCategoryExpense[]
  dailyExpenses: ReportDailyExpense[]
  memberExpenses: ReportMemberExpense[]
  aiAnalysis: {
    content: string
    generatedAt: string
  }
}
