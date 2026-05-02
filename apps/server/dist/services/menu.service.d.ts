export declare const menuService: {
    getMenu(): Promise<({
        items: {
            description: string | null;
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            slug: string;
            image: string | null;
            isAvailable: boolean;
            price: import("@prisma/client/runtime/library").Decimal;
            categoryId: string;
            isVeg: boolean;
            prepTime: number | null;
        }[];
    } & {
        description: string | null;
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        slug: string;
        image: string | null;
        sortOrder: number;
        isActive: boolean;
    })[]>;
    getCategories(): Promise<{
        description: string | null;
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        slug: string;
        image: string | null;
        sortOrder: number;
        isActive: boolean;
    }[]>;
    getItem(slug: string): Promise<({
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
        price: import("@prisma/client/runtime/library").Decimal;
        categoryId: string;
        isVeg: boolean;
        prepTime: number | null;
    }) | null>;
};
//# sourceMappingURL=menu.service.d.ts.map