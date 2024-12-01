import { MongoClient } from "mongodb";

let client;
let dbConnection;

const connectToDatabase = async () => {
    if (!dbConnection) {

            if (!client) {
                client = new MongoClient(process.env.MONGODB_URI);
            }
            await client.connect();
            dbConnection = client.db("RWADB");
            console.log("Database connected successfully");


    }
    return dbConnection;
};

export default connectToDatabase;
