const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const errHandler = require('./middleware/errorHandler');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
const userRouter = require('./routes/userRoutes');
app.get("/", (req, res) => res.send("Hello from express"));
app.use('/api/users', userRouter);

// Error Middleware
app.use(errHandler)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🎊`));