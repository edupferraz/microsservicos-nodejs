import { channels } from "../channels/index.ts";
import type { OrderCreatedMessage } from '../../../contracts/messages/order-created-message.ts'

export async function dispatchOrderCreated(data: OrderCreatedMessage) {
    try {
        const sent = await channels.orders.sendToQueue('orders', Buffer.from(JSON.stringify(data)));
        console.log('Message sent to the orders queue:', sent);
    } catch (error) {
        console.error('Error sending message to the orders queue:', error);
    }
}