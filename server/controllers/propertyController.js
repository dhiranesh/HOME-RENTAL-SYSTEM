// filepath: c:\Users\dhira\OneDrive\Desktop\other\final house rental website\home-rental-app\server\controllers\propertyController.js
const Property = require('../models/Property');
const User = require('../models/User'); // For owner checks
const asyncHandler = require('express-async-handler');
const { cloudinaryUploadImg, cloudinaryDeleteImg } = require('../config/cloudinary');
const fs = require('fs'); // File system for temporary file handling

// @desc    Get all properties with filtering, pagination, and search
// @route   GET /api/properties
// @access  Public
exports.getAllProperties = asyncHandler(async (req, res) => {
    try {
        console.log('Getting all properties with query:', req.query);
        const pageSize = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        
        let count = 0;
        let properties = [];
        
        try {
            // Simple query without conditions to get all properties - will restore filtering later
            count = await Property.countDocuments();
            properties = await Property.find().lean();
            
            // Log each property to see what's there
            console.log('Properties from database:');
            properties.forEach((prop, index) => {
                console.log(`Property ${index + 1}:`, JSON.stringify(prop._id));
            });

            console.log(`Found ${properties.length} properties out of ${count} total`);
        } catch (dbError) {
            console.error('Database error during find/count:', dbError);
            // Return empty results rather than failing completely
        }

        res.json({
            properties,
            page,
            pages: Math.ceil(count / pageSize) || 0,
            count
        });
    } catch (error) {
        console.error('Error in getAllProperties controller:', error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
});

// @desc    Get a single property by ID
// @route   GET /api/properties/:id
// @access  Public
exports.getPropertyById = asyncHandler(async (req, res) => {
    console.log('getPropertyById: Received ID:', req.params.id); // Added console.log
    const property = await Property.findById(req.params.id)
        .populate('owner', 'name email avatar')
        .populate({
            path: 'reviews',
            populate: { path: 'user', select: 'name avatar' }
        });

    console.log('getPropertyById: Property found:', property); // Added console.log

    if (property) {
        res.json(property);
    } else {
        res.status(404);
        throw new Error('Property not found');
    }
});

// @desc    Create a new property
// @route   POST /api/properties
// @access  Private (Authenticated User)
exports.createProperty = asyncHandler(async (req, res) => {
    const { 
        name, // Changed from title
        description, 
        type, 
        // address, // Expect address as an object: { street, city, state, zipCode, country }
        location, // Changed: Expect location as a string
        // location, // Expect location as an object: { coordinates: [lng, lat] }
        price, // Changed from pricePerNight
        bedrooms, 
        bathrooms, 
        guests, // Guests is optional in model, but was in controller logic
        amenities,
        area, // Added area
        image // Added image
    } = req.body;

    // Simplified validation based on Property.js model
    if (!name || !description || !type || !location || price === undefined || price === null || !bedrooms || !bathrooms || !area || !image) {
        res.status(400);
        throw new Error('Please provide all required fields: name, description, type, location, price, bedrooms, bathrooms, area, and image.');
    }

    const propertyData = {
        name,
        description,
        type,
        location, // Direct string
        price: Number(price),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        area: Number(area), // Added area
        image, // Added image
        guests: guests ? Number(guests) : undefined, // Retained optional guests
        amenities: amenities ? (Array.isArray(amenities) ? amenities : amenities.split(',').map(a => a.trim())) : [],
        owner: req.user._id, // From authMiddleware
        // images: [], // images (plural) was for multiple image uploads, model has singular 'image'
        status: 'Available' // Default status from model
    };

    // Geocoding for coordinates can be added here if needed
    // e.g., using a service like Google Geocoding API or a library

    const property = new Property(propertyData);
    const createdProperty = await property.save();

    // Add property to user's listings
    // Assuming User model has a 'listings' array field
    // await User.findByIdAndUpdate(req.user._id, { $push: { listings: createdProperty._id } });

    res.status(201).json(createdProperty);
});

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private (Owner or Admin)
exports.updateProperty = asyncHandler(async (req, res) => {
    const property = await Property.findById(req.params.id);

    if (!property) {
        res.status(404);
        throw new Error('Property not found');
    }

    // Check if the user is the owner or an admin
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to update this property');
    }

    const { 
        title, description, type, 
        address, // Expect address as an object
        location, // Expect location as an object e.g. { coordinates: [lng, lat] }
        pricePerNight, bedrooms, bathrooms, guests, amenities, images 
    } = req.body;

    property.title = title || property.title;
    property.description = description || property.description;
    property.type = type || property.type;

    if (address) {
        if (address.street !== undefined) property.address.street = address.street;
        if (address.city !== undefined) property.address.city = address.city;
        if (address.state !== undefined) property.address.state = address.state;
        if (address.zipCode !== undefined) property.address.zipCode = address.zipCode;
        if (address.country !== undefined) property.address.country = address.country;
    }

    if (location && location.coordinates && Array.isArray(location.coordinates) && location.coordinates.length === 2) {
        property.location.type = 'Point';
        property.location.coordinates = location.coordinates;
    }
    
    property.pricePerNight = pricePerNight !== undefined ? Number(pricePerNight) : property.pricePerNight;
    property.bedrooms = bedrooms !== undefined ? Number(bedrooms) : property.bedrooms;
    property.bathrooms = bathrooms !== undefined ? Number(bathrooms) : property.bathrooms;
    property.guests = guests !== undefined ? Number(guests) : property.guests;
    property.amenities = amenities ? (Array.isArray(amenities) ? amenities : amenities.split(',').map(a => a.trim())) : property.amenities;
    
    // If new images are provided (e.g., array of URLs or new uploads to handle)
    if (images) {
        // This part needs to align with how images are sent from the client (URLs or files)
        // If URLs, simply update: property.images = images;
        // If files, handle upload and then update URLs (see uploadPropertyImages)
        property.images = images; // Assuming images are an array of URLs for now
    }

    const updatedProperty = await property.save();
    res.json(updatedProperty);
});

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private (Owner or Admin)
exports.deleteProperty = asyncHandler(async (req, res) => {
    const property = await Property.findById(req.params.id);

    if (!property) {
        res.status(404);
        throw new Error('Property not found');
    }

    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to delete this property');
    }

    // Remove property from user's listings
    await User.findByIdAndUpdate(property.owner, { $pull: { listings: property._id } });

    // Delete images from Cloudinary if they exist
    if (property.images && property.images.length > 0) {
        for (const imageUrl of property.images) {
            try {
                // Extract public_id from URL (this depends on your Cloudinary URL structure)
                // Example: if URL is http://res.cloudinary.com/duy0fpt2r/image/upload/v1716130883/folder/image_id.jpg
                // Public ID might be "folder/image_id"
                const parts = imageUrl.split('/');
                const publicIdWithExtension = parts.slice(parts.indexOf('upload') + 2).join('/');
                const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));
                if (publicId) {
                    await cloudinaryDeleteImg(publicId);
                }
            } catch (uploadError) {
                console.error(`Failed to delete image ${imageUrl} from Cloudinary:`, uploadError);
                // Decide if you want to stop or continue if one image deletion fails
            }
        }
    }

    await property.remove(); // or property.deleteOne() for Mongoose v6+
    res.json({ message: 'Property removed successfully' });
});

