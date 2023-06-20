const { Gateway } = require('fabric-network');
const fs = require('fs');
const path = require("path")
const log4js = require('log4js');
const logger = log4js.getLogger('query');
const util = require('util')

const helper = require('./helper')
const queryChaincode = async (channelName, chaincodeName, args, fcn, userName, orgName) => {
    // Create a new file system based wallet for managing identities.
    let wallet = await helper.createWallet(orgName)

    // Check to see if we've already enrolled the user.
    let identity = await wallet.get(userName);

    if (!identity) {
        throw new Error(`An identity for the user ${userName} does not exist in the wallet`);
    }

    // load the network configuration
    const ccp = await helper.getCCP(orgName);
    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    const connectionOptions = {
        identity: userName,
        wallet: wallet,
        discovery: { enabled: true, asLocalhost: true }
    };
    try {
        // Connect to the blockchain gateway
        await gateway.connect(ccp, connectionOptions);

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(channelName);
        // Get the contract from the network.
        let results;
        const contract = network.getContract(chaincodeName);
        if (args != null ){
            console.log(fcn, args)
            results = await contract.evaluateTransaction(fcn, args);
        } else {
            results = await contract.evaluateTransaction(fcn);
        }
        if (results) {
            console.log(`Transaction has been evaluated, result is: ${results.toString()}`);
            return JSON.parse(results.toString());
        } else {
            logger.error('results is null');
            return 'results is null';
        }
    } catch (err) {
        if (err.message.includes('DiscoveryService has failed to return results') ||
            err.message.includes('REQUEST TIMEOUT') ||
            err.message.includes('UNAVAILABLE')
        ) {
            throw new Error("Peers are busy/unreachable. Try again later");
        }
        throw new Error(JSON.parse(err.message).detail);
    }
    finally {
        gateway.disconnect();
    }
};

exports.queryChaincode = queryChaincode;