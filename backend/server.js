require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");


const app = express();
app.use(cors());
app.use(express.json());


const resumeRoutes = require("./routes/resumeRoutes");


console.log("MONGO_URI:", process.env.MONGO_URI);


app.use("/api/resume", resumeRoutes);

mongoose.connect(process.env.MONGO_URI)

.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
