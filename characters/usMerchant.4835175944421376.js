// autorerun
var attack_mode=false

var loops=0;

map_key("5","snippet","transferPots()");

load_code(1);

setInterval(function(){

	use_hp_or_mp();
	loot();
	handleDeath();

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
	//partyAccept();  // accept party invite from jmanmage
	
	//Runs item upgrade/compound loops
	itemUpgrade();
	itemCompound();
	handleParty();
	if(checkChar("jmanmage")==1){
		transferPots();
	}

},6000);

//Runs walking loop
setInterval(function(){
	walkLoop();


},1000*6000);


async function walkLoop() {
	
	await game_log("STARTING walkLoop()");
	//closes stand
	await parent.close_merchant(0);
	await smart_move(get("leadercoords"));
	await sleep(240000);
	await smart_move({map:"main",x:-175,y:-65});
	await sleep(240000);
	await parent.open_merchant(0);
	await game_log("FINISHED walkLoop()");
	
}

//Change to get party names dynamically
function transferPots() {
	var check_item = "mpot0";
	var item_count = item_quantity(check_item);
	var item_inv = item_location(check_item);
	if(item_count >= 1) {
		send_item(party_list[1],item_inv,item_count/3);
		sleep(100);
		send_item(party_list[2],item_inv,item_count/3);
		sleep(100);
		send_item(party_list[3],item_inv,item_count/3);
		sleep(100);
	}
	sleep(100);
	var check_item = "hpot0";
	var item_count = item_quantity(check_item);
	var item_inv = item_location(check_item);
	if(item_count >= 1) {
		send_item(party_list[1],item_inv,item_count/3);
		sleep(100);
		send_item(party_list[2],item_inv,item_count/3);
		sleep(100);
		send_item(party_list[3],item_inv,item_count/3);
		sleep(100);
	}
}

function itemUpgrade() {

	if(item_location("scroll0")==-1 || item_quantity("scroll0") < 25) buy("scroll0",25);
	//if(item_location("scroll1")==-1 || item_quantity("scroll1").q<25) buy("scroll1",25);

	for(var i=0;i<42;i++)
	{
		if(!character.items[i]) continue;
		var item=character.items[i];
		var def=G.items[item.name];
		if(!def.upgrade) continue; // check whether the item is upgradeable
		if(item_grade(item)==2) continue; // rare item
		if(item_grade(item)==1) continue; // skip high items for now
		if(item_grade(item)==0) upgrade(i,item_location("scroll0"));
		//if(item_grade(item)==1) upgrade(i,item_location("scroll1"));
		break;
	}
}

function itemCompound() {
	var done=false;

	if(item_location("cscroll0")==-1 || item_quantity("cscroll0").q<25) buy("cscroll0",25);

	for(var i=0;i<42;i++)
	{
		if(!character.items[i]) continue;
		var item=character.items[i];
		var def=G.items[item.name];
		if(!def.compound) continue; // check whether the item can be compounded
		for(var j=i+1;j<42;j++)
		{
			if(!character.items[j]) continue;
			if(character.items[j].name!=character.items[i].name) continue;
			if(character.items[j].level!=character.items[i].level) continue;
			for(var k=j+1;k<42;k++)
			{
				if(!character.items[k]) continue;
				if(character.items[k].name!=character.items[i].name) continue;
				if(character.items[k].level!=character.items[i].level) continue;
				if(!done) // to prevent combining multiple items in one loop
				{
					var offering=null;
					// if(item.level==2) offering=item_location("offering");
					if(item_grade(item)==2) continue; // rare item
					if(item_grade(item)==1) continue; // skip high items for now
					if(item_grade(item)==0) compound(i,j,k,item_location("cscroll0"),offering);
					//if(item_grade(item)==1) compound(i,j,k,item_location("cscroll1"),offering);
					done=true;
				}
			}
		}
	}
}
