const { AppError } = require('../utils/errorHandler');

const validateImage = (req, res, next) => {
  if (!req.file) {
    return next(new AppError('No image file provided', 400));
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!allowedTypes.includes(req.file.mimetype)) {
    return next(new AppError('Invalid file type. Only JPEG, PNG, and JPG are allowed', 400));
  }

  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (req.file.size > maxSize) {
    return next(new AppError('File size exceeds 5MB limit', 400));
  }

  next();
};

module.exports = validateImage; 