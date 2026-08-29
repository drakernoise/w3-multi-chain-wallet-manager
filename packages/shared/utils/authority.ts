/**
 * Single source of truth for which key signs which operation.
 *
 * This list used to be copy-pasted into the background service worker, the
 * SignRequest popup and the mobile app, and the three copies disagreed on the
 * default: the popup fell back to the Posting key, the background fell back to
 * the Active key. A `comment` broadcast with no explicit keyType (which is what
 * blurt.blog's condenser sends when editing a post) was therefore signed with
 * the Active key and rejected by the node with `tx_missing_posting_auth`.
 *
 * Keep this the only place that maps an operation to an authority.
 */

export type KeyType = 'posting' | 'active' | 'memo' | '';

/**
 * Operations that need the Active authority. Everything else on Steem-family
 * chains (comment, comment_options, vote, custom_json, ...) is Posting.
 */
export const ACTIVE_KEY_OPS: readonly string[] = [
    'witness_update',
    'witness_set_properties',
    'account_witness_vote',
    'account_update',
    'account_update2',
    'account_witness_proxy',
    'change_recovery_account',
    'decline_voting_rights',
    'transfer',
    'recurrent_transfer',
    'transfer_to_vesting',
    'withdraw_vesting',
    'delegate_vesting_shares',
    'claim_account',
    'create_claimed_account',
    'account_create',
    'account_create_with_delegation',
    'transfer_to_savings',
    'transfer_from_savings',
    'escrow_transfer',
    'escrow_release',
    'escrow_dispute',
    'escrow_approve',
    'claim_reward_balance',
    'delegate_rc',
    'create_proposal',
    'update_proposal',
    'update_proposal_votes',
    'remove_proposal',
    // Market operations (wallet.hive.blog, etc.)
    'limit_order_create',
    'limit_order_create2',
    'limit_order_cancel',
    'convert',
    'collateralized_convert',
    'fill_convert_request',
    'cancel_transfer_from_savings',
    'set_withdraw_vesting_route'
];

export const normalizeKeyType = (type: any): KeyType => {
    if (typeof type !== 'string') return '';
    const normalized = type.trim().toLowerCase();
    if (normalized === 'posting' || normalized === 'active' || normalized === 'memo') {
        return normalized;
    }
    return '';
};

/** dApps send ops as `[name, data]` or as `{ type, ... }`. Accept both. */
export const getOperationName = (op: any): string => {
    if (Array.isArray(op)) return typeof op[0] === 'string' ? op[0] : '';
    if (op && typeof op === 'object') {
        const name = op.type || op.operation || op.method;
        return typeof name === 'string' ? name : '';
    }
    return '';
};

/** The payload half of `[name, data]` or `{ type, ... }`. */
const getOperationData = (op: any): any => {
    if (Array.isArray(op)) return op[1] || {};
    if (op && typeof op === 'object') return op.value || op.data || op;
    return {};
};

export const requiresActiveAuthority = (operations: any[]): boolean =>
    Array.isArray(operations) &&
    operations.some((op) => {
        if (ACTIVE_KEY_OPS.includes(getOperationName(op))) return true;

        // custom_json declares its own authority and the name alone cannot tell
        // them apart: required_posting_auths is Posting, required_auths is Active.
        // Hive Engine and Splinterlands send both shapes.
        const required = getOperationData(op).required_auths;
        return Array.isArray(required) && required.length > 0;
    });

export interface BroadcastKeySelection {
    /** Empty when the account has not imported the key this broadcast needs. */
    key: string;
    keyType: 'posting' | 'active';
}

/**
 * Pick the key for a broadcast.
 *
 * Active wins when the dApp asks for it or when any operation genuinely needs it
 * (a Posting key cannot sign a `transfer`, so honouring a dApp that mislabels one
 * as Posting would only guarantee a rejection). Otherwise the key is Posting —
 * including when the dApp sends no keyType at all, which is the case that broke
 * post editing. We never silently sign a posting-authority operation with the
 * Active key: that over-exposes the Active key and Blurt rejects it anyway.
 */
export const selectBroadcastKey = (
    account: { postingKey?: string; activeKey?: string },
    requestedKeyType: any,
    operations: any[]
): BroadcastKeySelection => {
    const needsActive =
        normalizeKeyType(requestedKeyType) === 'active' ||
        requiresActiveAuthority(operations);

    return needsActive
        ? { key: account.activeKey || '', keyType: 'active' }
        : { key: account.postingKey || '', keyType: 'posting' };
};
