//Mostly test functions
//Changing code from 'myFunctions.1.js -> 'mainfunctions.2.js' with async functions

//Char variables
let party_leader = "jmanmage";

function testing() {
	game_log("TESTING SUCCESS!");
}

async function funcAttack(target) {
    try {
        if (target){
            //attacks the target set waits for confirmation from server before sending
            if(distance(character, target) <= character.range) {
                await attack(target);
                reduce_cooldown("attack", Math.min(...parent.pings))
            }
            else {
                if (distance(character, target) > character.range) {
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
    } catch (e) {
        console.error(e)
    }
    setTimeout(async () => { funcAttack() }, 1000);
}

/**
async function funcAttack(target) {
    try {
        // TODO: #1: If we have a monster hunt, and it's doable, attack that monster

        if (target){
            //attacks the target set waits for confirmation from server before sending
            if(distance(character, target) <= character.range) {
                await attack(target);
                reduce_cooldown("attack", Math.min(...parent.pings))
            }
            else {
                if (distance(character, target) > character.range) {
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
    } catch (e) {
        console.error(e)
    }
    setTimeout(async () => { funcAttack() }, Math.max(100, ms_to_next_skill("attack")))
}
**/

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
	let party_leader_entity = get_player(party_leader);
	target = get_target_of(party_leader_entity);
	}
    return target;
}

async function moveLoop() {
    try {
        let party_leader_entity = get_player(party_leader);
        if (!target && distance(character,party_leader_entity) >= 25) {
            move(
                character.real_x+(leader.x-character.real_x) / 2,
                character.real_y+(leader.y-character.real_y) / 2
            );
        } 

    } catch (e) {
        console.error(e)
    }
    setTimeout(async () => { moveLoop() }, 250)
}