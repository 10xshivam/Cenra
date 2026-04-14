import { Request, Response } from "express";
export declare const createMessage: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getConversationMessagesWithIdentityCheck: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getLastMessage: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllMessages: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const sendHumanReply: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=message.controller.d.ts.map