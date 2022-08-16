const KIP7abi = [
	{
		constant: false,
		inputs: [
			{
				name: "spender",
				type: "address",
			},
			{
				name: "amount",
				type: "uint256",
			},
		],
		name: "approve",
		outputs: [
			{
				name: "",
				type: "bool",
			},
		],
		payable: false,
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		constant: false,
		inputs: [
			{
				name: "recipient",
				type: "address",
			},
			{
				name: "amount",
				type: "uint256",
			},
		],
		name: "transfer",
		outputs: [
			{
				name: "",
				type: "bool",
			},
		],
		payable: false,
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		constant: false,
		inputs: [
			{
				name: "sender",
				type: "address",
			},
			{
				name: "recipient",
				type: "address",
			},
			{
				name: "amount",
				type: "uint256",
			},
		],
		name: "transferFrom",
		outputs: [
			{
				name: "",
				type: "bool",
			},
		],
		payable: false,
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				name: "getName",
				type: "string",
			},
			{
				name: "getSymbol",
				type: "string",
			},
		],
		payable: false,
		stateMutability: "nonpayable",
		type: "constructor",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				name: "from",
				type: "address",
			},
			{
				indexed: true,
				name: "to",
				type: "address",
			},
			{
				indexed: false,
				name: "amount",
				type: "uint256",
			},
		],
		name: "Transfer",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				name: "spender",
				type: "address",
			},
			{
				indexed: true,
				name: "from",
				type: "address",
			},
			{
				indexed: true,
				name: "to",
				type: "address",
			},
			{
				indexed: false,
				name: "amount",
				type: "uint256",
			},
		],
		name: "Transfer",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				name: "owner",
				type: "address",
			},
			{
				indexed: true,
				name: "spender",
				type: "address",
			},
			{
				indexed: false,
				name: "oldAmount",
				type: "uint256",
			},
			{
				indexed: false,
				name: "amount",
				type: "uint256",
			},
		],
		name: "Approval",
		type: "event",
	},
	{
		constant: true,
		inputs: [
			{
				name: "",
				type: "address",
			},
			{
				name: "",
				type: "address",
			},
		],
		name: "_allowances",
		outputs: [
			{
				name: "",
				type: "uint256",
			},
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [],
		name: "_decimals",
		outputs: [
			{
				name: "",
				type: "uint8",
			},
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [],
		name: "_name",
		outputs: [
			{
				name: "",
				type: "string",
			},
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [],
		name: "_symbol",
		outputs: [
			{
				name: "",
				type: "string",
			},
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [],
		name: "_totalSupply",
		outputs: [
			{
				name: "",
				type: "uint256",
			},
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [
			{
				name: "owner",
				type: "address",
			},
			{
				name: "spender",
				type: "address",
			},
		],
		name: "allowance",
		outputs: [
			{
				name: "",
				type: "uint256",
			},
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [
			{
				name: "account",
				type: "address",
			},
		],
		name: "balanceOf",
		outputs: [
			{
				name: "",
				type: "uint256",
			},
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [],
		name: "decimals",
		outputs: [
			{
				name: "",
				type: "uint8",
			},
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [],
		name: "name",
		outputs: [
			{
				name: "",
				type: "string",
			},
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [],
		name: "symbol",
		outputs: [
			{
				name: "",
				type: "string",
			},
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [],
		name: "totalSupply",
		outputs: [
			{
				name: "",
				type: "uint256",
			},
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
];

module.exports = KIP7abi;
