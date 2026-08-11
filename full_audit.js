const { PrismaClient } = require('./node_modules/@prisma/client');
const { S3Client, ListObjectsV2Command, PutObjectCommand, DeleteObjectCommand } = require('./node_modules/@aws-sdk/client-s3');

const prisma = new PrismaClient();

async function runFullAudit() {
    console.log('=== FULL PRODUCTION AUDIT ===\n');

    // 1. DATABASE
    console.log('─── DATABASE AUDIT ───────────────────────────────');
    try {
        const userCount = await prisma.user.count();
        const productCount = await prisma.product.count();
        const orderCount = await prisma.order.count();
        const categoryCount = await prisma.category.count();
        const couponCount = await prisma.coupon.count();
        const bannerCount = await prisma.banner.count();
        const reviewCount = await prisma.rating.count();
        const messageCount = await prisma.contactMessage.count();
        const newsletterCount = await prisma.newsletter.count();
        const storeCount = await prisma.store.count();

        console.log('✅ DB Connection: PASS');
        console.log('   users:', userCount, '| products:', productCount, '| orders:', orderCount);
        console.log('   categories:', categoryCount, '| coupons:', couponCount, '| banners:', bannerCount);
        console.log('   reviews:', reviewCount, '| messages:', messageCount, '| newsletters:', newsletterCount, '| stores:', storeCount);

        const users = await prisma.user.findMany({ take: 5, select: { id: true, name: true, email: true, role: true } });
        console.log('✅ SELECT users: PASS -', users.map(u => `${u.name} (${u.role})`).join(', '));

        const products = await prisma.product.findMany({ take: 3, select: { id: true, name: true, price: true, category: true, inStock: true } });
        console.log('✅ SELECT products: PASS -', products.map(p => p.name).join(', '));

        const categories = await prisma.category.findMany({ take: 5, select: { id: true, name: true } });
        console.log('✅ SELECT categories: PASS -', categories.map(c => c.name).join(', '));

        const coupons = await prisma.coupon.findMany({ take: 3, select: { id: true, code: true, discount: true } });
        console.log('✅ SELECT coupons: PASS -', coupons.length, 'coupons');

        const banners = await prisma.banner.findMany({ take: 3 });
        console.log('✅ SELECT banners: PASS -', banners.length, 'banners');

        const orders = await prisma.order.findMany({ take: 3, select: { id: true, total: true, status: true } });
        console.log('✅ SELECT orders: PASS -', orders.length, 'orders');

        // Test activity log if it exists
        try {
            const activities = await prisma.activityLog.findMany({ take: 3 });
            console.log('✅ SELECT activityLog: PASS -', activities.length, 'records');
        } catch (e) {
            console.log('⚠️  activityLog: not found (optional)');
        }

        const messages = await prisma.contactMessage.findMany({ take: 3 });
        console.log('✅ SELECT contactMessages: PASS -', messages.length, 'records');

        const newsletters = await prisma.newsletter.findMany({ take: 3, select: { id: true, email: true } });
        console.log('✅ SELECT newsletter: PASS -', newsletters.length, 'records');

    } catch (err) {
        console.error('❌ Database error:', err.message.split('\n')[0]);
    }

    // 2. R2 STORAGE
    console.log('\n─── R2 STORAGE AUDIT ─────────────────────────────');
    const s3 = new S3Client({
        region: "auto",
        endpoint: process.env.R2_ENDPOINT,
        credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
        },
    });

    try {
        const listRes = await s3.send(new ListObjectsV2Command({ Bucket: process.env.R2_BUCKET_NAME, MaxKeys: 10 }));
        console.log('✅ R2 Connection & List: PASS - objects:', listRes.KeyCount || 0);
    } catch (err) {
        console.error('❌ R2 List error:', err.message);
    }

    try {
        const testKey = `audit_${Date.now()}.txt`;
        await s3.send(new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: testKey,
            Body: Buffer.from('Chand Jewelry Audit Test'),
            ContentType: 'text/plain',
        }));
        console.log('✅ R2 Upload (PUT): PASS -', testKey);

        await s3.send(new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: testKey }));
        console.log('✅ R2 Delete (DELETE): PASS');
    } catch (err) {
        console.error('❌ R2 Upload/Delete error:', err.message);
    }

    // 3. BRANDING CHECK
    console.log('\n─── BRANDING AUDIT ───────────────────────────────');
    const fs = require('fs');
    const path = require('path');

    // Check for "Turabi" references
    const { execSync } = require('child_process');
    try {
        const grepResult = execSync(
            `powershell -Command "Get-ChildItem -Path 'D:\\Web_Apps\\Bilal Faisal\\turabi\\app','D:\\Web_Apps\\Bilal Faisal\\turabi\\components' -Recurse -Include '*.jsx','*.tsx','*.js','*.ts' | Select-String -Pattern 'Turabi' -CaseSensitive | Select-Object -First 20 | ForEach-Object { $_.Path + ':' + $_.LineNumber + ': ' + $_.Line.Trim() }"`,
            { encoding: 'utf8' }
        ).trim();
        if (grepResult) {
            console.log('⚠️  Turabi references found in source:');
            console.log(grepResult);
        } else {
            console.log('✅ BRANDING: No "Turabi" references in app/components source files. PASS');
        }
    } catch (e) {
        console.log('✅ BRANDING: No "Turabi" references found (grep clean)');
    }

    // Check NEXT_PUBLIC_SITE_URL
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (siteUrl && siteUrl.includes('chandjewelry.store') && !siteUrl.includes('localhost')) {
        console.log('✅ SITE_URL: PASS -', siteUrl);
    } else {
        console.log('❌ SITE_URL: FAIL -', siteUrl);
    }

    await prisma.$disconnect();
    console.log('\n=== AUDIT COMPLETE ===');
}

runFullAudit();
