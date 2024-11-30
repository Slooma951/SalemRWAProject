import { MongoClient } from "mongodb";

let client;
let dbConnection;

const connectToDatabase = async () => {
    if (!dbConnection) {

            if (!client) {
                client = new MongoClient("mongodb+srv://b00149614:DwOAZ7tROreOh3at@rwa.vnkzr.mongodb.net/?retryWrites=true&w=majority&appName=RWA");
            }
            await client.connect();
            dbConnection = client.db("RWADB");
            console.log("Database connected successfully");


    }
    return dbConnection;
};

export default connectToDatabase;
