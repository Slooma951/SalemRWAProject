import connectToDatabase from "../../../lib/mongodb";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const db = await connectToDatabase();
            const { username, password } = req.body;

            // Validate input fields
            if (!username || !password) {
                return res.status(400).json({ success: false, message: "Username and password are required." });
            }

            // Check if user exists in the database
            const user = await db.collection("users").findOne({ username });
            if (!user) {
                return res.status(400).json({ success: false, message: "Invalid credentials." });
            }

            // Verify the hashed password
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                return res.status(400).json({ success: false, message: "Invalid credentials." });
            }

            // Return success response with user information (excluding sensitive fields)
            return res.status(200).json({
                success: true,
                message: "Login successful.",
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role || "user", // Include the role if available
                },
            });
        } catch (error) {
            console.error("Login API Error:", error);
            return res.status(500).json({ success: false, message: "Internal server error." });
        }
    } else {
        // Handle unsupported HTTP methods
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ success: false, message: `Method ${req.method} not allowed.` });
    }
}
