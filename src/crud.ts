import { User } from "./data/users";
import { getPayload } from "./utils";
import { v4 as uuidv4 } from "uuid";
import { Store } from "./store";

const store = Store.getInstance();

export type ResponseData = {
    code: number;
    data: any;
};

export const requiredFields: Array<keyof User> = ["username", "age", "hobbies"];

export const crud: { [key: string]: (...args: any[]) => Promise<ResponseData> | ResponseData } = {
    get(req, id) {
        if (!id) return { code: 200, data: store.getAll() };
        const user = store.getAll().find((u) => u?.id === id);
        return user ? { code: 200, data: user } : { code: 404, data: { message: "not found" } };
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
        store.add(user);

        return { code: 201, data: user };
    },
    async put(req, id) {
        const payload = await getPayload(req);
        if (!requiredFields.some((f) => Object.keys(payload).find((p) => p === f))) {
            return { code: 400, data: { message: "Invalid payload" } };
        }

        let userIndex = store.getAll().findIndex((user) => user?.id === id);
        if (userIndex === -1) {
            return { code: 400, data: { message: "User doesn't exist" } };
        }

        const user = { ...store.getAll()[userIndex], ...payload };
        store.update(id, user);

        return { code: 200, data: user };
    },
    delete(req, id) {
        let userIndex = store.getAll().findIndex((user) => user.id === id);
        if (userIndex === -1) {
            return { code: 400, data: { message: "User doesn't exist" } };
        }
        store.delete(id);
        return { code: 204, data: null };
    },
};
