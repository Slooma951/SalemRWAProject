import connectToDatabase from "../../lib/mongodb";

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const { userId, username, email, items, status } = req.body;

            if (!userId || !username || !email || !items || !status) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields (userId, username, email, items, or status).",
                });
            }

            const db = await connectToDatabase();
            const ordersCollection = db.collection("orders");

            const order = {
                userId,
                username,
                email,
                items,
                status,
                createdAt: new Date(),
            };

            const result = await ordersCollection.insertOne(order);

            if (result.acknowledged) {
                return res.status(200).json({ success: true, message: "Order placed successfully." });
            } else {
                return res.status(500).json({ success: false, message: "Failed to place order." });
            }
        } catch (error) {
            console.error("Error placing order:", error.message);
            return res.status(500).json({ success: false, message: "Internal server error." });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ success: false, message: `Method ${req.method} not allowed.` });
    }
}
