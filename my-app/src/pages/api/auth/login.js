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
            if (!user) {
                return res.status(400).json({ success: false, message: "Invalid credentials." });
            }


            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                return res.status(400).json({ success: false, message: "Invalid credentials." });
            }

            const role = user.role || "user";

            return res.status(200).json({
                success: true,
                message: "Login successful.",
                user: {
                    id: user.userId || user._id.toString(),
                    username: user.username,
                    email: user.email,
                    role: role,
                },
            });
        } catch (error) {
            console.error("Login API Error:", error.message);
            return res.status(500).json({ success: false, message: "Internal server error." });
        }
    } else {
        // Handle unsupported methods
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ success: false, message: `Method ${req.method} not allowed.` });
    }
}
