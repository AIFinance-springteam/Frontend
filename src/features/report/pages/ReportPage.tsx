import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { formatWon } from '../../../shared/utils/formatCurrency'
import { getTripReport } from '../services/reportService'
import type {
  ReportCategoryExpense,
  ReportDailyExpense,
  ReportMemberExpense,
} from '../types/report'
import './report.css'

type ApiError = {
  status?: number
  code?: string
  message?: string
}

const DISCLAIMER =
  '데이터에 없는 내용을 생성하거나 재무 판단으로 단정하지 않습니다. 높은 지출을 부정적 소비로 규정하지 않습니다.'

function ReportPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const navigate = useNavigate()
  const reportQuery = useQuery({
    queryKey: ['trip-report', tripId],
    queryFn: () => getTripReport(tripId!),
    enabled: Boolean(tripId),
    retry: false,
  })

  const goBack = () => {
    if (window.history.length > 1) navigate(-1)
    else navigate(`/trips/${tripId}`)
  }

  if (reportQuery.isPending) {
    return (
      <ReportState title="소비 리포트를 만들고 있어요" description="여행 지출을 안전하게 집계하고 있습니다." loading />
    )
  }

  if (reportQuery.isError) {
    const error = reportQuery.error as ApiError
    const message = error.code === 'TRIP_NOT_FOUND'
      ? '여행을 찾을 수 없습니다.'
      : error.code === 'TRIP_MEMBER_REQUIRED'
        ? '이 여행의 참여자만 소비 리포트를 볼 수 있습니다.'
        : error.code === 'INVALID_TRIP_STATUS'
          ? '정산이 완료된 뒤 소비 리포트를 확인할 수 있습니다.'
          : error.code === 'REPORT_DATA_INCONSISTENT'
            ? '정산 데이터가 일치하지 않아 소비 리포트를 불러올 수 없습니다.'
            : (error.status === 401 || error.status === 403) && error.code === 'UNKNOWN_ERROR'
              ? '로그인이 필요합니다.'
              : error.message ?? '소비 리포트를 불러오지 못했습니다.'

    return (
      <ReportState
        title="리포트를 표시할 수 없어요"
        description={message}
        onBack={goBack}
        onRetry={() => void reportQuery.refetch()}
      />
    )
  }

  const report = reportQuery.data
  const isEmpty = report.summary.paymentCount === 0

  return (
    <main className="report-page">
      <header className="report-header">
        <button type="button" className="report-back" onClick={goBack} aria-label="정산 결과로 돌아가기">
          <span aria-hidden="true">←</span> 정산 결과
        </button>
        <h1>{report.tripName} — 소비 리포트</h1>
      </header>

      <div className="report-content">
        <section className="report-ai-card" aria-labelledby="report-ai-title">
          <p className="report-eyebrow" id="report-ai-title">AI 소비 분석</p>
          <p className="report-ai-content">{report.aiAnalysis.content}</p>
          <p className="report-disclaimer">{DISCLAIMER}</p>
        </section>

        {isEmpty ? (
          <section className="report-empty">
            <span className="report-empty-icon" aria-hidden="true">₩</span>
            <h2>아직 표시할 소비 내역이 없어요</h2>
            <p>확정된 영수증이 생기면 카테고리, 일자, 참여자별 지출을 보여드릴게요.</p>
          </section>
        ) : (
          <div className="report-grid">
            <SummaryCard
              totalAmount={report.summary.totalAmount}
              averagePerPerson={report.summary.averagePerPerson}
              paymentCount={report.summary.paymentCount}
            />
            <CategoryCard categories={report.categories} />
            <DailyCard expenses={report.dailyExpenses} />
            <MemberCard members={report.memberExpenses} />
          </div>
        )}
      </div>
    </main>
  )
}

