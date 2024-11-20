import connectToDatabase from "../../lib/mongodb";

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const { userId } = req.query;

            if (!userId) {
                return res.status(400).json({ success: false, message: "User ID is required." });
            }

            const db = await connectToDatabase();
            const ordersCollection = db.collection("orders");

            // Find all orders for the logged-in user
            const userOrders = await ordersCollection.find({ userId }).toArray();

            if (userOrders.length === 0) {
                return res.status(404).json({ success: false, message: "No orders found for this user." });
            }

            res.status(200).json({ success: true, orders: userOrders });
        } catch (error) {
            console.error("Error fetching user orders:", error.message);
            res.status(500).json({ success: false, message: "Internal server error." });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).json({ success: false, message: `Method ${req.method} not allowed.` });
    }
}
