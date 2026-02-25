import type {
    WhitelistState,
    WhitelistAction,
    Role,
    TransitionResult,
} from "../domain/index.js";

const WHITELIST_TRANSITIONS: Record<
    string,
    { nextState: WhitelistState; allowedRoles: Role[]; auditEventType: string }
> = {
    "Requested->verify": {
        nextState: "OpsVerify",
        allowedRoles: ["Ops"],
        auditEventType: "WHITELIST_OPS_VERIFIED",
    },
    "OpsVerify->passOps": {
        nextState: "RiskScoreCheck",
        allowedRoles: ["Ops"],
        auditEventType: "WHITELIST_OPS_VERIFIED",
    },
    "OpsVerify->rejectOps": {
        nextState: "Rejected",
        allowedRoles: ["Ops"],
        auditEventType: "WHITELIST_OPS_REJECTED",
    },
    "RiskScoreCheck->passRisk": {
        nextState: "Approved",
        allowedRoles: ["Risk"],
        auditEventType: "WHITELIST_APPROVED",
    },
    "RiskScoreCheck->rejectRisk": {
        nextState: "Rejected",
        allowedRoles: ["Risk"],
        auditEventType: "WHITELIST_REJECTED",
    },
};

export function whitelistTransition(
    currentState: WhitelistState,
    action: WhitelistAction,
    actorRole: Role,
    context?: { reason?: string }
): TransitionResult<WhitelistState> {
    const key = `${currentState}->${action}`;
    const rule = WHITELIST_TRANSITIONS[key];

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

    if (["rejectOps", "rejectRisk"].includes(action) && !context?.reason) {
        return {
            success: false,
            error: `Action "${action}" requires a reason`,
        };
    }

    return {
        success: true,
        nextState: rule.nextState,
        auditEventType: rule.auditEventType as any,
    };
}
