const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
let client;

module.exports = async (req, res) => {
    // التأكد من وجود رابط الاتصال
    if (!uri) return res.status(500).json({ error: "MONGODB_URI missing" });

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
