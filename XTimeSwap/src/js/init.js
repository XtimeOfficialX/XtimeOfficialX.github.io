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

function showAlert(title, body) {
	$("#info-failed-title").html(title);
	$("#info-failed-body").html(body);
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