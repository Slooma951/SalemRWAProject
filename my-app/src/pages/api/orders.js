import connectToDatabase from "../../lib/mongodb";

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const { userId, isManager } = req.query;

            const db = await connectToDatabase();
            const ordersCollection = db.collection("orders");

            if (isManager === "true") {
                const orders = await ordersCollection.find().toArray();
                const totalOrders = orders.length;
                const totalRevenue = orders.reduce((sum, order) => {
                    const orderTotal = order.items.reduce(
                        (itemSum, item) => itemSum + item.price * item.quantity,
                        0
                    );
                    return sum + orderTotal;
                }, 0);

                return res.status(200).json({
                    success: true,
                    totalOrders,
                    totalRevenue,
                });
            }

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: "User ID is required.",
                });
            }

            const userOrders = await ordersCollection.find({ userId }).toArray();

            if (userOrders.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "No orders found for this user.",
                });
            }

            res.status(200).json({ success: true, orders: userOrders });
        } catch (error) {
            console.error("Error fetching orders:", error.message);
            res.status(500).json({
                success: false,
                message: "Internal server error.",
            });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        return res
            .status(405)
            .json({ success: false, message: `Method ${req.method} not allowed.` });
    }
}
