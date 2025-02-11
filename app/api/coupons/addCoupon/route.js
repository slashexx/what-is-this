import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { db } = await connectToDatabase();
    const data = await req.json();
    
    if (!data.couponTitle || !data.discount || !data.minPrice) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await db.collection('coupons').insertOne({
      ...data,
      status: 'Active',
      createdAt: new Date(),
      timesUsed: 0
    });

    return NextResponse.json({
      success: true,
      data: { id: result.insertedId, ...data }
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
