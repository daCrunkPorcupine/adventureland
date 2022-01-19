//buy("hpot0",9000);buy("mpot0",9000);
var farmer_gold_keep = 10000;

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
		if (character.hp<=character.max_hp*0.7 || character.mp<=character.max_mp*0.5){
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

function partyAccept() {
    if (!!Object.keys(parent.party).length == true) {
        // do nothing
    } else {
        accept_party_invite("jmanmage");
        game_log("Waiting for invite to party.");
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
	
	for(var i=2;i<42;i++)
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
