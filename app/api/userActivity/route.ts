import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

async function fetchUserActivities() {
  try {
    const { db } = await connectToDatabase();
    const activities = await db.collection("useractivities").find().toArray();

    return activities.map((activity) => {
      // Get the most recent activity log
      const latestLog = activity.activityLogs?.[activity.activityLogs.length - 1];
      
      return {
        _id: activity._id.toString(),
        userId: activity.userId,
        apiKey: activity.apiKey,
        name: activity.name,
        location: activity.location,
        language: activity.language,
        totalRequests: activity.totalRequests || 0,
        // Use the latest activity log timestamp
        lastActivity: latestLog?.timestamp || activity.updatedAt || activity.createdAt,
        // Use the actual activity type from logs
        activityType: latestLog?.activityType || 'No activity',
        activityLogs: activity.activityLogs || [],
        createdAt: activity.createdAt,
        updatedAt: activity.updatedAt
      };
    });
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
}

export async function GET() {
  try {
    const activities = await fetchUserActivities();
    return NextResponse.json({ activities });
  } catch (error) {
    console.error("Error in GET /api/userActivity:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch user activities",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
