const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
let client;

module.exports = async (req, res) => {
    // إعدادات الـ CORS للسماح بالاتصال
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        if (!client) {
            client = new MongoClient(uri);
            await client.connect();
        }
        const db = client.db('clinic_db');
        const collection = db.collection('patients');

        if (req.method === 'POST') {
            await collection.insertOne(req.body);
            return res.status(200).json({ success: true });
        } else {
            const data = await collection.find({}).toArray();
            return res.status(200).json(data);
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
