var page1;

function test() {
		
	if(localStorage.getItem("page1")) {
		page1 = localStorage.getItem("page1");
	} else {
		localStorage.setItem("page1", page1 );
	}
	
	$("body").append("<div id='main'></div>");
	$("#main").append("<img src='"+ 'data:image/jpg;base64,'+ page1 +"'></div>");
}
		








