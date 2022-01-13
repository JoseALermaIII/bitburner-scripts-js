import {ifRunningKillScript} from "shutdown.js";
/** @param {NS} ns **/
/* Continuously try to upgrade servers until we've reached the `ram`
 * amount of RAM.
 */

// Logging
const logFile = "/logs/upgradeServers.txt";
const logMode = "w";

export function calcMaxThreads(ns, server, script, ram) {
	/* Calculate maximum threads of `script` on `server` 
	 * we can run with `ram` */
	
	let scriptRam = ns.getScriptRam(script, server); // RAM needed to run `script`
	return Math.floor(ram / scriptRam); // Round down to integer
}

export async function main(ns) {

	await ns.write(logFile, "Start upgradeServers.js\n", logMode);

	if (ns.args.length < 2) {
		// Insufficient args
		throw TypeError("Missing args");
	}

	// Which server is being targeted
	let target = ns.args[0];

	// How much RAM each purchased server will have.
	let ram = ns.args[1];
	let maxRam = ns.getPurchasedServerMaxRam();
	await ns.write(logFile, `Max RAM: ${maxRam}\n`, "a");
	if (ram > maxRam) {
		// RAM exceeds max
		throw RangeError(`RAM exceeds max of: ${maxRam}`);
	}

	// Which scripts to install and run
	let script = "earlyHackTemplate.js";

	// List purchased servers
	let serverList = ns.getPurchasedServers();
	await ns.write(logFile, `Purchased servers: ${serverList}\n`, "a");
	
	for (let server of serverList) {
		// Upgrade each server

		ifRunningKillScript(ns, script, server); // Stop server for upgrade

		let maxThreads = calcMaxThreads(ns, server, script, ram);

		while (ns.getServerMaxRam(server) < ram) {
			
			if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
				// If home has enough money to upgrade the server, then:
				ns.deleteServer(server); // Delete old server
				let hostname = ns.purchaseServer(server, ram); // Purchase server with same name
				await ns.scp(script, hostname); // Copy `script` onto new server
				ns.exec(script, hostname, maxThreads, target); // Run `script` with `maxThreads`
				await ns.write(logFile, `Created server: ${hostname}\n`, "a");
			}
		}
	}

	await ns.write(logFile, "End upgradeServers.js\n", "a");
	ns.tprint("upgradeServers.js Done.");
}