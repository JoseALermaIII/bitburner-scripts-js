/**
 * Runs single thread of the NS.share method.
 * @param {NS} ns - Netscript namespace
 * @return {Promise<void>}
 */
export async function main(ns) {
	ns.disableLog("share");
	while (true) {
		await ns.share();
	}
}