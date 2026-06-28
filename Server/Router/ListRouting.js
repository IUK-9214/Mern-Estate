import express from 'express';
import {
  CreateListing,
  uploadListingImage,
  deleteListing,
  getListing,
  updateListing,
} from '../Controller/ListingController.js';
import { verifyToken } from '../Middleware/verifyToken.js';

const router = express.Router();

router.post('/uploadimage', verifyToken, uploadListingImage);
router.post('/listing', verifyToken, CreateListing);
router.delete('/listing/delete/:id', verifyToken, deleteListing);
router.get('/listing/get/:id', getListing);                        
router.put('/listing/update/:id', verifyToken, updateListing);    

export default router;