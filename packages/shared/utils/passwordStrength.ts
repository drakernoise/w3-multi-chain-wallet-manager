
/**
 * Calculates a basic password strength score.
 * Returns:
 * 0: Very Weak
 * 1: Weak
 * 2: Medium
 * 3: Strong
 * 4: Very Strong
 */
export const calculatePasswordStrength = (password: string): number => {
    let score = 0;
    if (!password) return 0;

    // Length checks
    if (password.length > 8) score += 1;
    if (password.length > 12) score += 1;

    // Character variety checks
    if (/[A-Z]/.test(password)) score += 0.5;
    if (/[0-9]/.test(password)) score += 0.5;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    return Math.floor(Math.min(4, score));
};

export const getStrengthLabel = (score: number): { label: string, color: string } => {
    switch (score) {
        case 0:
        case 1:
            return { label: 'Weak', color: 'bg-red-500' };
        case 2:
            return { label: 'Medium', color: 'bg-yellow-500' };
        case 3:
            return { label: 'Strong', color: 'bg-green-500' };
        case 4:
            return { label: 'Very Strong', color: 'bg-emerald-500' };
        default:
            return { label: 'Weak', color: 'bg-slate-500' };
    }
};
