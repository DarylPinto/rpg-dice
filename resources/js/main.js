var roll_history = [];

function rollData(dice_amount, individual_rolls, modifier, mod_type, result){
	this.dice_amount = dice_amount;
	this.individual_rolls = individual_rolls;
	this.modifier = modifier;
	this.mod_type = mod_type;
	this.result = result;
}

function randomNumberBetween(low, high){
	var difference = high - low;
	return Math.ceil(Math.random() * difference) + low;
}

function rollDice(){
	//Replace empty fields with 0
	['#dice-amount', '#faces-amount', '#modifier'].forEach(function(el){
		($(el).val().length === 0) ? $(el).val('0') : $(el).val();
	});

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
	result += modifier;

	//Add roll data to history
	roll_history.push( new rollData(dice_amount, individual_rolls, modifier, true, result) );

	console.log(roll_history[roll_history.length-1])
}