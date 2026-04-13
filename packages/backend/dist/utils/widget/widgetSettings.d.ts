type Suggestions = {
    suggestion1: string | null;
    suggestion2: string | null;
    suggestion3: string | null;
};
export declare const normalizeSuggestions: (value: unknown) => Suggestions | null;
export declare const mergeJson: <T>(incoming: T | undefined, existing: T | null) => NonNullable<T> | (T & null) | undefined;
export {};
//# sourceMappingURL=widgetSettings.d.ts.map