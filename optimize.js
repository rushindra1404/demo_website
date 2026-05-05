const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const cheerio = require('cheerio');

async function optimizeImages(dir) {
    const files = fs.readdirSync(dir);
    const converted = {};
    for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (['.jpg', '.jpeg', '.png'].includes(ext)) {
            const originalPath = path.join(dir, file);
            const newFile = file.substring(0, file.lastIndexOf('.')) + '.webp';
            const newPath = path.join(dir, newFile);
            
            // Only convert if it doesn't exist
            if (!fs.existsSync(newPath)) {
                try {
                    await sharp(originalPath)
                        .webp({ quality: 80 })
                        .toFile(newPath);
                    console.log(`Converted ${file} to WebP`);
                } catch (err) {
                    console.error(`Error converting ${file}:`, err);
                }
            }
            converted[`${path.basename(dir)}/${file}`] = `${path.basename(dir)}/${newFile}`;
        }
    }
    return converted;
}

async function run() {
    console.log("Starting image optimization...");
    const imagesConverted = {
        ...await optimizeImages(path.join(__dirname, 'images')),
        ...await optimizeImages(path.join(__dirname, 'gallery'))
    };

    console.log("Image optimization complete. Updating HTML...");
    
    let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

    // 1. Replace image paths with WebP
    for (const [oldPath, newPath] of Object.entries(imagesConverted)) {
        // Escape characters for regex or just use simple split/join
        html = html.split(oldPath).join(newPath);
        // Sometimes paths are URL encoded in HTML
        const encodedOld = oldPath.split('/').map(encodeURIComponent).join('/');
        const encodedNew = newPath.split('/').map(encodeURIComponent).join('/');
        html = html.split(encodedOld).join(encodedNew);
    }

    // 2. Load with cheerio for DOM manipulation
    // We use a regex replace for heavy animations first because cheerio might reformat things 
    // actually, cheerio might format HTML slightly, but it's okay. Let's do regex for animations to keep it simple.
    
    // Remove heavy continuous animations to improve rendering performance
    html = html.replace(/animate-\[pulseGlow_6s_ease-in-out_infinite\]/g, '');
    html = html.replace(/animate-\[pulseGlow_4s_ease-in-out_infinite\]/g, '');
    html = html.replace(/animate-\[pulseGlow_3s_ease-in-out_infinite\]/g, '');
    html = html.replace(/animate-\[pulseGlow_2s_ease-in-out_infinite\]/g, '');
    html = html.replace(/animate-pulse-glow/g, '');
    html = html.replace(/animate-\[floatSlow_4\.5s_ease-in-out_infinite\]/g, '');
    html = html.replace(/animate-\[floatSlow_5s_ease-in-out_infinite\]/g, '');
    html = html.replace(/animate-\[floatSlow_4s_ease-in-out_infinite\]/g, '');
    html = html.replace(/animate-\[floatSlow_4\.8s_ease-in-out_infinite\]/g, '');
    html = html.replace(/animate-pulse/g, '');
    // Replace hover animations with simpler ones or keep them (hover is fine since it's not continuous when not hovered)
    
    const $ = cheerio.load(html, { decodeEntities: false });

    // Add lazy loading to images, skip header/hero
    $('img').each((i, el) => {
        const parentId = $(el).closest('#hero-section, header').attr('id');
        if (!parentId) {
            $(el).attr('loading', 'lazy');
        }
    });

    // Optimize videos
    $('video').each((i, el) => {
        $(el).attr('preload', 'none');
        if (!$(el).attr('poster')) {
            // Give a generic or existing poster if possible, here we just ensure preload=none is there
        }
    });

    // Defer scripts
    $('script').each((i, el) => {
        const src = $(el).attr('src');
        if (src && src.includes('.js')) {
            $(el).attr('defer', 'defer');
        }
    });

    // Save updated HTML
    fs.writeFileSync(path.join(__dirname, 'index.html'), $.html());
    
    console.log("HTML optimization complete.");
}

run().catch(console.error);
