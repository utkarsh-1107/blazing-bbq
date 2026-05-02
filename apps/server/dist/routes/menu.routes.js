"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const menu_service_1 = require("../services/menu.service");
const router = (0, express_1.Router)();
// GET /menu - Get all categories with items
router.get('/', async (req, res) => {
    try {
        const menu = await menu_service_1.menuService.getMenu();
        res.json({ success: true, data: menu });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// GET /menu/categories - Get categories only
router.get('/categories', async (req, res) => {
    try {
        const categories = await menu_service_1.menuService.getCategories();
        res.json({ success: true, data: categories });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// GET /menu/items/:slug - Get single item
router.get('/items/:slug', async (req, res) => {
    try {
        const item = await menu_service_1.menuService.getItem(req.params.slug);
        if (!item) {
            return res.status(404).json({ success: false, error: 'Item not found' });
        }
        res.json({ success: true, data: item });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=menu.routes.js.map