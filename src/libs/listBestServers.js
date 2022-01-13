import * as getServers from "getServers.js";

/** @param {NS} ns **/
/* Lists currently hackable servers with the highest moneyMax and serverGrowth.
 */

// Logging
const logFile = "/logs/listBestServers.txt";
const logMode = "w";

export let tools = ["BruteSSH.exe", "FTPCrack.exe", 
		"relaySMTP.exe", "HTTPWorm.exe",
		"SQLInject.exe"]; // Current known tools

// Functions
export function getToolCount(ns) {

	let toolCount = 0; // Number of tools available	
	
	for (let tool of tools) {
		// Check current tools
		if (ns.fileExists(tool)){
			toolCount++;
		}
	}
	return toolCount;
}

export function getHackable(ns, _serverMap, _hackableMatrix) {
	/* List hackable servers from `_serverMap` in `_hackableMatrix`
	 * by order of required ports.
	 */
	let toolCount = getToolCount(ns);
	let myHackLevel = ns.getHackingLevel(); // Current hack level
	for (let server of Array.from(_serverMap.keys())) {
		// Determine hackability

		let serverDetails = _serverMap.get(server).details;
		let numPorts = serverDetails.numOpenPortsRequired;
			
		if (numPorts > toolCount) {
			continue; // Skip too many ports required
		}

		if (serverDetails.requiredHackingSkill > myHackLevel){
			continue; // Skip hack level too high
		}

		_hackableMatrix[numPorts].push(server); // Sort by port requirements
	}
}

export function getServerProperty(_serverMap, _hackableMatrix, _propertyMap, _property) {
	/* Create a `property` `_propertyMap` using the hostnames from the
	 * `_hackableMatrix` and properties from `_serverMap`. 
	 * 
	 * `_hackableMatrix` is populated by getHackable().
	 * `_serverMap` is populated by getServers.main().
	 */
	_hackableMatrix.forEach(function(serverList) {
		// Identify `_property` for each hackable server
		serverList.forEach(function(server) {
			let serverDetails = _serverMap.get(server).details;
			let property = serverDetails[_property];

			_propertyMap.set(server, property); // Store property
		})
	})
}

export function getTopThree(_map) {
	/* List the top three keys with highest values in a key: value map. */

	let keys = Array.from(_map.keys()); // Get keys for indexing hostnames
	let index = null; // Index to find key of sorted value
	let values = Array.from(_map.values()); // Get values for sorting
	let valuesSorted = values.slice(); // Copy values to sort in place
	valuesSorted.sort((a, b) => b - a); // Sort values in descending order
	let result = []; // Result to return
	
	if (valuesSorted.length > 3) {
		valuesSorted.length = 3; // Find top three by shortening length
	}

	valuesSorted.forEach(function(value) {
		// Find hostnames using array.indexOf
		index = values.indexOf(value);
		result.push(keys[index]);
	})
	return result;
}

export async function main(ns) {
	await ns.write(logFile, "Start listBestServers.js\n", logMode);
	
	// Constants
	const servers = await getServers.main(ns); // List of accessible servers
	const hackable = Array.from(Array(6), () => new Array()); // Hackable servers
	const profitable = new Map(); // Profitable servers
	const growable = new Map(); // Growable servers
	
	// Begin main()
	servers.delete("n00dles"); // n00dles' growth is extremely high
	getHackable(ns, servers, hackable); // Get hackable servers

	await ns.write(logFile, `Hackable servers: ${hackable.join(",\n")}\n\n`, "a");

	// Identify moneyMax and serverGrowth for each hackable server
	getServerProperty(servers, hackable, profitable, "moneyMax");
	await ns.write(logFile, `Profitable servers: ${[...profitable]}\n\n`, "a");

	getServerProperty(servers, hackable, growable, "serverGrowth");
	await ns.write(logFile, `Growable servers: ${[...growable]}\n\n`, "a");

	let mostProfitable = getTopThree(profitable); // Get most profitable
	await ns.write(logFile, `mostProfitable: ${mostProfitable}\n`, "a");

	let mostGrowable = getTopThree(growable); // Get most growable
	await ns.write(logFile, `mostGrowable: ${mostGrowable}\n\n`, "a");
	
	// Combine `mostProfitable` and `mostGrowable` excluding duplicates
	const bestServers = [];
	
	mostProfitable.forEach(function(value) {
		// Add most profitlable
		bestServers.push(value);
	})
	ns.tprint(`Best Servers with mostProfitable: ${bestServers}`);

	mostGrowable.forEach(function(value) {
		if (!bestServers.includes(value)) {
			// Exclude duplicates
			bestServers.push(value);
		}
	})
	ns.tprint(`Best Servers with mostGrowable: ${bestServers}`);
	await ns.write(logFile, `Best servers: ${bestServers}\n`, "a");

	await ns.write(logFile, "End listBestServers.js\n", "a");
	ns.tprint("listBestServers.js Done.");
	return bestServers;
}