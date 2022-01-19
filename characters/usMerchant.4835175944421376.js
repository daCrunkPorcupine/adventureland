var attack_mode=false

var loops=0;

map_key("5","snippet","transferPots()");

load_code(1);
setInterval(function(){

	use_hp_or_mp();
	loot();
	/**
	var check_item = "mpot0";
	var item_count = item_quantity(check_item);
	var item_inv = item_location(check_item);
	game_log(check_item + ": " + item_count);
	game_log(check_item + ": " + item_inv);
	**/

	if(!attack_mode || character.rip || is_moving(character)) return;

	var target=get_targeted_monster();
	if(!target)
	{
		target=get_nearest_monster({min_xp:100,max_att:120});
		if(target) change_target(target);
		else
		{
			set_message("No Monsters");
			return;
		}
	}
	
	if(!is_in_range(target))
	{
		move(
			character.x+(target.x-character.x)/2,
			character.y+(target.y-character.y)/2
			);
		// Walk half the distance
	}
	else if(can_attack(target))
	{
		set_message("Attacking");
		attack(target);
	}

},1000/4); // Loops every 1/4 seconds.
setInterval(function(){
	partyAccept();  // accept party invite from jmanmage

	transferPots();
	//Runs item upgrade loops
	//itemUpgrade();
	

},6000);

function partyAccept() {
    if (!!Object.keys(parent.party).length == true) {
        // do nothing
    } else {
        accept_party_invite("jmanmage");
        game_log("Waiting for invite to party.");
    }
}

function transferPots() {
	var check_item = "mpot0";
	var item_count = item_quantity(check_item);
	var item_inv = item_location(check_item);
	if(item_count >= 1) {
		send_item("jmanmage",item_inv,item_count/3);
		sleep(100);
		send_item("juswar",item_inv,item_count/3);
		sleep(100);
		send_item("jusranger",item_inv,item_count/3);
		sleep(100);
	}
	sleep(100);
	var check_item = "hpot0";
	var item_count = item_quantity(check_item);
	var item_inv = item_location(check_item);
	if(item_count >= 1) {
		send_item("jmanmage",item_inv,item_count/3);
		sleep(100);
		send_item("juswar",item_inv,item_count/3);
		sleep(100);
		send_item("jusranger",item_inv,item_count/3);
		sleep(100);
	}
}

function itemUpgrade() {

	if(item_location("scroll0")==-1 || item_quantity("scroll0") < 25) buy("scroll0",50);
	//if(locate_item("scroll1")==-1 || return_item("scroll1").q<25) buy("scroll1",50);

	for(var i=0;i<42;i++)
	{
		if(!character.items[i]) continue;
		var item=character.items[i];
		var def=G.items[item.name];
		if(!def.upgrade) continue; // check whether the item is upgradeable
		if(item_grade(item)==2) continue; // rare item
		if(item_grade(item)==0) upgrade(i,item_location("scroll0"));
		//if(item_grade(item)==1) upgrade(i,locate_item("scroll1"));
		break;
	}
}