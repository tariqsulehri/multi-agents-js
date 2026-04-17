import { OrderState } from "../state/order.state";

export const GetOrderTool = {
    name: "get_order",

    async execute(input: { orderId: string }) {
        return OrderState.getOrder(input.orderId);
    },
};