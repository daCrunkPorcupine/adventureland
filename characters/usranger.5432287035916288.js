// autorerun
load_code(1);

let attack_mode = true;
let assist_mode = false;
let skills_mode = true;


setInterval(function(){
    //partyAccept();  // accept party invite from jmanmage

	heal_hp_or_mp();
    loot();
    handleDeath();
    if(!attack_mode || character.rip) return;
    followBot();
    
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