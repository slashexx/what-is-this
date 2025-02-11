import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const team = await db.collection('admin').find({}).toArray();
    const teamWithoutPasswords = team.map(({ password, ...rest }) => rest);
    return NextResponse.json(teamWithoutPasswords);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch team' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { email, password, name, role } = await request.json();
    const { db } = await connectToDatabase();

    // Check if user already exists
    const existingUser = await db.collection('admin').findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate unique admin ID with timestamp and random suffix
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const adminId = `AID${timestamp}${randomSuffix}`;

    const newTeamMember = {
      email,
      password: hashedPassword,
      name,
      role,
      status: 'Active', // Always Active
      createdAt: new Date(),
      userID: adminId
    };

    await db.collection('admin').insertOne(newTeamMember);
    const { password: _, ...memberWithoutPassword } = newTeamMember;

    return NextResponse.json({
      user: memberWithoutPassword,
      message: 'Team member added successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Add team member error:', error);
    return NextResponse.json(
      { message: 'Failed to add team member' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { userID, name, role } = await request.json();
    const { db } = await connectToDatabase();

    const result = await db.collection('admin').updateOne(
      { userID },
      { 
        $set: {
          name,
          role,
          status: 'Active', // Always Active
          updatedAt: new Date()
        }
      }
    );

    if (!result.matchedCount) {
      return NextResponse.json(
        { message: 'Team member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Updated successfully' });

  } catch (error) {
    console.error('Update team member error:', error);
    return NextResponse.json(
      { message: 'Failed to update team member' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { userID } = await request.json();
    const { db } = await connectToDatabase();

    const result = await db.collection('admin').deleteOne({ userID });

    if (!result.deletedCount) {
      return NextResponse.json(
        { message: 'Team member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Deleted successfully' });

  } catch (error) {
    console.error('Delete team member error:', error);
    return NextResponse.json(
      { message: 'Failed to delete team member' },
      { status: 500 }
    );
  }
}
