import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { GridFSBucket } from "mongodb";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image');

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'No image provided' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const bucket = new GridFSBucket(db);

    const buffer = await image.arrayBuffer();
    const uploadStream = bucket.openUploadStream(image.name || 'untitled');

    await new Promise((resolve, reject) => {
      uploadStream.end(Buffer.from(buffer), (error) => {
        if (error) reject(error);
        resolve();
      });
    });

    return NextResponse.json({
      success: true,
      imageId: uploadStream.id.toString()
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