// @desc    Get properties by location (e.g., near a certain point)
// @route   GET /api/properties/location?lat=xx&lng=yy&distance=zz
// @access  Public
exports.getPropertiesByLocation = asyncHandler(async (req, res) => {
    // Placeholder: Implement actual geo-query logic
    // For example, using MongoDB's $near or $geoWithin operators
    // Requires a 2dsphere index on the location.coordinates field in the Property model
    const { lat, lng, distance } = req.query;

    if (!lat || !lng) {
        res.status(400);
        throw new Error('Latitude and longitude are required for location search.');
    }

    // const maxDistance = distance ? parseInt(distance) : 10000; // Default 10km in meters

    // Example (needs 2dsphere index on Property model: location.coordinates):
    // const properties = await Property.find({
    //     location: {
    //         $near: {
    //             $geometry: {
    //                 type: "Point",
    //                 coordinates: [parseFloat(lng), parseFloat(lat)]
    //             },
    //             $maxDistance: maxDistance
    //         }
    //     }
    // });

    res.status(501).json({ 
        message: 'Not Implemented: getPropertiesByLocation. Query params received', 
        lat, 
        lng, 
        distance 
    });
});

// @desc    Upload images for a property
// @route   PUT /api/properties/:id/images
// @access  Private (Owner or Admin)
exports.uploadPropertyImages = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const property = await Property.findById(id);

    if (!property) {
        res.status(404);
        throw new Error('Property not found');
    }

    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to upload images to this property');
    }

    if (!req.files || req.files.length === 0) {
        res.status(400);
        throw new Error('No image files uploaded.');
    }

    const uploadedImageUrls = [];
    try {
        for (const file of req.files) {
            const { path } = file;
            // Ensure your Cloudinary config specifies a folder for property images if desired
            const newPath = await cloudinaryUploadImg(path, 'property_images'); // 'property_images' is an example folder
            uploadedImageUrls.push(newPath.url); // Assuming cloudinaryUploadImg returns { url: '...', public_id: '...' }
            fs.unlinkSync(path); // Remove temp file after successful upload
        }

        property.images = property.images ? [...property.images, ...uploadedImageUrls] : uploadedImageUrls;
        const updatedProperty = await property.save();
        res.json(updatedProperty);

    } catch (error) {
        // If upload fails, attempt to delete any already uploaded images for this batch to prevent orphans
        for (const url of uploadedImageUrls) {
            try {
                 const parts = url.split('/');
                 const publicIdWithExtension = parts.slice(parts.indexOf('upload') + 2).join('/');
                 const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));
                if (publicId) await cloudinaryDeleteImg(publicId);
            } catch (cleanupError) {
                console.error('Error cleaning up uploaded image during failed request:', cleanupError);
            }
        }
        res.status(500);
        throw new Error('Image upload failed. Error: ' + error.message);
    }
});

