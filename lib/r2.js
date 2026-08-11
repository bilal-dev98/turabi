import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

export function getR2Client() {
    return new S3Client({
        region: "auto",
        endpoint: process.env.R2_ENDPOINT,
        credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
        },
    });
}

/**
 * Upload a file buffer to Cloudflare R2
 * @param {Buffer|ArrayBuffer} fileBuffer
 * @param {string} fileName  — unique key in the bucket
 * @param {string} contentType  — e.g. "image/jpeg"
 * @returns {Promise<string>}  — public URL of the uploaded file
 */
export async function uploadToR2(fileBuffer, fileName, contentType = "image/jpeg") {
    const bucket = process.env.R2_BUCKET_NAME;
    const publicUrl = process.env.R2_PUBLIC_URL;

    if (!bucket) {
        throw new Error("R2_BUCKET_NAME environment variable is missing");
    }

    const client = getR2Client();
    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: fileName,
        Body: Buffer.from(fileBuffer),
        ContentType: contentType,
    });

    await client.send(command);

    return `${publicUrl}/${fileName}`;
}

/**
 * Delete a file from Cloudflare R2 by its key (filename)
 * @param {string} fileName
 */
export async function deleteFromR2(fileName) {
    const bucket = process.env.R2_BUCKET_NAME;
    if (!bucket) return;

    const client = getR2Client();
    const command = new DeleteObjectCommand({
        Bucket: bucket,
        Key: fileName,
    });

    await client.send(command);
}

/**
 * Extract the R2 file key from a full public URL
 * @param {string} url
 * @returns {string}
 */
export function getKeyFromUrl(url) {
    const publicUrl = process.env.R2_PUBLIC_URL || "";
    return url.replace(`${publicUrl}/`, "");
}
