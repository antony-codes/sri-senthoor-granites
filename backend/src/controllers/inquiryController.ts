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
    const { search, status, page, limit } = req.query;
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || (page ? 10 : 1000);
    const skip = (pageNum - 1) * limitNum;

    let query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search) {
      const s = (search as string).toLowerCase().trim();
      query.$or = [
        { name: { $regex: s, $options: 'i' } },
        { phone: { $regex: s, $options: 'i' } },
        { email: { $regex: s, $options: 'i' } },
        { productCategory: { $regex: s, $options: 'i' } },
      ];
    }

    try {
      const totalCount = await Inquiry.countDocuments(query);
      const dbInquiries = await Inquiry.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

      if (dbInquiries && dbInquiries.length > 0) {
        return res.json({
          success: true,
          count: dbInquiries.length,
          totalCount,
          page: pageNum,
          totalPages: Math.ceil(totalCount / limitNum) || 1,
          limit: limitNum,
          data: dbInquiries,
        });
      }
    } catch {
      // Memory fallback
    }

    let filtered = [...memoryInquiries];
    if (status && status !== 'all') {
      filtered = filtered.filter((i) => (i.status || 'new') === status);
    }
    if (search) {
      const s = (search as string).toLowerCase().trim();
      filtered = filtered.filter(
        (i) =>
          i.name.toLowerCase().includes(s) ||
          i.phone.toLowerCase().includes(s) ||
          (i.email && i.email.toLowerCase().includes(s)) ||
          i.productCategory.toLowerCase().includes(s)
      );
    }

    const totalCount = filtered.length;
    const paginatedMemory = filtered.slice(skip, skip + limitNum);

    return res.json({
      success: true,
      count: paginatedMemory.length,
      totalCount,
      page: pageNum,
      totalPages: Math.ceil(totalCount / limitNum) || 1,
      limit: limitNum,
      data: paginatedMemory,
    });
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
