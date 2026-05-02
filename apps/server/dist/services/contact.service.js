"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactService = void 0;
const database_1 = __importDefault(require("../config/database"));
exports.contactService = {
    async submit(data) {
        const message = await database_1.default.contactMessage.create({
            data,
        });
        return message;
    },
    async getMessages() {
        const messages = await database_1.default.contactMessage.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return messages;
    },
    async markAsRead(id) {
        await database_1.default.contactMessage.update({
            where: { id },
            data: { isRead: true },
        });
    },
};
//# sourceMappingURL=contact.service.js.map