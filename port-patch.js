// This file is used to patch the server to listen on the correct port
// It will be copied to the dist directory during build

// Store the original listen method
const originalListen = require('http').Server.prototype.listen;

// Replace it with our version that uses the PORT environment variable
require('http').Server.prototype.listen = function(...args) {
  // If no configuration object is provided, check if it's called with (port, host, callback)
  if (typeof args[0] === 'number') {
    console.log(`Redirecting server from port ${args[0]} to ${process.env.PORT || 10000}`);
    args[0] = parseInt(process.env.PORT || 10000);
  } 
  // If the first arg is an object with a port property
  else if (args[0] && typeof args[0] === 'object' && args[0].port !== undefined) {
    console.log(`Redirecting server from port ${args[0].port} to ${process.env.PORT || 10000}`);
    args[0].port = parseInt(process.env.PORT || 10000);
  }

  return originalListen.apply(this, args);
};

console.log('Server port has been patched to use PORT environment variable');