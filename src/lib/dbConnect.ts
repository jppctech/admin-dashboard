import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI = process.env.MONGO_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

declare global {
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
}

global.mongoose = global.mongoose || { conn: null, promise: null };

let cached = global.mongoose;

async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) {
    console.log('db already connected')
    return cached.conn;
  }
  
  if (!cached.promise) {
    const opts = {
      // Removed deprecated options
    } as mongoose.ConnectOptions;
    
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  console.log('db connected')
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
