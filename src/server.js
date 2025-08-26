const dotenv = require('dotenv');
const connectDB = require('./config/db');
const app = require('./app');

// Load env and connect to database
dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
