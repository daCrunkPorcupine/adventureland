// autorerun
var attack_mode = true;
var assist_mode = false;
var skills_mode = true;

load_code(1);

setInterval(function(){
    //partyAccept();  // accept party invite from jmanmage

	heal_hp_or_mp();
    loot();
    handleDeath();
    if(!attack_mode || character.rip) return;

    // character entities
    var leader = get_player("jmanmage");

    var target;
    if (assist_mode) {
        target = get_target_of(leader);
    } else {
        target = get_nearest_monster({min_xp:100, max_att:100});
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
    if(is_moving(character)) return;
    if(assist_mode){
        if(checkChar(leader)==1){
            if (distance(character, leader) > 25) {
                move(
                    character.real_x+(leader.x-character.real_x) / 2,
                    character.real_y+(leader.y-character.real_y) / 2
                );
            }
        } else {
            smart_move(get("leadercoords"));
            sleep(30000);
        }
    }
    

},1000/4); // Loops every 1/4 seconds.
//Slow loops
setInterval(function(){
	send_item_merchant();
    handleParty();
},30000);

function useSkills(target) {
    useMark(target);
    useSupershot(target);
}

function useMark(target) { 
    if (can_use("huntersmark", target) && target.hp > target.max_hp * 0.35) {
        game_log("Hunters Mark!");
        use_skill("huntersmark",target);
    }
}

function useSupershot(target) {
    var hp_multi = 8
    //game_log("Chkatt: " + target.max_hp + " vs " + character.attack * hp_multi);
    if (can_use("supershot", target) && target.hp > target.max_hp * 0.70 && target.max_hp > character.attack * hp_multi) {
        game_log("Supershot!");
        use_skill("supershot",target);
    }
}