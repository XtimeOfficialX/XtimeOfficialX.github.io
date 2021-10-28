let labels = document.getElementsByClassName("label");
let points = new Array();
for (let anylabel of labels) {
	console.log(anylabel.href.split("#")[1])
	let p = document.getElementById(anylabel.href.split("#")[1]);
	p.indexE = anylabel;
	points.push(p);
}
let onscrollxx = function(){

	for (let point of points) {
		if (document.documentElement.scrollTop >= (point.offsetTop - 100) && document.documentElement.scrollTop <= (
				point.offsetTop + point.offsetHeight - 50)) {
			if (point.indexE.classList.contains("active") == false) {
				for (let point of points) {
					point.indexE.classList.remove("active")
				}
				point.indexE.classList.add("active")
			}

			return
		}
	}
	for (let point of points) {
		point.indexE.classList.remove("active")
	}
}
     $(".label").bind("click touch",function(){
                    //根据a标签的href转换为id选择器，获取id元素所处的位置，并高度减50px（这里根据需要自由设置）
                    $('html,body').animate({scrollTop: ($($(this).attr('href')).offset().top -20 )},500);
					onscrollxx();
                });
window.addEventListener("scroll", onscrollxx);
