"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeJson = exports.normalizeSuggestions = void 0;
const normalizeSuggestions = (value) => {
    if (!value)
        return null;
    const s = value;
    return {
        suggestion1: typeof s.suggestion1 === "string" ? s.suggestion1 : null,
        suggestion2: typeof s.suggestion2 === "string" ? s.suggestion2 : null,
        suggestion3: typeof s.suggestion3 === "string" ? s.suggestion3 : null,
    };
};
exports.normalizeSuggestions = normalizeSuggestions;
const mergeJson = (incoming, existing) => {
    if (incoming === undefined)
        return existing ?? undefined;
    return incoming;
};
exports.mergeJson = mergeJson;
