import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { ServerToClientEvents, ClientToServerEvents, OrderStatus } from '../../../../shared/types';
export interface ExtendedSocket extends Socket<ClientToServerEvents, ServerToClientEvents> {
    userId?: string;
    isAdmin?: boolean;
}
interface DeliveryPartner {
    name: string;
    phone: string;
}
export declare function initSocket(httpServer: HttpServer): Server<ClientToServerEvents, ServerToClientEvents>;
export declare function getIO(): Server<ClientToServerEvents, ServerToClientEvents>;
export declare function emitNewOrder(order: any): void;
export declare function emitOrderStatusUpdate(orderId: string, status: OrderStatus, estimatedTime?: number, deliveryPartner?: DeliveryPartner): void;
export declare function emitOrderCompleted(order: any): void;
export declare function emitNotification(message: string): void;
export {};
//# sourceMappingURL=socket.d.ts.map