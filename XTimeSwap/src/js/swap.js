let SWAP_WAY = 1; // 1: from bnb to xtime; 2: from xtime to bnb
let DEADLINE_TIME = 20 * 60;
let SLIPPAGE = 20;
let SWAP_FROM_VALUE = 0;
let SWAP_TO_VALUE = 0;
let BNB_BALANCE = 0;
let LIQUIDITY_BALANCE = "0";
let LIQUIDITY_TOTAL = 0;
let PAIR_RESERVES;
let XTIME_BALANCE = 0;
let CURRENT_ADDRESS;
let POLL_AMOUNT_XTIME = 0;
let POLL_AMOUNT_BNB = 0;
let REMOVE_LIQUIDITY_PERCENT = 0;
let PAIR_TOKEN_ALLOWANCE = 0;
let STAKE_BALANCE = "0";
let STAKE_CHANGE_WAY = 1; // 1: increase; 2: reduce
let STAKE_CHANGE_VALUE = 0;

function bindBtnEvents() {
	$("#btn-swap").click(function () {
		checkSwapInputValue();
		hidePageShowSwap();
		$("#swap-window").removeClass("hide");
		$("#pool-window").addClass("hide");
		$("#stake-window").addClass("hide");
	});

	$("#btn-pool").click(function () {
		hidePageShowSwap();
		$("#swap-window").addClass("hide");
		$("#pool-window").removeClass("hide");
		$("#stake-window").addClass("hide");
	});

	$("#btn-stake").click(function () {
		hidePageShowSwap();
		$("#swap-window").addClass("hide");
		$("#pool-window").addClass("hide");
		$("#stake-window").removeClass("hide");
	});

	// add Liquidity
	$("#btn-join-poll").click(function () {
		$("#window-body-poll-liquidity").addClass("hide")
		$("#window-body-poll-add").removeClass("hide")
	})

	// from add liquidity back
	$("#btn-poll-add-back").click(function () {
		$("#window-body-poll-liquidity").removeClass("hide")
		$("#window-body-poll-add").addClass("hide")
	})

	// exchange swap coin from to
	$("#btn-exchange").click(function () {
		switch (SWAP_WAY) {
		case 1:
			$("#btn-swap-from").html(`<img class="token-icon" src="assets/icon/xtime.png">XTime`);
			$("#btn-swap-to").html(`<img class=\"token-icon\" src=\"assets/icon/bnb.png\">BNB`);
			SWAP_WAY = 2;
			break;
		case 2:
			$("#btn-swap-from").html(`<img class=\"token-icon\" src=\"assets/icon/bnb.png\">BNB`);
			$("#btn-swap-to").html(`<img class="token-icon" src="assets/icon/xtime.png">XTime`);
			SWAP_WAY = 1;
			break;
		}

		$("#input-swap-from").val(SWAP_TO_VALUE);
		$("#input-swap-to").val(SWAP_FROM_VALUE);

		SWAP_TO_VALUE = $("#input-swap-to").val();
		SWAP_FROM_VALUE = $("#input-swap-from").val();
		showBalance();
	})

	// connect wallet
	$("#btn-connect-wallet").click(function () {
		connectWallet().then(connectedWallet).catch(error => {
			console.log(error);
		})
	});

	$("#btn-poll-connect-wallet").click(function () {
		connectWallet().then(connectedWallet).catch(error => {
			console.log(error);
		})
	});

	// change the swap from value
	$("#input-swap-from").on("input", function () {
		SWAP_FROM_VALUE = $(this).val();
		SWAP_TO_VALUE = calculateSwapToNumber();
		$("#input-swap-to").val(parseFloat(SWAP_TO_VALUE).toFixed(6));
		checkSwapInputValue();
	})


	$("#input-swap-to").on("input", function () {
		SWAP_TO_VALUE = $(this).val();
		SWAP_FROM_VALUE = calculateSwapFromNumber();
		$("#input-swap-from").val(parseFloat(SWAP_FROM_VALUE).toFixed(6));
		checkSwapInputValue();
	})

	$(".stake-container").on("click", "div.detail-btn", function (e) {
		let parent = $($(this).parents(".stake-container")[0]);
		if (parent.hasClass("open")) {
			parent.removeClass("open")
		} else {
			parent.addClass("open")
		}
	})

	// change the poll value
	$("#input-poll-A").on("input", function () {
		POLL_AMOUNT_BNB = $(this).val();
		calculatePollXTimeNumber();
		checkPollInputValue();
	})

	$("#input-poll-B").on("input", function () {
		POLL_AMOUNT_XTIME = $(this).val();
		calculatePollBNBNumber();
		checkPollInputValue();
	})

	// confirm swap
	$("#btn-confirm-swap").click(function () {
		if (SWAP_WAY === 1) {
			swapBNBToXTime().then(() => {
				showSuccessInfo("Swap Success!", "You transaction is on the way");
			});
		} else {
			swapXTimeToBNB().then(() => {
				showSuccessInfo("Swap Success!", "You transaction is on the way");
			})
		}
	});

	// confirm supply Liquidity
	$("#btn-poll-confirm-supply").click(function () {
		addLiquidity().then(() => {
			showSuccessInfo("Supply Success!", "You transaction is on the way");
		})
	});

	// remove liquidity
	$("#btn-remove-liquidity").click(function () {
		$("#window-body-poll-liquidity").addClass("hide");
		$("#window-body-poll-remove").removeClass("hide");
	})

	$("#btn-poll-remove-back").click(function () {
		$("#window-body-poll-liquidity").removeClass("hide");
		$("#window-body-poll-remove").addClass("hide");
	})

	// input remove liquidity value
	$("#remove-liquidity-btn-percent-25").click(function () {
		REMOVE_LIQUIDITY_PERCENT = 25;
		$("#input-poll-liquidity").val(REMOVE_LIQUIDITY_PERCENT);
		showLiquidityPay();
	})

	$("#remove-liquidity-btn-percent-50").click(function () {
		REMOVE_LIQUIDITY_PERCENT = 50;
		$("#input-poll-liquidity").val(REMOVE_LIQUIDITY_PERCENT);
		showLiquidityPay();
	})

	$("#remove-liquidity-btn-percent-75").click(function () {
		REMOVE_LIQUIDITY_PERCENT = 75;
		$("#input-poll-liquidity").val(REMOVE_LIQUIDITY_PERCENT);
		showLiquidityPay();
	})

	$("#remove-liquidity-btn-percent-100").click(function () {
		REMOVE_LIQUIDITY_PERCENT = 100;
		$("#input-poll-liquidity").val(REMOVE_LIQUIDITY_PERCENT);
		showLiquidityPay();
	})

	$("#input-poll-liquidity").on("input", function () {
		REMOVE_LIQUIDITY_PERCENT = $(this).val();
		if (REMOVE_LIQUIDITY_PERCENT > 100) {
			REMOVE_LIQUIDITY_PERCENT = 100;
			$("#input-poll-liquidity").val(REMOVE_LIQUIDITY_PERCENT);
		}

		switch (Number(REMOVE_LIQUIDITY_PERCENT)) {
		case 25:
			$(".btn-percent").removeClass("active");
			$("#remove-liquidity-btn-percent-25").addClass("active");
			break;
		case 50:
			$(".btn-percent").removeClass("active");
			$("#remove-liquidity-btn-percent-50").addClass("active");
			break;
		case 75:
			$(".btn-percent").removeClass("active");
			$("#remove-liquidity-btn-percent-75").addClass("active");
			break;
		case 100:
			$(".btn-percent").removeClass("active");
			$("#remove-liquidity-btn-percent-100").addClass("active");
			break;
		default:
			$(".btn-percent").removeClass("active");
		}

		showLiquidityPay();
	})

	// confirm remove liquidity
	$("#btn-confirm-remove-liquidity").click(function () {
		removeLiquidity().then(() => {
			showSuccessInfo("Remove Success!", "You transaction is on the way");
		})
	})

	// enable stake
	$("#btn-enable-stake").click(function () {
		enablePairTokenAllowance(STAKE_CONTRACT_ADDRESS).then(() => {
			getPairAllowance(CURRENT_ADDRESS, STAKE_CONTRACT_ADDRESS).then((result) => {
				console.log(result);
			})
		}).catch((error) => {
			console.log(error);
		})
	});

	// reduce stake
	$("#btn-increase-stake").click(function () {
		STAKE_CHANGE_WAY = 1;
		$("#change-stake-title").html("Stake XTime-BNB");
		$("#balance-change-stake").html(LIQUIDITY_BALANCE);
		$("#change-stake").modal('toggle');
	});

	// increase stake
	$("#btn-reduce-stake").click(function () {
		STAKE_CHANGE_WAY = 2;
		$("#change-stake-title").html("Unstake XTime-BNB");
		$("#balance-change-stake").html(STAKE_BALANCE);
		$("#change-stake").modal('toggle')
	});

	// percent input
	$("#change-stake-btn-percent-25").click(function () {
		STAKE_CHANGE_VALUE = calculateStakeValue(0.25);
		$("#input-change-stake").val(STAKE_CHANGE_VALUE);
		checkStakeInputValue(STAKE_CHANGE_VALUE);
	})

	$("#change-stake-btn-percent-50").click(function () {
		STAKE_CHANGE_VALUE = calculateStakeValue(0.5);
		$("#input-change-stake").val(STAKE_CHANGE_VALUE);
		checkStakeInputValue(STAKE_CHANGE_VALUE);
	})

	$("#change-stake-btn-percent-75").click(function () {
		STAKE_CHANGE_VALUE = calculateStakeValue(0.75);
		$("#input-change-stake").val(STAKE_CHANGE_VALUE);
		checkStakeInputValue(STAKE_CHANGE_VALUE);
	})

	$("#change-stake-btn-percent-100").click(function () {
		STAKE_CHANGE_VALUE = calculateStakeValue(1);
		$("#input-change-stake").val(STAKE_CHANGE_VALUE);
		checkStakeInputValue(STAKE_CHANGE_VALUE);
	})

	$("#input-change-stake").on("input", function () {
		STAKE_CHANGE_VALUE = $(this).val();
		checkStakeInputValue(STAKE_CHANGE_VALUE);
	})

	// confirm change stake
	$("#confirm-change-stake").click(function () {
		if (STAKE_CHANGE_WAY === 1) {
			depositStake(STAKE_CHANGE_VALUE.toString()).then((result) => {
				console.log(result);
				showSuccessInfo("Deposit Success!", "You transaction is on the way");
				$("#change-stake").modal('toggle');
			}).catch((error) => {
				console.log(error);
				showAlert("Deposit Failed!", error.message)
			})
		} else {
			withdrawStake(STAKE_CHANGE_VALUE.toString()).then((result) => {
				console.log(result);
				showSuccessInfo("Withdraw Success!", "You transaction is on the way");
				$("#change-stake").modal('toggle');
			}).catch((error) => {
				console.log(error);
				showAlert("Withdraw Failed!", error.message)
			})
		}
	})

	// confirm harvest
	$("#confirm-harvest").click(function () {
		depositStake("0").then((result) => {
			console.log(result);
			showSuccessInfo("Harvest Success!", "You transaction is on the way");
		}).catch((error) => {
			console.log(error);
			showAlert("Harvest Failed!", error.message)
		})
	})
}

