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
const roleRouter = require('./routes/roleRoutes');
const accountStatusRouter = require('./routes/accountStatusRoutes');

// Paths
app.get("/", (req, res) => res.send("Hello from express"));
app.use('/api/users', userRouter);
app.use('/api/roles', roleRouter);
app.use('/api/account-statuses', accountStatusRouter);

// Error Middleware
app.use(errHandler)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🎊`));