/*/////////////////////////////////

Global Variables (inside an object)

/////////////////////////////////*/

var _r = {
	roll_history: [], //Array of roll objects
	roll_speed: 400, //Roll speed
	currently_rolling: false, //Is the dice currently being rolled?
	roll: null, //Current roll
}

/*///////////////////////////////////////////////////////

Object Constructor to contain information about each roll

///////////////////////////////////////////////////////*/

function rollData(dice_amount, faces_amount, individual_rolls, modifier, mod_type, result){
	this.dice_amount = dice_amount;
	this.faces_amount = faces_amount;
	this.individual_rolls = individual_rolls;
	this.modifier = modifier;
	this.mod_type = mod_type;
	this.result = result;

	// '+ 10' or '- 10' as a string for displaying on the page
	this.display_modifier = (modifier >= 0) ? '+ ' + modifier.toString() : '- ' + (modifier * -1).toString();

	/*
		mod_type 1: add modifier to total result
		mod_type 2: add modifier to each individual roll
	*/
}

/*//////////////

Helper functions

//////////////*/

function smoothScrollTo(id, delay, speed){

	window.setTimeout(function(){

		$('html, body').animate({
			scrollTop: $(id).offset().top
		}, speed);

	}, delay);

}

/*///////////////

Data Manipulation

///////////////*/

function incrementInputFields(direction){

	//This function is necessary to simulate the <input type='number'> up & down arrow key controls
	if( !isNaN($(document.activeElement).val()) ){

		if(direction === 'up'){
			$(document.activeElement).val(function(){
				return parseInt(this.value) + 1;
			});
		}else if(direction === 'down'){
			$(document.activeElement).val(function(){
				return parseInt(this.value) - 1;
			});
		}

	}
}

function randomNumberBetween(low, high){
	//Generate random integer between low and high
	//(Including high, not including low)
	var difference = high - low;
	return Math.ceil(Math.random() * difference) + low;
}

function cleanFields(){
	//Accept modifier that starts with '+'
	var cleaned_modifier;

	if($('#modifier').val()[0] === '+'){
		cleaned_modifier = $('#modifier').val().substr(1);
	}else{
		cleaned_modifier = $('#modifier').val();
	}

	$('#modifier').val(cleaned_modifier);

	//Replace empty fields with 0
	['#dice-amount', '#faces-amount', '#modifier'].forEach(function(el){
		($(el).val().length === 0) ? $(el).val('0') : $(el).val();
	});

}

function getRollShorthand(){
	//Generate roll shorthand with a rollData object. example: 1d20

	var shorthand;
	var display_mod_nospace = _r.roll.display_modifier.replace(/ /g, '');

	//Modifier
	if(_r.roll.modifier != 0){

		//Modifier type 2
		if(_r.roll.mod_type === 2){
			shorthand = _r.roll.dice_amount+'(d'+_r.roll.faces_amount+display_mod_nospace+')';
		}
		//Modifier type 1
		else{
			shorthand = '('+_r.roll.dice_amount+'d'+_r.roll.faces_amount+')'+display_mod_nospace;
		}
	}
	//No modifier
	else{
		shorthand = _r.roll.dice_amount+'d'+_r.roll.faces_amount;
	}

	return shorthand;
}

function getFormattedIndividualRolls(rollDataItem){
	var display_mod_nbsp = rollDataItem.display_modifier.replace(/ /g, '&nbsp;');
	var display_mod_nospace = _r.roll.display_modifier.replace(/ /g, '');

	//Modifier type 1 (Add to total)
	if(rollDataItem.mod_type === 1 && rollDataItem.modifier != 0){
		var formatted_individual_rolls = rollDataItem.individual_rolls.join(', ') + ' ' + display_mod_nbsp;	
	}
	//Modifier type 2 (Add to each individual roll)
	else if(rollDataItem.mod_type === 2 && rollDataItem.modifier != 0){
		var formatted_individual_rolls = rollDataItem.individual_rolls.map(function(num){
			return num.toString() + display_mod_nospace;
		}).join(', ');
	}
	//No Modifier
	else{
		var formatted_individual_rolls = rollDataItem.individual_rolls.join(', ');
	}

	return formatted_individual_rolls;
}

