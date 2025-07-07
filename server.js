const express = require("express");
const connectDB = require('./config/dbConnect');
const errorHandler = require("./Middleware/errorHandle.js");
const app = express();
const dotenv = require("dotenv").config();

connectDB();
app.use(express.json());
app.use(errorHandler);


const port = process.env.PORT || 3001;

app.use("/api/contacts", require("./routes/contact.js"));
app.use("/api/user", require("./routes/user.js"));



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});