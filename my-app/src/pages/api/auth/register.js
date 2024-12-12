import connectToDatabase from "../../../lib/mongodb";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, message: "Method not allowed." });
    }

    try {
        const db = await connectToDatabase();
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters long." });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format." });
        }

        // Check if email is already registered
        const existingEmail = await db.collection("users").findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ success: false, message: "Email already registered." });
        }

        // Check if username is already taken
        const existingUsername = await db.collection("users").findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ success: false, message: "Username already taken." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        await db.collection("users").insertOne({
            username,
            email,
            password: hashedPassword,
            role: "user",
            createdAt: new Date(),
        });

        res.status(200).json({ success: true, message: "User registered successfully." });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ success: false, message: "An error occurred. Please try again later." });
    }
}
