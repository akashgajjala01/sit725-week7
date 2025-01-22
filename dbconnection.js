const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://akash:Akash%40123@cluster0.oybkw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


let client;
let collection;


const connectDatabase = async () => {
    try {
        
        client = await MongoClient.connect(uri);
        console.log("Connected to MongoDB");

        
        collection = client.db().collection('tech'); 

        
        const count = await collection.countDocuments();
        if (count === 0) {
            await collection.insertMany([
                {
                    title: "javascript",
                    image: "images/javascript.jpeg",
                    link: "About JavaScript",
                    description: "JavaScript is the programming language of the Web."
                },
                {
                    title: "CSS",
                    image: "images/css,jpeg",
                    link: "About CSS",
                    description: "CSS is the language we use to style an HTML document."
                }
            ]);
            console.log("data added into MongoDB");
        }
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error; 
    }
};


const getClient = () => {
    if (!client) {
        throw new Error('MongoDB connection not established');
    }
    return client;
};

module.exports = { connectDatabase, getClient };