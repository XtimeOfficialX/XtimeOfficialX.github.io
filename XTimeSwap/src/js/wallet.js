const XTIME_CONTRACT_ADDRESS = "0xFF2BF41EC57b897c914E2BAac857D621f4CB1691";
const WBNB_CONTRACT_ADDRESS = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c';
const PAIR_CONTRACT_ADDRESS = "0xbaBd4F4FC5667F8cac87DC6499F3e8f38f13B57A";
const ROUTER_CONTRACT_ADDRESS = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
const STAKE_CONTRACT_ADDRESS = "0xF8f10A45379E70103B2E54090Aa7aAe83F575B01";
const STAKE_XTIME_CONTRACT_ADDRESS = "0x002D4C9667f517Ac27f0F32579152D7C87108CCf";

let STAKE_CONTRACT;
let STAKE_XTIME_CONTRACT;
let PAIR_CONTRACT;
let ROUTER_CONTRACT;
let XTIME_CONTRACT;
let WBNB_CONTRACT;
let XTIME_PRICE;
let UINT_MAX = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

function connectWallet() {
	return new Promise(async function (resolve, reject) {
		if (window.ethereum) {
			try {
				await window.ethereum.request({method: "eth_requestAccounts"});
				const web3 = new Web3(window.ethereum);
				resolve(web3);
			} catch (error) {
				reject(error);
			}
		} else {
			showAlert("Need MetaMask!", "You should install the metamask wallet");
		}
	})
}

function addChain() {
	return web3.currentProvider.request({
		"method": "wallet_addEthereumChain",
		"params": [
			{
				chainId: "0x38",
				chainName: "Binance Smart Chain Mainnet",
				nativeCurrency: {
					name: "",
					symbol: "bnb",
					decimals: 18,
				},
				rpcUrls: ["https://bsc-dataseed1.ninicoin.io"],
				blockExplorerUrls: ["https://bscscan.com/"]
			}
		],
	})
}

function switchChain() {
	return web3.currentProvider.request({
		"method": "wallet_switchEthereumChain",
		"params": [
			{
				"chainId": "0x38"
			}
		],
	})
}

function getCurrentAddress() {
	return web3.currentProvider.selectedAddress;
}

function getBalance(address) {
	return new Promise(async function (resolve, reject) {
		try {
			let balance = await web3.eth.getBalance(address);
			resolve(balance);
		} catch (error) {
			reject(error);
		}
	})
}

function getXTimeBalance(address) {
	return new Promise(async function (resolve, reject) {
		try {
			let balance = XTIME_CONTRACT.methods.balanceOf(address).call()
			resolve(balance);
		} catch (error) {
			reject(error)
		}
	})
}

function getLiquidityBalance(address) {
	return new Promise(async function (resolve, reject) {
		try {
			let balance = PAIR_CONTRACT.methods.balanceOf(address).call()
			resolve(balance);
		} catch (error) {
			reject(error)
		}
	})
}

function getLiquidityTotalSupply() {
	return new Promise(async function (resolve, reject) {
		try {
			let balance = PAIR_CONTRACT.methods.totalSupply().call()
			resolve(balance);
		} catch (error) {
			reject(error)
		}
	})
}

function getPairReserves() {
	return new Promise(async function (resolve, reject) {
		try {
			let balance = PAIR_CONTRACT.methods.getReserves().call()
			resolve(balance);
		} catch (error) {
			reject(error)
		}
	})
}

function initContract() {
	PAIR_CONTRACT = new web3.eth.Contract(IUniswapV2PairABI, PAIR_CONTRACT_ADDRESS);
	ROUTER_CONTRACT = new web3.eth.Contract(RouterABI, ROUTER_CONTRACT_ADDRESS);
	XTIME_CONTRACT = new web3.eth.Contract(XTimeABI, XTIME_CONTRACT_ADDRESS);
	WBNB_CONTRACT = new web3.eth.Contract(WBNBABI, WBNB_CONTRACT_ADDRESS);
	STAKE_CONTRACT = new web3.eth.Contract(STAKE_ABI, STAKE_CONTRACT_ADDRESS);
	STAKE_XTIME_CONTRACT = new web3.eth.Contract(STAKE_XTIME_ABI, STAKE_XTIME_CONTRACT_ADDRESS);
}

