import connectToDatabase from '../../../lib/mongodb';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const db = await connectToDatabase();
            const { firstName, lastName, username, email, password } = req.body;

            // Basic field validation
            if (!firstName || !lastName || !username || !email || !password) {
                return res.status(400).json({ success: false, message: 'All fields are required.' });
            }

            // Password strength validation
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
            if (!passwordRegex.test(password)) {
                return res.status(400).json({
                    success: false,
                    message: 'Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.',
                });
            }

            // Check if email already exists
            const existingUser = await db.collection('users').findOne({ email });
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'Email already registered.' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert user into database
            const result = await db.collection('users').insertOne({
                firstName,
                lastName,
                username,
                email,
                password: hashedPassword,
                role: 'user', // Default role
                createdAt: new Date(),
            });

            if (result.acknowledged) {
                res.status(201).json({ success: true, message: 'User registered successfully.' });
            } else {
                res.status(400).json({ success: false, message: 'Registration failed.' });
            }
        } catch (error) {
            console.error("Registration error:", error.message);
            res.status(500).json({ success: false, message: 'Internal server error.' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed.' });
    }
}
