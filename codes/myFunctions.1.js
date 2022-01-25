//buy("hpot0",9000);buy("mpot0",9000);
var farmer_gold_keep = 10000;
// character entities
var leader = 'jmanmage';
let party_list = ['jusMerchant', 'jmanmage', 'juspriest', 'jusranger'];
//phat_targets are priority
let phat_targets = ['goldenbat','snowman','cutebee','phoenix'];
let monster_list = ['iceroamer','bee','crab','armadillo', 'croc','spider','arcticbee','osnake','snake','bat','minimush','poisio'];
var invites_sent = [true, false, false, false];

function heal_hp_or_mp() {
	//If attack mode is enabled, use potions when at certain HP points
	//If attack mode is disabled, use regen_hp or regen_mp
	if(!attack_mode) {
		if (character.hp<character.max_hp) {
			use_skill ("regen_hp");
		}
		if (character.mp<character.max_mp) {
			use_skill ("regen_mp");
		}
	} else if (attack_mode == true) {
		//If below 600HP or under 50% mana, use a potion
		//Else use regen_mp / regen_hp to conserve potions
		if (character.hp<=character.max_hp*0.8 || character.mp<=character.max_mp*0.8){
			//game_log("USING POTION");
			use_hp_or_mp();
		} else {
			if((character.hp/character.max_hp) >= (character.mp/character.max_mp)) {
				if (!is_on_cooldown("regen_mp") && character.mp<character.max_mp) {
					//game_log("using regen_mp");
					use_skill("regen_mp");
				}
			} else if (!is_on_cooldown("regen_hp") && character.hp<character.max_hp) {
				//game_log("using regen_hp");
				use_skill("regen_hp");
			}
		}
	}
}

//Checks for number of item in inventory. Helpful for potion counts (hpot0 or mpot0)
function item_quantity(name) {
	for(var i=0;i<42;i++)
	{
		if(character.items[i] && character.items[i].name==name) return character.items[i].q||0;
	}
	return 0;
}

//Checks for items location in bag, returns the slot #
function item_location(name) {
	for(var i=0;i<42;i++)
	{
		if(character.items[i] && character.items[i].name==name) return i;
	}
	return -1;
}

//Sends all items/gold to jusMerchant
function send_item_merchant() {
	//Only executes if merchant in range
	if(checkChar(party_list[0])==1){
		if(character.ctype == "warrior") {
			var inv_start = 4;
		} else {
			var inv_start = 2;
		}

		for(var i=inv_start;i<42;i++)
		{
			if(character.items[i]) {
				var item_count = character.items[i].q
				send_item("jusMerchant",i,item_count);
				sleep(100);
			}
		}
		if(character.gold > farmer_gold_keep) {
			send_gold("jusMerchant",(character.gold-farmer_gold_keep));
		}
	}
}

//Handles party functions, jusMerchant as leader
function handleParty() {
	//If party members != 4, reset invite array
	if (Object.keys(parent.party).length != 4) {
		var invites_sent = [true, false, false, false];
	}
	//For party leader jusMerchant to use
	if (character.name == party_list[0]) {
		//Sends out invites
		if (Object.keys(parent.party).length < party_list.length) {
			for (let i in party_list) {
				let player = party_list[i];
				if (player != party_list[0] && !invites_sent[i]) {
					//Send invite to player
					send_party_invite(player);
					invites_sent[i] = !invites_sent[i];
				}
			}
		}
		//For characters to accept
	} else if (!character.party) {
		accept_party_invite(party_list[0]);
	} else {
		// if we ARE in a party
		if (character.party != party_list[0]) {
			// we are in the wrong party and need to leave
			leave_party();
		}
	}
	
}

//Checks if character is in range
function checkChar(name) {
	if(!get_player(name)){
		return 0;
	} else {
		return 1;
	}
}
//Sends leader coordinates to "leadercoords"
function leaderCoord() {
	var coordinates = { map:character.map, x:character.real_x, y:character.real_y }
	set("leadercoords", coordinates);
}

//Death respawn. Pulled from examples
function handleDeath() {
	setTimeout(respawn,25000);
	return true;
	
}

//Buys potions if under a certain count
function buyPotions() {
	if(item_location("hpot0")==-1 || item_quantity("hpot0") < 100) buy("hpot0",300);
	if(item_location("mpot0")==-1 || item_quantity("mpot0") < 100) buy("mpot0",300);
}

//Movement & Targeting
function followBot() {
	var target;
    if (assist_mode) {
		var leader_entity = get_player(leader);
		target = get_target_of(leader_entity);
    } else {
        //target = get_nearest_monster({min_xp:100, max_att:100});
		target = get_target_of(leader);
		if(!target)target=get_nearest_monster({path_check:true,type:monster_list[8]});
		if(!target)target=get_nearest_monster({path_check:true,type:monster_list[9]});
		if(!target)target=get_nearest_monster({path_check:true,type:monster_list[11]});
		if(!target)target=get_nearest_monster({path_check:true,type:monster_list[10]});
    }

    if (!target) {
        // do nothing
    } else {
        if (!is_on_cooldown("attack") && in_attack_range(target)) {
            set_message("Attacking");
            if (skills_mode) useSkills(target);
			attack(target);
			//funcAttack(target);
        } else {
            if (!in_attack_range(target)) {
				if(character.ctype == "warrior") {
                    useCharge(target);
                }
				move(
					character.real_x+(target.x-character.real_x) / 2,
					character.real_y+(target.y-character.real_y) / 2
				);
			}
        }
    }
    
    if(is_moving(character)) return;
	if(!assist_mode) return;
    if(checkChar("jmanmage")==1) {
        let leader_entity = get_player(leader);
        if (!target && distance(character, leader_entity) >= 25) {
            move(
                character.real_x+(leader_entity.x-character.real_x) / 2,
                character.real_y+(leader_entity.y-character.real_y) / 2
            );
        }
    } else if (checkChar("jmanmage")==0) {
        smart_move(get("leadercoords"));
        sleep(30000);
    }
}
//Verifies all characters are on the same server
function checkServer() {
	//Add check server / move functions
	//charcter.server
}
