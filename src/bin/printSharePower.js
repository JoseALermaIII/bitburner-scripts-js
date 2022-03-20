/**
 * Prints current share power using NS.getSharePower method.
 * @param {NS} ns - Netscript namespace
 * @return {Promise<void>}
 */
export async function main(ns) {
	ns.tprint(`Share power: ${ns.getSharePower()}`);
}