function connectedWallet(web3) {
	window.web3 = web3;
	if (web3.currentProvider.chainId !== "0x38") {
		addChain().then(() => {
			switchChain();
		});
	}
	initContract();
	CURRENT_ADDRESS = getCurrentAddress();

	// get BNB and XTime balance
	Promise.all([getBalance(CURRENT_ADDRESS), getXTimeBalance(CURRENT_ADDRESS)]).then((result) => {
		BNB_BALANCE = Web3.utils.fromWei(result[0])
		XTIME_BALANCE = Web3.utils.fromWei(result[1])
		showBalance();
	})

	// get liquidity balance
	Promise.all([getLiquidityTotalSupply(), getLiquidityBalance(CURRENT_ADDRESS), getPairReserves()]).then(result => {
		LIQUIDITY_TOTAL = Web3.utils.fromWei(result[0]);
		LIQUIDITY_BALANCE = Web3.utils.fromWei(result[1]);
		PAIR_RESERVES = [
			Web3.utils.fromWei(result[2].reserve0),
			Web3.utils.fromWei(result[2].reserve1),
		];
		showLiquidityInfo();
	})

	getPairAllowance(CURRENT_ADDRESS, STAKE_CONTRACT_ADDRESS).then((result) => {
		PAIR_TOKEN_ALLOWANCE = new web3.utils.BN(result);
		showStakeButtons();
	});

	getStakeUserInfo(CURRENT_ADDRESS).then((result) => {
		STAKE_BALANCE = web3.utils.fromWei(result.amount);
		showStakeBalance(STAKE_BALANCE);
	});

	getStakeTotal().then((result) => {
		let total = web3.utils.fromWei(result);

		$("#stake-total").html(parseFloat(total).toFixed(6));
	});

	getStakePendingReward(CURRENT_ADDRESS).then((result) => {
		let pending_reward = web3.utils.fromWei(result);
		$("#stake-earned-result").html(parseFloat(pending_reward).toFixed(10));
	})

	getXTimeToWBNBPrice();
	setInterval(getXTimeToWBNBPrice, 5000)
	connectWalletSuccess()
}