function storeDiceRoll(){
	//Store roll information

	var mod_type = 1;

	//Set variables
	var dice_amount = parseInt( $('#dice-amount').val() );
	var faces_amount = parseInt( $('#faces-amount').val() );
	var modifier = parseInt( $('#modifier').val() );
	var individual_rolls = [];
	var result = 0;

	//Create array that contains the roll of each individual die
	for(var i = 0;i < dice_amount;i++){
		individual_rolls.push( randomNumberBetween(0,faces_amount) );
	}

	//Add individual rolls to get result
	individual_rolls.forEach(function(number){
		result += number;
	});

	//Add modifier
	if(mod_type === 1){
		result += modifier;
	}else if(mod_type === 2){
		result += modifier * dice_amount;
	}

	//Add roll data to history
	var currentRoll = new rollData(
		dice_amount,
		faces_amount,
		individual_rolls,
		modifier,
		mod_type,
		result);

	_r.roll_history.push(currentRoll);
	_r.roll = _r.roll_history[_r.roll_history.length - 1];
}

/*//////////////

DOM Manipulation

//////////////*/

function hideIrrelevantSections(){
	//Hide sections that don't need to be shown (such as individual rolls for a single die)

	function showAllSections(){
		$('.individual-rolls').css('display', 'block');
		$('.total').removeClass('pure-u-1').addClass('pure-u-1-2');
		$('.total h1').html('Result');		
	}

	//Show individual rolls section and results section (resetting to normal)
	showAllSections();	

	//If there's only 1 die, hide the individual rolls section
	if(_r.roll.dice_amount === 1 && _r.roll.modifier === 0){
		$('.individual-rolls').css('display', 'none');
		$('.total').removeClass('pure-u-1-2').addClass('pure-u-1');
		$('.total h1').html( 'Rolled ' + getRollShorthand(_r.roll) );
	}
}

function keepResultVisible(){
	if( $(window).scrollTop() > $('#results').offset().top && (_r.roll.dice_amount > 1 || _r.roll.modifier != 0) ){
		$('.total span').addClass('stickied-total');
	}else{
		$('.total span').removeClass('stickied-total');
	}
}

function displayRollResult(){
	//Display Roll Results on the screen

	function updateData(){
		hideIrrelevantSections();
		
		$('#results').removeClass('closed');
		$('.individual-rolls h1').html( 'Rolled ' + getRollShorthand(_r.roll) );
		$('.individual-rolls span').html( getFormattedIndividualRolls(_r.roll) );
		$('.total span').html( _r.roll.result );
	}

	//Transition between rolls

		_r.currently_rolling = true;
		$('.results-grid').addClass('faded-out');

		window.setTimeout(function(){
			updateData();
		}, _r.roll_speed / 2);

		window.setTimeout(function(){
			$('.results-grid').removeClass('faded-out');
			_r.currently_rolling = false;
		}, _r.roll_speed );
}

function logToRollHistoryWindow(rollDataItem){
	var li = document.createElement('li');
	var roll_shorthand = document.createElement('div');
	var individual_rolls = document.createElement('div');
	var roll_result = document.createElement('div');

	$(li).addClass('pure-g roll-data-item');
	$(roll_shorthand).addClass('pure-u-1-4 archive-shorthand');
	$(individual_rolls).addClass('pure-u-1-2 archive-individual-rolls');
	$(roll_result).addClass('pure-u-1-4 archive-total');

	$(roll_shorthand).html( getRollShorthand(rollDataItem) );
	$(individual_rolls).html( getFormattedIndividualRolls(rollDataItem) );
	$(roll_result).html( rollDataItem.result );

	$(li).append(roll_shorthand, individual_rolls, roll_result);
	$('.roll-history ul').prepend(li);

}

function openOverlay(){
	$('.overlay').css('display', 'block');

	window.setTimeout(function(){
	$('.overlay').removeClass('closed');
	}, 10);
}

function closeOverlay(){
	$('.overlay').addClass('closed');

	window.setTimeout(function(){
		$('.overlay').css('display', 'none');
	}, 400);
}

/*///////////

Main Function

///////////*/

function rollDice(){

	if(!_r.currently_rolling){ //Prevent spam rolling

		//Validate user's inputs
		cleanFields();

		//Store data from input fields
		storeDiceRoll();

		//Log Roll to Roll History Popup window
		logToRollHistoryWindow(_r.roll);

		//Display Roll Results on screen
		displayRollResult();

		//Scroll to results
		smoothScrollTo('#results', _r.roll_speed, 500);

	}
}