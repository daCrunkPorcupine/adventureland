// autorerun
// Ranger Code
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
    useMark(target);
    useSupershot(target);
    
}

function useMark(target) {
    var hp_multi = 6
    if (!is_on_cooldown("huntersmark") && target.hp >= character.attack * hp_multi) {
        game_log("Hunters Mark!");
        use_skill("huntersmark",target);
    }
}

function useSupershot(target) {
    var hp_multi = 6
    //game_log("Chkatt: " + target.max_hp + " vs " + character.attack * hp_multi);
    if (!is_on_cooldown("supershot") && target.hp >= character.attack * hp_multi) {
        game_log("Supershot!");
        use_skill("supershot",target);
    }
}

// 3 SHOT
let last_use_3shot = 0;
function skill3shot(targets, manaReserve = 0.7) {
    if(character.ctype !== "ranger") return // We're not a ranger, we can't use 3shot
    if(is_on_cooldown("attack")) return // We can't attack, it's on cooldown
    if(Date.now() - last_use_3shot >= 1000) return // We don't want to 3shot too often
    if(manaReserve < (character.mp / character.max_mp)) return // We are low on mana, don't use 3shot
    if(targets.length < 3) return // Not enough targets to 3shot
    
    // Remove all targets out of range
    let inRangeTargets = [];
    for(const target of targets) {
        if(!is_in_range(target)) continue // Out of range
        inRangeTargets.push(target)
    }
    
    if(inRangeTargets.length < 3) return // Not enough targets to 3shot
    
    log("3 SHOT")
    use_skill("3shot", inRangeTargets)
    last_use_3shot = Date.now()
}
// 3 SHOT