function showLiquidityInfo() {
	if (LIQUIDITY_BALANCE > 0) {
		let info = calculateLiquidityInfo(1);
		let sharing = info[2] > 0.00001 ? info[2].toFixed(12) : "<0.001%";
		$("#liquidity-balance").html(LIQUIDITY_BALANCE);
		$("#liquidity-balance-bnb").html(info[0].toFixed(12));
		$("#liquidity-balance-xtime").html(info[1].toFixed(12));
		$("#liquidity-balance-sharing").html(sharing);
		$(".poll-body-content-detail").addClass("hide");
		$(".poll-body-liquidity-box").removeClass("hide");
	}
}

function showLiquidityPay() {
	if (REMOVE_LIQUIDITY_PERCENT > 0) {
		let info = calculateLiquidityInfo(REMOVE_LIQUIDITY_PERCENT / 100);
		$("#liquidity-get-balance-bnb").html(info[0].toFixed(12));
		$("#liquidity-get-balance-xtime").html(info[1].toFixed(12));
		$("#btn-confirm-remove-liquidity").attr("disabled", false);
	} else {
		$("#btn-confirm-remove-liquidity").attr("disabled", true);
	}
}

function calculateLiquidityInfo(percent) {
	let value = percent * LIQUIDITY_BALANCE;
	let bnb = value / LIQUIDITY_TOTAL * PAIR_RESERVES[0];
	let xtime = value / LIQUIDITY_TOTAL * PAIR_RESERVES[1];
	return [bnb, xtime, value / LIQUIDITY_TOTAL];
}

