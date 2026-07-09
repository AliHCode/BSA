import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import { fileURLToPath } from 'url';

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegStatic);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, 'src', 'data', 'memories.json');
const publicDir = path.join(__dirname, 'public');
const thumbsDir = path.join(publicDir, 'thumbnails');

if (!fs.existsSync(thumbsDir)) {
  fs.mkdirSync(thumbsDir, { recursive: true });
}

async function processMedia() {
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  
  console.log(`Processing ${data.length} media items...`);
  
  for (const item of data) {
    const srcPath = path.join(publicDir, item.src);
    
    // Check if source file exists
    if (!fs.existsSync(srcPath)) {
      console.warn(`Warning: Source file not found: ${srcPath}`);
      continue;
    }

    if (item.type === 'image') {
      const thumbFilename = `${item.id}.webp`;
      const thumbPath = path.join(thumbsDir, thumbFilename);
      
      if (fs.existsSync(thumbPath)) {
        console.log(`Skipping image ${item.id} - thumbnail already exists`);
        continue;
      }

      console.log(`Generating thumbnail for image ${item.id}...`);
      try {
        await sharp(srcPath)
          .resize(400, null, { withoutEnlargement: true }) // max width 400, auto height
          .webp({ quality: 60 })
          .toFile(thumbPath);
      } catch (err) {
        console.error(`Error processing image ${item.id}:`, err);
      }
    } else if (item.type === 'video') {
      const thumbFilename = `${item.id}.jpg`;
      const thumbPath = path.join(thumbsDir, thumbFilename);
      
      if (fs.existsSync(thumbPath)) {
        console.log(`Skipping video ${item.id} - poster already exists`);
        continue;
      }

      console.log(`Generating poster for video ${item.id}...`);
      await new Promise((resolve, reject) => {
        ffmpeg(srcPath)
          .on('end', () => resolve())
          .on('error', (err) => {
            console.error(`Error processing video ${item.id}:`, err);
            resolve(); // Resolve anyway to continue loop
          })
          .screenshots({
            timestamps: [1], // screenshot at 1 second
            filename: thumbFilename,
            folder: thumbsDir,
            size: '400x?'
          });
      });
    }
  }
  
  console.log("Finished generating all thumbnails and posters!");
}

processMedia().catch(console.error);
