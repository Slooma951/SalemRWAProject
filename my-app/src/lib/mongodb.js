import { MongoClient } from "mongodb";

let client;
let dbConnection;

async function connectToDatabase() {
    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined in the environment variables.");
    }

    if (!dbConnection) {
        try {
            if (!client) {
                client = new MongoClient(process.env.MONGODB_URI, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                });
            }

            await client.connect();
            dbConnection = client.db("RWADB");
            console.log("Database connected successfully");
        } catch (error) {
            console.error("Database connection error:", error.message);
            throw new Error("Failed to connect to the database. Please check the connection details.");
        }
    }

    return dbConnection;
}

export default connectToDatabase;