function listenEvent() {
	XTIME_CONTRACT.events.Approval(
		{}, function (error, event) {
			console.log(event);
		})
		.on("connected", function (subscriptionId) {
			console.log(subscriptionId);
		})
		.on('data', function (event) {
			console.log(event); // same results as the optional callback above
		})
		.on('changed', function (event) {
			// remove event from local database
		})
		.on('error', function (error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
			console.log(error);
		});
}

function getXTimeToWBNBPrice() {
	const oneWBNB = Web3.utils.toWei("1");
	ROUTER_CONTRACT.methods.getAmountsOut(oneWBNB, [WBNB_CONTRACT_ADDRESS, XTIME_CONTRACT_ADDRESS]).call().then(result => XTIME_PRICE = Web3.utils.fromWei(result[1]));
}

async function swapBNBToXTime() {
	let amounts = await ROUTER_CONTRACT.methods.getAmountsOut(web3.utils.toWei(SWAP_FROM_VALUE.toString()), [WBNB_CONTRACT_ADDRESS, XTIME_CONTRACT_ADDRESS]).call();

	console.log(amounts);

	let XTimeAmountOutMin = Web3.utils.toBN(amounts[1]);

	// calculate the slippage
	let amountOutMin = XTimeAmountOutMin.sub(XTimeAmountOutMin.mul(Web3.utils.toBN(SLIPPAGE)).div(Web3.utils.toBN(100)));

	let data = ROUTER_CONTRACT.methods.swapExactETHForTokens(
		amountOutMin.toString(),
		[WBNB_CONTRACT_ADDRESS, XTIME_CONTRACT_ADDRESS],
		CURRENT_ADDRESS,
		Math.round(Date.now() / 1000) + DEADLINE_TIME,
	);
	console.log(data);

	let rawTransaction = {
		"from": CURRENT_ADDRESS,
		"to": ROUTER_CONTRACT_ADDRESS,
		"value": web3.utils.toHex(Web3.utils.toWei(SWAP_FROM_VALUE.toString())),
		"data": data.encodeABI()
	};

	return new Promise(async function (resolve, reject) {
		try {
			const txHash = await window.ethereum
				.request({
					method: 'eth_sendTransaction',
					params: [rawTransaction],
				});
			console.log(txHash);
			resolve(txHash);
		} catch (error) {
			console.log(error);
			reject(error);
		}
	})
}

async function swapXTimeToBNB() {
	let approveResponse = XTIME_CONTRACT.methods.approve(
		ROUTER_CONTRACT_ADDRESS,
		UINT_MAX
	);

	let rawApproveTransaction = {
		"from": CURRENT_ADDRESS,
		"to": XTIME_CONTRACT_ADDRESS,
		"value": "0x0",
		"data": approveResponse.encodeABI()
	};

	let amounts = await ROUTER_CONTRACT.methods.getAmountsOut(web3.utils.toWei(SWAP_FROM_VALUE.toString()), [XTIME_CONTRACT_ADDRESS, WBNB_CONTRACT_ADDRESS]).call();

	let BNBAmountOutMin = Web3.utils.toBN(amounts[1]);

	// calculate the slippage
	let amountOutMin = BNBAmountOutMin.sub(BNBAmountOutMin.mul(Web3.utils.toBN(SLIPPAGE)).div(Web3.utils.toBN(100)));

	let swapData = ROUTER_CONTRACT.methods.swapExactTokensForETHSupportingFeeOnTransferTokens(
		web3.utils.toWei(SWAP_FROM_VALUE.toString()),
		amountOutMin.toString(),
		[XTIME_CONTRACT_ADDRESS, WBNB_CONTRACT_ADDRESS],
		CURRENT_ADDRESS,
		Math.round(Date.now() / 1000) + DEADLINE_TIME,
	)

	let rawSwapTransaction = {
		"from": CURRENT_ADDRESS,
		"to": ROUTER_CONTRACT_ADDRESS,
		"value": web3.utils.toHex(0),
		"data": swapData.encodeABI(),
	};

	return new Promise(async (resolve, reject) => {
		try {
			const txApproveHash = await window.ethereum
				.request({
					method: 'eth_sendTransaction',
					params: [rawApproveTransaction],
				});

			let approvalLimit = await XTIME_CONTRACT.methods.allowance(CURRENT_ADDRESS, ROUTER_CONTRACT_ADDRESS).call();

			console.log("approve tx:", txApproveHash);
			console.log("approve limit:", approvalLimit);

			const txSwapHash = await window.ethereum
				.request({
					method: 'eth_sendTransaction',
					params: [rawSwapTransaction],
				});

			console.log("swap tx:", txSwapHash);
			resolve(txSwapHash);
		} catch (error) {
			reject(error);
		}
	})
}

