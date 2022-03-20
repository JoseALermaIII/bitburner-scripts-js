import * as getServers from "getServers.js";
/**
 * Prints hostname, maxRAM, cpuCores, serverGrowth, moneyMax, minDifficulty, hackDifficulty to
 * the terminal. Calculates and prints the number of threads to get the current amount of money
 * on the server.
 * @summary Prints select server statistics to the terminal.
 * @param {NS} ns - Netscript namespace
 * @param {string} server - Server to print stats of. Defaults to 'n00dles'
 * @returns {Promise<void>}
 */

export async function main(ns, server='n00dles') {
	let servers = await getServers.main(ns);
	if (ns.args.length !== 0) {
		server = ns.args[0];
	}
	let serverStats = servers.get(server);
	let hostname = serverStats.details["hostname"];
	let moneyAvailable = serverStats.details["moneyAvailable"];
	let moneyMax = serverStats.details["moneyMax"];
	ns.tprint(`${hostname} stats:`);
	ns.tprint(`maxRam: ${serverStats.details["maxRam"]}`);
	ns.tprint(`cpuCores: ${serverStats.details["cpuCores"]}`);
	ns.tprint(`serverGrowth: ${serverStats.details["serverGrowth"]}`);
	ns.tprint(`moneyMax: ${moneyMax}`);
	ns.tprint(`minDifficulty: ${serverStats.details["minDifficulty"]}`);
	ns.tprint(`hackDifficulty: ${serverStats.details["hackDifficulty"]}`);
	let numThreads = null;
	let hackAmount= null;
	if (moneyAvailable < moneyMax) {
		numThreads = ns.hackAnalyzeThreads(hostname, moneyAvailable);
		hackAmount = moneyAvailable;
	} else {
		numThreads = ns.hackAnalyzeThreads(hostname, moneyMax);
		hackAmount = moneyMax;
	}
	ns.tprint(`Number of threads to get ${hackAmount} from ${hostname}: ${numThreads}`);

}