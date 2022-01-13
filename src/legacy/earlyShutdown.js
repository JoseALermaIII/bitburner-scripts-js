/** @param {NS} ns **/

// Logging
const logFile = "/logs/earlyShutdown.txt";
const logMode = "w";

// Variables
let script = "earlyHackTemplate.js"; // Script to kill
let localServerPrefix = "pserv-"; // Prefix all local servers follow
let servers = ["n00dles",
	"sigma-cosmetics",
	"joesguns",
	"nectar-net",
	"hong-fang-tea",
	"harakiri-sushi",
	"zer0",
	"neo-net",
	"max-hardware",
	"iron-gym"]; // Array of all currently running servers

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
	await ns.write(logFile, "Start earlyShutdown.js\n", logMode);

	for (let i = 0; i <= 24; i++) {
		/* Check if script is running on our local servers.
		 * Current max is 25. 
		 */
		let serv = localServerPrefix.concat(i);

		ifRunningKillScript(ns, script, serv);
	}

	await ns.write(logFile, "Finished shutting down local servers.\n", "a");

	for (let i = 0; i < servers.length; ++i) {
		// Check if script is running on currently running servers.
		let serv = servers[i];

		ifRunningKillScript(ns, script, serv);
	}

	await ns.write(logFile, "Finished shutting down running servers.\n", "a");
	await ns.write(logFile, "End earlyShutdown.js\n", "a");
	ns.tprint("earlyShutdown.js Done.");
}