async function addLiquidity() {
	let approveResponse = XTIME_CONTRACT.methods.approve(
		ROUTER_CONTRACT_ADDRESS,
		UINT_MAX
	);

	console.log(web3.utils.toWei((POLL_AMOUNT_XTIME).toString()))

	let rawApproveTransaction = {
		"from": CURRENT_ADDRESS,
		"to": XTIME_CONTRACT_ADDRESS,
		"value": web3.utils.toHex(0),
		"data": approveResponse.encodeABI()
	};

	let BNBAmountOutMin = Web3.utils.toBN(Web3.utils.toWei(POLL_AMOUNT_XTIME.toString()));

	let amountOutMin = BNBAmountOutMin.sub(BNBAmountOutMin.mul(Web3.utils.toBN(SLIPPAGE)).div(Web3.utils.toBN(100)));

	let supplyData = ROUTER_CONTRACT.methods.addLiquidityETH(
		XTIME_CONTRACT_ADDRESS,
		Web3.utils.toWei((POLL_AMOUNT_XTIME).toString()),
		web3.utils.toHex(0),
		web3.utils.toHex(0),
		CURRENT_ADDRESS,
		Math.round(Date.now() / 1000) + DEADLINE_TIME,
	)

	console.log(Web3.utils.toWei(POLL_AMOUNT_XTIME.toString()));
	console.log(amountOutMin);
	console.log(Web3.utils.toWei(POLL_AMOUNT_BNB.toString()));

	let rawSupplyTransaction = {
		"from": CURRENT_ADDRESS,
		"to": ROUTER_CONTRACT_ADDRESS,
		"value": Web3.utils.toWei((POLL_AMOUNT_BNB * 0.8).toFixed(18).toString()),
		"data": supplyData.encodeABI(),
	};

	console.log(Web3.utils.toWei(POLL_AMOUNT_BNB.toString()));

	return new Promise(async (resolve, reject) => {
		try {
			const txApproveHash = await window.ethereum
				.request({
					method: 'eth_sendTransaction',
					params: [rawApproveTransaction],
				});
			console.log(txApproveHash);

			let approvalLimit = await XTIME_CONTRACT.methods.allowance(CURRENT_ADDRESS, ROUTER_CONTRACT_ADDRESS).call();
			console.log(approvalLimit);

			const txSupplyHash = await window.ethereum
				.request({
					method: 'eth_sendTransaction',
					params: [rawSupplyTransaction],
				});

			console.log(txSupplyHash);
			resolve(txSupplyHash);
		} catch (error) {
			reject(error);
		}
	})
}

