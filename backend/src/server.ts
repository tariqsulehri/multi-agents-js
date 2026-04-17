import app from "./app";
import dotenv from "dotenv";
import { ToolRegistry } from "./core/tools/tool.registry";
import { GetOrderTool } from "./core/tools/order.tool";
import { CreateOrderTool } from "./core/tools/create_order.tool";
import { FAQTool } from "./core/tools/faq.tool";

dotenv.config();

// register tools
ToolRegistry.register(GetOrderTool);
ToolRegistry.register(CreateOrderTool);
ToolRegistry.register(FAQTool);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

