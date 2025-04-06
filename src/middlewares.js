import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createThumbnail = async (req, res, next) => {
  if (!req.file) {
    next();
    return;
  }

  try {
    const thumbnailPath = path.join(
      __dirname,
      '../uploads',
      `${req.file.filename}_thumb.jpg`
    );

    await sharp(req.file.path)
      .resize(160, 160)
      .toFormat('jpeg')
      .toFile(thumbnailPath);

    console.log(`Thumbnail created at -> ${thumbnailPath}`);
    next();
  } catch (error) {
    console.error('Error with thumbnail:', error);
    next(error);
  }
};

export { createThumbnail };