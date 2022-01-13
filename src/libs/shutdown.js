import * as getServers from "getServers.js";
import * as bestServers from "listBestServers.js";
/** @param {NS} ns **/
// Shutdown script on all local and remote servers.

// Logging
const logFile = "/logs/shutdown.txt";
const logMode = "w";

// Functions
export function ifRunningKillScript(ns, script, serv) {
	/* If script named `script` exists on server named `serv`
	 * kill all processes regardless of arguments
	 */
	if (ns.scriptRunning(script, serv)) {
		ns.scriptKill(script, serv);
	}
}

export async function main(ns) {
	await ns.write(logFile, "Start shutdown.js\n", logMode);

	// Constants and variables
	let script = "earlyHackTemplate.js"; // Script to stop
	const servers = await getServers.main(ns); // Map of servers
	const hackable = Array.from(Array(6), () => new Array()); // Hackable servers
	let purchasedServers = ns.getPurchasedServers(); // Purchased servers
	await ns.write(logFile, `Purchased servers: ${purchasedServers}\n`, "a");

	// Determine servers where the script can be running
	bestServers.getHackable(ns, servers, hackable);
	await ns.write(logFile, `Hackable servers: ${hackable.join(",\n")}\n`, "a");

	for (let serv of purchasedServers) {
		ifRunningKillScript(ns, script, serv); // Check if script is running on our local servers.
	}
	await ns.write(logFile, "Finished shutting down local servers.\n", "a");

	for (let serverList of hackable) {
		// Check if script is running on currently running servers.
		if (serverList.length === 0) {
			continue; // Skip if there are no servers
		}

		for (let serv of serverList) {
			ifRunningKillScript(ns, script, serv);
		}
	}

	await ns.write(logFile, "Finished shutting down running servers.\n", "a");
	await ns.write(logFile, "End shutdown.js\n", "a");
	ns.tprint("shutdown.js Done.");
}