import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegStatic from 'ffmpeg-static'

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegStatic);

// Custom plugin to handle file uploads locally during development
const memoryUploadPlugin = () => ({
  name: 'memory-upload',
  configureServer(server) {
    server.middlewares.use('/api/upload', (req, res) => {
      if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', async () => {
          try {
            const data = JSON.parse(body);
            const { fileName, fileType, base64Data, caption, title, posX, posY } = data;
            
            // Determine folder and path
            const folder = fileType === 'video' ? 'videos' : 'images';
            const publicPath = path.resolve(__dirname, `public/${folder}/${fileName}`);
            
            // Save file from base64
            const base64Content = base64Data.split(';base64,').pop();
            fs.writeFileSync(publicPath, base64Content, { encoding: 'base64' });

            const newMemoryId = Date.now();

            // Generate Thumbnail
            const thumbsDir = path.resolve(__dirname, 'public/thumbnails');
            if (!fs.existsSync(thumbsDir)) {
              fs.mkdirSync(thumbsDir, { recursive: true });
            }
            
            if (fileType === 'image') {
              const thumbPath = path.resolve(thumbsDir, `${newMemoryId}.webp`);
              await sharp(publicPath)
                .resize(400, null, { withoutEnlargement: true })
                .webp({ quality: 60 })
                .toFile(thumbPath);
            } else if (fileType === 'video') {
              const thumbPath = path.resolve(thumbsDir, `${newMemoryId}.jpg`);
              await new Promise((resolve) => {
                ffmpeg(publicPath)
                  .on('end', resolve)
                  .on('error', (err) => {
                    console.error('FFmpeg error:', err);
                    resolve();
                  })
                  .screenshots({
                    timestamps: [1],
                    filename: `${newMemoryId}.jpg`,
                    folder: thumbsDir,
                    size: '400x?'
                  });
              });
            }

            // Update memories.json
            const jsonPath = path.resolve(__dirname, 'src/data/memories.json');
            const memories = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
            
            const newMemory = {
              id: newMemoryId,
              type: fileType,
              src: `/${folder}/${fileName}`,
              caption: caption,
              title: title,
              posX: posX !== undefined ? posX : 50,
              posY: posY !== undefined ? posY : 50
            };
            
            memories.push(newMemory);
            fs.writeFileSync(jsonPath, JSON.stringify(memories, null, 2));

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, memory: newMemory }));
          } catch (error) {
            console.error('Error uploading file:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: error.message }));
          }
        });
      } else {
        res.writeHead(405);
        res.end('Method Not Allowed');
      }
    });

    // Handle Delete
    server.middlewares.use('/api/delete', (req, res) => {
      if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
          try {
            const { id } = JSON.parse(body);
            const jsonPath = path.resolve(__dirname, 'src/data/memories.json');
            let memories = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
            
            const memoryToDelete = memories.find(m => m.id === id);
            if (memoryToDelete) {
              // Delete the file if it's in public/images or public/videos
              const filePath = path.resolve(__dirname, `public${memoryToDelete.src}`);
              if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
              }
            }
            
            memories = memories.filter(m => m.id !== id);
            fs.writeFileSync(jsonPath, JSON.stringify(memories, null, 2));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
          } catch (error) {
            console.error('Error deleting memory:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: error.message }));
          }
        });
      } else {
        res.writeHead(405); res.end('Method Not Allowed');
      }
    });

    // Handle Update
    server.middlewares.use('/api/update', (req, res) => {
      if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
          try {
            const { id, title, caption, posX, posY } = JSON.parse(body);
            const jsonPath = path.resolve(__dirname, 'src/data/memories.json');
            let memories = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
            
            const memoryIndex = memories.findIndex(m => m.id === id);
            if (memoryIndex !== -1) {
              memories[memoryIndex].title = title;
              memories[memoryIndex].caption = caption;
              memories[memoryIndex].posX = posX !== undefined ? posX : memories[memoryIndex].posX;
              memories[memoryIndex].posY = posY !== undefined ? posY : memories[memoryIndex].posY;
              fs.writeFileSync(jsonPath, JSON.stringify(memories, null, 2));
            }
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, memory: memories[memoryIndex] }));
          } catch (error) {
            console.error('Error updating memory:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: error.message }));
          }
        });
      } else {
        res.writeHead(405); res.end('Method Not Allowed');
      }
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), memoryUploadPlugin()],
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
})