function SummaryCard({
  totalAmount,
  averagePerPerson,
  paymentCount,
}: {
  totalAmount: number
  averagePerPerson: number
  paymentCount: number
}) {
  return (
    <section className="report-card">
      <h2>여행 지출 요약</h2>
      <dl className="report-summary-list">
        <div><dt>총지출</dt><dd>{formatWon(totalAmount)}</dd></div>
        <div><dt>1인 평균</dt><dd>{formatWon(averagePerPerson)}</dd></div>
        <div><dt>결제 건수</dt><dd>{paymentCount.toLocaleString('ko-KR')}건</dd></div>
      </dl>
    </section>
  )
}

function CategoryCard({ categories }: { categories: ReportCategoryExpense[] }) {
  return (
    <section className="report-card">
      <h2>카테고리별 지출</h2>
      {categories.length === 0 ? <p className="report-card-empty">카테고리가 지정된 항목이 없습니다.</p> : (
        <div className="report-categories">
          {categories.map((category) => (
            <div className="report-category" key={category.category}>
              <div className="report-category-label">
                <span>{category.categoryName}</span>
                <span><strong>{category.percentage}%</strong> · {formatWon(category.amount)}</span>
              </div>
              <div className="report-progress" role="img" aria-label={`${category.categoryName} ${category.percentage}%`}>
                <span style={{ width: `${Math.min(category.percentage, 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function DailyCard({ expenses }: { expenses: ReportDailyExpense[] }) {
  const maxAmount = Math.max(...expenses.map((expense) => expense.amount), 0)

  return (
    <section className="report-card report-chart-card">
      <h2>일자별 지출</h2>
      {expenses.length === 0 ? <p className="report-card-empty">결제일이 등록된 지출이 없습니다.</p> : (
        <div className="daily-chart" aria-label="일자별 지출 막대그래프">
          {expenses.map((expense) => {
            const height = maxAmount === 0 ? 0 : Math.max((expense.amount / maxAmount) * 100, 8)
            return (
              <div className="daily-chart-item" key={expense.date}>
                <span className="daily-chart-amount">{formatWon(expense.amount)}</span>
                <div className="daily-chart-track">
                  <span style={{ height: `${height}%` }} />
                </div>
                <span className="daily-chart-date">{formatShortDate(expense.date)}</span>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

function MemberCard({ members }: { members: ReportMemberExpense[] }) {
  const maxAmount = Math.max(...members.flatMap((member) => [member.paidAmount, member.shareAmount]), 0)

  return (
    <section className="report-card report-chart-card">
      <div className="report-card-heading">
        <h2>참여자별 결제·부담 비교</h2>
        <div className="member-legend"><span className="paid">결제</span><span className="share">부담</span></div>
      </div>
      <div className="member-chart">
        {members.map((member) => (
          <div className="member-chart-row" key={member.tripMemberId}>
            <strong title={member.name}>{member.name}</strong>
            <div className="member-bars">
              <div><span className="member-bar-track"><span className="member-bar paid" style={{ width: barWidth(member.paidAmount, maxAmount) }} /></span><small>{formatWon(member.paidAmount)}</small></div>
              <div><span className="member-bar-track"><span className="member-bar share" style={{ width: barWidth(member.shareAmount, maxAmount) }} /></span><small>{formatWon(member.shareAmount)}</small></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function ReportState({
  title,
  description,
  loading = false,
  onBack,
  onRetry,
}: {
  title: string
  description: string
  loading?: boolean
  onBack?: () => void
  onRetry?: () => void
}) {
  return (
    <main className="report-state">
      {loading && <span className="report-spinner" aria-hidden="true" />}
      <h1>{title}</h1>
      <p>{description}</p>
      <div className="report-state-actions">
        {onBack && <button type="button" onClick={onBack}>돌아가기</button>}
        {onRetry && <button type="button" className="primary" onClick={onRetry}>다시 시도</button>}
      </div>
    </main>
  )
}

function barWidth(amount: number, maxAmount: number) {
  if (amount === 0 || maxAmount === 0) return '0%'
  return `${Math.max((amount / maxAmount) * 100, 2)}%`
}

function formatShortDate(value: string) {
  const [, month, day] = value.split('-')
  return `${Number(month)}/${Number(day)}`
}

export default ReportPage
