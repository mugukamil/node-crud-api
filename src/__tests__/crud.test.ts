import http from "http";
import { AddressInfo } from "net";
import { users } from "../data/users";
import { crud } from "../crud";

describe("CRUD API Tests", () => {
    let server: http.Server;
    let baseUrl: string;
    let createdUserId: string;

    beforeAll((done) => {
        server = http.createServer(async (req, res) => {
            const { method, url } = req;
            const [, , id] = (url ?? "").substring(1).split("/");

            try {
                const result = await crud[method?.toLowerCase() ?? "get"](req, id);
                res.writeHead(result.code, { "Content-Type": "application/json" });
                res.end(JSON.stringify(result.data));
            } catch (error) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Internal Server Error" }));
            }
        });

        server.listen(0, () => {
            const { port } = server.address() as AddressInfo;
            baseUrl = `http://localhost:${port}`;
            done();
        });
    });

    afterAll((done) => {
        users.length = 0;
        server.close(done);
    });

    beforeEach(() => {
        users.length = 0;
    });

    test("GET /api/users returns empty array initially", async () => {
        const response = await fetch(`${baseUrl}/api/users`);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(Array.isArray(data)).toBeTruthy();
        expect(data.length).toBe(0);
    });

    test("POST /api/users creates new user", async () => {
        const newUser = {
            username: "John Doe",
            age: 30,
            hobbies: ["reading", "gaming"],
        };

        const response = await fetch(`${baseUrl}/api/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser),
        });

        const data = await response.json();
        createdUserId = data.id;

        expect(response.status).toBe(201);
        expect(data.username).toBe(newUser.username);
        expect(data.age).toBe(newUser.age);
        expect(data.hobbies).toEqual(newUser.hobbies);
        expect(data.id).toBeDefined();
    });

    test("GET /api/users/{userId} returns created user", async () => {
        const response = await fetch(`${baseUrl}/api/users/${createdUserId}`);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.id).toBe(createdUserId);
    });

    test("PUT /api/users/{userId} updates user", async () => {
        const updateData = {
            username: "Jane Doe",
            age: 31,
            hobbies: ["writing"],
        };

        const response = await fetch(`${baseUrl}/api/users/${createdUserId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateData),
        });

        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.username).toBe(updateData.username);
        expect(data.age).toBe(updateData.age);
        expect(data.hobbies).toEqual(updateData.hobbies);
        expect(data.id).toBe(createdUserId);
    });

    test("DELETE /api/users/{userId} removes user", async () => {
        const response = await fetch(`${baseUrl}/api/users/${createdUserId}`, {
            method: "DELETE",
        });

        expect(response.status).toBe(204);
    });

    test("GET /api/users/{userId} returns 404 for deleted user", async () => {
        const response = await fetch(`${baseUrl}/api/users/${createdUserId}`);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.message).toBe("not found");
    });

    test("PUT /api/users/{userId} returns 400 for invalid payload", async () => {
        const response = await fetch(`${baseUrl}/api/users/${createdUserId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ invalid: "payload" }),
        });

        const data = await response.json();
        expect(response.status).toBe(400);
        expect(data.message).toBe("Invalid payload");
    });
});
