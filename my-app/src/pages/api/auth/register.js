import connectToDatabase from "../../../lib/mongodb";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const db = await connectToDatabase();
            const { username, email, password } = req.body;

            // Check if email already exists
            const existingEmail = await db.collection("users").findOne({ email });
            if (existingEmail) {
                return res.status(400).json({ success: false, message: "Email already registered." });
            }

            // Check if username already exists
            const existingUsername = await db.collection("users").findOne({ username });
            if (existingUsername) {
                return res.status(400).json({ success: false, message: "Username already taken." });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await db.collection("users").insertOne({
                username,
                email,
                password: hashedPassword,
                role: "user",
            });

            res.status(201).json({ success: true, message: "User registered successfully." });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal server error." });
        }
    } else {
        res.status(405).json({ success: false, message: "Method not allowed." });
    }
}