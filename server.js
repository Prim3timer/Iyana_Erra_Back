require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const connectDB = require("./config/dbConn");
const corsOptions = require("./config/corsOptions");

connectDB();

const PORT = process.env.PORT || 4000;
// const PORT = 4000;
// const mongoUrl = process.env.MONGO_URL;

app.use(cors(corsOptions));
app.use(express.json());

// app.use("/", express.static(path.join(__dirname, "public")));
app.use("/items", require("./routes/itemRoute"));
app.use("/acquisition", require("./routes/acquisitionRoute"));
app.use("/used", require("./routes/usedRoute"));
mongoose.connection.once("open", () => {
  console.log("connected to mongo db");
  app.listen(PORT, () => console.log(`server listening on port: ${PORT}`));
});
