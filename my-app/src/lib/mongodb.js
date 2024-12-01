import { MongoClient } from "mongodb";

let client;
let dbConnection;

const connectToDatabase = async () => {
    try {
        if (!dbConnection) {
            if (!client) {
                // Initialize the MongoClient only if it does not already exist
                client = new MongoClient(process.env.MONGODB_URI, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                });
            }

            // Attempt connection
            await client.connect();

            // Connect to the database
            dbConnection = client.db("RWADB");
            console.log("Database connected successfully");
        }
        return dbConnection;
    } catch (error) {
        console.error("Failed to connect to the database:", error);
        throw new Error("Database connection error");
    }
};

export default connectToDatabase;
