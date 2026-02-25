import type {
    TransferState,
    TransferAction,
    Role,
    TransitionResult,
} from "../domain/index.js";

/** Transfer state machine transition rules */
const TRANSFER_TRANSITIONS: Record<
    string,
    { nextState: TransferState; allowedRoles: Role[]; auditEventType: string }
> = {
    "Draft->submit": {
        nextState: "Submitted",
        allowedRoles: ["Ops"],
        auditEventType: "TRANSFER_SUBMITTED",
    },
    "Submitted->assignOps": {
        nextState: "OpsReview",
        allowedRoles: ["Ops"],
        auditEventType: "TRANSFER_SUBMITTED",
    },
    "OpsReview->approveOps": {
        nextState: "RiskReview",
        allowedRoles: ["Ops"],
        auditEventType: "TRANSFER_OPS_APPROVED",
    },
    "OpsReview->rejectOps": {
        nextState: "Rejected",
        allowedRoles: ["Ops"],
        auditEventType: "TRANSFER_OPS_REJECTED",
    },
    "RiskReview->approveRisk": {
        nextState: "ApproverSignoff",
        allowedRoles: ["Risk"],
        auditEventType: "TRANSFER_RISK_APPROVED",
    },
    "RiskReview->rejectRisk": {
        nextState: "Rejected",
        allowedRoles: ["Risk"],
        auditEventType: "TRANSFER_RISK_REJECTED",
    },
    "RiskReview->freeze": {
        nextState: "Frozen",
        allowedRoles: ["Risk"],
        auditEventType: "TRANSFER_FROZEN",
    },
    "ApproverSignoff->approve": {
        nextState: "Scheduled",
        allowedRoles: ["Approver"],
        auditEventType: "TRANSFER_APPROVED",
    },
    "ApproverSignoff->reject": {
        nextState: "Rejected",
        allowedRoles: ["Approver"],
        auditEventType: "TRANSFER_REJECTED",
    },
    "Scheduled->execute": {
        nextState: "Executed",
        allowedRoles: ["Ops"], // System/Ops can trigger
        auditEventType: "TRANSFER_EXECUTED",
    },
    "Frozen->unfreeze": {
        nextState: "RiskReview",
        allowedRoles: ["Risk"],
        auditEventType: "TRANSFER_UNFROZEN",
    },
    "Submitted->cancel": {
        nextState: "Rejected",
        allowedRoles: ["Ops"],
        auditEventType: "TRANSFER_CANCELLED",
    },
};

const RISK_SCORE_THRESHOLD = 70;

export function transferTransition(
    currentState: TransferState,
    action: TransferAction,
    actorRole: Role,
    context?: { riskScore?: number; reason?: string }
): TransitionResult<TransferState> {
    const key = `${currentState}->${action}`;
    const rule = TRANSFER_TRANSITIONS[key];

    if (!rule) {
        return {
            success: false,
            error: `Invalid transition: ${currentState} -> ${action}`,
        };
    }

    if (!rule.allowedRoles.includes(actorRole)) {
        return {
            success: false,
            error: `Role "${actorRole}" is not allowed to perform "${action}" on state "${currentState}"`,
        };
    }

    // Reject/freeze actions require a reason
    if (
        ["rejectOps", "rejectRisk", "reject", "freeze", "unfreeze"].includes(action) &&
        !context?.reason
    ) {
        return {
            success: false,
            error: `Action "${action}" requires a reason`,
        };
    }

    // OpsReview->approveOps: if riskScore > threshold, must go to RiskReview (this is the default)
    // If riskScore <= threshold AND action is approveOps, still goes to RiskReview per flow
    // (The flow always goes through RiskReview, but high risk enforces extra scrutiny in UI)

    return {
        success: true,
        nextState: rule.nextState,
        auditEventType: rule.auditEventType as any,
    };
}
