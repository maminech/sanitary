/**
 * MongoDB Seed Script
 * Run with: npm run seed
 */

import bcrypt from 'bcryptjs';
import { config } from 'dotenv';
import { User, UserRole, Product, ProductType, MaterialType } from './models';
import { connectDatabase, disconnectDatabase } from './config/database';

config();

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // Connect to MongoDB
    await connectDatabase();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});

    // Hash password for test users
    const hashedPassword = await bcrypt.hash('Password123!', 10);

    // Create users
    console.log('👥 Creating users...');
    const users = await User.insertMany([
      {
        email: 'architect@example.com',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Architect',
        role: UserRole.ARCHITECT,
        company: 'Design Studio Inc.',
        phone: '+1234567890',
      },
      {
        email: 'supplier1@example.com',
        password: hashedPassword,
        firstName: 'Michael',
        lastName: 'Supplier',
        role: UserRole.SUPPLIER,
        company: 'Sanitary Supplies Co.',
        phone: '+1234567891',
      },
      {
        email: 'supplier2@example.com',
        password: hashedPassword,
        firstName: 'Sarah',
        lastName: 'Anderson',
        role: UserRole.SUPPLIER,
        company: 'Premium Bathrooms Ltd.',
        phone: '+1234567892',
      },
      {
        email: 'client@example.com',
        password: hashedPassword,
        firstName: 'Robert',
        lastName: 'Johnson',
        role: UserRole.CLIENT,
        company: 'Construction Corp.',
        phone: '+1234567893',
      },
    ]);

    console.log(`✅ Created ${users.length} users`);

    // Get supplier IDs
    const supplier1 = users[1];
    const supplier2 = users[2];

    // Create products
    console.log('🚽 Creating products...');
    const products = await Product.insertMany([
      // Toilets
      {
        name: 'Modern Wall-Mounted Toilet',
        sku: 'TOILET-001',
        type: ProductType.TOILET,
        description: 'Contemporary wall-mounted toilet with soft-close seat',
        brand: 'AquaLux',
        basePrice: 450.00,
        supplierId: supplier1._id,
        dimensions: { length: 54, width: 36, height: 40, unit: 'cm' },
        materials: [
          { type: MaterialType.CERAMIC, finish: 'Glossy White', color: 'White', priceModifier: 0 },
          { type: MaterialType.CERAMIC, finish: 'Matte Black', color: 'Black', priceModifier: 50 },
        ],
        assets3d: [
          { format: 'GLTF', fileUrl: '/assets/toilet-001.gltf', fileSize: 2048000, lodLevel: 0 },
        ],
        leadTime: 14,
        inStock: true,
        tags: ['modern', 'wall-mounted', 'water-saving'],
      },
      {
        name: 'Classic Floor-Standing Toilet',
        sku: 'TOILET-002',
        type: ProductType.TOILET,
        description: 'Traditional two-piece toilet with dual-flush system',
        brand: 'Heritage',
        basePrice: 320.00,
        supplierId: supplier2._id,
        dimensions: { length: 66, width: 38, height: 78, unit: 'cm' },
        materials: [
          { type: MaterialType.PORCELAIN, finish: 'Glossy White', color: 'White', priceModifier: 0 },
        ],
        assets3d: [
          { format: 'GLTF', fileUrl: '/assets/toilet-002.gltf', fileSize: 1536000, lodLevel: 0 },
        ],
        leadTime: 7,
        inStock: true,
        tags: ['classic', 'dual-flush', 'eco-friendly'],
      },

      // Sinks
      {
        name: 'Undermount Basin',
        sku: 'SINK-001',
        type: ProductType.SINK,
        description: 'Elegant undermount sink for countertop installation',
        brand: 'AquaLux',
        basePrice: 280.00,
        supplierId: supplier1._id,
        dimensions: { length: 56, width: 42, height: 18, unit: 'cm' },
        materials: [
          { type: MaterialType.CERAMIC, finish: 'Glossy White', color: 'White', priceModifier: 0 },
          { type: MaterialType.CERAMIC, finish: 'Glossy Beige', color: 'Beige', priceModifier: 20 },
        ],
        assets3d: [
          { format: 'GLTF', fileUrl: '/assets/sink-001.gltf', fileSize: 1024000, lodLevel: 0 },
        ],
        leadTime: 10,
        inStock: true,
        tags: ['undermount', 'modern', 'ceramic'],
      },
      {
        name: 'Pedestal Sink',
        sku: 'SINK-002',
        type: ProductType.SINK,
        description: 'Classic pedestal sink with chrome overflow',
        brand: 'Heritage',
        basePrice: 195.00,
        supplierId: supplier2._id,
        dimensions: { length: 50, width: 40, height: 85, unit: 'cm' },
        materials: [
          { type: MaterialType.PORCELAIN, finish: 'Glossy White', color: 'White', priceModifier: 0 },
        ],
        assets3d: [
          { format: 'GLTF', fileUrl: '/assets/sink-002.gltf', fileSize: 896000, lodLevel: 0 },
        ],
        leadTime: 7,
        inStock: true,
        tags: ['pedestal', 'classic', 'space-saving'],
      },

      // Bathtubs
      {
        name: 'Freestanding Bathtub',
        sku: 'BATHTUB-001',
        type: ProductType.BATHTUB,
        description: 'Luxury freestanding bathtub with chrome drain',
        brand: 'AquaLux',
        basePrice: 1850.00,
        supplierId: supplier1._id,
        dimensions: { length: 170, width: 75, height: 58, unit: 'cm' },
        materials: [
          { type: MaterialType.ACRYLIC, finish: 'Glossy White', color: 'White', priceModifier: 0 },
          { type: MaterialType.COMPOSITE, finish: 'Matte Stone', color: 'Grey', priceModifier: 300 },
        ],
        assets3d: [
          { format: 'GLTF', fileUrl: '/assets/bathtub-001.gltf', fileSize: 3072000, lodLevel: 0 },
        ],
        leadTime: 21,
        inStock: true,
        tags: ['freestanding', 'luxury', 'modern'],
      },

      // Showers
      {
        name: 'Walk-In Shower Enclosure',
        sku: 'SHOWER-001',
        type: ProductType.SHOWER,
        description: 'Frameless glass walk-in shower with chrome fixtures',
        brand: 'GlassWorks',
        basePrice: 980.00,
        supplierId: supplier1._id,
        dimensions: { length: 120, width: 90, height: 200, unit: 'cm' },
        materials: [
          { type: MaterialType.GLASS, finish: 'Clear 8mm', color: 'Clear', priceModifier: 0 },
          { type: MaterialType.GLASS, finish: 'Frosted 8mm', color: 'Frosted', priceModifier: 80 },
        ],
        assets3d: [
          { format: 'GLTF', fileUrl: '/assets/shower-001.gltf', fileSize: 2560000, lodLevel: 0 },
        ],
        leadTime: 14,
        inStock: true,
        tags: ['walk-in', 'frameless', 'modern'],
      },

      // Faucets
      {
        name: 'Single-Handle Faucet',
        sku: 'FAUCET-001',
        type: ProductType.FAUCET,
        description: 'Modern single-handle basin faucet with ceramic cartridge',
        brand: 'TapMaster',
        basePrice: 125.00,
        supplierId: supplier2._id,
        dimensions: { length: 15, width: 5, height: 28, unit: 'cm' },
        materials: [
          { type: MaterialType.CHROME, finish: 'Polished Chrome', color: 'Silver', priceModifier: 0 },
          { type: MaterialType.BRASS, finish: 'Brushed Brass', color: 'Gold', priceModifier: 35 },
          { type: MaterialType.BRONZE, finish: 'Oil-Rubbed Bronze', color: 'Bronze', priceModifier: 40 },
        ],
        assets3d: [
          { format: 'GLTF', fileUrl: '/assets/faucet-001.gltf', fileSize: 512000, lodLevel: 0 },
        ],
        leadTime: 5,
        inStock: true,
        tags: ['single-handle', 'modern', 'water-efficient'],
      },

      // Mirrors
      {
        name: 'LED Bathroom Mirror',
        sku: 'MIRROR-001',
        type: ProductType.MIRROR,
        description: 'Rectangular LED-lit mirror with demister pad',
        brand: 'Reflections',
        basePrice: 350.00,
        supplierId: supplier1._id,
        dimensions: { length: 80, width: 3, height: 60, unit: 'cm' },
        materials: [
          { type: MaterialType.GLASS, finish: 'Clear with LED', color: 'Clear', priceModifier: 0 },
        ],
        assets3d: [
          { format: 'GLTF', fileUrl: '/assets/mirror-001.gltf', fileSize: 768000, lodLevel: 0 },
        ],
        leadTime: 10,
        inStock: true,
        tags: ['led', 'modern', 'demister'],
      },

      // Cabinets
      {
        name: 'Vanity Cabinet',
        sku: 'CABINET-001',
        type: ProductType.CABINET,
        description: 'Wall-mounted vanity cabinet with soft-close drawers',
        brand: 'StoragePlus',
        basePrice: 680.00,
        supplierId: supplier2._id,
        dimensions: { length: 100, width: 46, height: 50, unit: 'cm' },
        materials: [
          { type: MaterialType.WOOD, finish: 'Oak Veneer', color: 'Natural Oak', priceModifier: 0 },
          { type: MaterialType.WOOD, finish: 'Walnut Veneer', color: 'Dark Walnut', priceModifier: 60 },
        ],
        assets3d: [
          { format: 'GLTF', fileUrl: '/assets/cabinet-001.gltf', fileSize: 2048000, lodLevel: 0 },
        ],
        leadTime: 14,
        inStock: true,
        tags: ['vanity', 'storage', 'soft-close'],
      },
    ]);

    console.log(`✅ Created ${products.length} products`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Test Accounts:');
    console.log('   Architect: architect@example.com / Password123!');
    console.log('   Supplier 1: supplier1@example.com / Password123!');
    console.log('   Supplier 2: supplier2@example.com / Password123!');
    console.log('   Client: client@example.com / Password123!');

    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    await disconnectDatabase();
    process.exit(1);
  }
};

// Export for route usage
export { seedDatabase };

// Only run directly if this is the main module
if (require.main === module) {
  seedDatabase();
}
