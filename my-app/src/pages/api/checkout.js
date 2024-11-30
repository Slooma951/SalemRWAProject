import connectToDatabase from "../../lib/mongodb";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { userId, items, email } = req.body;

        // Validate required fields
        if (!userId || !items || !email) {
            return res.status(400).json({ success: false, message: "Missing required fields." });
        }

        // Connect to database
        const db = await connectToDatabase();
        const result = await db.collection("orders").insertOne({
            userId,
            items,
            createdAt: new Date(),
        });

        if (!result.acknowledged) {
            return res.status(500).json({ success: false, message: "Failed to place order." });
        }

        // Prepare email content
        const emailContent = `
            <h1>Order Confirmation</h1>
            <p>Thank you for your purchase!</p>
            <p><strong>Order Details:</strong></p>
            <ul>
                ${items.map(item => `<li>${item.name} - Quantity: ${item.quantity} - $${item.price}</li>`).join("")}
            </ul>
            <p>Total: $${items.reduce((total, item) => total + item.price * item.quantity, 0)}</p>
        `;

        // Configure email transporter
        const transporter = nodemailer.createTransport({
            service: "gmail", // or another provider
            auth: {
                user: process.env.EMAIL_USERNAME, // Your email address
                pass: process.env.EMAIL_PASSWORD, // Your email app password
            },
        });

        try {
            // Send email
            await transporter.sendMail({
                from: `"Your Store" <${process.env.EMAIL_USERNAME}>`, // Sender address
                to: email, // Customer email
                subject: "Order Confirmation", // Subject line
                html: emailContent, // Email body
            });

            return res.status(200).json({ success: true, message: "Order placed and email sent successfully." });
        } catch (error) {
            console.error("Error sending email:", error);
            return res.status(500).json({ success: false, message: "Order placed, but failed to send confirmation email." });
        }
    }

    // Method not allowed
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, message: "Method not allowed." });
}
