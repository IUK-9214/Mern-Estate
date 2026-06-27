import express from 'express';
import { CreateListing, uploadListingImage } from '../Controller/ListingController.js';
import { verifyToken } from '../Middleware/verifyToken.js';

const router = express.Router();
router.post('/uploadimage', verifyToken,uploadListingImage); 
router.post('/listing', verifyToken, CreateListing);

export default router;