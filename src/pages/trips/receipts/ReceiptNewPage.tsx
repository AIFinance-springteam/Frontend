import { useParams } from 'react-router-dom'

function ReceiptNewPage() {
  const { tripId } = useParams<{ tripId: string }>()
  return <div className="p-4 text-ink">ReceiptNewPage: {tripId}</div>
}

export default ReceiptNewPage
