/** @param {NS} ns **/
/* Purchase and upgrade hacknet nodes.
 * Buys 8 nodes, upgrades them to level 80 with 16 GB RAM and 8 cores
 */

// Logging
const logFile = "/logs/purchaseNodes.txt";
const logMode = "w";

// Variables
let nodeMax = 8; // Max nodes to buy
let levelMax = 80; // Max level for nodes
let numLevels = 10; // Number of levels to buy at a time
let ramMax = 16; // Max RAM for nodes
let numRam = 2; // Amount of RAM to buy at a time
let coreMax = 8; // Max cores for nodes
let numCores = 1; // Number of cores to buy at a time
let sleepTime = 3000; // Sleep timer

// Functions
function myMoney(ns) {
    // Return current money
    return ns.getServerMoneyAvailable("home");
}

export async function wait(ns, time) {
    ns.sleep(time);
}

export async function main(ns) {
    await ns.write(logFile, "Starting purchaseNodes.js\n", logMode);
    // Disable logging on these functions so it doesn't spam the logs
    ns.disableLog("getServerMoneyAvailable");
    ns.disableLog("sleep");

    while(ns.hacknet.numNodes() < nodeMax) {
        // Keep buying nodes to nodeMax
        let cost = ns.hacknet.getPurchaseNodeCost();
        while (myMoney(ns) < cost) {
            // Not enough money. Sleep until `time` passes.
            await ns.write(logFile, `Need $${cost} . Have ${myMoney()}\n`, "a");
            wait(ns, sleepTime);
        }
        // Buy node when there's enough money
        let index = ns.hacknet.purchaseNode();
        await ns.write(logFile, `Purchased hacknet Node with index ${index}\n`, "a");
    }

    for (let i = 0; i < nodeMax; i++) {
        // Upgrade nodes to levelMax
        while (ns.hacknet.getNodeStats(i).level <= levelMax - 1) {
            // Keep upgrading current node to levelMax numLevels at a time
            let cost = ns.hacknet.getLevelUpgradeCost(i, numLevels);
            while (myMoney(ns) < cost) {
                await wait(ns, sleepTime);
            }
            // Upgrade node when there's enough money
            ns.hacknet.upgradeLevel(i, numLevels);
        }
    }
    await ns.write(logFile,"All nodes upgraded to level 80\n", "a");

    for (let i = 0; i < nodeMax; i++) {
        // Upgrade nodes' RAM to ramMax
        while (ns.hacknet.getNodeStats(i).ram < ramMax) {
            // Keep upgrading current node to ramMax numRam at a time
            let cost = ns.hacknet.getRamUpgradeCost(i, numRam);
            while (myMoney(ns) < cost) {
                await wait(ns, sleepTime);
            }
            // Upgrade when there's enough money
            ns.hacknet.upgradeRam(i, numRam);
        }
    }
    await ns.write(logFile,"All nodes upgraded to 16GB RAM\n", "a");

    for (let i = 0; i < nodeMax; i++) {
        // Upgrade nodes' cores to coreMax
        while (ns.hacknet.getNodeStats(i).cores < coreMax) {
            // Keep upgrading current node to coreMax numCores at a time
            let cost = ns.hacknet.getCoreUpgradeCost(i, numCores);
            while (myMoney(ns) < cost) {
                await wait(ns, sleepTime);
            }
            // Upgrade when there's enough money
            ns.hacknet.upgradeCore(i, numCores);
        }
    }
    await ns.write(logFile, "All nodes upgraded to 8 cores\n", "a");
    await ns.write(logFile, "End purchaseNodes.js\n", "a");
    ns.tprint("purchaseNodes.js Done.");
}