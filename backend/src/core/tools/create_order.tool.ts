import { OrderState } from "../state/order.state";
import { v4 as uuidv4 } from "uuid";

export const CreateOrderTool = {
    name: "create_order",

    async execute(input: { userId: string; items: string[] }) {
        const order = {
            orderId: uuidv4(),
            userId: input.userId,
            items: input.items,
            status: "CREATED" as const,
            createdAt: new Date(),
        };

        return OrderState.createOrder(order);
    },
};