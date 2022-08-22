const express = require("express");
const auth = express.Router();
// const Web3 = require("web3");
require("dotenv").config();
// const web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETH_NETWORK));
const Caver = require("caver-js");
const caver = new Caver(process.env.BAOBOB_NETWORK);
const { getFirestore } = require("firebase-admin/firestore");
// const db = getFirestore();
const app = require("../app");
// 회원가입 시 user의 db에 address, privateKey를 추가해주는 함수
auth.route("/register").post(async (req, res) => {
	try {
		// const { id } = req.body.id;
		// const account = await web3.eth.accounts.create();
		const account = await caver.klay.accounts.create();
		console.log(account);
		await app.db
			.collection("User")
			.doc(req.body.id)
			.update({
				address: account.address,
				privateKey: account.privateKey,
			})
			.then(res.status(200).send(account));
	} catch (error) {
		res.status(400).send(error);
	}
});

module.exports = auth;
