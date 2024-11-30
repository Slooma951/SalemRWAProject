import connectToDatabase from "../../lib/mongodb";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { isManager } = req.query;

        const db = await connectToDatabase();
        const ordersCollection = db.collection("orders");

        if (isManager === "true") {
            const orders = await ordersCollection.find().toArray();
            return res.status(200).json({ success: true, orders });
        }

        return res.status(400).json({ success: false, message: "Unauthorized access." });
    }

    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, message: `Method ${req.method} not allowed.` });
}
