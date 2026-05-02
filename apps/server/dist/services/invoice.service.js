"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceService = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const database_1 = __importDefault(require("../config/database"));
exports.invoiceService = {
    async generateInvoice(orderId) {
        const order = await database_1.default.order.findUnique({
            where: { id: orderId },
            include: {
                user: true,
                items: {
                    include: {
                        menuItem: true,
                    },
                },
            },
        });
        if (!order) {
            throw new Error('Order not found');
        }
        return new Promise((resolve, reject) => {
            try {
                const doc = new pdfkit_1.default({ margin: 50 });
                const chunks = [];
                doc.on('data', (chunk) => chunks.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(chunks)));
                doc.on('error', reject);
                // Header
                doc.fontSize(24).fillColor('#E53935').text('Blazing Barbecue', { align: 'center' });
                doc.moveDown(0.5);
                doc.fontSize(10).fillColor('#666').text('BBQ Restaurant', { align: 'center' });
                doc.text('Thane, Maharashtra', { align: 'center' });
                doc.text('FSSAI: 21520046000143', { align: 'center' });
                doc.moveDown(1);
                // Invoice details
                doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke('#ddd');
                doc.moveDown(0.5);
                doc.fontSize(12).fillColor('#333').text(`Invoice #${order.orderNumber}`, { align: 'center' });
                doc.fontSize(10).fillColor('#666');
                doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, { align: 'center' });
                doc.text(`Time: ${new Date(order.createdAt).toLocaleTimeString('en-IN')}`, { align: 'center' });
                doc.moveDown(1);
                // Customer info
                doc.fontSize(10).fillColor('#333');
                doc.text(`Customer: ${order.user.name || 'N/A'}`);
                doc.text(`Phone: ${order.user.phone}`);
                if (order.deliveryAddress) {
                    doc.text(`Delivery Address: ${order.deliveryAddress}`);
                }
                doc.moveDown(1);
                // Table header
                const tableTop = doc.y;
                doc.fontSize(10).fillColor('#E53935');
                doc.text('Item', 50, tableTop, { width: 250 });
                doc.text('Qty', 300, tableTop, { width: 50, align: 'center' });
                doc.text('Price', 350, tableTop, { width: 80, align: 'right' });
                doc.text('Total', 430, tableTop, { width: 80, align: 'right' });
                doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke('#E53935');
                // Items
                let y = tableTop + 25;
                doc.fillColor('#333');
                for (const item of order.items) {
                    const itemTotal = Number(item.price) * item.quantity;
                    doc.text(item.menuItem.name, 50, y, { width: 250 });
                    doc.text(item.quantity.toString(), 300, y, { width: 50, align: 'center' });
                    doc.text(`Rs. ${Number(item.price).toFixed(2)}`, 350, y, { width: 80, align: 'right' });
                    doc.text(`Rs. ${itemTotal.toFixed(2)}`, 430, y, { width: 80, align: 'right' });
                    y += 20;
                }
                doc.moveTo(50, y).lineTo(550, y).stroke('#ddd');
                y += 10;
                // Totals
                const totalsX = 350;
                doc.text('Subtotal:', totalsX, y, { width: 80, align: 'right' });
                doc.text(`Rs. ${Number(order.subtotal).toFixed(2)}`, 430, y, { width: 80, align: 'right' });
                y += 18;
                if (Number(order.discount) > 0) {
                    doc.fillColor('#2e7d32');
                    doc.text(`Discount (${order.couponCode || ''}):`, totalsX, y, { width: 80, align: 'right' });
                    doc.text(`- Rs. ${Number(order.discount).toFixed(2)}`, 430, y, { width: 80, align: 'right' });
                    y += 18;
                    doc.fillColor('#333');
                }
                doc.text('GST (5%):', totalsX, y, { width: 80, align: 'right' });
                doc.text(`Rs. ${Number(order.gst).toFixed(2)}`, 430, y, { width: 80, align: 'right' });
                y += 18;
                if (Number(order.deliveryFee) > 0) {
                    doc.text('Delivery Fee:', totalsX, y, { width: 80, align: 'right' });
                    doc.text(`Rs. ${Number(order.deliveryFee).toFixed(2)}`, 430, y, { width: 80, align: 'right' });
                    y += 18;
                }
                y += 5;
                doc.moveTo(50, y).lineTo(550, y).stroke('#E53935');
                y += 10;
                doc.fontSize(12).fillColor('#E53935');
                doc.text('TOTAL:', totalsX, y, { width: 80, align: 'right' });
                doc.text(`Rs. ${Number(order.total).toFixed(2)}`, 430, y, { width: 80, align: 'right' });
                y += 30;
                // Payment status
                doc.fontSize(10).fillColor('#666');
                doc.text(`Payment Status: ${order.paymentStatus}`, 50, y);
                if (order.paymentId) {
                    doc.text(`Payment ID: ${order.paymentId}`, 50, y + 15);
                }
                // Footer
                doc.fontSize(8).fillColor('#999');
                doc.text('Thank you for ordering with Blazing Barbecue!', 50, 700, { align: 'center' });
                doc.text('For queries, contact: blazingbarbecue@gmail.com | +91 9321836106', 50, 710, { align: 'center' });
                doc.end();
            }
            catch (error) {
                reject(error);
            }
        });
    },
};
//# sourceMappingURL=invoice.service.js.map