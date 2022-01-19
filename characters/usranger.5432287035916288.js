var attack_mode = true;
var assist_mode = true;
var skills_mode = true;

load_code(1);

setInterval(function(){
    partyAccept();  // accept party invite from jmanmage

	heal_hp_or_mp();
	//send_item_merchant();
    loot();
    if(!attack_mode || character.rip) return;

    // character entities
    var leader = get_player("jmanmage");

    var target;
    if (assist_mode) {
        target = get_target_of(leader);
    } else {
        target = get_nearest_monster({min_xp:targetMinXP, max_att:targetMaxAttack});
    }

    if (!target) {
        // do nothing
    } else {
        if (can_attack(target)) {
            set_message("Attacking");
            attack(target);
			//useMark(target);
            if (skills_mode) useSkills(target);
        } else {
            if (!in_attack_range(target)) {
				move(
					character.real_x+(target.x-character.real_x) / 2,
					character.real_y+(target.y-character.real_y) / 2
				);
			}
        }
    }

    if (distance(character, leader) > 25) {
        move(
            character.real_x+(leader.x-character.real_x) / 2,
            character.real_y+(leader.y-character.real_y) / 2
        );
    }

},1000/4); // Loops every 1/4 seconds.
//Slow loops
setInterval(function(){
	send_item_merchant();

},6000);

function useSkills(target) {
    useMark(target);
}

function useMark(target) { 
    if (can_use("huntersmark", target) && target.hp > target.max_hp * 0.35) {
        game_log("Hunters Mark!");
        use_skill("huntersmark",target);
    }
}