import prisma from '../config/database';

export const menuService = {
  async getMenu() {
    const categories = await prisma.category.findMany({
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
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    return categories;
  },

  async getItem(slug: string) {
    const item = await prisma.menuItem.findUnique({
      where: { slug },
      include: { category: true },
    });

    return item;
  },
};
