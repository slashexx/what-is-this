import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';

// Define the Query Schema
const querySchema = new mongoose.Schema({
  queryId: { type: String, required: true, unique: true },
  userID: { type: String, required: true },
  queryDate: { type: Date, default: Date.now },
  username: { type: String, required: true },
  userEmail: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, required: true }
});

// Create or get the model
const Query = mongoose.models.Query || mongoose.model('Query', querySchema);

export async function GET() {
    try {
        await connectToDatabase();
        const queries = await Query.find({}).sort({ queryDate: -1 });
        return NextResponse.json({ queries }, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch queries:", error);
        return NextResponse.json({ error: "Failed to fetch queries" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const body = await request.json();
        
        const newQuery = new Query({
            queryId: `Q${Date.now()}`, // Generate a unique query ID
            userID: body.userID,
            queryDate: new Date(),
            username: body.username,
            userEmail: body.userEmail,
            category: body.category,
            status: 'Opened' // Default status for new queries
        });

        await newQuery.save();
        return NextResponse.json({ query: newQuery }, { status: 201 });
    } catch (error) {
        console.error("Failed to create query:", error);
        return NextResponse.json({ error: "Failed to create query" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        await connectToDatabase();
        const { queryId, status } = await request.json();

        const updatedQuery = await Query.findOneAndUpdate(
            { queryId },
            { status },
            { new: true }
        );

        if (!updatedQuery) {
            return NextResponse.json({ error: "Query not found" }, { status: 404 });
        }

        return NextResponse.json({ query: updatedQuery }, { status: 200 });
    } catch (error) {
        console.error("Failed to update query:", error);
        return NextResponse.json({ error: "Failed to update query" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const queryId = searchParams.get('queryId');

        if (!queryId) {
            return NextResponse.json({ error: "Query ID is required" }, { status: 400 });
        }

        const deletedQuery = await Query.findOneAndDelete({ queryId });

        if (!deletedQuery) {
            return NextResponse.json({ error: "Query not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Query deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Failed to delete query:", error);
        return NextResponse.json({ error: "Failed to delete query" }, { status: 500 });
    }
}