// @desc    Delete an image from a property
// @route   DELETE /api/properties/:id/images
// @access  Private (Owner or Admin)
exports.deletePropertyImage = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { imageUrl } = req.body; // Client sends the URL of the image to delete

    if (!imageUrl) {
        res.status(400);
        throw new Error('Image URL is required to delete.');
    }

    const property = await Property.findById(id);

    if (!property) {
        res.status(404);
        throw new Error('Property not found');
    }

    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to modify this property\'s images');
    }

    try {
        // Extract public_id from URL
        const parts = imageUrl.split('/');
        const publicIdWithExtension = parts.slice(parts.indexOf('upload') + 2).join('/');
        const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));

        if (!publicId) {
            res.status(400);
            throw new Error('Could not extract public ID from image URL.');
        }
        
        await cloudinaryDeleteImg(publicId);
        
        property.images = property.images.filter(img => img !== imageUrl);
        await property.save();
        
        res.json({ message: 'Image deleted successfully', images: property.images });
    } catch (error) {
        console.error('Error deleting image from Cloudinary or property:', error);
        res.status(500);
        throw new Error('Failed to delete image. ' + error.message);
    }
});

// @desc    Get properties listed by the logged-in user
// @route   GET /api/properties/my-listings
// @access  Private
exports.getPropertiesByUser = asyncHandler(async (req, res) => {
    // Placeholder implementation
    res.status(501).json({ message: 'Not Implemented: getPropertiesByUser' });
});

// Ensure all controller functions are exported
module.exports = {
    getAllProperties: exports.getAllProperties,
    getPropertyById: exports.getPropertyById,
    createProperty: exports.createProperty,
    updateProperty: exports.updateProperty,
    deleteProperty: exports.deleteProperty,
    uploadPropertyImages: exports.uploadPropertyImages,
    deletePropertyImage: exports.deletePropertyImage,
    getPropertiesByUser: exports.getPropertiesByUser,
    getPropertiesByLocation: exports.getPropertiesByLocation,
};
