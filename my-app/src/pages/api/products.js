// src/pages/api/Product.js
import connectToDatabase from '../../lib/mongodb';

export default async function handler(req, res) {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("products");

        if (req.method === "GET") {
            // Fetch all products
            const products = await collection.find({}).toArray();
            return res.status(200).json(products);
        } else if (req.method === "POST") {
            // Add a new product
            const { name, description, image, price } = req.body;

            // Validation
            if (!name || !price) {
                return res.status(400).json({ message: "Name and Price are required." });
            }

            const newProduct = {
                name,
                description: description || "",
                image: image || "/placeholder.png",
                price: parseFloat(price),
            };

            const result = await collection.insertOne(newProduct);

            if (result.acknowledged) {
                return res.status(201).json({ message: "Product added successfully." });
            } else {
                return res.status(500).json({ message: "Failed to add product." });
            }
        } else {
            res.setHeader("Allow", ["GET", "POST"]);
            return res.status(405).json({ message: `Method ${req.method} not allowed.` });
        }
    } catch (error) {
        console.error("Error handling products API:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}
