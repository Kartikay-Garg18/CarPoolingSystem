const requestLogger = (req, res, next) => {
    const start = Date.now();
    
    // Log request information
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    
    // Once the request is processed, log the response time
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    });
    
    next();
  };
  
  module.exports = requestLogger;