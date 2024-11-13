// src/pages/api/customer.js

export default function handler(req, res) {
    if (req.method === 'GET') {
        res.status(200).json({ message: 'Welcome to the customer page!' });
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