function showBalance() {
	if (SWAP_WAY === 1) {
		$("#label-balance-from").html(`Balance: ${parseFloat(BNB_BALANCE).toFixed(6)}`);
		$("#label-balance-from").removeClass("hide");
		$("#label-balance-to").html(`Balance: ${parseFloat(XTIME_BALANCE).toFixed(6)}`);
		$("#label-balance-to").removeClass("hide");
	} else {
		$("#label-balance-from").html(`Balance: ${parseFloat(XTIME_BALANCE).toFixed(6)}`);
		$("#label-balance-from").removeClass("hide");
		$("#label-balance-to").html(`Balance: ${parseFloat(BNB_BALANCE).toFixed(6)}`);
		$("#label-balance-to").removeClass("hide");
	}

	$("#label-poll-balance-A").html(`Balance: ${BNB_BALANCE}`);
	$("#label-poll-balance-B").html(`Balance: ${XTIME_BALANCE}`);
}

function calculateSwapToNumber() {
	if (SWAP_WAY === 1) {
		return SWAP_FROM_VALUE === "" ? "" : (SWAP_FROM_VALUE * XTIME_PRICE).toFixed(18);
	} else {
		return SWAP_FROM_VALUE === "" ? "" : (SWAP_FROM_VALUE / XTIME_PRICE).toFixed(18);
	}
}

function calculateSwapFromNumber() {
	if (SWAP_WAY === 1) {
		return SWAP_TO_VALUE === "" ? "" : SWAP_TO_VALUE / XTIME_PRICE;
	} else {
		return SWAP_TO_VALUE === "" ? "" : SWAP_TO_VALUE * XTIME_PRICE;
	}
}

function calculatePollXTimeNumber() {
	if (POLL_AMOUNT_BNB === "") {
		POLL_AMOUNT_XTIME = "";
	} else {
		POLL_AMOUNT_XTIME = (POLL_AMOUNT_BNB * XTIME_PRICE).toFixed(18);
	}
	$("#input-poll-B").val(POLL_AMOUNT_XTIME);
}

function calculatePollBNBNumber() {
	if (POLL_AMOUNT_XTIME === "") {
		POLL_AMOUNT_BNB = "";
	} else {
		POLL_AMOUNT_BNB = (POLL_AMOUNT_XTIME / XTIME_PRICE).toFixed(18);
	}
	$("#input-poll-A").val(POLL_AMOUNT_BNB);
}

function checkPollInputValue() {
	if (parseFloat(POLL_AMOUNT_BNB) > 0 && parseFloat(POLL_AMOUNT_XTIME) > 0 && parseFloat(POLL_AMOUNT_BNB) <= parseFloat(BNB_BALANCE) && parseFloat(POLL_AMOUNT_XTIME) <= parseFloat(XTIME_BALANCE)) {
		$("#btn-poll-confirm-supply").attr("disabled", false);
	} else {
		$("#btn-poll-confirm-supply").attr("disabled", true);
	}
}

