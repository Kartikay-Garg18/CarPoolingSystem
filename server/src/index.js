const app = require('./app.js');
const connectDB = require('./config/db.js');

const dotenv = require('dotenv');
dotenv.config('../.env');

connectDB()
  .then(() => {
    app.listen(4000, () => {
      console.log(`Server is running on port 4000`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });