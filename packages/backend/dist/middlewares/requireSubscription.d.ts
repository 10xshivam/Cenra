import { NextFunction, Request, Response } from "express";
interface Subscription {
    id: string;
    userId: string;
    plan: string;
    status: string;
    startedAt: Date;
    endsAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare global {
    namespace Express {
        interface Request {
            subscription?: Subscription;
        }
    }
}
export declare const requireActiveSubscription: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export {};
//# sourceMappingURL=requireSubscription.d.ts.map