import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

// This is still a POST request because the login page needs to "post" sensitive credentials safely to the backend.
export async function POST(req: Request) {
    try {
        // Unpack the email and password the user typed into the login boxes.
        const { email, password } = await req.json();

        // Standard safety check: Make sure they didn't hit submit with empty inputs.
        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        // Wait for the server to establish a connection to your MongoDB Atlas cluster.
        const client = await clientPromise;
        const db = client.db();

        // Look up the user in the "users" collection by checking their email address.
        const user = await db.collection('users').findOne({ email });

        // "if (!user)" means: If the database returned absolutely nothing (the email is not registered).
        if (!user) {
            // "status: 401" is the internet standard HTTP code for "Unauthorized" (wrong username or password).
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        // "await bcrypt.compare(password, user.password)" is a special security tool.
        // It takes the plain password typed into the login box, scrambles it using the exact same math blueprint, and checks if it matches the scrambled hash inside the database ("user.password").
        // It returns true if they match, and false if they don't.
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            // Deny entry with a 401 Unauthorized code.
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        // If both the email exists AND the password is correct, the code reaches this line.
        // "status: 200" is the standard HTTP code for "OK" (successful operation).
        return NextResponse.json({
            message: 'Login successful',
            user: { id: user._id, email: user.email }
        }, { status: 200 });

    } catch (error) {
        // Catches any unexpected code crashes and responds cleanly.
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}