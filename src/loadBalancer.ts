import http from "http";
import { AddressInfo } from "net";

export class LoadBalancer {
    private currentWorker = 0;
    private readonly workers: number[];

    constructor(
        private basePort: number,
        private numWorkers: number,
    ) {
        this.workers = Array.from({ length: numWorkers }, (_, i) => basePort + i + 1);
    }

    async forward(req: http.IncomingMessage, res: http.ServerResponse) {
        const targetPort = this.workers[this.currentWorker];
        this.currentWorker = (this.currentWorker + 1) % this.workers.length;

        const options = {
            hostname: "localhost",
            port: targetPort,
            path: req.url,
            method: req.method,
            headers: req.headers,
        };

        const proxyReq = http.request(options, (proxyRes) => {
            res.writeHead(proxyRes.statusCode!, proxyRes.headers);
            proxyRes.pipe(res, { end: true });
        });

        req.pipe(proxyReq, { end: true });

        proxyReq.on("error", (error) => {
            console.error(`Error forwarding to worker on port ${targetPort}:`, error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal Server Error" }));
        });
    }
}