function checkSwapInputValue() {
	if (SWAP_FROM_VALUE > 0 && SWAP_TO_VALUE > 0) {
		if (SWAP_WAY === 1 && parseFloat(SWAP_FROM_VALUE) <= parseFloat(BNB_BALANCE)) {
			$("#btn-confirm-swap").attr("disabled", false);
			$("#btn-confirm-swap").html("Swap");
			return;
		} else if (SWAP_WAY === 2 && parseFloat(SWAP_FROM_VALUE) <= parseFloat(XTIME_BALANCE)) {
			$("#btn-confirm-swap").attr("disabled", false);
			$("#btn-confirm-swap").html("Swap");
			return;
		}
	}

	$("#btn-confirm-swap").attr("disabled", true);
	$("#btn-confirm-swap").html("Insufficient BNB balance");
}

function connectWalletSuccess() {
	$("#btn-connect-wallet").addClass("hide");
	$("#btn-poll-connect-wallet").addClass("hide");
	$("#btn-confirm-swap").removeClass("hide");
	$("#btn-poll-confirm-supply").removeClass("hide");
}

function hidePageShowSwap() {
	if ($(".swap-container").hasClass("hide")) {
		$(".index-container").addClass("hide");
		$(".swap-container").removeClass("hide");
	}
}

function showStakeButtons() {
	if (PAIR_TOKEN_ALLOWANCE.gt(new web3.utils.BN("0"))) {
		$("#btn-enable-stake").addClass("hide");
		$("#btn-increase-stake").removeClass("hide");
		$("#btn-reduce-stake").removeClass("hide");
	} else {
		$("#btn-enable-stake").removeClass("hide");
		$("#btn-increase-stake").addClass("hide");
		$("#btn-reduce-stake").addClass("hide");
	}
}

function showStakeBalance(value) {
	$("#stake-staked-result").html(parseFloat(value).toFixed(6))
}

function calculateStakeValue(percent) {
	let result;

	if (STAKE_CHANGE_WAY === 1) {
		result = LIQUIDITY_BALANCE * percent;
	} else {
		result = STAKE_BALANCE * percent;
	}
	return result;
}

function checkStakeInputValue(value) {
	let wei_value = new web3.utils.BN(web3.utils.toWei(value.toString()));
	let wei_liquidity_balance = new web3.utils.BN(web3.utils.toWei(LIQUIDITY_BALANCE));
	let wei_stake_balance = new web3.utils.BN(web3.utils.toWei(STAKE_BALANCE));

	if (STAKE_CHANGE_WAY === 1 && wei_value.lte(wei_liquidity_balance)) {
		$("#confirm-change-stake").attr("disabled", false);
	} else if(STAKE_CHANGE_WAY === 2 && wei_value.lte(wei_stake_balance)) {
		$("#confirm-change-stake").attr("disabled", false);
	} else {
		$("#confirm-change-stake").attr("disabled", true);
	}
}

// change the deadline
$("#input-deadline").on("input", function (e) {
	DEADLINE_TIME = $("#input-deadline").val() * 60;
})

$("#input-percent").on("input", function () {
	let value = Number($("#input-percent").val());

	if (value >= 100) {
		value = 100;
		$("#input-percent").val(100);
	}

	switch (value) {
	case 10:
		$(".btn-percent").removeClass("active");
		$("#btn-percent-10").addClass("active");
		break;
	case 15:
		$(".btn-percent").removeClass("active");
		$("#btn-percent-15").addClass("active");
		break;
	case 25:
		$(".btn-percent").removeClass("active");
		$("#btn-percent-25").addClass("active");
		break;
	default:
		$(".btn-percent").removeClass("active");
	}
	SLIPPAGE = value;
})

// click button change slippage
function settingPercentChange() {
	$("#btn-percent-10").click(function () {
		$(".btn-percent").removeClass("active");
		$(this).addClass("active");
		$("#input-percent").val(10);
		SLIPPAGE = 0.1;
	})

	$("#btn-percent-15").click(function () {
		$(".btn-percent").removeClass("active");
		$(this).addClass("active");
		$("#input-percent").val(15);
		SLIPPAGE = 0.15;
	})

	$("#btn-percent-25").click(function () {
		$(".btn-percent").removeClass("active");
		$(this).addClass("active");
		$("#input-percent").val(25);
		SLIPPAGE = 0.25;
	})
}