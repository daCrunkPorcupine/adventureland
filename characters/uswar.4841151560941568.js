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
    if (assist_mode && !target) {
        if (distance(character, leader) > 25) {
            move(
                character.real_x+(leader.x-character.real_x) / 2,
                character.real_y+(leader.y-character.real_y) / 2
            );
        }
    }

},1000/4); // Loops every 1/4 seconds.
//Slow loops
setInterval(function(){

    send_item_merchant();

},6000);

function partyAccept() {
    if (!!Object.keys(parent.party).length == true) {
        // do nothing
    } else {
        accept_party_invite("jmanmage");
        game_log("Waiting for invite to party.");
    }
}

function useSkills(target) {
    useTaunt(target);
}

//Checks if skill is ready
function useCharge(target) { 
    if (can_use("charge", target)) {
        game_log("Charge!");
        use_skill("charge",target);
    }
}

function useTaunt(target) { 
    if (can_use("taunt", target) && get_target_of(target) != character) {
        use_skill("taunt", target);
    }
}