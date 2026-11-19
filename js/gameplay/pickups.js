// Power-up pickups: coffee, DND, bug fix heal, golden chappal.
function collectPickup(kind){arcadeSound('pickup');score+=20;
 if(kind==='coffee'){coffeeBoost=5;showPowerText('☕ Sprint fuel! Speed boost for 5s');}
 if(kind==='dnd'){dndCharges++;showPowerText('🛡️ Do Not Disturb! Blocks one hit');}
 if(kind==='heal'){const before=health;health=Math.min(100,health+25);hearts=Math.ceil(health/25);showPowerText(before===100?'❤️ Full health! +20 points':'❤️ Bug fixed! +25 health');}
 if(kind==='goldenChappal'){throwCooldown=0;for(const e of enemies){e.stun=4;e.target=null;}showPowerText('🩴 GOLDEN CHAPPAL! Haris stunned for 4s');}
 updateUI();}
