import dotenv from "dotenv";
import { startCluster } from "./cluster";

dotenv.config();

if (process.env.NODE_ENV === "multi") {
    startCluster();
} else {
    const PORT = parseInt(process.env.PORT || "4000");
    import("./server").then(({ createServer }) => {
        createServer(PORT);
        console.log(`Server is running on port ${PORT}`);
    });
}
