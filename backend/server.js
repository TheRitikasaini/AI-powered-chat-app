const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.error(err));

const chatRoute = require('./routes/chat');
app.use('/api', chatRoute);

app.get('/', (req, res) => {
    res.send('Server is Running');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));