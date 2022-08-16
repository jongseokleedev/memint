const express = require("express");
const wallet = express.Router();
const {
	KlayToLCN,
	LCNToKlay,
	toOffChain,
	toOnChain,
	transferETH,
	transferLCN,
	getBalance,
} = require("./walletCtrl");

wallet.route("/KlayToLCN").post(KlayToLCN);

wallet.route("/LCNToKlay").post(LCNToKlay);

wallet.route("/toOffChain").post(toOffChain);

wallet.route("/toOnChain").post(toOnChain);

wallet.route("/transferETH").post(transferETH);

wallet.route("/transferLCN").post(transferLCN);

wallet.route("/getBalance").post(getBalance);

// router.get("/getBalance", async (req, res) => {
//   try {
//     const { addr } = req.body;
//     console.log(addr);
//     const balance = await web3.eth.getBalance(addr);
//     console.log(balance);
//     res.status(200).send(balance);
//   } catch (e) {
//     console.log(e);
//     res.status(404).send(e);
//   }
// });

module.exports = wallet;

// {
//     address: '0x96fF79FDF17f10c42D36f6c271031540D4bBcB61',
//     privateKey: '0xdc84bac7f06ccbc00c233dad3599ebf86d5daa3144073c6bb4aac9401e9ddc85',
//     signTransaction: [Function: signTransaction],
//     sign: [Function: sign],
//     encrypt: [Function: encrypt]
//   }
