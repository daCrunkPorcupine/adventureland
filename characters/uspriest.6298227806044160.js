var attack_mode = true;
var assist_mode = true;
var skills_mode = true;

load_code(1);

setInterval(function(){
    partyAccept();  // accept party invite from jmanmage

    heal_hp_or_mp();
    loot();
    //send_item_merchant();
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
            
            //Heals self, or runs heal_party() to check party member HP
            if (character.hp < character.max_hp * 0.30) { 
                heal(character); 
            } else {
                heal_party();
            }
            useCurse(target);
            //if (skills_mode) useCombatSkills(target);
        } else {
            if (!in_attack_range(target)) {
				move(
					character.real_x+(target.x-character.real_x) / 2,
					character.real_y+(target.y-character.real_y) / 2
				);
			}
        }
    }

    if (distance(character, leader) > 100) {
        move(
            character.real_x+(leader.x-character.real_x) / 2,
            character.real_y+(leader.y-character.real_y) / 2
        );
    }

},1000/4);  // loops every 1/4 seconds.

function partyAccept() {
    if (!!Object.keys(parent.party).length == true) {
        // do nothing
    } else {
        accept_party_invite("jmanmage");
        game_log("Waiting for invite to party.");
    }
}

function heal_party() {
	var target;
	var lowest = 9999;
	for (var i = 0; i < parent.party_list.length; i++) {
		var member = get_player(parent.party_list[i]);
		if (member != null && !member.rip && member.hp < member.max_hp) {
			var difference = member.max_hp - member.hp;
			if (difference > 300 && difference < lowest) {
				lowest = difference;
				if (target == null || target.max_hp - target.hp > difference) {
					target = member;
				}
			}
		}
	}

	if (target != null) {
		set_message("Healing");
		heal(target);
	}
}

function useCurse(target) { 
    if (can_use("curse", target) && target.hp > target.max_hp * 0.35) {
        game_log("Curse!");
        use_skill("curse",target);
    }
}