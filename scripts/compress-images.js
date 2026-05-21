import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import imageminWebp from 'imagemin-webp';
import { createHash } from 'crypto';
import { fileURLToPath } from 'url';
import { dirname, join, extname, basename } from 'path';
import {
  existsSync,
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
} from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicImagesPath = join(__dirname, '../public/images');
const cacheFile = join(__dirname, '../.image-compression-cache.json');

const SOURCE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg']);

const hashFile = (filePath) =>
  createHash('sha256').update(readFileSync(filePath)).digest('hex');

const loadCache = () => {
  if (!existsSync(cacheFile)) return {};
  try {
    return JSON.parse(readFileSync(cacheFile, 'utf-8'));
  } catch {
    console.log('⚠️  Cache invalide, réinitialisation...');
    return {};
  }
};

const saveCache = (cache) => {
  writeFileSync(cacheFile, JSON.stringify(cache, null, 2) + '\n');
};

const listSourceImages = () => {
  if (!existsSync(publicImagesPath)) return [];
  return readdirSync(publicImagesPath)
    .filter((name) => SOURCE_EXTENSIONS.has(extname(name).toLowerCase()))
    .map((name) => join(publicImagesPath, name));
};

const fileFingerprint = (filePath) => {
  const stats = statSync(filePath);
  return { size: stats.size, mtimeMs: stats.mtimeMs };
};

const needsCompression = (filePath, cache) => {
  const name = basename(filePath);
  const entry = cache[name];
  const { size, mtimeMs } = fileFingerprint(filePath);

  if (
    entry?.hash &&
    entry.size === size &&
    entry.mtimeMs === mtimeMs
  ) {
    return false;
  }

  const hash = hashFile(filePath);
  return !entry?.hash || entry.hash !== hash;
};

const needsWebp = (filePath, cache) => {
  const name = basename(filePath);
  const webpPath = filePath.replace(/\.(png|jpe?g)$/i, '.webp');
  if (!existsSync(webpPath)) return true;
  const entry = cache[name];
  if (!entry?.webp) return true;
  if (needsCompression(filePath, cache)) return true;
  const sourceMtime = statSync(filePath).mtimeMs;
  const webpMtime = statSync(webpPath).mtimeMs;
  return webpMtime < sourceMtime;
};

const pngPlugins = [
  imageminPngquant({
    quality: [0.65, 0.8],
    speed: 1,
  }),
];

const jpegPlugins = [
  imageminMozjpeg({
    quality: 80,
    progressive: true,
  }),
];

const webpPlugins = [
  imageminWebp({
    quality: 80,
  }),
];

const pluginsFor = (filePath) => {
  const ext = extname(filePath).toLowerCase();
  if (ext === '.png') return pngPlugins;
  if (ext === '.jpg' || ext === '.jpeg') return jpegPlugins;
  return null;
};

const initCacheOnly = process.argv.includes('--init-cache');

(async () => {
  console.log('🖼️  Compression des images de background...\n');

  const cache = loadCache();
  const sources = listSourceImages();

  if (initCacheOnly) {
    for (const filePath of sources) {
      const name = basename(filePath);
      const webpPath = filePath.replace(/\.(png|jpe?g)$/i, '.webp');
      const { size, mtimeMs } = fileFingerprint(filePath);
      cache[name] = {
        hash: hashFile(filePath),
        size,
        mtimeMs,
        webp: existsSync(webpPath),
      };
    }
    for (const cachedName of Object.keys(cache)) {
      if (!sources.some((p) => basename(p) === cachedName)) {
        delete cache[cachedName];
      }
    }
    saveCache(cache);
    console.log(
      `✨ Cache initialisé pour ${sources.length} image(s) (sans recompression).\n`,
    );
    return;
  }

  if (sources.length === 0) {
    console.log('ℹ️  Aucune image dans public/images.\n');
    return;
  }

  const toCompress = sources.filter((p) => needsCompression(p, cache));
  const toWebp = sources.filter((p) => needsWebp(p, cache));

  if (toCompress.length === 0 && toWebp.length === 0) {
    console.log('✨ Aucune nouvelle image à compresser (cache à jour).\n');
    return;
  }

  let totalProcessed = 0;

  for (const filePath of toCompress) {
    const name = basename(filePath);
    const plugins = pluginsFor(filePath);
    if (!plugins) continue;

    await imagemin([filePath], {
      destination: publicImagesPath,
      plugins,
    });

    const { size, mtimeMs } = fileFingerprint(filePath);
    const hash = hashFile(filePath);
    cache[name] = {
      ...(cache[name] || {}),
      hash,
      size,
      mtimeMs,
      webp: cache[name]?.webp ?? false,
    };
    console.log(`✅ ${name} compressé`);
    totalProcessed += 1;
  }

  if (toWebp.length > 0) {
    const webpResults = await imagemin(toWebp, {
      destination: publicImagesPath,
      plugins: webpPlugins,
    });

    for (const file of webpResults) {
      const name = basename(file.sourcePath);
      const webpName = name.replace(/\.(png|jpe?g)$/i, '.webp');
      const { size, mtimeMs } = fileFingerprint(file.sourcePath);
      const hash = hashFile(file.sourcePath);
      cache[name] = { hash, size, mtimeMs, webp: true };
      console.log(`✅ ${webpName} généré`);
      totalProcessed += 1;
    }
  }

  // Entrées orphelines : image supprimée du dossier
  for (const cachedName of Object.keys(cache)) {
    if (!sources.some((p) => basename(p) === cachedName)) {
      delete cache[cachedName];
    }
  }

  saveCache(cache);
  console.log(`\n✨ ${totalProcessed} fichier(s) traité(s).\n`);
})().catch((error) => {
  console.error('❌ Erreur lors de la compression:', error);
  process.exit(1);
});
