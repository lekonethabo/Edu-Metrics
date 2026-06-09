// "NextResponse" is a tool from Next.js that helps us send responses (like success or error messages) back to the browser.
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

//highly secure industry-standard encryption library used to scramble passwords.
import bcrypt from 'bcryptjs';

// "export" makes this function available to the Next.js router.
// "async" means "asynchronous". It tells the computer that this function will perform tasks that take time (like talking to a database) and it should wait for them to finish without freezing the whole app.
// "function POST" specifies that this function only triggers when someone sends data to this URL.
// "req: Request" means this function accepts an incoming "Request" object containing the data the user typed.
export async function POST(req: Request) {

  // "try" starts a safety net. It runs the code inside, and if anything crashes, it jumps to the "catch" block at the bottom instead of crashing your entire server.
  try {

    // "await" tells the server to pause and wait for the request data to fully download.
    // "req.json()" extracts the raw data sent by the browser and turns it into a readable JavaScript object.
    // "const { email, password }" is a shortcut called "destructuring". It grabs the 'email' and 'password' variables directly out of that data object.
    const { email, password } = await req.json();

    // "if" is a conditional check. 
    // The "!" symbol means "NOT". So this reads: "If NOT email, OR if NOT password..." (meaning if either input is blank).
    if (!email || !password) {

      // "return" stops the function immediately.
      // "NextResponse.json()" sends a structured JSON message back to the user's screen.
      // "status: 400" is the global internet standard HTTP code for "Bad Request" (the user made a mistake).
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // "const client" creates a local variable to hold our database client.
    // "await clientPromise" waits for the physical cloud connection to MongoDB Atlas to establish completely.
    const client = await clientPromise;

    // "db()" selects the specific database we defined in your cluster (our "auth_demo" bucket).
    const db = client.db();

    // "collection('users')" targets a specific folder/table inside that database where user accounts live.
    const collection = db.collection('users');

    // "await collection.findOne({ email })" tells MongoDB to search through the collection to see if a document with this exact email already exists.
    const existingUser = await collection.findOne({ email });

    // "if (existingUser)" means: if the database actually found a matching email address...
    if (existingUser) {
      // Return a 400 Bad Request error because you cannot register the same email twice.
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // "await bcrypt.hash(password, 10)" takes the plain-text password (e.g., "password123") and runs it through a mathematical scrambling engine.
    // The number "10" is the "salt rounds"—it dictates how many times the data is scrambled to ensure hackers cannot guess it.
    const hashedPassword = await bcrypt.hash(password, 10);

    // "await collection.insertOne({...})" commands MongoDB Atlas to physically insert a new item (document) into the cloud cluster.
    const result = await collection.insertOne({
      email,                  // Saves the user's email address.
      password: hashedPassword, // Saves the SCRAMBLED password, NEVER the real one!
      createdAt: new Date(),  // "new Date()" automatically grabs the exact current timestamp of the registration.
    });

    // "status: 201" is the internet standard HTTP code for "Created" (success!).
    // "result.insertedId" sends back the unique, automatic ID number MongoDB assigned to this new user.
    return NextResponse.json({ message: 'User created successfully', userId: result.insertedId }, { status: 201 });

  }
  catch (error) {
    // THIS IS OUR NEW DEBUGGING LOG:
    // It prints a clear marker line and the raw database error message right in your terminal.
    console.error('================ MONGODB CRASH LOG ================\n', error);
    console.error('===================================================');

    // This stays the same, responding cleanly to the browser
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}