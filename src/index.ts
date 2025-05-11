import http from "http";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.end("Server is running");
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
