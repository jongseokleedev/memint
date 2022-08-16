const express = require("express");
const router = express.Router();
const Web3 = require("web3");
require("dotenv").config();
const fs = require("fs");
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETH_NETWORK));
const Caver = require("caver-js");
const caver = new Caver(process.env.BAOBOB_NETWORK);
router.post("/sendEther", async (req, res) => {
	try {
		const { fromAddress, toAddress, amount } = req.body;
		// console.log(web3.eth.accounts[0]);
		// console.log(web3.personal);
		// const txHash = web3.eth.sendTransaction(
		// 	{
		// 		from: fromAddress,
		// 		to: toAddress,
		// 		value: amount,
		// 	},
		// 	(err, txHash) => {
		// 		console.log("txHash: " + txHash);
		// 	}
		// );
		console.log(txHash);
		res.status(200).send();
	} catch (e) {
		console.log(e);
		res.status(404).send(e);
	}
});

module.exports = router;
