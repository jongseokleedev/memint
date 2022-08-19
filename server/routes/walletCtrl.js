require("dotenv").config();
const Caver = require("caver-js");
const HDWalletProvider = require("truffle-hdwallet-provider-klaytn");
const abi = require("../contracts/KIP7/KIP7abi");
const contractAddress = require("../contracts/KIP7/KIP7address");
const byteCode = require("../contracts/KIP7/KIP7bin");
const { SERVER_PRIVATEKEY, SERVER_ADDRESS, BAOBAB_NETWORK } = process.env;
// const provider = new HDWalletProvider(SERVER_PRIVATEKEY, BAOBAB_NETWORK);
const provider = new Caver(BAOBAB_NETWORK);
// const provider = new Caver.providers.HttpProvider(BAOBAB_NETWORK);
const caver = new Caver(provider);
// var caver = new Caver();
// caver.setProvider(new Caver.providers.HttpProvider(BAOBAB_NETWORK));
const { convertToPeb, convertFromPeb } = caver.utils;
const myContract = new caver.contract(abi, contractAddress);
// myContract.setProvider(caver.currentProvider);
const app = require("../app");
const firestore = require("firebase-admin/firestore");
// 원래는 userUID를 통해 계정의 address와 pk를 받아서 tx를 해야하지만, 현재는 firestore가 연결되어있지 않기 때문에 post요청에서 address와 pk를 받아서 진행한다.
// 토큰 가격은 0.001eth === 1LCN으로 고정한 상태로 진행한다.
caver.wallet.newKeyring(SERVER_ADDRESS, SERVER_PRIVATEKEY);
const updateKlayAndOnchainToken = async (id, KlayBalance, LCNBalance) => {
	await app.db.collection("User").doc(id).update({
		klayAmount: KlayBalance,
		onChainTokenAmount: LCNBalance,
	});
};

const updateLCN = async (id, tokenAmount, LCNBalance) => {
	console.log({ tokenAmount, LCNBalance });
	await app.db.collection("User").doc(id).update({
		tokenAmount: tokenAmount,
		onChainTokenAmount: LCNBalance,
	});
};
const updateOnchainToken = async (id, LCNBalance) => {
	await app.db.collection("User").doc(id).update({
		onChainTokenAmount: LCNBalance,
	});
};

const updateKlay = async (id, KlayBalance) => {
	console.log({ id, KlayBalance });
	await app.db.collection("User").doc(id).update({
		klayAmount: KlayBalance,
	});
};

const createKlayOnTxLog = async (id, txType, txHash) => {
	await app.db.collection("User").doc(id).collection("OnchainKlayLog").add({
		txType: txType,
		txHash: txHash,
		createdAt: firestore.FieldValue.serverTimestamp(),
	});
};
const createLcnOnTxLog = async (id, txType, txHash) => {
	await app.db.collection("User").doc(id).collection("OnchainTokenLog").add({
		txType: txType,
		txHash: txHash,
		createdAt: firestore.FieldValue.serverTimestamp(),
	});
};

