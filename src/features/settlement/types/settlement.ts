export type SplitMode = "equal" | "personal" | "custom";

export type SplitItem = {
  id: string;
  name: string;
  amount: number;
  additionalCost?: boolean;
  mode: SplitMode;
  selectedIds: string[];
  remainderPayerId?: string;
};

export type CustomShare = {
  participantId: string;
  amount: number;
};

export type TransferStatus = "PENDING" | "SENT" | "CONFIRMED";

export type SettlementTransfer = {
  id: string;
  senderMemberId: string;
  senderName: string;
  receiverMemberId: string;
  receiverName: string;
  amount: number;
  status: TransferStatus;
};

export type SettlementMemberSummary = {
  id: string;
  name: string;
  paidAmount: number;
  shareAmount: number;
  balance: number;
};

export type SettlementSummary = {
  tripName: string;
  currentUserId: string;
  currentUserIsOwner: boolean;
  totalAmount: number;
  transferCount: number;
  myBalance: number;
  transfers: SettlementTransfer[];
  members: SettlementMemberSummary[];
};
