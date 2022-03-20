/**
 *  @remarks
 *  Placeholder until final logic is determined
 *
 *  @param {NS} ns - Netscript namespace
 *  @return {Promise<void>}
 */

import * as startUp from "./bin/startup.js";

// Logging
/** @constant
 *  @default
 */
const logFile = "/logs/main.txt";
const logMode = "w";

export async function main(ns) {
	await ns.write(logFile, "Start main.js\n", logMode);
	
	await startUp.main(ns, "catalyst"); // Start purchased and hacked servers
	// Start home server. Current RAM = 32.77 TB
	ns.run("earlyHackTemplate.js", 256, "the-hub");
	ns.run("earlyHackTemplate.js", 512, "comptek");
	ns.run("earlyHackTemplate.js", 1600, "rothman-uni");
	ns.run("earlyHackTemplate.js", 6144, "netlink");
	
	await ns.write(logFile, "End main.js\n", "a");
	ns.tprint("main.js Done.");
}