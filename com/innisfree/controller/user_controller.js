function onMouseDown( e ) {
	e.preventDefault();
	
	fromX = e.clientX;
	
	isPlay = false;
	onPause(isPlay);
}
function onMouseUp( e ) {
	e.preventDefault();
	
	toX = e.clientX;
	dis = fromX - toX;
	if(Math.abs(dis) > 20) {
		if(dis > 0) {
			goRight();
		} else {
			goLeft();
		}	
	}
}
function onTouchStart( e ) {
	e.preventDefault();
	
	touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
	fromX = touch.pageX;
	
	isPlay = false;
	onPause(isPlay);
}
function onTouchEnd( e ) {
	e.preventDefault();
	
	touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
	toX = touch.pageX;
	
	dis = fromX - toX;
	if(Math.abs(dis) > 20) {
		if(dis > 0) {
			goRight();
		} else {
			goLeft();
		}
	}
}