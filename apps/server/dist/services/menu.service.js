"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuService = void 0;
const database_1 = __importDefault(require("../config/database"));
exports.menuService = {
    async getMenu() {
        const categories = await database_1.default.category.findMany({
            where: { isActive: true },
            include: {
                items: {
                    where: { isAvailable: true },
                    orderBy: { name: 'asc' },
                },
            },
            orderBy: { sortOrder: 'asc' },
        });
        return categories;
    },
    async getCategories() {
        const categories = await database_1.default.category.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
        });
        return categories;
    },
    async getItem(slug) {
        const item = await database_1.default.menuItem.findUnique({
            where: { slug },
            include: { category: true },
        });
        return item;
    },
};
//# sourceMappingURL=menu.service.js.map