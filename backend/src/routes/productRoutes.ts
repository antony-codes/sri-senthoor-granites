import { Router } from 'express';
import { getProducts, getSubCategories, getProductBySlug, createProduct, updateProduct, deleteProduct } from '../controllers/productController';
import { protect } from '../middlewares/auth';

const router = Router();

router.get('/', getProducts);
router.get('/subcategories', getSubCategories);
router.get('/:slug', getProductBySlug);
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

export default router;
