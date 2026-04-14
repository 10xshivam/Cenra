import { NextFunction, Request, Response } from "express";
declare global {
    namespace Express {
        interface Request {
            workspace?: {
                id: string;
                userId: string;
                name: string;
                website: string | null;
                plan: string;
            };
        }
    }
}
export declare const requireWorkspaceAccess: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const requireWorkspacePublic: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=requireWorkspace.d.ts.map