import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI!;
const dbName = "test";

async function fetchUsers() {
  const client = await MongoClient.connect(uri);

  try {
    const db = client.db(dbName);
    const users = await db.collection("users").find().toArray();
    let count = 1;

    return users.map((user) => ({
      index: count++, // Index of the user
      id: user._id.toString(), // MongoDB ObjectId as a string
      name: user.name, // User's name
      email: user.email, // User's email
      userId: user.userId, // Unique user ID
      country: user.country?.label || "N/A", // Country label
      language: user.language?.label || "N/A", // Language label
      createdAt: user.createdAt, // Creation date
      updatedAt: user.updatedAt, // Last updated date
      subscription: user.subscription, // Subscription type
      apiKey: user.apiKey, // API Key
      status: user.status, // User status
    }));
  } finally {
    client.close();
  }
}

export async function GET() {
  try {
    const users = await fetchUsers();
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
