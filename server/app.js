const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const wallet = require("./routes/wallet");
const transactionRouter = require("./routes/transaction");
const auth = require("./routes/auth");
const mintNFT = require("./routes/mintNFT");
const app = express();
const fs = require("fs");
const port = process.env.PORT || 5000;

//Firebase setting
const admin = require("firebase-admin");
const firestore = require("firebase-admin/firestore");
const serviceAccount = require("./key/memint-c2130-firebase-adminsdk-p6jhw-39f8a3b04b.json");

const firebaseApp = admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

module.exports.db = firestore.getFirestore(firebaseApp);
//Firebase setting

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
	res.send("hello Web3");
});

app.use("/auth", auth);
app.use("/wallet", wallet);
app.use("/transaction", transactionRouter);
app.use("/mintNFT", mintNFT);
// catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error("Not Found");
	err["status"] = 404;
	next(err);
});

// error handler
app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.json({
		errors: {
			message: err.message,
		},
	});
});

app.listen(port, () => {
	console.log(`Memint Server listening at http://localhost:${port}`);
});

module.exports = app;
