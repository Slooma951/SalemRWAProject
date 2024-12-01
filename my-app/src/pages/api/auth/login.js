import connectToDatabase from "../../../lib/mongodb";

export default async function handler(req, res) {
    const db = await connectToDatabase();
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Username and password are required." });
    }

    // Find the user by username
    const user = await db.collection("users").findOne({ username });
    if (!user) {
        return res.status(400).json({ success: false, message: "Invalid username or password." });
    }

    return res.status(200).json({
        success: true,
        message: "Login successful.",
        user: {
            id: user._id.toString(),
            username: user.username,
        },
    });
}
