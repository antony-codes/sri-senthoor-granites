import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Product } from '../models/Product';
import { AuthRequest } from '../middlewares/auth';
import { logAuditEvent } from '../utils/auditLogger';

const buildIdQuery = (id: string) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return { $or: [{ _id: id }, { id }] };
  }
  return { id };
};

let memoryProducts: any[] = [
  // --- VITRIFIED TILES & CERAMIC TILES ---
  {
    id: 'p-floor-statuario',
    slug: 'statuario-imperial-floor-tile',
    title: 'Statuario Imperial Floor Tile',
    subtitle: '800x1600mm Full-Body Glazed Tile',
    category: 'vitrified-tiles',
    subCategory: 'Floor Tiles',
    description: 'Classic Statuario Italian marble veining on ultra-dense glazed porcelain, engineered for high-traffic living room and hall flooring.',
    price: 180,
    offerPrice: 160,
    unit: 'sq.ft',
    finish: 'High Gloss Glazed',
    thickness: '9mm',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    features: ['High Gloss Mirror Shine', 'Stain & Abrasion Resistant', 'Rectified Seamless Joints'],
    specs: { sizes: '800x1600mm', waterAbsorption: '<0.05%', finish: 'High Gloss' },
    stockStatus: 'in_stock',
    isFeatured: true,
    isPopular: true,
    displayOrder: 1,
    status: 'active',
  },
  {
    id: 'p-bathroom-anti-skid',
    slug: 'anti-skid-bathroom-matte-tile',
    title: 'Royal Slate Anti-Skid Toilet & Bathroom Tile',
    subtitle: '300x600mm Slip Resistant Matte Finish',
    category: 'vitrified-tiles',
    subCategory: 'Bathroom Tiles',
    description: 'Anti-slip textured matte ceramic tile designed for wet bathroom floors and shower enclosures, offering safety & luxury.',
    price: 95,
    offerPrice: 85,
    unit: 'sq.ft',
    finish: 'R11 Anti-Skid Matte',
    thickness: '8mm',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    features: ['R11 Anti-Slip Rating', 'Soap & Acid Resistant', 'Easy Clean Hydro-Shield'],
    specs: { sizes: '300x600mm', use: 'Bathroom Floor & Wall', finish: 'Matte Anti-Skid' },
    stockStatus: 'in_stock',
    isFeatured: true,
    isPopular: true,
    displayOrder: 2,
    status: 'active',
  },
  {
    id: 'p-wall-spanish-metro',
    slug: 'spanish-marquina-wall-cladding-tile',
    title: 'Spanish Marquina Wall Cladding Tile',
    subtitle: '400x800mm High Gloss Wall Tile',
    category: 'vitrified-tiles',
    subCategory: 'Wall Tiles',
    description: 'Deep black marble design with intense white lightning veins, crafted for kitchen backsplashes and bathroom feature walls.',
    price: 110,
    offerPrice: 98,
    unit: 'sq.ft',
    finish: 'High Gloss Polish',
    thickness: '8.5mm',
    image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    features: ['Stain Repellent Glaze', 'Vibrant Contrast Veining', 'Precision Wall Edge'],
    specs: { sizes: '400x800mm', use: 'Interior Wall Cladding', finish: 'Gloss' },
    stockStatus: 'in_stock',
    isFeatured: false,
    isPopular: true,
    displayOrder: 3,
    status: 'active',
  },
  {
    id: 'p-kitchen-tile-marmi',
    slug: 'carrara-kitchen-backsplash-tile',
    title: 'Carrara Statuario Kitchen Backsplash Tile',
    subtitle: '300x900mm Stain-Proof Kitchen Tile',
    category: 'vitrified-tiles',
    subCategory: 'Kitchen Tiles',
    description: 'Ultra-smooth glazed ceramic kitchen backsplash tile designed for heat and oil-splatter resistance.',
    price: 105,
    offerPrice: 92,
    unit: 'sq.ft',
    finish: 'Smooth Satin Glaze',
    thickness: '8mm',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    features: ['Oil & Heat Repellent', 'High Gloss Polish', 'Easy Wipe Surface'],
    specs: { sizes: '300x900mm', use: 'Kitchen Backsplash', finish: 'Satin Glaze' },
    stockStatus: 'in_stock',
    isFeatured: true,
    isPopular: true,
    displayOrder: 4,
    status: 'active',
  },
  {
    id: 'p-calacatta-porcelain',
    slug: 'calacatta-onyx-vitrified-slab',
    title: 'Calacatta Onyx Vitrified Slab',
    subtitle: '1200x2400mm Architectural Porcelain',
    category: 'vitrified-tiles',
    subCategory: 'Large Slabs',
    description: 'Italian Statuario veining engineered into full-body vitrified porcelain slabs for seamless large hall installations.',
    price: 240,
    offerPrice: 215,
    unit: 'sq.ft',
    finish: 'Silk Satin Finish',
    thickness: '12mm',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    features: ['Stain & Chemical Resistant', 'Seamless Rectified Edges'],
    specs: { sizes: '1200x2400mm', waterAbsorption: '<0.05%', finish: 'Silk Satin' },
    stockStatus: 'in_stock',
    isFeatured: true,
    isPopular: true,
    displayOrder: 5,
    status: 'active',
  },
  {
    id: 'p-outdoor-paver',
    slug: 'heavy-duty-outdoor-parking-tile',
    title: 'Heavy Duty Textured Outdoor Parking Tile',
    subtitle: '400x400mm 16mm Heavy Vehicle Paver',
    category: 'vitrified-tiles',
    subCategory: 'Outdoor Tiles',
    description: 'High breaking strength vitrified paver tiles designed for driveways, parking zones, and open courtyard terraces.',
    price: 75,
    offerPrice: 65,
    unit: 'sq.ft',
    finish: 'Punch Textured Anti-Slip',
    thickness: '16mm',
    image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    features: ['High Breaking Load', 'Weather & Frost Proof', 'Scratch Resistant'],
    specs: { sizes: '400x400mm', thickness: '16mm', finish: 'Textured Matte' },
    stockStatus: 'in_stock',
    isFeatured: false,
    isPopular: false,
    displayOrder: 6,
    status: 'active',
  },

  // --- GRANITES ---
  {
    id: 'p-black-galaxy',
    slug: 'black-galaxy-granite',
    title: 'Black Galaxy Granite',
    subtitle: 'Quarry Grade Mirror Polish',
    category: 'granites',
    subCategory: 'Black Granites',
    description: 'High-density natural black granite with golden copper specks. Zero water absorption, heat & scratch resistant.',
    price: 185,
    offerPrice: 165,
    unit: 'sq.ft',
    finish: 'High Gloss Polish',
    thickness: '18mm',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    features: ['Heat & Scratch Resistant', 'Zero Water Absorption', 'Custom Edge Profiles'],
    specs: { thickness: '18mm', origin: 'Direct Quarry Select', finish: 'High Gloss Polish' },
    stockStatus: 'in_stock',
    isFeatured: true,
    isPopular: true,
    displayOrder: 7,
    status: 'active',
  },
  {
    id: 'p-tan-brown',
    slug: 'tan-brown-granite',
    title: 'Tan Brown Granite Slabs',
    subtitle: 'Deep Chocolate & Tan Mineral Grains',
    category: 'granites',
    subCategory: 'Countertop Slabs',
    description: 'Rich dark brown granite with black and reddish mineral crystals, ideal for kitchen countertops and heavy use counters.',
    price: 140,
    offerPrice: 125,
    unit: 'sq.ft',
    finish: 'Mirror Polish',
    thickness: '18mm',
    image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    features: ['High Density Quartz Base', 'Stain Resistant', 'High Traffic Strength'],
    specs: { thickness: '18mm', origin: 'Telangana Quarry', finish: 'Mirror Polish' },
    stockStatus: 'in_stock',
    isFeatured: true,
    isPopular: true,
    displayOrder: 8,
    status: 'active',
  },
  {
    id: 'p-kashmir-white',
    slug: 'kashmir-white-granite',
    title: 'Kashmir White Granite',
    subtitle: 'Exotic White Granite with Garnet Dots',
    category: 'granites',
    subCategory: 'Exotic Granites',
    description: 'Luminous light gray and white granite studded with rich burgundy garnet crystals for luxury wall & floor cladding.',
    price: 195,
    offerPrice: 175,
    unit: 'sq.ft',
    finish: 'High Gloss Polish',
    thickness: '20mm',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    features: ['Low Porosity', 'Exotic Garnet Veining', 'Precision Edge Cut'],
    specs: { thickness: '20mm', origin: 'South India Quarry', finish: 'High Gloss' },
    stockStatus: 'in_stock',
    isFeatured: false,
    isPopular: true,
    displayOrder: 9,
    status: 'active',
  },

  // --- KADAPPA ---
  {
    id: 'p-kadappa-black',
    slug: 'authentic-kadappa-natural-stone',
    title: 'Authentic Cuddapah Kadappa Stone',
    subtitle: 'Traditional Natural Black Limestone',
    category: 'kadappa',
    subCategory: 'Black Kadappa',
    description: 'Non-slip natural matte black limestone ideal for outdoor steps, courtyards, and wall cladding.',
    price: 65,
    offerPrice: 55,
    unit: 'sq.ft',
    finish: 'Machine Cut Matte',
    thickness: '25mm',
    image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    features: ['Natural Non-Slip Texture', 'All-Weather Resilience'],
    specs: { thickness: '25mm - 30mm', finish: 'Machine Cut Matte', use: 'Indoor & Outdoor' },
    stockStatus: 'in_stock',
    isFeatured: false,
    isPopular: true,
    displayOrder: 10,
    status: 'active',
  },
  {
    id: 'p-kadappa-steps',
    slug: 'kadappa-machine-cut-steps',
    title: 'Kadappa Machine-Cut Stair Treads & Steps',
    subtitle: 'Calibrated Chamfered Edge Black Stone',
    category: 'kadappa',
    subCategory: 'Machine Cut Steps',
    description: 'Precision machine cut Cuddapah stone with bullnosed front edge, prepared specifically for durable staircase steps.',
    price: 90,
    offerPrice: 80,
    unit: 'sq.ft',
    finish: 'Smooth Machine Cut',
    thickness: '30mm',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    features: ['Pre-Formed Bullnose Edge', 'High Impact Strength', 'Zero Flaking'],
    specs: { thickness: '30mm', finish: 'Calibrated Cut', origin: 'Cuddapah AP' },
    stockStatus: 'in_stock',
    isFeatured: true,
    isPopular: true,
    displayOrder: 11,
    status: 'active',
  },

  // --- SANITARY WARES ---
  {
    id: 'p-sanitary-basin',
    slug: 'freestanding-stone-ceramic-basin',
    title: 'Freestanding Stone Ceramic Basin',
    subtitle: 'Nano-Glaze Ceramic Suite',
    category: 'sanitary-wares',
    subCategory: 'Wash Basins',
    description: 'Ultra-hygienic glazed ceramic basin engineered with antibacterial coating.',
    price: 14500,
    offerPrice: 12800,
    unit: 'piece',
    finish: 'Glazed Ceramic',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    features: ['Nano-Glaze Surface', 'Soft-Close Ergonomics'],
    specs: { material: 'Vitreous China', warranty: '10-Year Guarantee', finish: 'Glazed Ceramic' },
    stockStatus: 'in_stock',
    isFeatured: true,
    isPopular: false,
    displayOrder: 12,
    status: 'active',
  },
  {
    id: 'p-sanitary-toilet',
    slug: 'wall-hung-rimless-toilet-suite',
    title: 'Wall-Hung Rimless Toilet Suite',
    subtitle: 'Tornado Flush Hygienic Water Closet',
    category: 'sanitary-wares',
    subCategory: 'Water Closets',
    description: 'Space-saving wall-hung toilet with rimless 360-degree tornado flushing system and quiet soft-close seat.',
    price: 18900,
    offerPrice: 16500,
    unit: 'piece',
    finish: 'Antibacterial Ceramic',
    image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80',
    features: ['Rimless Hygiene Design', 'Dual Flush Water Saver', 'UF Heavy Duty Seat'],
    specs: { material: 'Vitreous Ceramic', warranty: '10-Year Guarantee', finish: 'Antibacterial Glaze' },
    stockStatus: 'in_stock',
    isFeatured: true,
    isPopular: true,
    displayOrder: 13,
    status: 'active',
  },

  // --- BATH FITTINGS ---
  {
    id: 'p-bath-gold-faucet',
    slug: 'pvd-gold-thermostatic-cascade-shower',
    title: 'PVD Gold Thermostatic Shower System',
    subtitle: 'Solid Lead-Free Brass Hydrotherapy',
    category: 'bath-fittings',
    subCategory: 'Thermostatic Showers',
    description: 'Luxury thermostatic brassware waterfall showerhead in anti-tarnish PVD gold.',
    price: 28500,
    offerPrice: 24900,
    unit: 'set',
    finish: 'PVD Brushed Gold',
    image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80',
    features: ['PVD Anti-Tarnish Coating', 'Precision Temperature Control'],
    specs: { material: 'Solid Brass', finish: 'PVD Rose Gold', warranty: '12-Year Warranty' },
    stockStatus: 'in_stock',
    isFeatured: true,
    isPopular: true,
    displayOrder: 14,
    status: 'active',
  },
  {
    id: 'p-bath-black-mixer',
    slug: 'matte-black-waterfall-basin-mixer',
    title: 'Matte Black Waterfall Basin Mixer',
    subtitle: 'Single Lever Solid Brass Tapware',
    category: 'bath-fittings',
    subCategory: 'Faucets',
    description: 'Modern tall waterfall tapware with ceramic disc cartridge and electroplated matte black finish.',
    price: 7800,
    offerPrice: 6500,
    unit: 'piece',
    finish: 'Matte Black PVD',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    features: ['Water-Saving Aerator', 'Solid Brass Body', 'Drip-Free Ceramic Disc'],
    specs: { material: 'Lead-Free Brass', finish: 'Matte Black', warranty: '10-Year Warranty' },
    stockStatus: 'in_stock',
    isFeatured: true,
    isPopular: false,
    displayOrder: 15,
    status: 'active',
  },
];

