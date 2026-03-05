const { Client } = require('pg');

async function testConnection(url) {
    const client = new Client({
        connectionString: url,
    });
    try {
        await client.connect();
        const res = await client.query('SELECT NOW()');
        console.log(`Success with: ${url} at ${res.rows[0].now}`);
        await client.end();
        return true;
    } catch (err) {
        console.error(`Failed for: ${url} - Error: ${err.message}`);
        return false;
    }
}

async function runTests() {
    const pass = "H9MH.*vy9%25vs3iX"; // encoded
    const passRaw = "H9MH.*vy9%vs3iX";
    const ref = "ytivyldglecdnhkvrevd";

    const urls = [
        `postgres://postgres.${ref}:${pass}@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres`,
        `postgres://postgres:${pass}@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres`,
        `postgres://postgres.${ref}:${pass}@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres`,
        `postgres://postgres:${passRaw}@db.${ref}.supabase.co:5432/postgres`
    ];

    for (const url of urls) {
        console.log(`Testing... ${url.replace(pass, '***').replace(passRaw, '***')}`);
        await testConnection(url);
    }
}

runTests();
