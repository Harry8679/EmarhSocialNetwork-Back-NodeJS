const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const { readdirSync } = require('fs');

const app = express();

mongoose.connect(process.env.DATABASE, {})
        .then(() => console.log("DB connected"))
        .catch((err) => console.error("DB CONNECTION ERROR => ", err));

// Middlewares
// app.use(express.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }))
app.use(cors());

// Autoload routes
readdirSync('./routes').map((r) => app.use('/api', require(`./routes/${r}`)));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`));




/*
app.use(cors({
    origin: 'http://localhost:3000'
}))

          useNewUrlParser: true,
          // useFindAndModify: false,
          useUnifiedTopology: true,
          // useCreateIndex: true
        
*/