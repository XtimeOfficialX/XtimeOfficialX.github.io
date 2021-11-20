/*
	Background slideshow
*/
function intervalChangeBackground() {
	var filelist = ["bg1.jpg", "bg2.png", "bg3.png", "bg4.jpg"];
	var counterN = 1;

	setInterval(() => {
		counterN++;
		document.getElementById("app").style.backgroundImage = "url('../img/countdown/" + filelist[counterN % filelist.length] + "')";
	}, 7000);
}

/*
	Countdown initializer
*/
function initCountdownElements() {
	var now = new Date();
	var finaldate = new Date("NOV 20 2021 14:00 UTC ");
	var countTo = finaldate.getTime() - now.getTime() + now.valueOf();
	$(".timer").countdown(countTo, function (event) {
		var $this = $(this);
		switch (event.type) {
		case "seconds":
		case "minutes":
		case "hours":
		case "days":
		case "weeks":
		case "daysLeft":
			$this.find('span.' + event.type).html(event.value);
			break;
		case "finished":
			$this.hide();
			break;
		}
	});
}

function showAlert() {
	$("#alert").removeClass("hide");
	setTimeout(function () {
		$("#alert").addClass("hide")
	}, 3000)
}

function showSuccessInfo(title, body) {
	$("#info-success-title").html(title);
	$("#info-success-body").html(body);
	$("#success-info").removeClass("hide");
	setTimeout(function () {
		$("#success-info").addClass("hide")
	}, 3000)
}