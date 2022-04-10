/** Start up script on all local and remote servers.
 *  @remarks
 *  Runs prefedined script on purchased and hackable servers with a
 *  specified target.
 *
 *  @param {NS} ns - Netscript namespace
 *  @param {string} target - Server to hack
 *  @return {Promise<void>}
 */

import * as getServers from "getServers.js";
import { calcMaxThreads } from "upgradeServers.js";
import * as bestServers from "listBestServers.js";

// Logging
/** @ constant
 *  @ default
 */
const logFile = "/logs/startup.txt";

/** @ constant
 *  @ default
 */
const logMode = "w";

// Functions
/** Copy and run script
 *  @remarks
 *  Copy `_script` to `_server` and hack `_target` with `_threads` number of threads.
 * 
 *  @param {string} _script - script to copy and run
 *  @param {string} _server - server to copy script to and run on
 *  @param {number} _threads - number of threads of _script to run on _server
 *  @param {string} _target - server for _script to target
 *  @return {Promise<void>}
 */
export async function copyAndRun(ns, _script, _server, _threads, _target) {
	await ns.scp(_script, _server);
	if (!ns.hasRootAccess(_server)) {
		// If no root access, use nuke() to get it.
		ns.nuke(_server);
	}
	ns.exec(_script, _server, _threads, _target);
}

export function hackWithTool(ns, _server, _toolNum) {
	/* Use tool specified by `_toolNum` to hack `_server`.
	 *
	 * Tools specified by listBestServers.tools
	 */
	switch (_toolNum) {
		case 0:
			ns.brutessh(_server);
			break;
		case 1:
			ns.ftpcrack(_server);
			break;
		case 2:
			ns.relaysmtp(_server);
			break;
		case 3:
			ns.httpworm(_server);
			break;
		case 4:
			ns.sqlinject(_server);
			break;
		default:
			throw RangeError(`Unexpected value for _toolNum: ${_toolNum}`);
	}
}

export async function startServers(ns, _script, _serverList, _target, _toolNum = null) {
	/* For each server in `_serverList`:
	 *	1) Hack with `_toolNum` (if specified)
	 *	2) Copy and run `_script` specifying `_target` as a target
	 */
	for (let serv of _serverList) {
		if (_toolNum) {
			// If a tool is specified, use tools to gain access
			if (!ns.hasRootAccess(serv)) {
				// If no access, then use a tool to open it.
				let i = _toolNum;
				while (i >= 0) {
					// Use all tools to open required number of ports
					hackWithTool(ns, serv, i);
					i--;
				}
			}
		}

		// Copy and run script on each server
		let serverRam = ns.getServerMaxRam(serv);
		if (serverRam === 0) {
			continue; // Skip servers without RAM
		}
		let maxThreads = calcMaxThreads(ns, serv, _script, serverRam);
		if (serv !== _target) {
			// Only run if current server doesn't match the target server.
			await copyAndRun(ns, _script, serv, maxThreads, _target);
		} else {
			await ns.write(logFile, `Server skipped: ${serv}\n`, "a");
		}
	}
}

export async function waitForTool(ns, _tool) {
	await ns.write(logFile, `Waiting for ${_tool}\n`, "a");
	while (!ns.fileExists(_tool)) {
		// Wait until we acquire the `_tool` program
		await ns.sleep(60000);
	}
}

export async function main(ns) {
	await ns.write(logFile, "Start startup.js\n", logMode);
	// No args
	if (ns.args.length === 0) {
		throw TypeError("Empty args");
	}

	// Disable logging on these functions so it doesn't spam the logs
    ns.disableLog("sleep");

	// Constants and variables
	let script = "earlyHackTemplate.js"; // Script to start
	const servers = await getServers.main(ns); // Map of servers
	const hackable = Array.from(Array(6), () => new Array()); // Hackable servers
	let purchasedServers = ns.getPurchasedServers(); // Purchased servers

	// Which server is being targeted
	let target = ns.args[0];

	// Determine hackable servers
	bestServers.getHackable(ns, servers, hackable);
	await ns.write(logFile, `Hackable servers: ${hackable.join(",\n")}\n`, "a");

	// Start purchased servers
	await startServers(ns, script, purchasedServers, target);

	await ns.write(logFile, "Finished local servers.\n", "a");

	// Start servers by port requirements
	/* NOTE: Because there is an await inside the for loop, hackable.forEach(function(){})
	 * acts the same as a for-await-of loop outside an async function.
	 * 
	 * hackable.forEach(async function(){}) also didn't resolve the syntax issue.
	 * 
	 * More info:
	 * - https://github.com/nodejs/node/issues/21617
	 */
	let numPorts = 0; // Iterator for below loop
	for (let serverList of hackable) {
		await ns.write(logFile, `Server list: ${serverList}\n`, "a");
		if (serverList.length === 0) {
			continue; // Skip if there are no servers
		}
		let toolNum = numPorts;
		if (numPorts > 0) {
			toolNum = numPorts - 1; // Tools are zero indexed
		}
		let tool = bestServers.tools[toolNum];

		/* TODO: Too WET, break out into function */
		switch (numPorts) {
			case 0:
				// No tools required
				await startServers(ns, script, serverList, target);
				await ns.write(logFile,
					`Finished ${numPorts} port servers.\n`, "a");
				break;
			case 1:
				await waitForTool(ns, tool);
				await startServers(ns, script, serverList, target, toolNum);
				await ns.write(logFile,
					`Finished ${numPorts} port servers.\n`, "a");
				break;
			case 2:
				await waitForTool(ns, tool);
				await startServers(ns, script, serverList, target, toolNum);
				await ns.write(logFile,
					`Finished ${numPorts} port servers.\n`, "a");
				break;
			case 3:
				await waitForTool(ns, tool);
				await startServers(ns, script, serverList, target, toolNum);
				await ns.write(logFile, `Finished ${numPorts} port servers.\n`, "a");
				break;
			case 4:
				await waitForTool(ns, tool);
				await startServers(ns, script, serverList, target, toolNum);
				await ns.write(logFile, `Finished ${numPorts} port servers.\n`, "a");
				break;
			case 5:
				await waitForTool(ns, tool);
				await startServers(ns, script, serverList, target, toolNum);
				await ns.write(logFile, `Finished ${numPorts} port servers.\n`, "a");
				break;
			default:
				throw RangeError(`Unexpected value for numPorts: ${numPorts}`);
		}
		numPorts++;
	}

	await ns.write(logFile, "End startup.js\n", "a");
	ns.tprint("startup.js Done.");
}