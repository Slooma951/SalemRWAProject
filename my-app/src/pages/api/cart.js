import connectToDatabase from "../../lib/mongodb";

export default async function handler(req, res) {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("shopping_cart");

        if (req.method === "GET") {
            const { userId } = req.query;
            if (!userId) return res.status(400).json({ success: false, message: "User ID is required." });

            const cartItems = await collection.find({ userId }).toArray();
            return res.status(200).json({ success: true, cartItems });
        }

        if (req.method === "POST") {
            const { pname, price, userId, quantity = 1 } = req.body;
            if (!pname || !userId) return res.status(400).json({ success: false, message: "Missing required fields." });

            const existingItem = await collection.findOne({ userId, pname });
            if (existingItem) {
                await collection.updateOne({ userId, pname }, { $inc: { quantity } });
            } else {
                await collection.insertOne({ pname, price, userId, quantity });
            }
            return res.status(200).json({ success: true });
        }

        if (req.method === "DELETE") {
            const { userId, pname } = req.body;
            if (!userId) return res.status(400).json({ success: false, message: "User ID is required." });

            if (pname) await collection.deleteOne({ userId, pname });
            else await collection.deleteMany({ userId });

            return res.status(200).json({ success: true });
        }

        return res.status(405).json({ success: false, message: "Method not allowed." });
    } catch {
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}