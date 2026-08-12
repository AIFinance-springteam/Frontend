import { useParams } from 'react-router-dom'

function ReceiptDetailPage() {
  const { tripId, receiptId } = useParams<{ tripId: string; receiptId: string }>()
  return (
    <div className="p-4 text-ink">
      ReceiptDetailPage: {tripId} / {receiptId}
    </div>
  )
}

export default ReceiptDetailPage
