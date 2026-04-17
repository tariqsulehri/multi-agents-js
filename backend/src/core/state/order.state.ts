type OrderStatus = "CREATED" | "PREPARING" | "DELIVERED";

export interface Order {
    orderId: string;
    userId: string;
    items: string[];
    status: OrderStatus;
    createdAt: Date;
}

class OrderStateStore {
    private orders: Record<string, Order> = {};

    createOrder(order: Order) {
        this.orders[order.orderId] = order;
        return order;
    }

    getOrder(orderId: string) {
        return this.orders[orderId] || null;
    }

    updateOrder(orderId: string, updates: Partial<Order>) {
        if (!this.orders[orderId]) return null;

        this.orders[orderId] = {
            ...this.orders[orderId],
            ...updates,
        };

        return this.orders[orderId];
    }

    getUserOrders(userId: string) {
        return Object.values(this.orders).filter(o => o.userId === userId);
    }
}

export const OrderState = new OrderStateStore();