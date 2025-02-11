import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI!;
const dbName = "test";

async function fetchUserById(userId) {
  const client = await MongoClient.connect(uri);

  try {
    const db = client.db(dbName);
    const user = await db.collection("users").findOne({ userId: userId });
    
    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      userId: user.userId,
      name: user.name,
      email: user.email,
      country: user.country?.label || "N/A",
      language: user.language?.label || "N/A",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      subscription: user.subscription,
      apiKey: user.apiKey,
      status: user.status,
    };
  } finally {
    client.close();
  }
}

export async function GET(request, { params }) {
  const { userId } = params;

  try {
    const user = await fetchUserById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { userId: string } }) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const { userId } = params;
    const updateData = await request.json();

    const result = await db.collection("users").updateOne(
      { userId: userId }, 
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedUser = await db.collection("users").findOne({ userId: userId });

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await client.close();
  }
}
