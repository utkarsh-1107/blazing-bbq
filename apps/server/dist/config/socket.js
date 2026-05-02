"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = initSocket;
exports.getIO = getIO;
exports.emitNewOrder = emitNewOrder;
exports.emitOrderStatusUpdate = emitOrderStatusUpdate;
exports.emitOrderCompleted = emitOrderCompleted;
exports.emitNotification = emitNotification;
const socket_io_1 = require("socket.io");
let io;
function initSocket(httpServer) {
    io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:3000',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });
    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);
        // Join admin room
        socket.on('join:admin', () => {
            socket.join('admin');
            console.log('Admin joined room:', socket.id);
        });
        // Join order tracking room
        socket.on('join:order', (orderId) => {
            socket.join(`order:${orderId}`);
            console.log('Client joined order room:', orderId);
        });
        // Leave order tracking room
        socket.on('leave:order', (orderId) => {
            socket.leave(`order:${orderId}`);
            console.log('Client left order room:', orderId);
        });
        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
    return io;
}
function getIO() {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
}
// Helper functions to emit events
function emitNewOrder(order) {
    io?.to('admin').emit('order:created', order);
}
function emitOrderStatusUpdate(orderId, status, estimatedTime, deliveryPartner) {
    io?.to(`order:${orderId}`).emit('order:statusUpdate', {
        orderId,
        status,
        estimatedTime,
        deliveryPartner
    });
}
function emitOrderCompleted(order) {
    io?.to(`order:${order.id}`).emit('order:completed', order);
}
function emitNotification(message) {
    io?.to('admin').emit('notification', message);
}
//# sourceMappingURL=socket.js.map