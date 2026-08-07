import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Testimonial } from '../models/Testimonial';

const buildIdQuery = (id: string) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return { $or: [{ _id: id }, { id }] };
  }
  return { id };
};

let memoryTestimonials: any[] = [
  {
    id: 't-1',
    name: 'Ar. Rajesh Kumar',
    role: 'Principal Architect, Studio Form',
    content: 'Sri Senthoor Granites supplied our Statuario vitrified slabs and Black Galaxy countertops for a 12,000 sq.ft villa in Thillai Nagar. The mirror polish calibration and zero flaking cut quality exceeded expectations.',
    rating: 5,
    project: 'Thillai Nagar Luxury Villa',
    displayOrder: 1,
    isActive: true,
  },
  {
    id: 't-2',
    name: 'S. Shanmugam',
    role: 'Managing Director, SVR Constructions',
    content: 'We sourced over 8,000 sq.ft of natural Cuddapah Kadappa stone for outdoor courtyard steps. Founder Arshath personally ensured zero-defect delivery right to our site schedule.',
    rating: 5,
    project: 'Cantonment Commercial Plaza',
    displayOrder: 2,
    isActive: true,
  },
  {
    id: 't-3',
    name: 'Dr. Meenakshi Sundaram',
    role: 'Homeowner',
    content: 'The PVD Gold thermostatic bath fittings and ceramic sanitaryware suite completely transformed our master bathroom. High quality products and excellent guidance on care.',
    rating: 5,
    project: 'KK Nagar Private Residence',
    displayOrder: 3,
    isActive: true,
  },
];

export const getTestimonials = async (req: Request, res: Response) => {
  try {
    const includeDisabled = req.query.includeDisabled === 'true';
    const filter = includeDisabled ? {} : { isActive: true };

    try {
      const dbItems = await Testimonial.find(filter).sort({ displayOrder: 1, createdAt: -1 });
      if (dbItems && dbItems.length > 0) {
        return res.json({ success: true, count: dbItems.length, data: dbItems });
      }
    } catch {
      // Memory fallback
    }

    let items = includeDisabled ? memoryTestimonials : memoryTestimonials.filter(t => t.isActive !== false);
    return res.json({ success: true, count: items.length, data: items });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createTestimonial = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const id = data.id || `t-${Date.now()}`;
    const newDoc = {
      id,
      ...data,
      rating: data.rating || 5,
      displayOrder: data.displayOrder || memoryTestimonials.length + 1,
      isActive: data.isActive !== false,
    };

    try {
      const created = await Testimonial.create(newDoc);
      return res.status(201).json({ success: true, data: created });
    } catch {
      memoryTestimonials.unshift(newDoc);
      return res.status(201).json({ success: true, data: newDoc });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTestimonial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const query = buildIdQuery(id);

    try {
      const updated = await Testimonial.findOneAndUpdate(query, req.body, { new: true });
      if (updated) return res.json({ success: true, data: updated });
    } catch {
      // Memory fallback
    }

    const idx = memoryTestimonials.findIndex(t => t.id === id || t._id === id);
    if (idx !== -1) {
      memoryTestimonials[idx] = { ...memoryTestimonials[idx], ...req.body };
      return res.json({ success: true, data: memoryTestimonials[idx] });
    }

    return res.status(404).json({ success: false, message: 'Testimonial not found' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTestimonial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const query = buildIdQuery(id);

    try {
      await Testimonial.findOneAndDelete(query);
    } catch {
      // Memory fallback
    }

    memoryTestimonials = memoryTestimonials.filter(t => t.id !== id && t._id !== id);
    return res.json({ success: true, message: 'Testimonial deleted' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
