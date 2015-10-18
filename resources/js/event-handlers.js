$('#roll-dice').click(function(){
	rollDice();
});

//When the page loads
$(document).ready(function() {
});

//When the window is Resized
$( window ).resize(function() {
});

//When the page scrolls
$(window).scroll(function() {
});

//Key Bindings
var keys = {
	enter: 13
}

$(document).keypress(function(e){
	if (e.which == keys.enter){
		rollDice();
	}
});