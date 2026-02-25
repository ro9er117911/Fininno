// ─── RBAC ───
export type Role = "Ops" | "Risk" | "Approver";

// ─── Common ───
export type Currency = "BTC" | "ETH" | "USDT";
export type Chain = "Bitcoin" | "Ethereum" | "Tron";

// ─── Customer ───
export type KycStatus = "Pending" | "Verified" | "Enhanced" | "Expired";
export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export interface Customer {
    id: string;
    name: string;
    companyName: string;
    email: string;
    phone: string; // PII — 預設遮罩
    idNumber: string; // PII — 預設遮罩
    kycStatus: KycStatus;
    riskLevel: RiskLevel;
    createdAt: string; // ISO 8601
    updatedAt: string;
}

// ─── Account & Position ───
export interface Account {
    id: string;
    customerId: string;
    label: string;
    createdAt: string;
}

export type PositionStatus = "Custodied" | "PendingDeposit" | "Frozen";

export interface AssetPosition {
    id: string;
    accountId: string;
    customerId: string;
    currency: Currency;
    chain: Chain;
    amount: number;
    fiatValue: number; // TWD equivalent
    status: PositionStatus;
    updatedAt: string;
}

// ─── Transfer Request ───
export type TransferState =
    | "Draft"
    | "Submitted"
    | "OpsReview"
    | "RiskReview"
    | "ApproverSignoff"
    | "Scheduled"
    | "Executed"
    | "Rejected"
    | "Frozen";

export type TransferAction =
    | "submit"
    | "assignOps"
    | "approveOps"
    | "rejectOps"
    | "approveRisk"
    | "rejectRisk"
    | "freeze"
    | "approve"
    | "reject"
    | "execute"
    | "unfreeze"
    | "cancel";

export type TransferDirection = "Deposit" | "Withdrawal";

export interface TransferRequest {
    id: string;
    customerId: string;
    direction: TransferDirection;
    currency: Currency;
    chain: Chain;
    amount: number;
    fiatValue: number;
    fromAddress: string; // PII
    toAddress: string; // PII
    whitelistAddressId?: string;
    txHash?: string;
    confirmations?: number;
    riskScore: number; // 0–100
    state: TransferState;
    coolingEndsAt?: string;
    rejectionReason?: string;
    freezeReason?: string;
    approvalTaskIds: string[];
    createdAt: string;
    updatedAt: string;
}

// ─── Whitelist Address ───
export type WhitelistState =
    | "Requested"
    | "OpsVerify"
    | "RiskScoreCheck"
    | "Approved"
    | "Rejected";

export type WhitelistAction =
    | "verify"
    | "passOps"
    | "rejectOps"
    | "passRisk"
    | "rejectRisk";

export interface WhitelistAddressRequest {
    id: string;
    customerId: string;
    label: string;
    address: string; // PII
    chain: Chain;
    purpose: string;
    riskScore: number;
    state: WhitelistState;
    rejectionReason?: string;
    approvedAt?: string;
    createdAt: string;
    updatedAt: string;
}

// ─── Alert ───
export type AlertState = "New" | "Triage" | "Dismissed" | "Escalated";

export type AlertAction = "triage" | "dismiss" | "escalate";

export type AlertType = "Fraud" | "SuspiciousTransaction" | "AbnormalBehavior";

export interface Alert {
    id: string;
    customerId: string;
    transferRequestId?: string;
    type: AlertType;
    title: string;
    description: string;
    riskScore: number;
    state: AlertState;
    dismissReason?: string;
    caseId?: string;
    createdAt: string;
    updatedAt: string;
}

// ─── Case ───
export type CaseState = "Open" | "Investigating" | "Filed" | "Closed";

export type CaseAction = "investigate" | "file" | "close";

export interface Case {
    id: string;
    alertIds: string[];
    customerId: string;
    title: string;
    description: string;
    state: CaseState;
    filingType?: "STR" | "InternalReport";
    filingReference?: string;
    closureReason?: string;
    assigneeId?: string;
    createdAt: string;
    updatedAt: string;
}

// ─── Approval Task ───
export type ApprovalStatus = "Pending" | "Approved" | "Rejected";

export interface ApprovalTask {
    id: string;
    entityType: "TransferRequest" | "WhitelistAddressRequest";
    entityId: string;
    step: string; // e.g. "OpsReview", "RiskReview", "ApproverSignoff"
    assignedRole: Role;
    status: ApprovalStatus;
    actorId?: string;
    actorName?: string;
    reason?: string;
    createdAt: string;
    completedAt?: string;
}

// ─── Audit Event ───
export type AuditEventType =
    | "TRANSFER_SUBMITTED"
    | "TRANSFER_OPS_APPROVED"
    | "TRANSFER_OPS_REJECTED"
    | "TRANSFER_RISK_APPROVED"
    | "TRANSFER_RISK_REJECTED"
    | "TRANSFER_APPROVED"
    | "TRANSFER_REJECTED"
    | "TRANSFER_FROZEN"
    | "TRANSFER_UNFROZEN"
    | "TRANSFER_EXECUTED"
    | "TRANSFER_CANCELLED"
    | "WHITELIST_REQUESTED"
    | "WHITELIST_OPS_VERIFIED"
    | "WHITELIST_OPS_REJECTED"
    | "WHITELIST_APPROVED"
    | "WHITELIST_REJECTED"
    | "ALERT_TRIAGED"
    | "ALERT_DISMISSED"
    | "ALERT_ESCALATED"
    | "CASE_OPENED"
    | "CASE_INVESTIGATING"
    | "CASE_FILED"
    | "CASE_CLOSED"
    | "PII_UNMASKED"
    | "REPORT_EXPORTED";

export interface AuditEvent {
    id: string;
    timestamp: string;
    eventType: AuditEventType;
    actor: {
        userId: string;
        role: Role;
        displayName: string;
    };
    entity: {
        type: "TransferRequest" | "WhitelistAddressRequest" | "Alert" | "Case" | "Customer" | "Report";
        id: string;
    };
    before: Record<string, unknown> | null;
    after: Record<string, unknown> | null;
    reason?: string;
    metadata?: Record<string, unknown>;
}

// ─── Reports ───
export interface ReconciliationReport {
    id: string;
    period: "Daily" | "Monthly";
    date: string;
    totalTransactions: number;
    matchedCount: number;
    discrepancyCount: number;
    discrepancies: ReconciliationDiscrepancy[];
    status: "Pending" | "Resolved" | "Partial";
    createdAt: string;
}

export interface ReconciliationDiscrepancy {
    id: string;
    transferRequestId: string;
    expectedAmount: number;
    actualAmount: number;
    currency: Currency;
    reason: string;
    resolution?: string;
    status: "Open" | "Resolved";
}

export interface TaxReport {
    id: string;
    customerId: string;
    year: number;
    totalGain: number;
    totalLoss: number;
    netPnl: number;
    isSecurityToken: boolean;
    costBasisMethod: "FIFO" | "LIFO" | "Average";
    generatedAt: string;
}

// ─── Transition Result ───
export type TransitionResult<S> =
    | { success: true; nextState: S; auditEventType: AuditEventType }
    | { success: false; error: string };
