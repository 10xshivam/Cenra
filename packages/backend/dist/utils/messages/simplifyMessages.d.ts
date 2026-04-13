import { BaseMessage } from "@langchain/core/messages";
type SimplifiedMessage = {
    id: string;
    from: string;
    content: string;
};
export declare const simplifyMessage: (msg: BaseMessage) => SimplifiedMessage | null;
export {};
//# sourceMappingURL=simplifyMessages.d.ts.map