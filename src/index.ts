import http from "http";
import dotenv from "dotenv";
import { validate } from "uuid";
import { crud, ResponseData } from "./crud";

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
    const { method, url } = req;
    const httpMethod = method ?? "GET";

    const [place, name, id] = (url ?? "").substring(1).split("/");
    if (place !== "api") return void res.end('"Not found"');
    if (name !== "users") return void res.end('"Not found"');

    if (id && !validate(id)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "id is not valid" }));
        return;
    }

    try {
        const result: ResponseData = await crud[httpMethod.toLowerCase()](req, id);
        res.writeHead(result.code, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result.data));
    } catch (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: (error as Error).message }));
        return;
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
