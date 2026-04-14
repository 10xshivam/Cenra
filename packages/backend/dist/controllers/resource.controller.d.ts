import { Request, Response } from "express";
export declare const createFileResource: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createWebResource: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllResources: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const toggleResource: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteResource: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const recrawlWebResource: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=resource.controller.d.ts.map