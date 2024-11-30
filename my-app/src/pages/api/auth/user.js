import connectToDatabase from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ success: false, message: "Method not allowed." });
    }

    const { userId } = req.query;
    if (!userId) return res.status(400).json({ success: false, message: "User ID is required." });

    const db = await connectToDatabase();
    const user = await db.collection("users").findOne({
        _id: ObjectId.isValid(userId) ? new ObjectId(userId) : null,
    });

    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    res.status(200).json({
        success: true,
        username: user.username,
        email: user.email,
        role: user.role,
    });
}
