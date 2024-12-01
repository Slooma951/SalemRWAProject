import connectToDatabase from "../../../lib/mongodb";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
    const db = await connectToDatabase();
    const { username, email, password } = req.body;

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
    });

    res.status(200).json({ success: true, message: "User registered successfully." });
}
