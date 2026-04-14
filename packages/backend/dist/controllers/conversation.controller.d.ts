import { Request, Response } from "express";
export declare const createConversation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const startConversation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getConversations: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getConversationStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateConversationStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteConversation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=conversation.controller.d.ts.map