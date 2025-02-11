import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Create Coupon
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

    const newCoupon = await db.collection('coupons').findOne({ _id: result.insertedId });

    return NextResponse.json({
      success: true,
      data: { id: result.insertedId, ...newCoupon }
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Get All Coupons
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

    return NextResponse.json({ 
      success: true,
      coupons: formattedCoupons
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Update Coupon
export async function PUT(req) {
  try {
    const { db } = await connectToDatabase();
    const { couponID, updatedFields } = await req.json();

    if (!couponID || !updatedFields) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

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

    return NextResponse.json({
      success: true,
      message: "Coupon updated successfully"
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Delete Coupon
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
    console.error('API Error:', error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
