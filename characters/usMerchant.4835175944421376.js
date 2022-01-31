// autorerun
var attack_mode=false

var upgrade_whitelist = ['pickaxe','rod'];


map_key("5","snippet","transferPots()");

load_code(1);

setInterval(function(){

	heal_hp_or_mp();
	loot();
	handleDeath();
	if(!is_moving(character)) {
		parent.open_merchant(0);
	} else if (is_moving(character)) {
		parent.close_merchant(0);
	}
	if(!attack_mode || character.rip || is_moving(character)) return;

	/**
	//IDEA: Add FISH/MINE
	if(off cooldown(fish)
  		do_fish()
	else if( off cooldown(mine)
		do_mine()
	**/

},1000/4); // Loops every 1/4 seconds.
setInterval(function(){
	//partyAccept();  // accept party invite from jmanmage
	
	//Runs item upgrade/compound loops
	itemUpgrade();
	itemCompound();
	buyPotions(50,300);
	handleParty();
	if(checkChar("jmanmage")==1){
		transferPots();
	}

},6000);

//Runs walking loop
setInterval(function(){
	walkLoop();
},1800000);


async function walkLoop() {
	
	console.log("STARTING walkLoop()");
	//closes stand
	await parent.close_merchant(0);
	await sleep(250);
	await smart_move(get("leadercoords"));
	await sleep(120000);
	await smart_move({map:"main",x:-175,y:-65});
	await sleep(120000);
	await parent.open_merchant(0);
	await sleep(250);
	console.log("FINISHED walkLoop()");
	
}

//IDEA: Change to get party names dynamically;
//IDEA: Change to loop
async function transferPots() {
	var check_item = "mpot0";
	var item_count = item_quantity(check_item);
	var item_inv = item_location(check_item);
	if(item_count >= 1) {
		send_item(party_list[1],item_inv,item_count/3);
		await sleep(250);
		send_item(party_list[2],item_inv,item_count/3);
		await sleep(250);
		send_item(party_list[3],item_inv,item_count/3);
		await sleep(250);
	}
	
	var check_item = "hpot0";
	var item_count = item_quantity(check_item);
	var item_inv = item_location(check_item);
	if(item_count >= 1) {
		send_item(party_list[1],item_inv,item_count/3);
		await sleep(250);
		send_item(party_list[2],item_inv,item_count/3);
		await sleep(250);
		send_item(party_list[3],item_inv,item_count/3);
		await sleep(250);
	}
	await use_skill("mluck",party_list[1]);
	await sleep(250);
	await use_skill("mluck",party_list[2]);
	await sleep(250);
	await use_skill("mluck",party_list[3]);
}

function itemUpgrade() {

	if(item_location("scroll0")==-1 || item_quantity("scroll0") < 25) buy("scroll0",25);
	//if(item_location("scroll1")==-1 || item_quantity("scroll1") < 25) buy("scroll1",25);

	for(var i=0;i<42;i++)
	{
		if(!character.items[i] || upgrade_whitelist.includes(character.items[i].name)) continue;
		var item=character.items[i];
		var def=G.items[item.name];
		if(!def.upgrade) continue; // check whether the item is upgradeable
		if(can_use("massproduction")) {
			use_skill("massproduction");
		}
		if(item_grade(item)==2) continue; // rare item
		if(item_grade(item)==1) continue; // skip high items for now
		if(item_grade(item)==0) upgrade(i,item_location("scroll0"));
		if(item_grade(item)==1) upgrade(i,item_location("scroll1"));
		break;
	}
}

function itemCompound() {
	var done=false;

	if(item_location("cscroll0")==-1 || item_quantity("cscroll0") < 25) buy("cscroll0",25);

	for(var i=0;i<42;i++)
	{
		if(!character.items[i] || upgrade_whitelist.includes(character.items[i].name)) continue;
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
					if(can_use("massproduction")) {
						use_skill("massproduction");
					}
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
