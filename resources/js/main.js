var roll_history = [];

function rollData(dice_amount, faces_amount, individual_rolls, modifier, mod_type, result){
	this.dice_amount = dice_amount;
	this.faces_amount = faces_amount;
	this.individual_rolls = individual_rolls;
	this.modifier = modifier;
	this.mod_type = mod_type;
	this.result = result;

	/*
		mod_type 1: add modifier to total result
		mod_type 2: add modifier to each individual roll
	*/
}

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

function rollDice(){

	var mod_type = 1;

	cleanFields();

	//Set variables
	var dice_amount = parseInt($('#dice-amount').val());
	var faces_amount = parseInt($('#faces-amount').val());
	var modifier = parseInt($('#modifier').val());
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
	var currentRoll = new rollData();
	currentRoll.dice_amount = dice_amount;
	currentRoll.faces_amount = faces_amount;
	currentRoll.individual_rolls = individual_rolls;
	currentRoll.modifier = modifier;
	currentRoll.mod_type = mod_type;
	currentRoll.result = result;

	roll_history.push(currentRoll);

	//Display Roll Results on screen
	displayRollResult(currentRoll);
}

function getRollShorthand(roll){
	//Generate roll shorthand with a rollData object. example: 1d20
	var shorthand;
	var modifier_operator = (roll.modifier < 0) ? '' : '+';

	//Modifier
	if(roll.modifier != 0){

		//Modifier type 2
		if(roll.mod_type === 2){
			shorthand = roll.dice_amount+'(d'+roll.faces_amount+modifier_operator+roll.modifier+')';
		}
		//Modifier type 1
		else{
			shorthand = '('+roll.dice_amount+'d'+roll.faces_amount+')'+modifier_operator+roll.modifier;
		}
	}
	//No modifier
	else{
		shorthand = roll.dice_amount+'d'+roll.faces_amount;
	}

	return shorthand;
}

function hideIrrelevantFields(){
	var currentRoll = roll_history[roll_history.length - 1];

	//Reset to normal
	$('.individual-rolls').css('display', 'block');
	$('.total').removeClass('pure-u-1').addClass('pure-u-1-2');
	$('.total h1').html( 'Result' );

	//If there's only 1 die, hide the individual rolls section
	if(currentRoll.dice_amount === 1 && currentRoll.modifier === 0){
		$('.individual-rolls').css('display', 'none');
		$('.total').removeClass('pure-u-1-2').addClass('pure-u-1');
		$('.total h1').html( 'Rolled ' + getRollShorthand(currentRoll) );
	}
}

function displayRollResult(roll){

	hideIrrelevantFields();
	var modifier_operator = (roll.modifier < 0) ? '' : '+';
	'+modifier_operator+'
	//Modifier type 1 (Add to total)
	if(roll.mod_type === 1 && roll.modifier != 0){
		var formatted_individual_rolls = roll.individual_rolls.join(', ') + ' '+modifier_operator+'&nbsp;' + roll.modifier;	
	}
	//Modifier type 2 (Add to each individual roll)
	else if(roll.mod_type === 2 && roll.modifier != 0){
		var formatted_individual_rolls = roll.individual_rolls.map(function(num){
			return num.toString() + modifier_operator + roll.modifier;
		}).join(', ');
	}
	//No Modifier
	else{
		var formatted_individual_rolls = roll.individual_rolls.join(', ');
	}

	$('.results').removeClass('closed');
	$('.individual-rolls h1').html( 'Rolled ' + getRollShorthand(roll) );
	$('.individual-rolls span').html( formatted_individual_rolls );
	$('.total span').html( roll.result );
}