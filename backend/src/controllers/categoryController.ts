import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Category } from '../models/Category';
import { AuthRequest } from '../middlewares/auth';
import { logAuditEvent } from '../utils/auditLogger';

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

export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id, title, subtitle, description, icon, image, displayOrder, isActive } = req.body;
    const catId = id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    let newCat: any;

    try {
      newCat = await Category.create({
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
    } catch {
      newCat = {
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
    }

    const actorName = req.user?.name || 'Arshath (Founder)';
    await logAuditEvent({
      reqUser: req.user,
      action: `${actorName} created category "${title}"`,
      entityType: 'category',
      entityId: catId,
      details: { title, subtitle, isActive: newCat.isActive },
    });

    return res.status(201).json({ success: true, data: newCat });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    let prevActiveState: boolean | undefined;

    const memoryIdx = memoryCategories.findIndex(c => c.id === id || (c as any)._id === id);
    if (memoryIdx !== -1) {
      prevActiveState = memoryCategories[memoryIdx].isActive;
      memoryCategories[memoryIdx] = { ...memoryCategories[memoryIdx], ...req.body };
    }

    let updated: any;
    try {
      const existing = await Category.findOne(buildIdQuery(id));
      if (existing) prevActiveState = existing.isActive;

      updated = await Category.findOneAndUpdate(
        buildIdQuery(id),
        { $set: req.body },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
    } catch {
      // Fallback
    }

    const resultDoc = updated || (memoryIdx !== -1 ? memoryCategories[memoryIdx] : null);
    if (!resultDoc) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const actorName = req.user?.name || 'Arshath (Founder)';
    const title = resultDoc.title || id;

    let actionMsg = `${actorName} updated details for category "${title}"`;
    if (typeof req.body.isActive === 'boolean' && prevActiveState !== req.body.isActive) {
      actionMsg = `${actorName} updated category "${title}" status to ${req.body.isActive ? 'ACTIVE' : 'DISABLED'}`;
    }

    await logAuditEvent({
      reqUser: req.user,
      action: actionMsg,
      entityType: 'category',
      entityId: id,
      details: { title, isActive: resultDoc.isActive, previousActive: prevActiveState },
    });

    return res.json({ success: true, data: resultDoc });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    let targetTitle = id;

    const memCat = memoryCategories.find(c => c.id === id || (c as any)._id === id);
    if (memCat) targetTitle = memCat.title;

    try {
      const cat = await Category.findOne(buildIdQuery(id));
      if (cat) {
        targetTitle = cat.title;
        await cat.deleteOne();
      }
    } catch {
      // Fallback
    }
    memoryCategories = memoryCategories.filter(c => c.id !== id && (c as any)._id !== id);

    const actorName = req.user?.name || 'Arshath (Founder)';
    await logAuditEvent({
      reqUser: req.user,
      action: `${actorName} deleted category "${targetTitle}"`,
      entityType: 'category',
      entityId: id,
      details: { title: targetTitle },
    });

    return res.json({ success: true, message: 'Category removed' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
