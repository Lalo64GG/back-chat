import 'dotenv/config';
import mongoose from 'mongoose';


const MongoDbHost = process.env['MONGODB_HOST'];
const MONGODB_DATABASE = process.env['MONGODB_DATABASE'];

const MongoUrl = `mongodb://${MongoDbHost}/${MONGODB_DATABASE}`;


mongoose.connect(MongoUrl)
    .then(db => console.log('Db is connected'))
    .catch(error => console.log(error.message))

