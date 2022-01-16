/** @param {NS} ns **/
/* Gets all servers on current network.
 * Returns a map with an array and object.
 * 
 * Each key in the map contains the following structure:
 * 	"serverName": {"connections": [arrayOfString],
 * 					"details": Server obj}
 */

// Logging
const logFile = "/logs/getServers.txt";
const logMode = "w";

// Functions
export function buildNetwork(ns, _map, target) {
	/* Build list of servers in `_map` based on connections
	 * from `target`.
	 */

	for (let server of _map.get(target).connections) {
		
		let servDetails = ns.getServer(server);
		
		if (servDetails.purchasedByPlayer) {
			// Skip local servers
			continue;
		}

		if (!_map.has(server)) {
			// If server not in servers, then add it
			_map.set(server, {connections: ns.scan(server), 
						details: servDetails});
		}
	}
}

export async function main(ns) {
	await ns.write(logFile, "Start getServers.js\n", logMode);
	
	// Constants and Variables
	let maxDepth = null; // Maximum depth
	if (ns.args.length === 0) {
		maxDepth = 5; // Default if no args
	} else {
		maxDepth = ns.args[0];
	}
	const servers = new Map(); // Server object
	let depth = 0; 	// Depth counter

	// Initialize with home
	servers.set("home", {connections: ns.scan("home"), 
				details: ns.getServer("home")});
	buildNetwork(ns, servers, "home");
	servers.delete("home");

	while (depth < maxDepth) {
		// Check for and add new servers

		for (let server of Array.from(servers.keys())) {
			// Iterate through each server in target.
			buildNetwork(ns, servers, server)
		}
		// Found all connections at current depth.
		depth++;
	}

	await ns.write(logFile, `Found ${servers.size} servers: ${Array.from(servers.keys())}\n`, "a");
	await ns.write(logFile, "End getServers.js\n", "a");
	ns.tprint("getServers.js Done.");
    return servers;
}