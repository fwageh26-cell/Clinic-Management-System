const { MongoClient } = require('mongodb');

// استخدام متغير البيئة الذي أضفته في Vercel
const uri = process.env.MONGODB_URI;
let cachedClient = null;

export default async function handler(req, res) {
    if (!uri) {
        return res.status(500).json({ error: "MONGODB_URI is not defined" });
    }

    try {
        if (!cachedClient) {
            cachedClient = new MongoClient(uri);
            await cachedClient.connect();
        }
        
        const db = cachedClient.db('clinic_db');
        const collection = db.collection('patients');

        if (req.method === 'POST') {
            const result = await collection.insertOne(req.body);
            return res.status(200).json(result);
        } else if (req.method === 'GET') {
            const patients = await collection.find({}).toArray();
            return res.status(200).json(patients);
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "فشل الاتصال بـ MongoDB: " + e.message });
    }
}
