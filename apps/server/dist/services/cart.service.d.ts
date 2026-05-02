import { Decimal } from '@prisma/client/runtime/library';
export declare const cartService: {
    getCart(userId: string): Promise<{
        subtotal: number;
        items?: ({
            menuItem: {
                category: {
                    description: string | null;
                    id: string;
                    createdAt: Date;
                    name: string;
                    updatedAt: Date;
                    slug: string;
                    image: string | null;
                    sortOrder: number;
                    isActive: boolean;
                };
            } & {
                description: string | null;
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                slug: string;
                image: string | null;
                isAvailable: boolean;
                price: Decimal;
                categoryId: string;
                isVeg: boolean;
                prepTime: number | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            cartId: string;
            menuItemId: string;
            quantity: number;
            notes: string | null;
        })[] | undefined;
        userId?: string | undefined;
        id?: string | undefined;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
    }>;
    addItem(userId: string, menuItemId: string, quantity: number, notes?: string): Promise<{
        subtotal: number;
        items?: ({
            menuItem: {
                category: {
                    description: string | null;
                    id: string;
                    createdAt: Date;
                    name: string;
                    updatedAt: Date;
                    slug: string;
                    image: string | null;
                    sortOrder: number;
                    isActive: boolean;
                };
            } & {
                description: string | null;
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                slug: string;
                image: string | null;
                isAvailable: boolean;
                price: Decimal;
                categoryId: string;
                isVeg: boolean;
                prepTime: number | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            cartId: string;
            menuItemId: string;
            quantity: number;
            notes: string | null;
        })[] | undefined;
        userId?: string | undefined;
        id?: string | undefined;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
    }>;
    updateItem(userId: string, cartItemId: string, quantity: number, notes?: string): Promise<{
        subtotal: number;
        items?: ({
            menuItem: {
                category: {
                    description: string | null;
                    id: string;
                    createdAt: Date;
                    name: string;
                    updatedAt: Date;
                    slug: string;
                    image: string | null;
                    sortOrder: number;
                    isActive: boolean;
                };
            } & {
                description: string | null;
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                slug: string;
                image: string | null;
                isAvailable: boolean;
                price: Decimal;
                categoryId: string;
                isVeg: boolean;
                prepTime: number | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            cartId: string;
            menuItemId: string;
            quantity: number;
            notes: string | null;
        })[] | undefined;
        userId?: string | undefined;
        id?: string | undefined;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
    }>;
    removeItem(userId: string, cartItemId: string): Promise<{
        subtotal: number;
        items?: ({
            menuItem: {
                category: {
                    description: string | null;
                    id: string;
                    createdAt: Date;
                    name: string;
                    updatedAt: Date;
                    slug: string;
                    image: string | null;
                    sortOrder: number;
                    isActive: boolean;
                };
            } & {
                description: string | null;
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                slug: string;
                image: string | null;
                isAvailable: boolean;
                price: Decimal;
                categoryId: string;
                isVeg: boolean;
                prepTime: number | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            cartId: string;
            menuItemId: string;
            quantity: number;
            notes: string | null;
        })[] | undefined;
        userId?: string | undefined;
        id?: string | undefined;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
    }>;
    applyCoupon(userId: string, code: string): Promise<{
        coupon: {
            description: string | null;
            id: string;
            code: string;
            expiresAt: Date;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            discountType: string;
            discountValue: Decimal;
            minOrderValue: Decimal | null;
            maxDiscount: Decimal | null;
            usageLimit: number | null;
            usedCount: number;
            startsAt: Date;
        };
        subtotal: number;
        items?: ({
            menuItem: {
                category: {
                    description: string | null;
                    id: string;
                    createdAt: Date;
                    name: string;
                    updatedAt: Date;
                    slug: string;
                    image: string | null;
                    sortOrder: number;
                    isActive: boolean;
                };
            } & {
                description: string | null;
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                slug: string;
                image: string | null;
                isAvailable: boolean;
                price: Decimal;
                categoryId: string;
                isVeg: boolean;
                prepTime: number | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            cartId: string;
            menuItemId: string;
            quantity: number;
            notes: string | null;
        })[] | undefined;
        userId?: string | undefined;
        id?: string | undefined;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
    }>;
    clearCart(userId: string): Promise<{
        subtotal: number;
        items?: ({
            menuItem: {
                category: {
                    description: string | null;
                    id: string;
                    createdAt: Date;
                    name: string;
                    updatedAt: Date;
                    slug: string;
                    image: string | null;
                    sortOrder: number;
                    isActive: boolean;
                };
            } & {
                description: string | null;
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                slug: string;
                image: string | null;
                isAvailable: boolean;
                price: Decimal;
                categoryId: string;
                isVeg: boolean;
                prepTime: number | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            cartId: string;
            menuItemId: string;
            quantity: number;
            notes: string | null;
        })[] | undefined;
        userId?: string | undefined;
        id?: string | undefined;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
    }>;
};
//# sourceMappingURL=cart.service.d.ts.map