const { MongoClient, ObjectId } = require('mongodb');

// docker run --name some-mongo -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password -p 27017:27017 -d mongo
// points-mongo

const URI = `mongodb://admin:password@localhost:27017/?maxPoolSize=20&w=majority`;

const client = new MongoClient(URI);
const database = client.db('points');

export { ObjectId };

export const User = database.collection('users');
export const Subscription = database.collection('subscriptions');

client.connect().catch((error) => {
    console.error(error);
    process.exit(1);
});
