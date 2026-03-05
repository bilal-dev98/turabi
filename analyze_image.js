const Jimp = require('jimp');

async function analyze() {
    try {
        const image = await Jimp.read('C:/Users/umarh/.gemini/antigravity/brain/8b1beecd-eee6-4bce-b007-58eeff628b23/media__1771709480606.png');
        const width = image.bitmap.width;
        const height = image.bitmap.height;

        let redPixels = [];

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const hex = image.getPixelColor(x, y);
                const rgb = Jimp.intToRGBA(hex);

                // Identify strong red pixels (high R, low G and B)
                if (rgb.r > 200 && rgb.g < 50 && rgb.b < 50) {
                    redPixels.push({ x, y });
                }
            }
        }

        if (redPixels.length === 0) {
            console.log("No red pixels found");
            return;
        }

        // Find lines or bounding boxes
        let minX = width, maxX = 0, minY = height, maxY = 0;
        let yCounts = {};

        redPixels.forEach(p => {
            if (p.x < minX) minX = p.x;
            if (p.x > maxX) maxX = p.x;
            if (p.y < minY) minY = p.y;
            if (p.y > maxY) maxY = p.y;

            yCounts[p.y] = (yCounts[p.y] || 0) + 1;
        });

        console.log(`Red envelope: X[${minX}-${maxX}] Y[${minY}-${maxY}]`);

        // Find horizontal lines
        console.log("Horizontal red lines (Y coordinates with > 50 red pixels):");
        Object.keys(yCounts).forEach(y => {
            if (yCounts[y] > 50) {
                const xs = redPixels.filter(p => p.y == y).map(p => p.x);
                const localMinX = Math.min(...xs);
                const localMaxX = Math.max(...xs);
                console.log(`Y=${y}: X from ${localMinX} to ${localMaxX} (Length: ${localMaxX - localMinX})`);
            }
        });

    } catch (err) {
        console.error(err);
    }
}

analyze();
