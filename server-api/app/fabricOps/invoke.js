const request = require('request')

const {
  Gateway,
} = require('fabric-network')
const log4js = require('log4js')
const logger = log4js.getLogger('Hospital-sample')
const util = require('util')
const helper = require('./helper')
const { result } = require('lodash')

let event_response = []

const invokeTransaction = async (channelName, chaincodeName, fcn, args, userName, orgName,) => {
  logger.info(
    util.format(
      '\n============ invoke transaction on channel %s ============\n',
      channelName,
    ),
  )
   
  let payload = [];
  payload.push(JSON.stringify(args));

  // Create a new file system based wallet for managing identities.
  let wallet = await helper.createWallet(orgName)

  // Check to see if we've already enrolled the user.
  let identity = await wallet.get(userName)
  if (!identity) {
    console.log(
      `An identity for the user ${userName} does not exist in the wallet, so registering user`,
    )
    throw new Error(`An identity for the user ${userName} does not exist in the wallet`);
  }

  let connectionOptions = {
    identity: "admin",
    wallet: wallet,
    discovery: { enabled: true, asLocalhost: true }
  };

  // load the network configuration
  const ccp = await helper.getCCP(orgName)
  // Create a new gateway for connecting to our peer node.
  const gateway = new Gateway()
  try {
    await gateway.connect(ccp, connectionOptions)
    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork(channelName)
    const contract = network.getContract(chaincodeName)

    // Need to treat public and private data seperately
    if (args.isPrivate) {
      delete args['isPrivate'];
      let statefulTxn = contract.createTransaction(fcn)
      let tmapData = Buffer.from(JSON.stringify(args))

      statefulTxn.setTransient({
        emp_pvt_properties: tmapData,
      })
      const txn_result = await statefulTxn.submit()
      return (txn_result);
    } else {
      // invoke transaction
      const invokeResponse = await contract.submitTransaction(fcn, payload);
      logger.info("Transaction successfully submitted at " + new Date().toISOString());
      return JSON.parse(invokeResponse.toString());
    }

  } catch (err) {
    logger.error('Error in submitting transaction' + err);
    if (err.message.includes('DiscoveryService has failed to return results') ||
      err.message.includes('REQUEST TIMEOUT') ||
      err.message.includes('UNAVAILABLE')
    ) {
      throw new Error("Peers are busy/unreachable. Try again later");
    }
    throw new Error(err);
  } finally {
    gateway.disconnect();
  }
}

const listener = async (event) => {
  if (event.eventName == "PatientRecordAdded") {
    event_response = []
    event_response.push(JSON.parse(event.payload.toString('utf-8')))
  }
}

exports.invokeTransaction = invokeTransaction
