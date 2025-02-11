import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { db } = await connectToDatabase();
    const data = await request.json(); // Expect JSON data with Firebase URLs
    
    const blogData = {
      ...data,
      createdAt: new Date()
    };

    const result = await db.collection("blogs").insertOne(blogData);
    
    return NextResponse.json({ 
      success: true, 
      data: { ...blogData, _id: result.insertedId }
    });

  } catch (error) {
    console.error('Blog creation error:', error);
    return NextResponse.json(
      { success: false, error: error.message }, 
      { status: 500 }
    );
  }
}
