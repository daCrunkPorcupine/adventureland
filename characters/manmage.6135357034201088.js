// autorerun
var attack_mode=true;

load_code(1);

setInterval(function(){

	//function from load_code(1) 'myFunctions'
	heal_hp_or_mp();
	loot();
	handleDeath();
	if(!attack_mode || character.rip || character.moving) return;

	var target=get_targeted_monster();
	if(!target)
	{	
		//target=get_nearest_monster({min_xp:100,max_att:125,path_check:true,no_target:true});
		//target=get_nearest_monster({min_xp:100,max_att:200});
		if(!target)target=get_nearest_monster({no_target:true,path_check:true,type:monster_list[8]});
		if(!target)target=get_nearest_monster({no_target:true,path_check:true,type:monster_list[9]});
		if(!target)target=get_nearest_monster({path_check:true,type:monster_list[11]});
		if(!target)target=get_nearest_monster({path_check:true,type:monster_list[10]});
		if(target) change_target(target);
		else
		{
			set_message("No Monsters");
			return;
		}
	}
	
	if(!in_attack_range(target))
	{
		move(
			character.real_x+(target.real_x-character.real_x)/2,
			character.real_y+(target.real_y-character.real_y)/2
			);
		// Walk half the distance
	}
	else if(can_attack(target))
	{
		set_message("Attacking");
		attack(target);
		
	}

},1000/4); // Loops every 1/4 seconds.
//Slow loops

setInterval(function(){
	
	send_item_merchant();
	handleParty();
	leaderCoord();

},10000);

function useReflection(target) {
	if (target.max_hp > character.attack * 3 && get_target_of(target) == "juswar") {
		game_log("Using Reflection!");
		use_skill("reflection",target);
	}

}