async function removeLiquidity() {
	let liquidity_bn = new web3.utils.BN(web3.utils.toWei(LIQUIDITY_BALANCE));
	let removeLiquidity = liquidity_bn.mul(Web3.utils.toBN(REMOVE_LIQUIDITY_PERCENT)).div(Web3.utils.toBN(100));

	let approveResponse = PAIR_CONTRACT.methods.approve(
		ROUTER_CONTRACT_ADDRESS,
		UINT_MAX
	);

	console.log(removeLiquidity.toString());

	let rawApproveTransaction = {
		"from": CURRENT_ADDRESS,
		"to": PAIR_CONTRACT_ADDRESS,
		"value": web3.utils.toHex(0),
		"data": approveResponse.encodeABI()
	};

	// let removeLiquidityResponse = ROUTER_CONTRACT.methods.removeLiquidityETHSupportingFeeOnTransferTokens(
	// 	XTIME_CONTRACT_ADDRESS,
	// 	removeLiquidity.toString(),
	// 	web3.utils.toHex(0),
	// 	web3.utils.toHex(0),
	// 	CURRENT_ADDRESS,
	// 	Math.round(Date.now() / 1000) + DEADLINE_TIME,
	// );

	let removeLiquidityResponse = ROUTER_CONTRACT.methods.removeLiquidity (
		WBNB_CONTRACT_ADDRESS,
		XTIME_CONTRACT_ADDRESS,
		removeLiquidity.toString(),
		web3.utils.toHex(0),
		web3.utils.toHex(0),
		CURRENT_ADDRESS,
		Math.round(Date.now() / 1000) + DEADLINE_TIME,
	);

	let rawRemoveLiquidity = {
		"from": CURRENT_ADDRESS,
		"to": ROUTER_CONTRACT_ADDRESS,
		"value": web3.utils.toHex(0),
		"data": removeLiquidityResponse.encodeABI()
	};

	return new Promise(async (resolve, reject) => {
		try {
			const txApproveHash = await window.ethereum
				.request({
					method: 'eth_sendTransaction',
					params: [rawApproveTransaction],
				});

			console.log("approve tx: ", txApproveHash);

			let approvalLimit = await PAIR_CONTRACT.methods.allowance(CURRENT_ADDRESS, ROUTER_CONTRACT_ADDRESS).call();

			console.log("pair approve : ", approvalLimit);

			const txRemoveLiquidityHash = await window.ethereum
				.request({
					method: 'eth_sendTransaction',
					params: [rawRemoveLiquidity],
				});
			console.log("remove tx:", txRemoveLiquidityHash);
			resolve(txRemoveLiquidityHash);
		} catch (error) {
			reject(error);
		}
	})
}

function getStakePendingReward(address) {
	return new Promise(async function (resolve, reject) {
		try {
			let info = STAKE_CONTRACT.methods.pendingReward(address).call();
			resolve(info);
		} catch (error) {
			reject(error);
		}
	})
}

function getStakeTotal() {
	return new Promise(async function (resolve, reject) {
		try {
			let balance = PAIR_CONTRACT.methods.balanceOf(STAKE_CONTRACT_ADDRESS).call()
			resolve(balance);
		} catch (error) {
			reject(error)
		}
	})
}

function getStakeUserInfo(address) {
	return new Promise(async function (resolve, reject) {
		try {
			let info = STAKE_CONTRACT.methods.userInfo(address).call();
			resolve(info);
		} catch (error) {
			reject(error);
		}
	})
}

function getPairAllowance(owner, spender) {
	return new Promise(async function (resolve, reject) {
		try {
			let allowance = PAIR_CONTRACT.methods.allowance(owner, spender).call();
			resolve(allowance);
		} catch (error) {
			reject(error);
		}
	})
}

function enablePairTokenAllowance(spender) {
	return new Promise(async function (resolve, reject) {
		try {
			let allowance = PAIR_CONTRACT.methods.approve(spender, UINT_MAX);

			let rawApproveTransaction = {
				"from": CURRENT_ADDRESS,
				"to": PAIR_CONTRACT_ADDRESS,
				"value": web3.utils.toHex(0),
				"data": allowance.encodeABI()
			};

			const txApproveHash = await window.ethereum
				.request({
					method: 'eth_sendTransaction',
					params: [rawApproveTransaction],
				});
			resolve(txApproveHash);
		} catch (error) {
			reject(error);
		}
	})
}

function depositStake(value) {
	let amount = web3.utils.toWei(value);
	let deposit = STAKE_CONTRACT.methods.deposit(amount);

	let rawTransaction = {
		"from": CURRENT_ADDRESS,
		"to": STAKE_CONTRACT_ADDRESS,
		"value": web3.utils.toHex(0),
		"data": deposit.encodeABI()
	};

	return new Promise(async function (resolve, reject) {
		try {
			const txAHash = await window.ethereum
				.request({
					method: 'eth_sendTransaction',
					params: [rawTransaction],
				});
			resolve(txAHash);
		} catch (error) {
			reject(error);
		}
	})
}

