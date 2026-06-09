// This tells Next.js that this page runs on the user's browser (Client Component), 
// which is required whenever we use interactive things like forms, buttons, or state variables.
'use client';

// "useState" is a React hook that lets our page remember information that changes,
// like what the user typed into the input boxes or error messages from the server.
import { useState } from 'react';

export default function RegisterPage() {
  // Set up "state variables" to hold user inputs and display messages.
  // "email" stores the text, "setEmail" is the function we use to update that text.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // This function runs automatically when the user clicks the "Sign Up" submit button.
  // "e: React.FormEvent" is the form submission event object.
  const handleSubmit = async (e: React.FormEvent) => {
    // "preventDefault" stops the browser from refreshing the whole page (the old-school HTML behavior).
    e.preventDefault();
    setMessage('Processing...'); // Give the user instant visual feedback

    // "fetch" sends an HTTP network request across your machine to our backend API route.
    const response = await fetch('/api/auth/register', {
      method: 'POST', // We use POST because we are sending sensitive data
      headers: { 'Content-Type': 'application/json' }, // Tell the server the data is in JSON format
      body: JSON.stringify({ email, password }), // Convert our variables into a raw text string
    });

    // Wait for the backend server to respond and parse its JSON message.
    const data = await response.json();

    // "response.ok" checks if the HTTP status code is a success code (like 201 Created).
    if (response.ok) {
      setMessage('Registration successful! You can now log in.');
      setEmail('');    // Clear out the email box
      setPassword(''); // Clear out the password box
    } else {
      // If the backend threw an error (like "User already exists"), show it here.
      setMessage(data.error || 'Something went wrong.');
    }
  };

  return (
    // Tailwind styling: Centers the form perfectly on the screen with a light gray background
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-black">
      {/* The form calls our handleSubmit function when submitted */}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create an Account</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            // "onChange" fires every single time you type a letter, updating our React memory state instantly.
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-black"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-black"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded transition duration-200"
        >
          Sign Up
        </button>

        {/* If the message state is not empty, display it to the user here */}
        {message && (
          <p className="mt-4 text-sm text-center font-medium text-blue-600">{message}</p>
        )}
      </form>
    </div>
  );
}
