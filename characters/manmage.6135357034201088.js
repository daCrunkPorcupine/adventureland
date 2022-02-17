// autorerun
// Mage code (Primary Leader) //
var attack_mode=true;
var skills_mode=true;

load_code(1);
load_code("mainfunctions");
fixAddLog();

setInterval(function(){

	//function from load_code(1) 'myFunctions'
	heal_hp_or_mp();
	loot();
	if(character.rip) handleDeath();
	if(!attack_mode || character.rip || character.moving) return;

	var target=get_targeted_monster();
	if(!target)	{
		for(let targetArray of phat_targets) {
			target = get_nearest_monster({path_check:true,type:targetArray})
			if(target) break;
		}
		if(!target) {
			for(let targetArray of monster_list) {
				if(!attack_mode || character.rip || character.moving) return;
				target = get_nearest_monster({path_check:true,type:targetArray});
				if(target) break;
			}	
		}
		//target=get_nearest_monster({min_xp:100,max_att:125,path_check:true,no_target:true});
		//target=get_nearest_monster({min_xp:100,max_att:200});
		
		if(target) change_target(target);
		else
		{
			set_message("No Monsters");
			//Moves to farming area if out of range / dead
			if(!is_moving(character)) {
				//bats
				let coordinates = {map:'cave',x:'138',y:'-1167'}
				//arcticbee
				//let coordinates = {map:'winterland',x:'682',y:'-967'}
				//iceroamer
				//let coordinates = {map:'winterland',x:'608',y:'4'}
				//mushrooms
				//let coordinates = {map:'halloween',x:'-156',y:'535'}
				
				smart_move(coordinates);
			}
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
		if (skills_mode) useSkills(target);
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


}

function useSkills(target) {
    //Variables
	var hp_multi = 5

	if (!is_on_cooldown("reflection") && target.hp >= character.attack * hp_multi) {
		let tank_entity = get_player('juswar');
		if (get_target_of(target)==tank_entity) {
			game_log('Using Reflection!');
			use_skill('reflection','juswar');
		}
	}

}