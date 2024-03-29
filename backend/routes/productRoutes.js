import express from 'express';
import {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
  getLatestProducts,
  getSaleProducts,
  getRelatedProducts,
  getSortByPriceProducts,
  createProductComment,
  createCommentReply,
  createReviewReply
} from '../controllers/productController.js';
import { protect, checkAdmin } from '../middlewares/AuthMiddleware.js';
const router = express.Router();

router.route('/').get(getProducts).post(protect, checkAdmin, createProduct);
router.route('/:id/reviews').post(protect, createProductReview);
router.route('/:id/reply/reviews').post(protect, checkAdmin, createReviewReply);
router.route('/:id/comments').post(protect, createProductComment);
router.route('/:id/reply').post(protect, createCommentReply);
router.get('/top', getTopProducts);
router.get('/latest', getLatestProducts);
router.get('/sale', getSaleProducts);
router.get('/related', getRelatedProducts);
router.get('/price', getSortByPriceProducts);
router
  .route('/:id')
  .get(getProductById)
  .delete(protect, checkAdmin, deleteProduct)
  .put(protect, checkAdmin, updateProduct);

export default router;
