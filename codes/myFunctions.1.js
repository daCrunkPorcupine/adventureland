//buy("hpot0",9000);buy("mpot0",9000);
var farmer_gold_keep = 10000;
// character entities
var leader = 'jmanmage';
let party_list = ['jusMerchant', 'jmanmage', 'juspriest', 'juswar'];
//phat_targets are priority
let phat_targets = ['goldenbat','snowman','cutebee','phoenix','mvampire','pinkgoo'];
let monster_list = ['iceroamer','osnake','snake','bat','minimush','poisio','arcticbee','booboo'];
var invites_sent = [true, false, false, false];
const send_whitelist = ['tracker'];
const sell_list = ['hpbelt'];
const junk = ['ringsj', 'hpamulet', 'hpbelt','bwing'];
const merchantTown = {map:"main",x:-175,y:-65};
var mpot_ct;
var hpot_ct;

function heal_hp_or_mp() {
	//If below 80%HP or under 70% mana, use a potion
	//Else use regen_mp / regen_hp to conserve potions
	if (character.hp<=character.max_hp*0.8 || character.mp<=character.max_mp*0.7){
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
		var inv_start = 2;
		/**
		if(character.ctype == "warrior") {
			var inv_start = 4;
		} else {
			var inv_start = 2;
		}
		*/

		for(var i=inv_start;i<42;i++)
		{
			if(character.items[i]) {
				if(send_whitelist.includes(character.items[i].name)) continue;
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
async function handleDeath() {
	setTimeout(respawn,25000);
	await ns.sleep(1000);
	return true;
	
}

//Buys potions if under a certain count
function buyPotions(hpot_ct,mpot_ct) {
	//if(item_location("hpot0")==-1 || item_quantity("hpot0") < 100) buy("hpot0",hpot_ct);
	//if(item_location("mpot0")==-1 || item_quantity("mpot0") < 100) buy("mpot0",mpot_ct);
	if(item_location("hpot0")==-1 || item_quantity("hpot0") < hpot_ct) {
		buy("hpot0",(hpot_ct - item_quantity("hpot0")));
	}
	if(item_location("mpot0")==-1 || item_quantity("mpot0") < mpot_ct) {
		buy("mpot0",(mpot_ct - item_quantity("mpot0")));
	}
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
				//smart_move(target);

				xmove(character.x + (target.x - character.x) / 2, character.y + (target.y - character.y) / 2);
				/**
				move(
					character.real_x+(target.x-character.real_x) / 2,
					character.real_y+(target.y-character.real_y) / 2
				);
				**/
			}
        }
    }
    
    //if(is_moving(character)) return;
	if(!assist_mode) return;
	if(checkChar("jmanmage")==1 && assist_mode) {
        let leader_entity = get_player(leader);
        if (!target && distance(character, leader_entity) >= 25) {
            move(
                character.real_x+(leader_entity.x-character.real_x) / 2,
                character.real_y+(leader_entity.y-character.real_y) / 2
            );
        }
    } else if (checkChar("jmanmage")==0 && assist_mode) {
        if(!is_moving(character)) {
			if(is_moving(character)) return;
			smart_move(get("leadercoords"));
			//Test & Fix smartmove
			//bats
			//let coordinates = {map:'cave',x:'138',y:'-1167'}
			//arcticbee
			//let coordinates = {map:'winterland',x:'682',y:'-967'}
			//iceroamer
			//let coordinates = {map:'winterland',x:'608',y:'4'}
			//smart_move(coordinates);
		}
        sleep(30000);
    }
	
}
//Verifies all characters are on the same server
function checkServer() {
	//Add check server / move functions
	//charcter.server
}

//Log Filters
function fixAddLog()
{
    if (parent.addLogFixed) {
        return;
    }

    const oldAddLog = parent.add_log;
    const regex = /killed|gold/;
    parent.add_log = (message, color) => {
        if (typeof message === 'string' && !message.match(regex)) {
            oldAddLog(message, color);
        }
    };

    parent.addLogFixed = true;
}

async function selljunk() {
    for (id in junk) {
        let loc = locate_item(junk[id]);
        while(loc >= 0) {
            sell(loc, 1);
            loc = locate_item(junk[id]);
            await sleep(10);
        }
    }
}

async function returnTown() {
	await smart_move(merchantTown);
}

async function itemExchange() {
	let gemLoc = item_location('gem0');
	await smart_move('exchange');
	await sleep(100);
	for(let i = 0; i < item_quantity('gem0'); i++) {
		exchange(gemLoc);
		await sleep(10000);
		game_log(i);
	}
	await returnTown();
}