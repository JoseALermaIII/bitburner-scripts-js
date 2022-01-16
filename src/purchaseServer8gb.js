import { calcMaxThreads } from "./bin/upgradeServers.js";
/** @param {NS} ns **/
export async function main(ns) {
	/* Continuously try to purchase servers until we've reached the maximum
	 * amount of servers.
	 */

	// Variables
	let target = ns.args[0]; // Which server is being targeted
	let script = "earlyHackTemplate.js"; // Which script to install and run
	let serverNamePrefix = "pserv-"; // Purchased server name prefix.
	let ram = 8; // RAM for each new server
	let i = 0; // While loop iterator

	while (i < ns.getPurchasedServerLimit()) {
		// Check if we have enough money to purchase a server
		if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
			/* If we have enough money, then:
			 *  1. Purchase the server
			 *  2. Copy our hacking script onto the newly-purchased server
			 *  3. Calculate the number of threads of that script we can run
			 *  4. Run our hacking script on the newly-purchased server with above threads
			 *  5. Increment iterator to move on to the next server
			 */
			let hostname = ns.purchaseServer(serverNamePrefix.concat(i), ram);
			await ns.scp(script, hostname);
			let maxThreads = calcMaxThreads(ns, hostname, script, ram);
			ns.exec(script, hostname, maxThreads, target);
			++i;
		}
	}
}