export const getSubCategories = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    let filter: any = { status: 'active' };
    if (category && category !== 'all') {
      filter.category = category;
    }

    try {
      const subs = await Product.distinct('subCategory', filter);
      const cleanSubs = subs.filter((s: any) => s && typeof s === 'string' && s.trim() !== '');
      return res.json({ success: true, data: cleanSubs });
    } catch {
      // Memory fallback
    }

    let memoryList = memoryProducts.filter(p => p.status === 'active');
    if (category && category !== 'all') {
      memoryList = memoryList.filter(p => p.category === category);
    }
    const uniqueSubs = Array.from(new Set(memoryList.map(p => p.subCategory).filter(Boolean)));
    return res.json({ success: true, data: uniqueSubs });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, subCategory, search, featured } = req.query;
    let query: any = {};

    if (category && category !== 'all') {
      query.category = category;
    }
    if (subCategory && subCategory !== 'all') {
      query.subCategory = subCategory;
    }
    if (featured === 'true') {
      query.isFeatured = true;
    }

    try {
      let products = await Product.find(query).sort({ displayOrder: 1, createdAt: -1 });
      if (search) {
        const s = (search as string).toLowerCase();
        products = products.filter(p => p.title.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
      }
      return res.json({ success: true, count: products.length, data: products });
    } catch {
      // Memory fallback
    }

    let filtered = [...memoryProducts];
    if (category && category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }
    if (subCategory && subCategory !== 'all') {
      filtered = filtered.filter(p => p.subCategory === subCategory);
    }
    if (search) {
      const s = (search as string).toLowerCase();
      filtered = filtered.filter(p => p.title.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
    }
    return res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    try {
      const prod = await Product.findOne({ slug });
      if (prod) return res.json({ success: true, data: prod });
    } catch {
      // Memory fallback
    }

    const prod = memoryProducts.find(p => p.slug === slug || p.id === slug);
    if (prod) return res.json({ success: true, data: prod });

    return res.status(404).json({ success: false, message: 'Product not found' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const prodData = req.body;
    const slug = prodData.slug || prodData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const id = prodData.id || `p-${Date.now()}`;

    const newProduct = {
      id,
      slug,
      ...prodData,
      status: prodData.status || 'active',
      displayOrder: prodData.displayOrder || memoryProducts.length + 1,
    };

    let created: any;
    try {
      created = await Product.create(newProduct);
    } catch {
      memoryProducts.unshift(newProduct);
      created = newProduct;
    }

    // Audit Log Entry
    const actorName = req.user?.name || 'Arshath (Founder)';
    const priceVal = created.offerPrice || created.price;
    const priceStr = priceVal ? ` (Price: ₹${priceVal})` : '';

    await logAuditEvent({
      reqUser: req.user,
      action: `${actorName} added product "${created.title}"${priceStr}`,
      entityType: 'product',
      entityId: created._id?.toString() || created.id,
      details: { title: created.title, price: created.price, offerPrice: created.offerPrice, category: created.category },
    });

    return res.status(201).json({ success: true, data: created });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateBody = req.body;
    const query = buildIdQuery(id);

    let prevProduct: any = null;
    let updatedProduct: any = null;

    try {
      prevProduct = await Product.findOne(query);
      if (prevProduct) {
        updatedProduct = await Product.findOneAndUpdate(query, updateBody, { new: true });
      }
    } catch {
      // Memory fallback
    }

    if (!updatedProduct) {
      const idx = memoryProducts.findIndex(p => p.id === id || p._id === id);
      if (idx !== -1) {
        prevProduct = { ...memoryProducts[idx] };
        memoryProducts[idx] = { ...memoryProducts[idx], ...updateBody };
        updatedProduct = memoryProducts[idx];
      }
    }

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const actorName = req.user?.name || 'Arshath (Founder)';
    const title = updatedProduct.title || 'Product';

    // Price change tracking
    const oldPrice = prevProduct ? (prevProduct.offerPrice || prevProduct.price) : null;
    const newPrice = updatedProduct ? (updatedProduct.offerPrice || updatedProduct.price) : null;

    let actionText = `${actorName} updated product "${title}"`;
    if (oldPrice !== null && newPrice !== null && oldPrice !== newPrice) {
      actionText = `${actorName} changed ${title} price from ₹${oldPrice} to ₹${newPrice}`;
    } else if (prevProduct && prevProduct.status !== updatedProduct.status) {
      actionText = `${actorName} changed ${title} status from ${prevProduct.status.toUpperCase()} to ${updatedProduct.status.toUpperCase()}`;
    }

    await logAuditEvent({
      reqUser: req.user,
      action: actionText,
      entityType: 'product',
      entityId: updatedProduct._id?.toString() || updatedProduct.id,
      details: {
        title,
        previousPrice: oldPrice,
        newPrice: newPrice,
        previousStatus: prevProduct?.status,
        newStatus: updatedProduct?.status,
      },
    });

    return res.json({ success: true, data: updatedProduct });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const query = buildIdQuery(id);
    let targetTitle = id;

    try {
      const prod = await Product.findOne(query);
      if (prod) {
        targetTitle = prod.title;
        await prod.deleteOne();
      }
    } catch {
      // Memory fallback
    }

    const memProd = memoryProducts.find(p => p.id === id || p._id === id);
    if (memProd) {
      targetTitle = memProd.title;
      memoryProducts = memoryProducts.filter(p => p.id !== id && p._id !== id);
    }

    const actorName = req.user?.name || 'Arshath (Founder)';
    await logAuditEvent({
      reqUser: req.user,
      action: `${actorName} deleted product "${targetTitle}"`,
      entityType: 'product',
      entityId: id,
      details: { title: targetTitle },
    });

    return res.json({ success: true, message: 'Product deleted' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
