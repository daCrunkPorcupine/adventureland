// autorerun
var attack_mode=true;

load_code(1);

setInterval(function(){

	//function from load_code(1) 'myFunctions'
	heal_hp_or_mp();
	loot();
	handleDeath();
	if(!attack_mode || character.rip || is_moving(character)) return;

	var target=get_targeted_monster();
	if(!target)
	{	
		//target=get_nearest_monster({min_xp:100,max_att:125,path_check:true,no_target:true});
		target=get_nearest_monster({min_xp:100,max_att:125,path_check:true});
		if(target) change_target(target);
		else
		{
			set_message("No Monsters");
			return;
		}
	}
	
	if(!is_in_range(target))
	{
		move(
			character.x+(target.x-character.x)/2,
			character.y+(target.y-character.y)/2
			);
		// Walk half the distance
	}
	else if(can_attack(target))
	{
		set_message("Attacking");
		attack(target);
		
		if (can_use("reflection")) {
			useReflection(target);
		}
		
	}

},1000/4); // Loops every 1/4 seconds.
//Slow loops

setInterval(function(){
	
	send_item_merchant();
	handleParty();
	leaderCoord();

},30000);

function useReflection(target) {
	if (target.max_hp > character.attack * 3 && get_target_of(target) == "juswar") {
		game_log("Using Reflection!");
		use_skill("reflection",target);
	}

}