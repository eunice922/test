function onPlay() {	
	$("#playBtn").css("display", "none");
	$("#pauseBtn").css("display", "block");
	timer = window.setInterval( goRight, time );
}
function onPause() {
	$("#playBtn").css("display", "block");
	$("#pauseBtn").css("display", "none");
	clearInterval(timer);
}
function slidePlay( $bl ) {
	if($bl) {
		onPlay();
	} else {
		onPause();
	}
}

function goLeft() {
	curID--;
	if(curID < 0) {
		isFirst = true;
	}
	onSlideAnimation();
}
function goRight() {
	curID++;
	if(curID == totalPage) {
		isLast = true;
	}
	onSlideAnimation();
}
/*
function onSlideDirectly() {
	posX = 1024*curID;
	
	$("#pageState").text(curID);
	$("#bookCase").css({'marginLeft': -posX});
}*/
function onSlideAnimation() {
	posX = 1024*curID;
	
	$("#pageState").text(curID);
	$("#bookCase").animate({'marginLeft': -posX}, 300, null, onComplete);
}
function onComplete() {
	if(isFirst) {
		curID = totalPage-1;
		$("#bookCase").css({'marginLeft': -1024*curID});
		isFirst = false;
	}
	if(isLast) {
		curID = 0;
		$("#bookCase").css({'marginLeft': -1024*curID});
		isLast = false;
	}
}