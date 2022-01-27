// autorerun
// Priest Code
load_code(1);
load_code("mainfunctions");

let attack_mode = true;
let assist_mode = true;
let skills_mode = true;


setInterval(function(){
	heal_hp_or_mp();
	funcLoop();
    if(character.rip) handleDeath();
	if(!attack_mode || character.rip) return;
    followBot();

},1000/4); // Loops every 1/4 seconds.
//Slow loops
setInterval(function(){
    send_item_merchant();
    handleParty();
},30000);


function useSkills(target) {
    //Variables
	var hp_multi = 5

	//Heals self, or runs heal_party() to check party member HP
    if (character.hp < character.max_hp * 0.70) { 
        heal(character); 
    } else {
        heal_party();
    }

	party_heal();

    if (can_use("curse", target) && target.hp >= character.attack * hp_multi) {
        game_log("Curse!");
        use_skill("curse",target);
    }

}

function heal_party() {
	var target;
	var lowest = 9999;
	for (var i = 0; i < parent.party_list.length; i++) {
		var member = get_player(parent.party_list[i]);
		if (member != null && !member.rip && member.hp < member.max_hp) {
			var difference = member.max_hp - member.hp;
			if (difference > 750 && difference < lowest) {
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

async function party_heal() {
	let heal_counter = 0;
	for (var i = 0; i < parent.party_list.length; i++) {
		if (checkChar(parent.party_list[i])) {
			var member = get_player(parent.party_list[i]);
			//game_log(parent.party_list[i] + " hp/max: " + member.hp + "/" + member.max_hp);
			if (member != null && !member.rip && member.hp <= member.max_hp * 0.7) {
				//game_log("Increment heal_counter");
				heal_counter++;
			}	
		}
		await sleep(100);
	}
	if (heal_counter >= 2 && character.mp > character.max_mp * 0.5) {
		game_log("Party heal!");
		console.log("SKILL: PARTY HEAL");
		use_skill("partyheal");
	}
}