const KlayToLCN = async (req, res) => {
	const { id, klayAmount } = req.body;
	const doc = await app.db.collection("User").doc(id).get();
	const { address, privateKey } = doc.data();
	const keyring = new caver.wallet.keyring.singleKeyring(address, privateKey);
	try {
		// 먼저 거래 전 사용자의 klay 잔액을 확인한다.
		const beforeBalance = await caver.rpc.klay.getBalance(address);
		const check = await caver.klay.accountCreated(address);
		// user의 지갑에서 server지갑으로 KLAY Amount만큼 transfer하는 함수
		const getKlayFromUser = async () => {
			const tx = caver.transaction.valueTransfer.create({
				from: address,
				to: SERVER_ADDRESS,
				gas: 25000,
				value: convertToPeb(klayAmount.toString(), "KLAY"),
			});
			const signedTx = await tx.sign(keyring).then((result) => {
				return result.getRLPEncoding();
			});

			return await caver.rpc.klay.sendRawTransaction(
				signedTx,
				async (err, result) => {
					if (err) return res.status(400).send({ error: err });
					await createKlayOnTxLog(id, "Transfer KLAY", result);
					return { status: "success", result };
				}
			);
		};

		// server의 account에서 user의 account로, 알맞은 양의 LCN을 지급하는 함수
		const sendLCNToUser = async () => {
			const txInput = caver.abi.encodeFunctionCall(
				{
					name: "transfer",
					type: "function",
					inputs: [
						{ type: "address", name: "recipient" },
						{
							type: "uint256",
							name: "amount",
						},
					],
				},
				[address, convertToPeb((klayAmount * 10).toString())]
			);
			const txObject = caver.transaction.smartContractExecution.create({
				from: SERVER_ADDRESS,
				to: contractAddress,
				gas: 100000,
				input: txInput,
			});
			const signedTx = await txObject
				.sign(caver.wallet.getKeyring(SERVER_ADDRESS))
				.then((result) => {
					return result.getRLPEncoding();
				});
			return await caver.rpc.klay.sendRawTransaction(
				signedTx,
				async (err, result) => {
					if (err) return res.status(400).send({ error: err });
					await createLcnOnTxLog(id, "Recieve LCN", result);
				}
			);
		};

		// 이더 받는 함수 실행 후, 이어서 LCN을 보내는 함수 실행
		if (check && beforeBalance > klayAmount) {
			getKlayFromUser()
				.then(() => {
					return sendLCNToUser();
				})
				.then(async () => {
					const KlayBalance = await caver.rpc.klay.getBalance(address);
					const LCNBalance = await myContract.methods.balanceOf(address).call();
					await updateKlayAndOnchainToken(
						id,
						Number(convertFromPeb(KlayBalance.toString())),
						Number(convertFromPeb(LCNBalance.toString()))
					);
					res.send({
						// 아래 나와있는 balance들은 최종 업데이트 된 결과값이다.
						// 아래 값을 firestore에 저장하고, front에 success 라는 res를 보내면 front에서 정보를 업데이트하여 렌더링하면 될 것 같다.
						message: "success",
						KlayBalance: convertFromPeb(KlayBalance.toString()),
						LCNBalance: convertFromPeb(LCNBalance.toString()),
					});
				});
		} else {
			res.status(400).send("There is no account or enough balance");
		}
	} catch (error) {
		console.error(error);
	}
};

const LCNToKlay = async (req, res) => {
	const { id, tokenAmount } = req.body;
	console.log({ id, tokenAmount });
	const doc = await app.db.collection("User").doc(id).get();
	const { address, privateKey } = doc.data();
	const keyring = new caver.wallet.keyring.singleKeyring(address, privateKey);
	try {
		// 먼저 거래 전 사용자의 klay 잔액을 확인한다.
		const beforeBalance = await myContract.methods.balanceOf(address).call();
		const check = await caver.klay.accountCreated(address);
		// user의 지갑에서 server지갑으로 LCN Amount만큼 transfer하는 함수
		const getLCNFromUser = async () => {
			const txInput = caver.abi.encodeFunctionCall(
				{
					name: "transfer",
					type: "function",
					inputs: [
						{ type: "address", name: "recipient" },
						{
							type: "uint256",
							name: "amount",
						},
					],
				},
				[SERVER_ADDRESS, convertToPeb(tokenAmount.toString())]
			);
			const txObject = caver.transaction.smartContractExecution.create({
				from: address,
				to: contractAddress,
				gas: 50000,
				input: txInput,
			});
			const signedTx = await txObject.sign(keyring).then((result) => {
				return result.getRLPEncoding();
			});
			return await caver.rpc.klay.sendRawTransaction(
				signedTx,
				async (err, result) => {
					if (err) return res.status(400).send({ error: err });
					await createLcnOnTxLog(id, "Transfer LCN", result);
				}
			);
		};

		const sendKlayToUser = async () => {
			const tx = caver.transaction.valueTransfer.create({
				from: SERVER_ADDRESS,
				to: address,
				gas: 25000,
				value: convertToPeb((tokenAmount / 10).toString(), "KLAY"),
			});
			const signedTx = await tx
				.sign(caver.wallet.getKeyring(SERVER_ADDRESS))
				.then((result) => {
					return result.getRLPEncoding();
				});

			return await caver.rpc.klay.sendRawTransaction(
				signedTx,
				async (err, result) => {
					if (err) return res.status(400).send({ error: err });
					await createKlayOnTxLog(id, "Recieve KLAY", result);
					return { status: "success", result };
				}
			);
		};

		// server의 account에서 user의 account로, 알맞은 양의 LCN을 지급하는 함수

		// 이더 받는 함수 실행 후, 이어서 LCN을 보내는 함수 실행
		if (check && beforeBalance > tokenAmount * 10) {
			getLCNFromUser()
				.then(() => {
					return sendKlayToUser();
				})
				.then(async () => {
					const KlayBalance = await caver.rpc.klay.getBalance(address);
					const LCNBalance = await myContract.methods.balanceOf(address).call();
					await updateKlayAndOnchainToken(
						id,
						Number(convertFromPeb(KlayBalance.toString())),
						Number(convertFromPeb(LCNBalance.toString()))
					);
					res.send({
						// 아래 나와있는 balance들은 최종 업데이트 된 결과값이다.
						// 아래 값을 firestore에 저장하고, front에 success 라는 res를 보내면 front에서 정보를 업데이트하여 렌더링하면 될 것 같다.
						message: "success",
						KlayBalance: convertFromPeb(KlayBalance.toString()),
						LCNBalance: convertFromPeb(LCNBalance.toString()),
					});
				});
		} else {
			res.status(400).send("There is no account or enough balance");
		}
	} catch (error) {
		console.error(error);
	}
};

