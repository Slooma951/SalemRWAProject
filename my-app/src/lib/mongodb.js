import { MongoClient } from "mongodb";
let client;
let dbConnection;
const connectToDatabase = async () => {
    if (!process.env.MONGODB_URI) {
        throw new Error("Missing MONGODB_URI environment variable.");
    }
    if (!dbConnection) {
        try {
            client = client || new MongoClient(process.env.MONGODB_URI);
            await client.connect();
            dbConnection = client.db("RWADB");
            console.log("Database connected successfully");
        } catch (error) {
            console.error("Failed to connect to the database:", error.message);
            throw error;
        }
    }
    return dbConnection;
};
export default connectToDatabase;
