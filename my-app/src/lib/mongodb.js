import { MongoClient } from "mongodb";
let client;
let dbConnection;
const connectToDatabase = async () => {
    if (!process.env.MONGODB_URI) {
        throw new Error("Missing MONGODB_URI environment variable.");
    }
    if (!dbConnection) {
        try {
            client = client || new MongoClient("mongodb+srv://b00149614:DwOAZ7tROreOh3at@cluster0.mongodb.net/RWADB?retryWrites=true&w=majority&appName=AtlasApp\n");
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


//MongoDBURI=mongodb+srv://b00149614:DwOAZ7tROreOh3at@cluster0.mongodb.net/RWADB?retryWrites=true&w=majority&appName=AtlasApp
