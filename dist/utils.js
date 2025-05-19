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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPayload = void 0;
const getPayload = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, req_1, req_1_1;
    var _b, e_1, _c, _d;
    try {
        const buffers = [];
        try {
            for (_a = true, req_1 = __asyncValues(req); req_1_1 = yield req_1.next(), _b = req_1_1.done, !_b; _a = true) {
                _d = req_1_1.value;
                _a = false;
                const chunk = _d;
                buffers.push(chunk);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_a && !_b && (_c = req_1.return)) yield _c.call(req_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        const data = Buffer.concat(buffers).toString();
        return JSON.parse(data);
    }
    catch (err) {
        throw new Error("Invalid Request");
    }
});
exports.getPayload = getPayload;
