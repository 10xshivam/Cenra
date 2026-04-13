interface GoogleProfile {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
}
export declare const getGoogleUserProfile: (code: string) => Promise<GoogleProfile | null>;
export {};
//# sourceMappingURL=googleAuth.d.ts.map