function withdrawStake(value) {
	let amount = web3.utils.toWei(value);
	let withdraw = STAKE_CONTRACT.methods.withdraw(amount);

	let rawTransaction = {
		"from": CURRENT_ADDRESS,
		"to": STAKE_CONTRACT_ADDRESS,
		"value": web3.utils.toHex(0),
		"data": withdraw.encodeABI()
	};

	return new Promise(async function (resolve, reject) {
		try {
			const txHash = await window.ethereum
				.request({
					method: 'eth_sendTransaction',
					params: [rawTransaction],
				});
			resolve(txHash);
		} catch (error) {
			reject(error);
		}
	})
}

// stake xtime
function getXTimeStakeAllowance(owner, spender) {
	return new Promise(async function (resolve, reject) {
		try {
			let allowance = XTIME_CONTRACT.methods.allowance(owner, spender).call();
			resolve(allowance);
		} catch (error) {
			reject(error);
		}
	})
}

function enableXTimeStake(spender) {
	return new Promise(async function (resolve, reject) {
		try {
			let allowance = XTIME_CONTRACT.methods.approve(spender, UINT_MAX);

			let rawApproveTransaction = {
				"from": CURRENT_ADDRESS,
				"to": XTIME_CONTRACT_ADDRESS,
				"value": web3.utils.toHex(0),
				"data": allowance.encodeABI()
			};

			const txApproveHash = await window.ethereum
				.request({
					method: 'eth_sendTransaction',
					params: [rawApproveTransaction],
				});
			resolve(txApproveHash);
		} catch (error) {
			reject(error);
		}
	})
}

function getXTimeStakePendingReward(address) {
	return new Promise(async function (resolve, reject) {
		try {
			let info = STAKE_XTIME_CONTRACT.methods.pendingReward(address).call();
			resolve(info);
		} catch (error) {
			reject(error);
		}
	})
}

function getXTimeStakeTotal() {
	return new Promise(async function (resolve, reject) {
		try {
			let balance = XTIME_CONTRACT.methods.balanceOf(STAKE_XTIME_CONTRACT_ADDRESS).call()
			resolve(balance);
		} catch (error) {
			reject(error)
		}
	})
}

function getXTimeSTakeUserInfo(address) {
	return new Promise(async function (resolve, reject) {
		try {
			let info = STAKE_XTIME_CONTRACT.methods.userInfo(address).call();
			resolve(info);
		} catch (error) {
			reject(error);
		}
	})
}

function depositXTimeStake(value) {
	let amount = web3.utils.toWei(value);
	let deposit = STAKE_XTIME_CONTRACT.methods.deposit(amount);

	let rawTransaction = {
		"from": CURRENT_ADDRESS,
		"to": STAKE_XTIME_CONTRACT_ADDRESS,
		"value": web3.utils.toHex(0),
		"data": deposit.encodeABI()
	};

	return new Promise(async function (resolve, reject) {
		try {
			const txAHash = await window.ethereum
				.request({
					method: 'eth_sendTransaction',
					params: [rawTransaction],
				});
			resolve(txAHash);
		} catch (error) {
			reject(error);
		}
	})
}

function withdrawXTimeStake(value) {
	let amount = web3.utils.toWei(value);
	let withdraw = STAKE_XTIME_CONTRACT.methods.withdraw(amount);

	let rawTransaction = {
		"from": CURRENT_ADDRESS,
		"to": STAKE_XTIME_CONTRACT_ADDRESS,
		"value": web3.utils.toHex(0),
		"data": withdraw.encodeABI()
	};

	return new Promise(async function (resolve, reject) {
		try {
			const txHash = await window.ethereum
				.request({
					method: 'eth_sendTransaction',
					params: [rawTransaction],
				});
			resolve(txHash);
		} catch (error) {
			reject(error);
		}
	})
}

