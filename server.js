require("./config/db");

const app = require("express")();
const port = process.env.PORT || 6040;
const connectDB = require("./config/db");
connectDB.run()
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
const bodyParser = require("express").json;
app.use(bodyParser());

// const SigninRouter = require("./api/sign-in");
// app.use("/sign-in", SigninRouter);


// const SignupRouter = require("./api/sign-up");
// app.use("/sign-up", SignupRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
