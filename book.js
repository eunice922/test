/**
 *  WEB DB - - - - -  - - - - -  - - - - -  - - - - -  - - - - -  - - - - -  - - - - -  - - - - - 
 * */
var html5rocks = {};
html5rocks.webdb = {};
html5rocks.webdb.db = null;

html5rocks.webdb.open = function() {
  var dbSize = 5 * 1024 * 1024; // 5MB
  html5rocks.webdb.db = openDatabase("INNI_EBOOK", "1.0", "INNI_EBOOK manager", dbSize);
};

html5rocks.webdb.createTable = function() {
  var db = html5rocks.webdb.db;
  db.transaction(function(tx) {
	  tx.executeSql("DROP TABLE IF EXISTS inni_ebook1", []);
	  tx.executeSql("CREATE TABLE IF NOT EXISTS inni_ebook1(ID INTEGER PRIMARY KEY ASC, todo TEXT, added_on DATETIME)", []);
  });
};

html5rocks.webdb.addTodo = function(todoText) {
  var db = html5rocks.webdb.db;
  db.transaction(function(tx){
    var addedOn = new Date();
    tx.executeSql("INSERT INTO inni_ebook1(todo, added_on) VALUES (?,?)", 
        [todoText, addedOn],
        function() {
          html5rocks.webdb.getAllTodoItems(loadTodoItems);
        },
        html5rocks.webdb.onError);
   });
};

html5rocks.webdb.onError = function(tx, e) {
  alert("There has been an error: " + e.message);
};

html5rocks.webdb.onSuccess = function(tx, r) {

};

html5rocks.webdb.getAllTodoItems = function(renderFunc) {
	
	console.log("getAllTodoItems");
	
    var db = html5rocks.webdb.db;
    db.transaction(function(tx) {
    	tx.executeSql("SELECT * FROM inni_ebook1", [], renderFunc, 
           html5rocks.webdb.onError);
    });
};

html5rocks.webdb.deleteTodo = function(id) {
  var db = html5rocks.webdb.db;
  db.transaction(function(tx){
    tx.executeSql("DELETE FROM inni_ebook1 WHERE ID=?", [id],      
        function() {
          html5rocks.webdb.getAllTodoItems(loadTodoItems);
        }, 
        html5rocks.webdb.onError);
    });
};


var outputStr = "";
var index = -1;
function loadTodoItems(tx, rs) 
{	
	index++;
//	console.log("loadTodoItems", index);
	
	src = renderTodo(rs.rows.item(index));
	addContents( index, src );
	
//	outputStr += src;
//	$("#output").text(outputStr);
}
function renderTodo(row) {
	return row.todo;
}

/**
 *  end of WEB DB - - - - -  - - - - -  - - - - -  - - - - -  - - - - -  - - - - -  - - - - - 
 * */

var curID = 1;
var totalPage = 0;
var posX;
var timer;
var time = 2000;
var fromX;
var toX;
var dis;
var isPlay = false;
var isFirst = false;
var isLast = false;
var touch;

var typeList = new Array();
var timeList = new Array();

var xml;
var type;
var src;
var srcNum;

var video;

function onSuccess( $xml ) {
	xml = $xml;
	totalPage =  $(xml).find("page").size();
		
	html5rocks.webdb.open();
    html5rocks.webdb.createTable();
	
	setLayout();
	setContentsInfo();
	setDB();
	setEvent();
	
//	deleteTodos();
}
function deleteTodos() {
	var i;
	for(i=1; i<100; ++i) {
		html5rocks.webdb.deleteTodo(i);
	}
}
function setContentsInfo()
{
	var i;
	var n;
	
	//set types and times
	n = totalPage-1;
	typeList[0] = type = $(xml).find("page").eq(n).attr("type");
	timeList[0] = $(xml).find("page").eq(n).attr("time");
	
	for(i=0; i<totalPage; ++i) {
		srcNum = i;
		n = (i+1);
		typeList[n] = $(xml).find("page").eq(i).attr("type");
		timeList[n] = $(xml).find("page").eq(i).attr("time");
	}
	
	n = totalPage+1;
	typeList[n] = $(xml).find("page").eq(0).attr("type");
	timeList[n] = $(xml).find("page").eq(0).attr("time");
}
function setDB() {
	
	var i;
	var n;
	var src;
	
	n = totalPage-1;
	src = $(xml).find("contentsSrc").eq(n).text();	
	html5rocks.webdb.addTodo(src);
		
	for(i=0; i<totalPage; ++i) {
		n = (i+1);
		src = $(xml).find("contentsSrc").eq(i).text();		
		html5rocks.webdb.addTodo(src);
	}
	
	n = totalPage+1;
	src = $(xml).find("contentsSrc").eq(0).text();	
	html5rocks.webdb.addTodo(src);
}

function addContents( id, src ) 
{	
	var vW = 1024;
	var vH = 768;
	
	if(typeList[id] == "image") {
		$("#page"+id).append("<img src='" + src + "' />");
	} else {
		$("#page"+id).append("<video id='video"+id+"' class='videos' width='"+vW+"' height='"+vH+"' id='clip' ><source src='"+src+"' type='video/mp4'; codecs='avc1.42E01E, mp4a.40.2' /></video>");
//		$("#page"+id).append("<video id='video"+id+"' class='videos' width='"+vW+"' height='"+vH+"' id='clip' controls='controls'><source src='"+src+"' /></video>");
		
		if(id == 1) {
			$("video").attr("autoplay", "autoplay");
			video = document.getElementById("video"+id);
			fncCalled = false;
			video.play();
			
			//for ipad movie autoplay...but it doesn't work!!
			fakeClick(function() {
		    	video = document.getElementById("video"+curID);
				fncCalled = false;
				video.play();
		    });
		}
	}
}

