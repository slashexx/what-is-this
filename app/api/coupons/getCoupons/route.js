import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const coupons = await db.collection('coupons')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    const formattedCoupons = coupons.map(coupon => ({
      ...coupon,
      id: coupon._id.toString()
    }));

    return NextResponse.json({ coupons: formattedCoupons });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
