import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const OCCASIONS_DIR = path.resolve('public/occasions');

async function compressAll() {
  try {
    const files = fs.readdirSync(OCCASIONS_DIR);
    console.log(`Found ${files.length} files in ${OCCASIONS_DIR}`);

    for (const file of files) {
      if (!file.toLowerCase().endsWith('.jpg') && !file.toLowerCase().endsWith('.jpeg')) {
        continue;
      }

      const filePath = path.join(OCCASIONS_DIR, file);
      const tempPath = path.join(OCCASIONS_DIR, `temp_${file}`);

      const statsBefore = fs.statSync(filePath);
      const sizeBeforeMb = (statsBefore.size / (1024 * 1024)).toFixed(2);

      console.log(`Compressing ${file} (${sizeBeforeMb} MB)...`);

      // Resize to max 600px width (since they are small cards) and convert/compress to highly optimized progressive JPEG
      await sharp(filePath)
        .resize({ width: 600, withoutEnlargement: true })
        .jpeg({ quality: 80, progressive: true })
        .toFile(tempPath);

      // Replace original file with compressed one
      fs.unlinkSync(filePath);
      fs.renameSync(tempPath, filePath);

      const statsAfter = fs.statSync(filePath);
      const sizeAfterKb = (statsAfter.size / 1024).toFixed(1);

      console.log(`-> Compressed ${file} successfully! New size: ${sizeAfterKb} KB`);
    }

    console.log('All images compressed successfully!');
  } catch (error) {
    console.error('Error during compression:', error);
  }
}

compressAll();
