import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING;
}

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const admin = await prisma.user.upsert({
    where: { phone: '+919321836106' },
    update: {},
    create: {
      phone: '+919321836106',
      name: 'Akshay Gole',
      email: 'blazingbarbecue@gmail.com',
      role: 'ADMIN',
    },
  });

  console.log('Admin created:', admin.name);

  // Create categories
  const categories = [
    { name: 'Appetizers', slug: 'appetizers', description: 'Start your meal right', sortOrder: 1 },
    { name: 'Wraps', slug: 'wraps', description: 'Delicious wrapped delights', sortOrder: 2 },
    { name: 'Wings', slug: 'wings', description: 'Crispy chicken wings', sortOrder: 3 },
    { name: 'Sandwiches', slug: 'sandwiches', description: 'Loaded sandwiches', sortOrder: 4 },
    { name: 'Hot Dogs', slug: 'hot-dogs', description: 'American style hot dogs', sortOrder: 5 },
    { name: 'Full Leg', slug: 'full-leg', description: 'Full chicken leg BBQ', sortOrder: 6 },
    { name: 'Drumsticks', slug: 'drumsticks', description: 'Tender drumsticks', sortOrder: 7 },
    { name: 'Extras', slug: 'extras', description: 'Sides and beverages', sortOrder: 8 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log('Categories created');

  // Get category IDs
  const catMap: Record<string, string> = {};
  const allCats = await prisma.category.findMany();
  for (const cat of allCats) {
    catMap[cat.slug] = cat.id;
  }

  // Create menu items
  const menuItems = [
    // Appetizers
    { name: 'Crispy Corn', slug: 'crispy-corn', description: 'Golden fried corn kernels with special spices', price: 149, categoryId: catMap['appetizers'], isVeg: true },
    { name: 'Paneer Tikka', slug: 'paneer-tikka', description: 'Marinated cottage cheese cubes grilled to perfection', price: 199, categoryId: catMap['appetizers'], isVeg: true },
    { name: 'Spring Rolls', slug: 'spring-rolls', description: 'Crispy rolls stuffed with vegetables', price: 129, categoryId: catMap['appetizers'], isVeg: true },
    { name: 'French Fries', slug: 'french-fries', description: 'Crispy golden french fries with dips', price: 99, categoryId: catMap['appetizers'], isVeg: true },

    // Wraps
    { name: 'Chicken Shawarma Wrap', slug: 'chicken-shawarma-wrap', description: 'Juicy chicken with garlic sauce in pita bread', price: 189, categoryId: catMap['wraps'], isVeg: false },
    { name: 'Paneer Wrap', slug: 'paneer-wrap', description: 'Grilled paneer with fresh veggies', price: 169, categoryId: catMap['wraps'], isVeg: true },
    { name: 'BBQ Chicken Wrap', slug: 'bbq-chicken-wrap', description: 'Smoky BBQ chicken in a soft wrap', price: 199, categoryId: catMap['wraps'], isVeg: false },
    { name: 'Veggie Wrap', slug: 'veggie-wrap', description: 'Fresh seasonal vegetables with chutney', price: 149, categoryId: catMap['wraps'], isVeg: true },

    // Wings
    { name: 'Classic Buffalo Wings', slug: 'classic-buffalo-wings', description: 'Spicy buffalo sauce coated chicken wings', price: 249, categoryId: catMap['wings'], isVeg: false },
    { name: 'BBQ Wings', slug: 'bbq-wings', description: 'Smoky BBQ glazed crispy wings', price: 269, categoryId: catMap['wings'], isVeg: false },
    { name: 'Garlic Parmesan Wings', slug: 'garlic-parmesan-wings', description: 'Rich garlic butter with parmesan coating', price: 279, categoryId: catMap['wings'], isVeg: false },
    { name: 'Jalapeno Wings', slug: 'jalapeno-wings', description: 'Hot jalapeno glazed wings', price: 259, categoryId: catMap['wings'], isVeg: false },

    // Sandwiches
    { name: 'Chicken Zinger', slug: 'chicken-zinger', description: 'Crispy chicken with lettuce and mayo', price: 229, categoryId: catMap['sandwiches'], isVeg: false },
    { name: 'Veg Maharaja', slug: 'veg-maharaja', description: 'Loaded veg patty with special sauce', price: 189, categoryId: catMap['sandwiches'], isVeg: true },
    { name: 'BBQ Pulled Pork', slug: 'bbq-pulled-pork', description: 'Slow cooked pulled pork with BBQ slaw', price: 259, categoryId: catMap['sandwiches'], isVeg: false },
    { name: 'Grilled Paneer', slug: 'grilled-paneer-sandwich', description: 'Schezwan grilled paneer sandwich', price: 199, categoryId: catMap['sandwiches'], isVeg: true },

    // Hot Dogs
    { name: 'Classic American Dog', slug: 'classic-american-dog', description: 'Beef frank with mustard and ketchup', price: 179, categoryId: catMap['hot-dogs'], isVeg: false },
    { name: 'Cheese Dog', slug: 'cheese-dog', description: 'Mozzarella stuffed beef frank', price: 209, categoryId: catMap['hot-dogs'], isVeg: false },
    { name: 'Chili Dog', slug: 'chili-dog', description: 'Beef frank with spicy chili con carne', price: 229, categoryId: catMap['hot-dogs'], isVeg: false },
    { name: 'Veg Frankfurter', slug: 'veg-frankfurter', description: 'Plant-based frank with all toppings', price: 159, categoryId: catMap['hot-dogs'], isVeg: true },

    // Full Leg
    { name: 'Tandoori Full Leg', slug: 'tandoori-full-leg', description: 'Marinated whole chicken leg roasted in tandoor', price: 349, categoryId: catMap['full-leg'], isVeg: false },
    { name: 'BBQ Full Leg', slug: 'bbq-full-leg', description: 'Slow grilled with our secret BBQ rub', price: 379, categoryId: catMap['full-leg'], isVeg: false },
    { name: 'Lemon Herb Leg', slug: 'lemon-herb-leg', description: 'Citrus and herb marinated grilled leg', price: 369, categoryId: catMap['full-leg'], isVeg: false },
    { name: 'Spicy Tikka Leg', slug: 'spicy-tikka-leg', description: 'Extra hot tikka masala coated leg', price: 389, categoryId: catMap['full-leg'], isVeg: false },

    // Drumsticks
    { name: 'Fried Drumsticks', slug: 'fried-drumsticks', description: 'Crispy fried chicken drumsticks (3 pcs)', price: 229, categoryId: catMap['drumsticks'], isVeg: false },
    { name: 'Grilled Drumsticks', slug: 'grilled-drumsticks', description: 'Smoky grilled drumsticks (3 pcs)', price: 249, categoryId: catMap['drumsticks'], isVeg: false },
    { name: 'Honey Garlic Drumsticks', slug: 'honey-garlic-drumsticks', description: 'Sweet honey garlic glazed (3 pcs)', price: 269, categoryId: catMap['drumsticks'], isVeg: false },
    { name: 'Buffalo Drumsticks', slug: 'buffalo-drumsticks', description: 'Hot buffalo sauce coated (3 pcs)', price: 259, categoryId: catMap['drumsticks'], isVeg: false },

    // Extras
    { name: 'Coleslaw', slug: 'coleslaw', description: 'Creamy cabbage slaw', price: 79, categoryId: catMap['extras'], isVeg: true },
    { name: 'Mac & Cheese', slug: 'mac-cheese', description: 'Creamy macaroni and cheese', price: 129, categoryId: catMap['extras'], isVeg: true },
    { name: 'Onion Rings', slug: 'onion-rings', description: 'Beer battered crispy onion rings', price: 119, categoryId: catMap['extras'], isVeg: true },
    { name: 'Garlic Bread', slug: 'garlic-bread', description: 'Cheesy garlic toasted bread', price: 99, categoryId: catMap['extras'], isVeg: true },
    { name: 'Soft Drink', slug: 'soft-drink', description: 'Coca-Cola, Sprite or Fanta', price: 49, categoryId: catMap['extras'], isVeg: true },
    { name: 'Mojito', slug: 'mojito', description: 'Fresh mint lime mojito', price: 99, categoryId: catMap['extras'], isVeg: true },
    { name: 'Water Bottle', slug: 'water-bottle', description: '500ml packaged water', price: 29, categoryId: catMap['extras'], isVeg: true },
    { name: 'Ice Cream', slug: 'ice-cream', description: 'Vanilla or chocolate scoop', price: 59, categoryId: catMap['extras'], isVeg: true },
  ];

  for (const item of menuItems) {
    await prisma.menuItem.upsert({
      where: { slug: item.slug },
      update: {},
      create: item,
    });
  }

  console.log('Menu items created:', menuItems.length);

  // Create welcome coupon
  await prisma.coupon.upsert({
    where: { code: 'WELCOME20' },
    update: {},
    create: {
      code: 'WELCOME20',
      description: '20% off on your first order',
      discountType: 'PERCENTAGE',
      discountValue: 20,
      minOrderValue: 299,
      maxDiscount: 100,
      usageLimit: 1,
      startsAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.coupon.upsert({
    where: { code: 'BBQ100' },
    update: {},
    create: {
      code: 'BBQ100',
      description: 'Flat Rs 100 off',
      discountType: 'FIXED',
      discountValue: 100,
      minOrderValue: 499,
      startsAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  });

  console.log('Coupons created');
  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
