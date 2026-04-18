import app from "./app";
import dotenv from "dotenv";

// Tool Registry
import { ToolRegistry } from "./core/tools/tool.registry";
import { GetOrderTool } from "./core/tools/order.tool";
import { CreateOrderTool } from "./core/tools/create_order.tool";
import { FAQTool } from "./core/tools/faq.tool";

// Temporary EventBus Workers
import { SalesWorker } from "./agents/workers/sales.worker";
import { SupportWorker } from "./agents/workers/support.worker";

// IMPORTANT: Queue Consumer Bootstrap
import "./agents/workers/info.consumer";

dotenv.config();

/**
 * Register Tools
 */
ToolRegistry.register(GetOrderTool);
ToolRegistry.register(CreateOrderTool);
ToolRegistry.register(FAQTool);

/**
 * Temporary workers
 */
new SalesWorker();
new SupportWorker();

/**
 * Start API Server
 */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});