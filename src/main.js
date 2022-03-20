/** bitburner-scripts-js.main
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
	
	await startUp.main(ns, "comptek"); // Start purchased and hacked servers
	// Start home server. Current RAM = 16.38 TB
	ns.run("earlyHackTemplate.js", 256, "the-hub");
	ns.run("earlyHackTemplate.js", 1600, "rothman-uni");
	ns.run("earlyHackTemplate.js", 1024, "johnson-ortho");
	ns.run("earlyHackTemplate.js", 2048, "catalyst");
	
	await ns.write(logFile, "End main.js\n", "a");
	ns.tprint("main.js Done.");
}