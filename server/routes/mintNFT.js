const express = require("express");
const mintNFT = express.Router();
require("dotenv").config();
const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const abi = require("../contracts/ERC721/ERC721abi");
const contractAddress = require("../contracts/ERC721/ERC721address");
const { SERVER_PRIVATEKEY, SERVER_ADDRESS, ETH_NETWORK } = process.env;
const provider = new HDWalletProvider(SERVER_PRIVATEKEY, ETH_NETWORK);
const web3 = new Web3(provider);
const myContract = new web3.eth.Contract(abi, contractAddress);
const app = require("../app");

mintNFT.route("/").post(async (req, res) => {
  const { address, NFTId, imgUri } = req.body;
  console.log({ address, NFTId, imgUri });
  try {
    const result = await myContract.methods.mintNFT(imgUri, address).send({
      from: SERVER_ADDRESS,
      gas: 2000000,
      gasPrice: await web3.eth.getGasPrice(),
    });

    const tokenId = result.events.Transfer.returnValues.tokenId;

    await app.db.collection("NFT").doc(NFTId).update({
      tokenId,
    });

    res.status(200).send({ message: "success" });
  } catch (error) {
    res.status(400).send({ error });
  }
});

module.exports = mintNFT;