const toOffChain = async (req, res) => {
	const { id, tokenAmount, currentTokenAmount } = req.body;
	const doc = await app.db.collection("User").doc(id).get();
	const { address, privateKey } = doc.data();
	const keyring = new caver.wallet.keyring.singleKeyring(address, privateKey);
	try {
		// tokenAmount만큼 user의 계정에서 server의 계정으로 LCN을 transfer해주는 함수
		const beforeBalance = await myContract.methods.balanceOf(address).call();
		const check = await caver.klay.accountCreated(address);
		// user의 지갑에서 server지갑으로 LCN Amount만큼 transfer하는 함수
		const getLCNFromUser = async () => {
			const txInput = caver.abi.encodeFunctionCall(
				{
					name: "transfer",
					type: "function",
					inputs: [
						{ type: "address", name: "recipient" },
						{
							type: "uint256",
							name: "amount",
						},
					],
				},
				[SERVER_ADDRESS, convertToPeb(tokenAmount.toString())]
			);
			const txObject = caver.transaction.smartContractExecution.create({
				from: address,
				to: contractAddress,
				gas: 50000,
				input: txInput,
			});
			const signedTx = await txObject.sign(keyring).then((result) => {
				return result.getRLPEncoding();
			});
			return await caver.rpc.klay.sendRawTransaction(
				signedTx,
				async (err, result) => {
					if (err) return res.status(400).send({ error: err });
					await createLcnOnTxLog(id, "Transfer LCN", result);
				}
			);
		};

		getLCNFromUser().then(async () => {
			// 아래 나와있는 balance를 firestore db에 업데이트해준다.
			const LCNBalance = await myContract.methods.balanceOf(address).call();
			await updateLCN(
				id,
				tokenAmount + currentTokenAmount,
				Number(convertFromPeb(LCNBalance.toString()))
			);
			res.status(200).send({
				message: "success",
				LCNBalance: convertFromPeb(LCNBalance.toString()),
			});
		});
	} catch (error) {
		console.error(error);
	}
};

const toOnChain = async (req, res) => {
	const { id, tokenAmount, currentTokenAmount } = req.body;
	const doc = await app.db.collection("User").doc(id).get();
	const { address, privateKey } = doc.data();
	// firestore에서 user db에 저장되어있는 토큰의 개수가 tokenAmount이상인지 확인한다.
	// ex) const userInfo = await db.collection('User').doc(id).get()
	// if(userInfo.data().tokenAmount >= tokenAmount) { ... }

	// server의 account에서 user의 account로, 알맞은 양의 LCN을 지급하는 함수
	try {
		const sendLCNToUser = async () => {
			const txInput = caver.abi.encodeFunctionCall(
				{
					name: "transfer",
					type: "function",
					inputs: [
						{ type: "address", name: "recipient" },
						{
							type: "uint256",
							name: "amount",
						},
					],
				},
				[address, convertToPeb(tokenAmount.toString())]
			);
			const txObject = caver.transaction.smartContractExecution.create({
				from: SERVER_ADDRESS,
				to: contractAddress,
				gas: 50000,
				input: txInput,
			});
			const signedTx = await txObject
				.sign(caver.wallet.getKeyring(SERVER_ADDRESS))
				.then((result) => {
					return result.getRLPEncoding();
				});
			return await caver.rpc.klay.sendRawTransaction(
				signedTx,
				async (err, result) => {
					if (err) return res.status(400).send({ error: err });
					await createLcnOnTxLog(id, "Recieve LCN", result);
				}
			);
		};

		sendLCNToUser().then(async () => {
			const LCNBalance = await myContract.methods.balanceOf(address).call();
			await updateLCN(
				id,
				currentTokenAmount - tokenAmount,
				Number(convertFromPeb(LCNBalance.toString()))
			);
			// const afterTokenAmount = 원래 user document의 tokenAmount - 파라미터로 받은 tokenAmount
			// firebase에서 onChainTokenAmount에 LCNBalance 값을, tokenAmount에 afterTokenAmount 값을 업데이트해준 후 front에 res를 보내준다.
			res.status(200).send({
				message: "success",
				LCNBalance: convertFromPeb(LCNBalance.toString()),
			});
		});
	} catch (error) {
		console.log(error);
	}
};

