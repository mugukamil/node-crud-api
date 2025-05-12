import cluster from "cluster";
import os from "os";
import { createServer } from "./server";
import { LoadBalancer } from "./loadBalancer";
import http from "http";

const numCPUs = os.cpus().length;
const PORT = parseInt(process.env.PORT || "4000");

export const startCluster = () => {
    if (cluster.isPrimary) {
        console.log(`Primary ${process.pid} is running`);
        console.log(`Starting load balancer on port ${PORT}`);

        let sharedState: any[] = [];

        // Create load balancer
        const loadBalancer = new LoadBalancer(PORT, numCPUs - 1);
        http.createServer((req, res) => {
            loadBalancer.forward(req, res);
        }).listen(PORT);

        // Fork workers
        for (let i = 0; i < numCPUs - 1; i++) {
            cluster.fork({ WORKER_PORT: PORT + i + 1 });
        }

        // Handle messages from workers
        Object.values(cluster.workers!).forEach((worker) => {
            worker?.on("message", (msg: { type: string; payload: any }) => {
                if (msg.type === "STATE_UPDATE") {
                    sharedState = msg.payload;
                    // Broadcast to all workers
                    Object.values(cluster.workers!).forEach((w) => {
                        w?.send({ type: "SYNC_STATE", payload: sharedState });
                    });
                }
            });
        });

        cluster.on("exit", (worker, code, signal) => {
            console.log(`Worker ${worker.process.pid} died`);
        });
    } else {
        const workerPort = parseInt(process.env.WORKER_PORT || "4001");
        createServer(workerPort);
        console.log(`Worker ${process.pid} started on port ${workerPort}`);
    }
};
