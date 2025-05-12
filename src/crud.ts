import { User, users } from "./data/users";
import { getPayload } from "./utils";
import { v4 as uuidv4 } from "uuid";

export type ResponseData = {
    code: number;
    data: any;
};

export const requiredFields: Array<keyof User> = ["username", "age", "hobbies"];

export const crud: { [key: string]: (...args: any[]) => Promise<ResponseData> | ResponseData } = {
    get(req, id) {
        if (!id) return { code: 200, data: users };
        const user = users.find((u) => u?.id === id);
        return user ? { code: 200, data: user } : { code: 400, data: { message: "not found" } };
    },
    async post(req, id) {
        const payload = await getPayload(req);
        if (!requiredFields.every((f) => f in payload)) {
            return { code: 400, data: { message: "Invalid Payload" } };
        }

        const user = {
            id: uuidv4(),
            ...payload,
        };
        users.push(user);

        return { code: 201, data: user };
    },
    async put(req, id) {
        const payload = await getPayload(req);
        if (!requiredFields.some((f) => Object.keys(payload).find((p) => p === f))) {
            return { code: 400, data: { message: "Invalid payload" } };
        }

        let userIndex = users.findIndex((user) => user?.id === id);
        if (userIndex === -1) {
            return { code: 400, data: { message: "User doesn't exist" } };
        }

        const user = { ...users[userIndex], ...payload };
        users[userIndex] = user;

        return { code: 200, data: user };
    },
    delete(req, id) {
        let userIndex = users.findIndex((user) => user.id === id);
        if (userIndex === -1) {
            return { code: 400, data: { message: "User doesn't exist" } };
        }
        users.splice(userIndex, 1);
        return { code: 204, data: null };
    },
};
