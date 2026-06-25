import express from 'express';
import { CreateListing } from '../Controller/ListingController.js';
import { verifyToken } from '../Middleware/verifyToken.js';

const router= express.Router();


router.post('/listing',verifyToken,CreateListing)

export default router;