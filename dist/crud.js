"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crud = exports.requiredFields = void 0;
const users_1 = require("./data/users");
const utils_1 = require("./utils");
const uuid_1 = require("uuid");
exports.requiredFields = ["username", "age", "hobbies"];
exports.crud = {
    get(req, id) {
        if (!id)
            return { code: 200, data: users_1.users };
        const user = users_1.users.find((u) => (u === null || u === void 0 ? void 0 : u.id) === id);
        return user ? { code: 200, data: user } : { code: 400, data: { message: "not found" } };
    },
    post(req, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = yield (0, utils_1.getPayload)(req);
            if (!exports.requiredFields.every((f) => f in payload)) {
                return { code: 400, data: { message: "Invalid Payload" } };
            }
            const user = Object.assign({ id: (0, uuid_1.v4)() }, payload);
            users_1.users.push(user);
            return { code: 201, data: user };
        });
    },
    put(req, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = yield (0, utils_1.getPayload)(req);
            if (!exports.requiredFields.some((f) => Object.keys(payload).find((p) => p === f))) {
                return { code: 400, data: { message: "Invalid payload" } };
            }
            let userIndex = users_1.users.findIndex((user) => (user === null || user === void 0 ? void 0 : user.id) === id);
            if (userIndex === -1) {
                return { code: 400, data: { message: "User doesn't exist" } };
            }
            const user = Object.assign(Object.assign({}, users_1.users[userIndex]), payload);
            users_1.users[userIndex] = user;
            return { code: 200, data: user };
        });
    },
    delete(req, id) {
        let userIndex = users_1.users.findIndex((user) => user.id === id);
        if (userIndex === -1) {
            return { code: 400, data: { message: "User doesn't exist" } };
        }
        users_1.users.splice(userIndex, 1);
        return { code: 204, data: null };
    },
};
