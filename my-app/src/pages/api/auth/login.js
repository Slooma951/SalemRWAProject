import connectToDatabase from '../../../lib/mongodb';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const db = await connectToDatabase();
            const { username, password } = req.body;

            // Basic validation
            if (!username || !password) {
                return res.status(400).json({ success: false, message: 'Both username and password are required.' });
            }

            // Check if the user exists
            const user = await db.collection('users').findOne({ username });
            if (!user) {
                return res.status(400).json({ success: false, message: 'Invalid username or password.' });
            }

            // Verify the password
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                return res.status(400).json({ success: false, message: 'Invalid username or password.' });
            }

            res.status(200).json({ success: true, message: 'Login successful.' });
        } catch (error) {
            console.error("Login error:", error.message);
            res.status(500).json({ success: false, message: 'Internal server error.' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed.' });
    }
}
