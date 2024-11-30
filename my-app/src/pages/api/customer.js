import connectToDatabase from "../../lib/mongodb";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const db = await connectToDatabase();
        const products = await db.collection("products").find({}).toArray();

        return res.status(200).json(products);
    }

    return res.status(405).json({ message: "Method not allowed" });
}
