import connectToDatabase from "../../lib/mongodb";

export default async function handler(req, res) {
    const db = await connectToDatabase();
    const productsCollection = db.collection("products");

    if (req.method === "GET") {
        const products = await productsCollection.find({}).toArray();
        return res.status(200).json({ success: true, products });
    }

    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
}
