import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Category } from '../models/Category';

const buildIdQuery = (id: string) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return { $or: [{ _id: id }, { id }] };
  }
  return { id };
};

let memoryCategories = [
  {
    id: 'granites',
    title: 'Granites',
    subtitle: 'Premium Quarry Slabs & Custom Cuts',
    description: 'High-density natural granite slabs selected for superior durability, vein elegance, and high-gloss polish.',
    icon: 'Layers',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    displayOrder: 1,
    isActive: true,
  },
  {
    id: 'vitrified-tiles',
    title: 'Vitrified Tiles',
    subtitle: 'Ultra-Large Format Architectural Porcelain',
    description: 'Precision-engineered vitrified tiles offering floor, wall, toilet/bathroom, and outdoor paver options.',
    icon: 'Grid',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    displayOrder: 2,
    isActive: true,
  },
  {
    id: 'kadappa',
    title: 'Kadappa',
    subtitle: 'Traditional Natural Black Stone Elegance',
    description: 'Authentic Cuddapah black limestone offering slip-resistant matte textures, stair steps, and pavers.',
    icon: 'Square',
    image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    displayOrder: 3,
    isActive: true,
  },
  {
    id: 'sanitary-wares',
    title: 'Sanitary Wares',
    subtitle: 'Designer Ceramic Basins & Water Closets',
    description: 'Ultra-hygienic glazed ceramic basins, wall-hung toilets, and wash suite sanitary installations.',
    icon: 'Bath',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    displayOrder: 4,
    isActive: true,
  },
  {
    id: 'bath-fittings',
    title: 'Bath Fittings',
    subtitle: 'Precision Brass Faucets & Hydrotherapies',
    description: 'Luxury thermostatic brassware, waterfall showerheads, and PVD gold & matte black tapware.',
    icon: 'Droplets',
    image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80',
    displayOrder: 5,
    isActive: true,
  },
];

export const getCategories = async (req: Request, res: Response) => {
  try {
    const { includeDisabled } = req.query;
    const isIncludeDisabled = includeDisabled === 'true';
    let queryFilter: any = {};
    if (!isIncludeDisabled) {
      queryFilter.isActive = { $ne: false };
    }

    try {
      const dbCategories = await Category.find(queryFilter).sort({ displayOrder: 1 });
      const count = await Category.countDocuments();
      if (count > 0) {
        return res.json({ success: true, data: dbCategories });
      }
    } catch {
      // Fallthrough to memory fallback
    }

    let memoryList = isIncludeDisabled ? memoryCategories : memoryCategories.filter(c => c.isActive !== false);
    return res.json({ success: true, data: memoryList });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { id, title, subtitle, description, icon, image, displayOrder, isActive } = req.body;
    const catId = id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    try {
      const newCat = await Category.create({
        id: catId,
        title,
        subtitle,
        description,
        icon,
        image,
        displayOrder: displayOrder || 0,
        isActive: isActive !== false,
      });
      memoryCategories.push((newCat.toObject ? newCat.toObject() : newCat) as any);
      return res.status(201).json({ success: true, data: newCat });
    } catch {
      const newCat = {
        id: catId,
        title,
        subtitle,
        description,
        icon,
        image,
        displayOrder: displayOrder || 0,
        isActive: isActive !== false,
      };
      memoryCategories.push(newCat);
      return res.status(201).json({ success: true, data: newCat });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Memory fallback update
    const memoryIdx = memoryCategories.findIndex(c => c.id === id || (c as any)._id === id);
    if (memoryIdx !== -1) {
      memoryCategories[memoryIdx] = { ...memoryCategories[memoryIdx], ...req.body };
    }

    try {
      const updated = await Category.findOneAndUpdate(
        buildIdQuery(id),
        { $set: req.body },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      if (updated) return res.json({ success: true, data: updated });
    } catch {
      // Fallback
    }

    if (memoryIdx !== -1) {
      return res.json({ success: true, data: memoryCategories[memoryIdx] });
    }

    return res.status(404).json({ success: false, message: 'Category not found' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    try {
      await Category.findOneAndDelete(buildIdQuery(id));
    } catch {
      // Fallback
    }
    memoryCategories = memoryCategories.filter(c => c.id !== id && (c as any)._id !== id);
    return res.json({ success: true, message: 'Category removed' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
