import { Router } from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController';
import { protect, requirePermission } from '../middlewares/auth';

const router = Router();

router.get('/', getCategories);
router.post('/', protect, requirePermission('categories:manage'), createCategory);
router.put('/:id', protect, requirePermission('categories:manage'), updateCategory);
router.delete('/:id', protect, requirePermission('categories:manage'), deleteCategory);

export default router;