function fakeClick(fn) {
    var $a = $('<a href="#" id="fakeClick"></a>');
        $a.bind("click", function(e) {
            e.preventDefault();
            fn();
        });

    $("body").append($a);

    var evt, 
        el = $("#fakeClick").get(0);

    if (document.createEvent) {
        evt = document.createEvent("MouseEvents");
        if (evt.initMouseEvent) {
            evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            el.dispatchEvent(evt);
        }
    }
    $(el).remove();
}
function setLayout()
{
	$("body").append("<div id='main'></div>");
	$("#main").append("<section id='book-wrapper'></section>");
	$("#book-wrapper").append("<section id='bookCase'></section>");
	
	//make pages
	var i;
	for(i=0; i<totalPage+2; ++i) {
		$("#bookCase").append("<article id='page"+i+"' class='pages'></article>");
	}
	
	//make touch area
	$("#main").append("<div id='touch-area'></div>");
	
	/*
	//make controller case
	$("#main").append("<div id='controllerCase'></div>");
		
	$("#controllerCase").append("<div id='arrowLeft' class='arrows'><img src='assets/images/arrowLeft.png' /></div>");
	$("#controllerCase").append("<div id='arrowRight' class='arrows'><img src='assets/images/arrowRight.png' /></div>");
	$("#controllerCase").append("<div id='pauseBtn' class='button'><img src='assets/images/pauseBtn.png' /></div>");
	$("#controllerCase").append("<div id='playBtn' class='button'><img src='assets/images/playBtn.png' /></div>");
	
	$("#pauseBtn").css("display", "none");
	*/
	
//	$("#main").append("<div id='output'></div>");
}

var fncCalled = false;
var now;
var end;
function setEvent() 
{	
	//set viedos
	var id;
	$("video").bind("timeupdate", function() {
		now = parseInt( this.currentTime );
		end = parseInt(this.duration);
		
		id = this.id.substr(5,1);
		timeList[id] = end;
		
		if(curID != id) {
			this.pause();
			this.currentTime = 0;
		}				
		if(now == end) {			
			if(isPlay) {
				this.pause();
				this.currentTime = 0;
			}
		}
	});
	
	//set controllers - - - - - - - - - - - - - - - - -
	
	/*
	$("#arrowLeft").click( function() {
		isPlay = false;
		onPause();
		
		goLeft();
	});
	$("#arrowRight").click( function() {
		isPlay = false;
		onPause();
		
		goRight();
	});
	*/
	
	$("#touch-area").bind( "mousedown", onMouseDown );
	$("#touch-area").bind( "mouseup", onMouseUp );
	
	$("#touch-area").bind( "touchstart", onTouchStart );
	$("#touch-area").bind( "touchend", onTouchEnd );
	
	$(".pages").bind( "touchstart", onTouchStart );
	$(".pages").bind( "touchend", onTouchEnd );
	
	$(".videos").bind( "touchstart", onTouchStart );
	$(".videos").bind( "touchend", onTouchEnd );
	
	/*
	$("#controllerCase").mouseover( function() {
		$(this).css("cursor", "pointer");
	});
	$(".button").click( function() {
		
		if(isPlay == false)	isPlay = true;
		else				isPlay = false;
		
		slidePlay(isPlay);
	});
	*/
}
function videoReset( $el) {
	$el.pause();
	$el.currentTime = 0;
	$el.play();
}

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

function slidePlay( $bl ) {
	if($bl) {
		onPlay();
	} else {
		onPause();
	}
}

var slidingTime;
function setTimer() 
{	
	if(typeList[curID] == "video") {
		slidingTime = timeList[curID] - (parseInt(video.currentTime) * 1000); //time - played time
	} else {
		slidingTime = timeList[curID];
	}
	timer = window.setTimeout( goRight, slidingTime );
	console.log(timeList[curID], slidingTime);
}
function removeTimer() {
	clearTimeout(timer);
}
/*
function onPlay() {	
	$("#playBtn").css("display", "none");
	$("#pauseBtn").css("display", "block");
	
	setTimer();
}
function onPause() {
	$("#playBtn").css("display", "block");
	$("#pauseBtn").css("display", "none");
	
	removeTimer();
}
*/
function goLeft() {
	curID--;
	if(curID < 0) {
		isFirst = true;
	}
	onSlideAnimation();
}

var delayTime;
var isSetTimer = false; //for set timer only once
function goRight() {
	curID++;
	if(curID == totalPage) {
		isLast = true;
	}
	if(curID > totalPage) {
		isLast = true;
	}
	
	console.log(curID, "time", timeList[curID]);
	removeTimer();
	isSetTimer = false;
	
	onSlideAnimation();
}
function onSlideAnimation() {
	if(isPlay == true && isSetTimer == false) {
		setTimer();
		isSetTimer = true;
	}
	if(isPlay == false) {
		removeTimer();
		isSetTimer = false;
	}
	
	//is curID is video, removeTimer !!
	if(typeList[curID] == "video") {
//		removeTimer();
//		isSetTimer = false;
		
		video = document.getElementById("video"+curID);
		fncCalled = false;
		video.play();
	}
	else {
		video.pause();
		video.currentTime = 0;
	}
	
	posX = 1024*(curID-1);
	
	$("#bookCase").animate({'marginLeft': -posX}, 300, null, onComplete);	
}
function onComplete() {
	if(isFirst) {
		curID = totalPage-1;
		$("#bookCase").css({'marginLeft': -1024*(curID-1)});
		isFirst = false;
	}
	if(isLast) {
		curID = 0;
		$("#bookCase").css({'marginLeft': -1024*(curID-1)});
		isLast = false;
	}
}
function onError() {
	alert("XML is not exist!!");
}