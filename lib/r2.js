import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

// Cloudflare R2 is S3-compatible — we use AWS SDK pointed at R2 endpoint
export const r2Client = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
});

const BUCKET = process.env.R2_BUCKET_NAME;
const PUBLIC_URL = process.env.R2_PUBLIC_URL;

/**
 * Upload a file buffer to Cloudflare R2
 * @param {Buffer|ArrayBuffer} fileBuffer
 * @param {string} fileName  — unique key in the bucket
 * @param {string} contentType  — e.g. "image/jpeg"
 * @returns {Promise<string>}  — public URL of the uploaded file
 */
export async function uploadToR2(fileBuffer, fileName, contentType = "image/jpeg") {
    const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: fileName,
        Body: Buffer.from(fileBuffer),
        ContentType: contentType,
    });

    await r2Client.send(command);

    // Return the public dev URL
    return `${PUBLIC_URL}/${fileName}`;
}

/**
 * Delete a file from Cloudflare R2 by its key (filename)
 * @param {string} fileName  — key in the bucket (e.g. "1234_product.jpg")
 */
export async function deleteFromR2(fileName) {
    const command = new DeleteObjectCommand({
        Bucket: BUCKET,
        Key: fileName,
    });

    await r2Client.send(command);
}

/**
 * Extract the R2 file key from a full public URL
 * e.g. "https://pub-xxx.r2.dev/1234_product.jpg" → "1234_product.jpg"
 * @param {string} url
 * @returns {string}
 */
export function getKeyFromUrl(url) {
    return url.replace(`${PUBLIC_URL}/`, "");
}
