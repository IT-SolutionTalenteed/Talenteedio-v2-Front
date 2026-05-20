import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import imageminWebp from 'imagemin-webp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicImagesPath = join(__dirname, '../public/images');

console.log('🖼️  Compression des images de background...\n');

(async () => {
  try {
    // Compression des PNG
    const pngFiles = await imagemin([`${publicImagesPath}/*.png`], {
      destination: publicImagesPath,
      plugins: [
        imageminPngquant({
          quality: [0.65, 0.80],
          speed: 1
        })
      ]
    });
    
    if (pngFiles.length > 0) {
      console.log(`✅ ${pngFiles.length} fichiers PNG compressés`);
      pngFiles.forEach(file => {
        console.log(`   - ${file.sourcePath.split('/').pop()}`);
      });
    }

    // Compression des JPEG/JPG
    const jpgFiles = await imagemin([`${publicImagesPath}/*.{jpg,jpeg}`], {
      destination: publicImagesPath,
      plugins: [
        imageminMozjpeg({
          quality: 80,
          progressive: true
        })
      ]
    });
    
    if (jpgFiles.length > 0) {
      console.log(`\n✅ ${jpgFiles.length} fichiers JPEG compressés`);
      jpgFiles.forEach(file => {
        console.log(`   - ${file.sourcePath.split('/').pop()}`);
      });
    }

    // Génération de versions WebP (optionnel mais recommandé)
    const webpFiles = await imagemin([`${publicImagesPath}/*.{png,jpg,jpeg}`], {
      destination: publicImagesPath,
      plugins: [
        imageminWebp({
          quality: 80
        })
      ]
    });
    
    if (webpFiles.length > 0) {
      console.log(`\n✅ ${webpFiles.length} versions WebP générées`);
      webpFiles.forEach(file => {
        const filename = file.sourcePath.split('/').pop();
        const webpName = filename.replace(/\.(png|jpg|jpeg)$/i, '.webp');
        console.log(`   - ${webpName}`);
      });
    }

    console.log('\n✨ Compression terminée avec succès!\n');
  } catch (error) {
    console.error('❌ Erreur lors de la compression:', error);
    process.exit(1);
  }
})();
