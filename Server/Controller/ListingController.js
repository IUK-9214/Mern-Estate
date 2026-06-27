import Listing from "../Models/listingModel.js";
import { errorHandler } from "../utils/error.js";
import cloudinary from "../config/cloudinary.js";

export const CreateListing = async (req, res, next) => {
  try {
    // attach the logged-in user's id from the verified token
    const listing = await Listing.create({
      ...req.body,
      userRef: req.user.id,   
    });

    return res.status(201).json(listing);

  } catch (error) {
    next(error);
  }
};



export const uploadListingImage = async (req, res, next) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) return next(errorHandler(400, "No image provided"));

    const uploadResult = await cloudinary.uploader.upload(imageUrl, {
      folder: "listing_images",
    });

    res.status(200).json({ success: true, imageUrl: uploadResult.secure_url });

  } catch (error) {
    next(error);
  }
};