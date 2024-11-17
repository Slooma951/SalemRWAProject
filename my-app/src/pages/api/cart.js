import connectToDatabase from "../../lib/mongodb";

export default async function handler(req, res) {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("shopping_cart");

        if (req.method === "GET") {
            // Retrieve cart items
            const { userId } = req.query;

            if (!userId) {
                return res.status(400).json({ success: false, message: "User ID is required." });
            }

            const cartItems = await collection.find({ userId }).toArray();
            return res.status(200).json({ success: true, cartItems });
        } else if (req.method === "POST") {
            // Add item to cart
            const { pname, price, userId, quantity = 1 } = req.body;

            if (!pname || !price || !userId) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields (pname, price, or userId).",
                });
            }

            const existingItem = await collection.findOne({ userId, pname });
            if (existingItem) {
                // Update quantity if item already exists
                const updatedResult = await collection.updateOne(
                    { userId, pname },
                    { $inc: { quantity } }
                );

                if (updatedResult.modifiedCount > 0) {
                    return res.status(200).json({
                        success: true,
                        message: "Cart item quantity updated successfully.",
                    });
                } else {
                    return res.status(500).json({
                        success: false,
                        message: "Failed to update item quantity.",
                    });
                }
            } else {
                // Add new item to cart
                const cartItem = { pname, price, userId, quantity, addedAt: new Date() };
                const result = await collection.insertOne(cartItem);

                if (result.acknowledged) {
                    return res.status(200).json({
                        success: true,
                        message: "Item added to cart successfully.",
                    });
                } else {
                    return res.status(500).json({
                        success: false,
                        message: "Failed to add item to the cart.",
                    });
                }
            }
        } else if (req.method === "DELETE") {
            // Remove item from cart
            const { userId, pname } = req.body;

            if (!userId || !pname) {
                return res.status(400).json({
                    success: false,
                    message: "User ID and product name are required.",
                });
            }

            const result = await collection.deleteOne({ userId, pname });

            if (result.deletedCount > 0) {
                return res.status(200).json({
                    success: true,
                    message: "Item removed from cart successfully.",
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: "Item not found in cart.",
                });
            }
        } else {
            // Unsupported method
            res.setHeader("Allow", ["GET", "POST", "DELETE"]);
            return res.status(405).json({
                success: false,
                message: `Method ${req.method} not allowed.`,
            });
        }
    } catch (error) {
        console.error("Cart API error:", error.message);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}
