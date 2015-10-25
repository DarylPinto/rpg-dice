$('#roll-dice-button').click(function(){
	rollDice();
});

$('.dice-input').click(function(){
	this.select();
});

$('#show-history').click(function(){
	openOverlay();
});

$('.blackout').click(function(){
	closeOverlay();
});

//Key Bindings
var keys = {
	enter: 13,
	esc: 27,
	uparrow: 38,
	downarrow: 40,
}

$(document).keydown(function(e) {
	switch(e.which) {
		case keys.enter:
			rollDice();
			break;
		case keys.esc:
			closeOverlay();
			break;
		case keys.uparrow:
			incrementInputFields('up');
			break;
		case keys.downarrow:
			incrementInputFields('down');
			break;
		default: return;
	}
	e.preventDefault();
});

//When the page loads
$(document).ready(function() {
});

//When the window is Resized
$( window ).resize(function() {

	keepResultVisible();

});

//When the page scrolls
$(window).scroll(function() {

	keepResultVisible();

});