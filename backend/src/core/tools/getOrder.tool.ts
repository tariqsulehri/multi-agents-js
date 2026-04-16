import { Tool } from "./tool.interface";

export const GetOrderTool: Tool = {
    name: "get_order",
    description: "Fetch order details",

    async execute(input: any) {
        return {
            orderId: input.orderId,
            status: "Delivered",
            amount: 1200,
        };
    },
};