import cluster from "cluster";
import { User } from "./data/users";

export class Store {
    private static instance: Store;
    private data: User[] = [];

    private constructor() {
        if (cluster.isWorker) {
            // Listen for state updates from primary
            process.on("message", (msg: { type: string; payload: any }) => {
                if (msg.type === "SYNC_STATE") {
                    this.data = msg.payload;
                }
            });
        }
    }

    static getInstance(): Store {
        if (!Store.instance) {
            Store.instance = new Store();
        }
        return Store.instance;
    }

    getAll(): User[] {
        return this.data;
    }

    add(user: User): void {
        this.data.push(user);
        this.syncState();
    }

    update(id: string, userData: Partial<User>): User | null {
        const index = this.data.findIndex((u) => u.id === id);
        if (index === -1) return null;

        this.data[index] = { ...this.data[index], ...userData };
        this.syncState();
        return this.data[index];
    }

    delete(id: string): boolean {
        const index = this.data.findIndex((u) => u.id === id);
        if (index === -1) return false;

        this.data.splice(index, 1);
        this.syncState();
        return true;
    }

    private syncState() {
        if (cluster.isWorker && process.send) {
            // Send update to primary
            process.send({ type: "STATE_UPDATE", payload: this.data });
        }
    }
}
