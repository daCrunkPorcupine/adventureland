// autorerun
load_code(1);

let attack_mode = true;
let assist_mode = true;
let skills_mode = true;


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
        target = get_nearest_monster({min_xp:100, max_att:120});
    }

    if (!target) {
        // do nothing
    } else {
        if (can_attack(target)) {
            set_message("Attacking");
            attack(target);
			if (skills_mode) useSkills(target);

        } else {
            if (!in_attack_range(target)) {
				useCharge(target);
                move(
					character.real_x+(target.x-character.real_x) / 2,
					character.real_y+(target.y-character.real_y) / 2
				);
			}
        }
    }
    
    if(is_moving(character)) return;
        if(checkChar("jmanmage")){
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

},1000/4); // Loops every 1/4 seconds.
//Slow loops
setInterval(function(){

    send_item_merchant();
    handleParty();

},30000);

function partyAccept() {
    if (!!Object.keys(parent.party).length == true) {
        // do nothing
    } else {
        accept_party_invite(leader);
        game_log("Waiting for invite to party.");
    }
}

function useSkills(target) {
    var hp_multi = 8
    //Taunts if not attacking warrior
    if (can_use("taunt", target) && get_target_of(target) != character) {
        use_skill("taunt", target);
    }
    //Stomps if target Max HP is higher (change logic to higher attack targets?)
    if (!is_on_cooldown("stomp") && target.hp > target.max_hp * 0.50 && target.max_hp > character.attack * hp_multi) {
        game_log("RAAAAAWR!");
        use_skill("stomp",target);
    }
}

//Checks if skill is ready
function useCharge(target) { 
    if (can_use("charge", target)) {
        game_log("Charge!");
        use_skill("charge",target);
    }
}

function useTaunt(target) { 

}