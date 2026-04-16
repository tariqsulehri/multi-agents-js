import app from "./app";
import dotenv from "dotenv";
import { ToolRegistry } from "./core/tools/tool.registry";
import { GetOrderTool } from "./core/tools/getOrder.tool";

ToolRegistry.register(GetOrderTool);

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

