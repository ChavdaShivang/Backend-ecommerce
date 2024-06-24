const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require('cors')
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const authRoute = require("./routes/auth");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");


dotenv.config();

const stripeRoute = require("./routes/stripe");

mongoose
	.connect(process.env.MONGO_URL)
	.then(() => {
		console.log("Connected to the database successfully!");
	})
	.catch((err) => {
		console.log(err);
	});

const port = 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute)

app.listen(port, () => {
	console.log(`Server is up and running on port ${port}`);
});
