import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(req) {
  try {
    const { db } = await connectToDatabase();
    const { couponID } = await req.json();

    if (!couponID) {
      return NextResponse.json(
        { error: "Coupon ID is required" },
        { status: 400 }
      );
    }

    const result = await db.collection('coupons').deleteOne({
      _id: new ObjectId(couponID)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Coupon not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Coupon deleted successfully"
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
