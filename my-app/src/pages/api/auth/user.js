import connectToDatabase from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    try {
        if (req.method === "GET") {
            const { userId } = req.query;

            if (!userId) {
                return res.status(400).json({ success: false, message: "User ID is required." });
            }

            const db = await connectToDatabase();
            const usersCollection = db.collection("users");


            const user = await usersCollection.findOne({
                $or: [
                    { userId: userId },
                    { _id: ObjectId.isValid(userId) ? new ObjectId(userId) : undefined },
                ],
            });

            if (!user) {
                return res.status(404).json({ success: false, message: "User not found." });
            }

            res.status(200).json({
                success: true,
                username: user.username,
                email: user.email,
                role: user.role,
            });
        } else {
            res.setHeader("Allow", ["GET"]);
            return res.status(405).json({ success: false, message: `Method ${req.method} not allowed.` });
        }
    } catch (error) {
        console.error("Error fetching user:", error.message);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}
