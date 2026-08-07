import { Request, Response } from 'express';
import { Inquiry } from '../models/Inquiry';

let memoryInquiries: any[] = [
  {
    _id: 'inq-1',
    name: 'Architect Rajesh Swaminathan',
    phone: '9840123456',
    email: 'rajesh@designstudio.in',
    productCategory: 'Granites',
    message: 'Requesting sample slab pricing for Black Galaxy granite 2000 sq.ft for villa project.',
    status: 'new',
    createdAt: new Date().toISOString(),
  },
];

export const createInquiry = async (req: Request, res: Response) => {
  try {
    const { name, phone, email, productCategory, message } = req.body;

    if (!name || !phone || !productCategory || !message) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    try {
      const inq = await Inquiry.create({ name, phone, email, productCategory, message });
      return res.status(201).json({ success: true, data: inq, message: 'Inquiry submitted successfully' });
    } catch {
      const inq = {
        _id: `inq-${Date.now()}`,
        name,
        phone,
        email,
        productCategory,
        message,
        status: 'new',
        createdAt: new Date().toISOString(),
      };
      memoryInquiries.unshift(inq);
      return res.status(201).json({ success: true, data: inq, message: 'Inquiry submitted successfully' });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getInquiries = async (req: Request, res: Response) => {
  try {
    try {
      const inquiries = await Inquiry.find().sort({ createdAt: -1 });
      if (inquiries.length > 0) return res.json({ success: true, data: inquiries });
    } catch {
      // Memory fallback
    }
    return res.json({ success: true, data: memoryInquiries });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateInquiryStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const updated = await Inquiry.findByIdAndUpdate(id, { status }, { new: true });
      if (updated) return res.json({ success: true, data: updated });
    } catch {
      // Fallback
    }

    const idx = memoryInquiries.findIndex(i => i._id === id);
    if (idx !== -1) {
      memoryInquiries[idx].status = status;
      return res.json({ success: true, data: memoryInquiries[idx] });
    }

    return res.status(404).json({ success: false, message: 'Inquiry not found' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
