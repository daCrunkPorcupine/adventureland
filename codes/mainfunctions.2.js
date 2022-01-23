//Char variables
const party_leader = "jmanmage";

function testing() {
	game_log("TESTING SUCCESS!");
}

async function funcAttack(target) {
    try {
        // TODO: #1: If we have a monster hunt, and it's doable, attack that monster

        if (target){
            //attacks the target set waits for confirmation from server before sending
            if(distance(character, target) <= character.range) {
                await attack(target);
                reduce_cooldown("attack", Math.min(...parent.pings))
            }
            
        }
    } catch (e) {
        console.error(e)
    }
    setTimeout(async () => { funcAttack() }, Math.max(100, ms_to_next_skill("attack")))
}

async function funcLoop() {
    try {
        loot()
    } catch (e) {
        console.error(e)
    }
    setTimeout(async () => { funcLoop() }, 250)
}

async function funcTargeting() {
	let target;

	if (character.name === party_leader) {
	target = get_nearest_monster();
	} else {
	const party_leader_entity = get_player(party_leader);
	target = get_target_of(party_leader_entity);
	}

}