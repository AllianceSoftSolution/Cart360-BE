// BACKEND/api/index.js
// Vercel serverless entry point

import dotenv from 'dotenv';
dotenv.config();

import app from '../src/app.js';
import connectDB from '../src/config/db.js';

// Cache the DB connection across serverless invocations
let isConnected = false;

export default async function handler(req, res) {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  return app(req, res);
}
