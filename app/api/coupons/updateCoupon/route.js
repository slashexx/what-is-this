import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PATCH(req) {
  try {
    const { db } = await connectToDatabase();
    const { couponID, updatedFields } = await req.json();

    const result = await db.collection('coupons').updateOne(
      { _id: new ObjectId(couponID) },
      { $set: updatedFields }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Coupon not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
