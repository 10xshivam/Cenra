type Suggestions = {
  suggestion1: string | null;
  suggestion2: string | null;
  suggestion3: string | null;
};

export const normalizeSuggestions = (value: unknown): Suggestions | null => {
  if (!value) return null;

  const s = value as Record<string, unknown>;

  return {
    suggestion1: typeof s.suggestion1 === "string" ? s.suggestion1 : null,
    suggestion2: typeof s.suggestion2 === "string" ? s.suggestion2 : null,
    suggestion3: typeof s.suggestion3 === "string" ? s.suggestion3 : null,
  };
};

export const mergeJson = <T>(incoming: T | undefined, existing: T | null) => {
  if (incoming === undefined) return existing ?? undefined;
  return incoming;
};
