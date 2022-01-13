/** @param {NS} ns **/
// Start up script on all local and remote servers.

// Logging
const logFile = "/logs/earlyStartup.txt";
const logMode = "w";

// Script to start
var script = "earlyHackTemplate.js";

// Prefix all local servers follow
var localServerPrefix = "pserv-";

/* Array of all servers that don't need any ports opened
 * to gain root access. These have 16 GB of RAM
 */
var servers0Port = ["n00dles",
					"sigma-cosmetics",
					"joesguns",
					"nectar-net",
					"hong-fang-tea",
					"harakiri-sushi"];

/* Array of all servers that only need 1 port opened
 * to gain root access. These have 32 GB of RAM 
 */
var servers1Port = ["neo-net",
					"zer0",
					"max-hardware",
					"iron-gym"];

export async function transferAndStartScript (ns, script, serv, threads, target) {
	/* Copy `script` to `serv` and hack `target`
	 * with `threads` number of threads.
	 */
	await ns.scp(script, serv);
	if (!ns.hasRootAccess(serv)) {
		// If no root access, use nuke() to get it.
		ns.nuke(serv);
	}
	ns.exec(script, serv, threads, target);	
}

export async function main(ns) {
	await ns.write(logFile, "Start earlyStartup.js\n", logMode);
	// No args
	if (ns.args.length === 0) {
		throw TypeError("Empty args");
	}

	ns.disableLog("sleep"); // Prevent spamming logs
	
	// Which server is being targeted
	var target = ns.args[0];

	for (var i=0; i <= 24; i++) {
		/* Copy our scripts onto our local servers.
		 * These currently have 256 GB of RAM.
		 */
		var hostname = localServerPrefix + i;
		
		await transferAndStartScript(ns, script, hostname, 102, target);
	}

	await ns.write(logFile, "Finished local servers.\n", "a");

	for (var j = 0; j < servers0Port.length; ++j) {
		/* Copy our scripts onto each server that requires 0 ports
		 * to gain root access.
		 */
		var serv = servers0Port[j];
		if (serv !== target) {
			// Only run if current server doesn't match the target server.
			await transferAndStartScript(ns, script, serv, 6, target);
		} else {
			await ns.write(logFile, "Skipped: ".concat(serv).concat("\n"), "a");
		}
	}

	await ns.write(logFile, "Finished 0 port servers.\n", "a");

	while (!ns.fileExists("BruteSSH.exe")) {
		// Wait until we acquire the "BruteSSH.exe" program
		await ns.write(logFile, "Waiting for BruteSSH\n", "a");
		await ns.sleep(60000);
	}

	for (var k = 0; k < servers1Port.length; ++k) {
		/* Copy our scripts onto each server that requires 1 port
		 * to gain root access. Then use brutessh() to open it.
		 */
		var server = servers1Port[k];

		ns.brutessh(server);
		if (server !== target) {
			// Only run if current server doesn't match the target server.
			await transferAndStartScript(ns, script, server, 12, target);
		} else {
			await ns.write(logFile, "Skipped: ".concat(server).concat("\n"), "a");
		}
	}
	await ns.write(logFile, "Finished 1 port servers.\n", "a");
	await ns.write(logFile, "End earlyStartup.js\n", "a");
	ns.tprint("earlyStartup.js Done.");
}