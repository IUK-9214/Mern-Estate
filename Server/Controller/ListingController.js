import Listing from "../Models/listingModel.js";
import { errorHandler } from "../utils/error.js";
import cloudinary from "../config/cloudinary.js";

export const CreateListing = async (req, res, next) => {
  try {
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


export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    if (req.user.id !== listing.userRef.toString()) {
      return next(errorHandler(403, "You can only delete your own listings"));
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Listing deleted successfully" });

  } catch (error) {
    next(error);
  }
};


export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    res.status(200).json(listing);

  } catch (error) {
    next(error);
  }
};



export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    if (req.user.id !== listing.userRef.toString()) {
      return next(errorHandler(403, "You can only update your own listings"));
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedListing);

  } catch (error) {
    next(error);
  }
};