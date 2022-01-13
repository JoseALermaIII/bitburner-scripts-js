/** @param {NS} ns **/
export async function main(ns) {
	
	if (ns.args.length === 0) {
		// No args
		throw TypeError("Empty args");
	}

	// Server to hack.
    let target = ns.args[0];

	/* How much money a server should have before we hack it.
	 * In this case, 75% of the server's max money.
	 */
	let moneyThresh = ns.getServerMaxMoney(target) * 0.75;

	/* Maximum security level the target server can have.
	 * In this case, higher than 5 levels above minimum.
	 */
	let securityThresh = ns.getServerMinSecurityLevel(target) + 5;

	/* If we have the BruteSSH.exe program, use it to open the SSH Port
	 * on the target server.
	 *//*
	if (ns.fileExists("BruteSSH.exe", "home")) {
		ns.brutessh(target);
	}*/
	if (!ns.hasRootAccess(target)) {
		// Get root access to target server
		ns.nuke(target);
	}

	while(true) {
		// Infinite loop that continously hacks/grows/weakens the target server
		if (ns.getServerSecurityLevel(target) > securityThresh) {
			// If the server's security level is above our threshold, weaken it
			await ns.weaken(target);
		} else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
			// If the server's money is less than our threshold, grow it
			await ns.grow(target);
		} else {
			// Otherwise, hack it
			await ns.hack(target);
		}
	}
}