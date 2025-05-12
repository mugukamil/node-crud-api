import http from "http";
import dotenv from "dotenv";
import { User, users } from "./data/users";
import { v4 as uuidv4, validate } from "uuid";
import { getPayload } from "./utils";

dotenv.config();

const PORT = process.env.PORT || 3000;

const crud = { get: "read", post: "create", put: "update", delete: "delete" };

// const routing = {
//     users: {
//         async get(id) {
//             if (!id) return pool.query("SELECT id, login FROM users");
//             const sql = "SELECT id, login FROM users WHERE id = $1";
//             return await pool.query(sql, [id]);
//         },

//         async post({ login, password }) {
//             const sql = "INSERT INTO users (login, password) VALUES ($1, $2)";
//             const passwordHash = await hash(password);
//             return await pool.query(sql, [login, passwordHash]);
//         },

//         async put(id, { login, password }) {
//             const sql = "UPDATE users SET login = $1, password = $2 WHERE id = $3";
//             const passwordHash = await hash(password);
//             return await pool.query(sql, [login, passwordHash, id]);
//         },

//         async delete(id) {
//             const sql = "DELETE FROM users WHERE id = $1";
//             return await pool.query(sql, [id]);
//         },
//     },
// };

const server = http.createServer(async (req, res) => {
    const { method, url } = req;

    if (url?.includes("/api/users")) {
        const requiredFields: Array<keyof User> = ["username", "age", "hobbies"];
        const [id] = url.replace("/api/users", "").split("/").slice(-1);

        console.log(id);
        console.log(users);

        if (method === "GET") {
            if (!id) {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(users));
                return;
            }
            if (!validate(id)) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "id is not valid" }));
                return;
            }
            const user = users.find((user) => user?.id === id);
            if (!user) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "User doesn't exist" }));
                return;
            }
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(user));
            return;
        }
        if (method === "POST") {
            const payload = await getPayload(req);

            if (!requiredFields.every((f) => f in payload)) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Invalid payload" }));
                return;
            }

            const user = {
                id: uuidv4(),
                ...payload,
            };
            users.push(user);
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify(user));
            return;
        }
        if (method === "PUT") {
            const payload = await getPayload(req);

            if (!requiredFields.some((f) => Object.keys(payload).find((p) => p === f))) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Invalid payload" }));
                return;
            }

            if (!validate(id)) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "id is not valid" }));
                return;
            }

            let userIndex = users.findIndex((user) => user.id === id);
            if (userIndex === -1) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "User doesn't exist" }));
                return;
            }

            const user = { ...users[userIndex], ...payload };
            users[userIndex] = user;

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(user));
            return;
        }
        if (method === "DELETE") {
            if (!validate(id)) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "id is not valid" }));
                return;
            }

            let userIndex = users.findIndex((user) => user.id === id);
            if (userIndex === -1) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "User doesn't exist" }));
                return;
            }

            users.splice(userIndex, 1);

            res.writeHead(204, { "Content-Type": "application/json" });
            res.end(JSON.stringify(id));
            return;
        }
    }
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
