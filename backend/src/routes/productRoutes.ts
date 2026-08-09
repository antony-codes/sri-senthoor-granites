import { Router } from 'express';
import { getProducts, getSubCategories, getProductBySlug, createProduct, updateProduct, deleteProduct } from '../controllers/productController';
import { protect, requirePermission } from '../middlewares/auth';

const router = Router();

router.get('/', getProducts);
router.get('/subcategories', getSubCategories);
router.get('/:slug', getProductBySlug);
router.post('/', protect, requirePermission('products:manage'), createProduct);
router.put('/:id', protect, requirePermission('products:manage'), updateProduct);
router.delete('/:id', protect, requirePermission('products:manage'), deleteProduct);

export default router;