const transferKlay = async (req, res) => {
	const { id, klayAmount, toAddress } = req.body;
	const doc = await app.db.collection("User").doc(id).get();
	const { address, privateKey } = doc.data();
	const keyring = new caver.wallet.keyring.singleKeyring(address, privateKey);
	// ETHAmount보다 beforeBalance의 값이 크거나 같은지 먼저 체크한다.

	try {
		const beforeBalance = await caver.rpc.klay.getBalance(address);
		// user의 address에서 toAddress로 klay 보내주는 함수

		const sendKlayTo = async () => {
			const tx = caver.transaction.valueTransfer.create({
				from: address,
				to: toAddress,
				gas: 25000,
				value: convertToPeb(klayAmount.toString(), "KLAY"),
			});
			const signedTx = await tx.sign(keyring).then((result) => {
				return result.getRLPEncoding();
			});

			return await caver.rpc.klay.sendRawTransaction(
				signedTx,
				async (err, result) => {
					if (err) return res.status(400).send({ error: err });
					await createKlayOnTxLog(id, "Transfer KLAY", result);
					return { status: "success", result };
				}
			);
		};

		sendKlayTo().then(async () => {
			// 아래 afterBalance 값을 user document의 onChainTokenAmount 값에 업데이트해준다.
			const afterBalance = await caver.rpc.klay.getBalance(address);
			await updateKlay(id, Number(convertFromPeb(afterBalance.toString())));

			res.status(200).send({
				message: "success",
				balance: convertFromPeb(afterBalance.toString()),
			});
		});
	} catch (error) {
		res.status(400).send({ error });
	}
};

const transferLCN = async (req, res) => {
	const { id, tokenAmount, toAddress } = req.body;
	const doc = await app.db.collection("User").doc(id).get();
	const { address, privateKey } = doc.data();
	const keyring = new caver.wallet.keyring.singleKeyring(address, privateKey);
	try {
		// user의 address에서 toAddress로 LCN을 보내주는 함수
		const beforeBalance = await myContract.methods.balanceOf(address).call();
		const check = await caver.klay.accountCreated(address);
		// user의 지갑에서 server지갑으로 LCN Amount만큼 transfer하는 함수
		const sendLCNTo = async () => {
			const txInput = caver.abi.encodeFunctionCall(
				{
					name: "transfer",
					type: "function",
					inputs: [
						{ type: "address", name: "recipient" },
						{
							type: "uint256",
							name: "amount",
						},
					],
				},
				[toAddress, convertToPeb(tokenAmount.toString())]
			);
			const txObject = caver.transaction.smartContractExecution.create({
				from: address,
				to: contractAddress,
				gas: 50000,
				input: txInput,
			});
			const signedTx = await txObject.sign(keyring).then((result) => {
				return result.getRLPEncoding();
			});
			return await caver.rpc.klay.sendRawTransaction(
				signedTx,
				async (err, result) => {
					if (err) return res.status(400).send({ error: err });
					await createLcnOnTxLog(id, "Transfer LCN", result);
				}
			);
		};

		sendLCNTo().then(async () => {
			// 아래 afterBalance 값을 firestore에 업데이트해준다.
			const afterBalance = await myContract.methods.balanceOf(address).call();
			await updateOnchainToken(
				id,
				Number(convertFromPeb(afterBalance.toString()))
			);
			res.status(200).send({
				message: "success",
				balance: convertFromPeb(afterBalance.toString()),
			});
		});
	} catch (error) {
		console.error(error);
	}
};

const getBalance = () => {};

module.exports = {
	KlayToLCN,
	LCNToKlay,
	toOffChain,
	toOnChain,
	transferKlay,
	transferLCN,
	getBalance,
};
