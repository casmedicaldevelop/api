"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeCum = normalizeCum;
function normalizeCum(raw) {
    if (!raw)
        return null;
    const trimmed = raw.trim();
    if (!trimmed)
        return null;
    const dashIdx = trimmed.lastIndexOf('-');
    if (dashIdx === -1)
        return trimmed;
    const prefix = trimmed.slice(0, dashIdx);
    const suffix = trimmed.slice(dashIdx + 1);
    return `${prefix}-${suffix.replace(/^0+([1-9])$/, '$1')}`;
}
//# sourceMappingURL=normalize-cum.js.map