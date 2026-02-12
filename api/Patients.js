const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI; // سنقوم بضبط هذا المتغير في Vercel لاحقاً
const client = new MongoClient(uri);

export default async function handler(req, res) {
    try {
        await client.connect();
        const database = client.db('clinic_db');
        const patients = database.collection('patients');

        if (req.method === 'GET') {
            const allPatients = await patients.find({}).toArray();
            return res.status(200).json(allPatients);
        }

        if (req.method === 'POST') {
            const newPatient = req.body;
            const result = await patients.insertOne(newPatient);
            return res.status(201).json(result);
        }
    } catch (error) {
        res.status(500).json({ error: 'حدث خطأ في الاتصال بقاعدة البيانات' });
    }
}
