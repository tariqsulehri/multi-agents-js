export const toolSchemas = [
    {
        name: "get_order",
        description: "Get order status by orderId",
        parameters: {
            type: "object",
            properties: {
                orderId: {
                    type: "string",
                    description: "Order ID of customer",
                },
            },
            required: ["orderId"],
        },
    },
];