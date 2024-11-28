import connectToDatabase from '../../lib/mongodb';

export default async function handler(req, res) {
    try {
        const db = await connectToDatabase();
        const productsCollection = db.collection("products");

        if (req.method === "GET") {

            const products = await productsCollection.find({}).toArray();
            return res.status(200).json({ success: true, products });
        } else {
            res.setHeader("Allow", ["GET"]);
            return res.status(405).json({ message: `Method ${req.method} not allowed` });
        }
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}