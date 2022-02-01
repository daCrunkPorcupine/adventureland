// autorerun

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
    var hp_multi = 8
    //Taunts if not attacking warrior
    if (can_use("taunt", target) && get_target_of(target) != character) {
        use_skill("taunt", target);
    }
    //Stomps if target Max HP is higher (change logic to higher attack targets?)
    if (can_use("stomp") && target.hp > target.max_hp * 0.50 && target.max_hp > character.attack * hp_multi) {
        use_skill("stomp",target);
    }
    if (!is_on_cooldown("hardshell") && in_attack_range(target)) {
        if(target.damage_type == 'physical' && target.attack > character.hp * 0.03 && get_target_of(target) == character) {
        //Use hardshell -
        use_skill('hardshell');
        game_log('TANK MODE RAWR');
        }
    }
}
// 

//Checks if skill is ready
function useCharge(target) { 
    if (can_use("charge", target)) {
        game_log("Charge!");
        use_skill("charge",target);
    }
}