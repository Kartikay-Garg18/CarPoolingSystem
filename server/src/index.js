const app = require('./app.js');
const connectDB = require('./config/db.js');

connectDB()
  .then(() => {
    console.log('Database connected successfully!');
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });