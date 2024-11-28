import connectToDatabase from "../../../lib/mongodb";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const db = await connectToDatabase();
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ success: false, message: "Username and password are required." });
            }

            const user = await db.collection("users").findOne({ username });
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(400).json({ success: false, message: "Invalid credentials." });
            }

            return res.status(200).json({
                success: true,
                message: "Login successful.",
                user: {
                    id: user._id.toString(),
                    username: user.username,
                },
            });
        } catch {
            return res.status(500).json({ success: false, message: "Internal server error." });
        }
    } else {
        return res.status(405).json({ success: false, message: "Method not allowed." });
    }
}