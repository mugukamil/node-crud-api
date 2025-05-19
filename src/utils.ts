import { IncomingMessage } from "http";
export const getPayload = async (req: IncomingMessage) => {
    try {
        const buffers = [];
        for await (const chunk of req) buffers.push(chunk);
        const data = Buffer.concat(buffers).toString();
        return JSON.parse(data);
    } catch (err) {
        throw new Error("Invalid Request");
    }
};
