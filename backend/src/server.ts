import app from "./app";
import dotenv from "dotenv";

// Tool Registry
import { ToolRegistry } from "./core/tools/tool.registry";
import { GetOrderTool } from "./core/tools/order.tool";
import { CreateOrderTool } from "./core/tools/create_order.tool";
import { FAQTool } from "./core/tools/faq.tool";

// Workers (IMPORTANT for Event Bus subscriptions)
import { InfoWorker } from "./agents/workers/info.worker";
import { SalesWorker } from "./agents/workers/sales.worker";
import { SupportWorker } from "./agents/workers/support.worker";

dotenv.config();

/**
 * -----------------------------------
 * Register Tools
 * -----------------------------------
 */
ToolRegistry.register(GetOrderTool);
ToolRegistry.register(CreateOrderTool);
ToolRegistry.register(FAQTool);

/**
 * -----------------------------------
 * Bootstrap Event-Driven Workers
 * VERY IMPORTANT:
 * Instantiating workers activates
 * EventBus subscriptions
 * -----------------------------------
 */
new InfoWorker();
new SalesWorker();
new SupportWorker();

/**
 * -----------------------------------
 * Start Server
 * -----------------------------------
 */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});