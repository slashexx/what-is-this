import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req, { params }) {
  try {
    const { db } = await connectToDatabase();
    const bucket = new GridFSBucket(db);
    
    const file = await bucket.find({ _id: new ObjectId(params.id) }).next();
    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const stream = bucket.openDownloadStream(new ObjectId(params.id));
    return new NextResponse(stream);
  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
