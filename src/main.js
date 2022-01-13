/** bitburner-scripts-js.main
 *  @remarks
 *  Placeholder until final logic is determined
 *
 *  @param {NS} ns - Netscript namespace
 *  @return {Promise<void>}
 */

import * as startUp from "./libs/startup.js";

// Logging
/** @constant
 *  @ default
 */
const logFile = "/logs/main.txt";
const logMode = "w";

export async function main(ns) {
	await ns.write(logFile, "Start main.js\n", logMode);
	
	await startUp.main(ns, "comptek"); // Start purchased and hacked servers
	ns.run("earlyHackTemplate.js", 6400, "the-hub"); // Start home server
	
	await ns.write(logFile, "End main.js\n", "a");
	ns.tprint("main.js Done.");
}