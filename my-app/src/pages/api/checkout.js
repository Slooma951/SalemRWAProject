import connectToDatabase from "../../lib/mongodb";

export default async function handler(req, res) {
    if (req.method === "POST") {

        const {userId, items, username, email} = req.body;

        if (!userId || !items) {
            return res.status(400).json({success: false, message: "Missing required fields."});
        }

        const db = await connectToDatabase();
        const result = await db.collection("orders").insertOne({
            userId,
            username,
            email,
            items,
            createdAt: new Date(),
        });

        return result.acknowledged
            ? res.status(200).json({success: true, message: "Order placed successfully."})
            : res.status(500).json({success: false, message: "Failed to place order."});
    } else {
        return res.status(405).json({success: false, message: "Method not allowed."});
    }
}