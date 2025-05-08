// This is a simple helper to handle the port configuration
// for both local development and Render deployment

// Render will set the PORT environment variable
// In development, we default to 5000
export const PORT = process.env.PORT || 5000;

// Log the port configuration
console.log(`Server configured to listen on port: ${PORT}`);

// Export just the port number for easy imports
export default PORT;