'use strict';

var { Gateway, Wallets, DefaultEventHandlerStrategies, X509WalletMixin } = require('fabric-network');
const path = require('path');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const log4js = require('log4js');
const logger = log4js.getLogger('fabric-helper');
const config = require('../../../general-config.json');
const util = require('util');
const walletHelper = require('./wallet');

//Setting default environment type if not mentioned to local
if (!process.env.NODE_ENV) {
	process.env.NODE_ENV = 'local'
}

const ledgerOpsStatus = {
	success: "SUCCESS",
	error: "ERROR"
}

logger.level = config.loglevel;
const enrollAdmin = async (orgName) => {
	try {
		const ccp = getCCP(orgName);
		const clientOrg = ccp.client.organization;

		const org = ccp.organizations[clientOrg];
		const mspId = org.mspid;

		const caClient = await getCAClientByOrg(orgName);

		//  Create a new file system based wallet for managing identities.
		const wallet = await createWallet(orgName)
		let { adminUserId, adminUserPasswd } = await getAdminCreds(orgName);
		// Check to see if we've already enrolled the admin user.
		const identity = await wallet.get(adminUserId);
		if (identity) {
			logger.info('An identity for the admin user already exists in the wallet');
			return Error('An identity for the admin user already exists in the wallet');
		}

		// Enroll the admin user, and import the new identity into the wallet.
		const enrollment = await caClient.enroll({ enrollmentID: adminUserId, enrollmentSecret: adminUserPasswd });
		const x509Identity = await createIdentity(enrollment, org);
		await wallet.put(adminUserId, x509Identity);
		logger.info('Successfully enrolled admin user and imported it into the wallet');

	} catch (error) {
		console.error(`Failed to enroll admin user : ${error}`);
		throw new Error('Failed to enroll admin user: ' + error.toString());
	}
};

const registerAndEnrollUser = async (username, secret, userOrg) => {
	try {
		const ccp = getCCP(userOrg);
		const clientOrg = ccp.client.organization;

		const org = ccp.organizations[clientOrg];
		console.log('mspid:', org.mspid);

		let { adminUserId } = await getAdminCreds(userOrg);

		const caClient = await getCAClientByOrg(userOrg);
		// Check to see if we've already enrolled the user

		const wallet = await createWallet(userOrg)
		const userIdentity = await wallet.get(username);
		if (userIdentity) {
			logger.info(`An identity for the user ${username} already exists in the wallet`);
			throw (new Error(`An identity for the user ${username} already exists in the wallet`));
		}

		// Must use an admin to register a new user
		const adminIdentity = await wallet.get(adminUserId);
		if (!adminIdentity) {
			logger.info('An identity for the admin user does not exist in the wallet');
			throw new Error('An identity for the admin user does not exist in the wallet, enroll the admin user before retrying');
		}

		// build a user object for authenticating with the CA
		const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
		const adminUser = await provider.getUserContext(adminIdentity, adminUserId);

		// Register the user, enroll the user, and import the new identity into the wallet.
		// if affiliation is specified by client, the affiliation value must be configured in CA
		let affiliation = userOrg.toLowerCase() + '.department1';

		await caClient.register({
			enrollmentID: username,
			enrollmentSecret: secret,
			role: 'client'
		}, adminUser);

		const enrollment = await caClient.enroll({
			enrollmentID: username,
			enrollmentSecret: secret
		});
		const x509Identity = await createIdentity(enrollment, org);

		await wallet.put(username, x509Identity);
		logger.info(`Successfully registered and enrolled user ${username} and imported it into the wallet`);
		var response = {
			success: true,
			username: username
		};
		return response;

	} catch (error) {
		if (error.toString().includes('Calling register endpoint failed')) {
			return (new Error("Fabric CA is busy/unreachable. Try again later"));
		}
		logger.error(`Failed to register user : ${error}`)
		// return (new Error(`Failed to register user : ${error}`));
		throw (error)
	}
};

const createResponse = (msgStatus, message) => (
	{
		success: msgStatus,
		message: message
	}
)

const getRegisteredUser = async (username, userOrg) => {
	try {
		const wallet = await createWallet(userOrg)
		const userIdentity = await wallet.get(username);
		if (!userIdentity) {
			logger.error(`An identity for the user ${username} does not exists in the wallet`);
			throw "User does not exist";
		}

		// build a user object
		let provider = wallet.getProviderRegistry().getProvider(userIdentity.type);
		const user = await provider.getUserContext(userIdentity, username);

		if (user && user.isEnrolled()) {
			logger.info('Successfully loaded "%s" of org "%s" from persistence', username, userOrg);
			return user;
		}
		else {
			throw "username or password incorrect";
		}
	} catch (err) {
		throw new Error(err);
	}
};

const createWallet = async (orgName) => {
	let walletPath = path.join(__dirname, `../../../network/${process.env.NODE_ENV}/identities/${orgName}/wallet`);
		await walletHelper.create(walletPath);
		const wallet = await walletHelper.getWallet();
		return wallet;
}

const createIdentity = async (enrollment, orgName) => {
	let x509Identity;
	x509Identity = {
		credentials: {
			certificate: enrollment.certificate,
			privateKey: enrollment.key.toBytes(),
		},
		mspId: orgName.mspid,
		type: 'X.509',
	};
	return x509Identity;
}

const getCCP = (org) => {
	// load the common connection configuration file
	const ccpPath = path.resolve(__dirname, '../../../network/' + process.env.NODE_ENV + '/network-config/network-config-' + org + '.json');
	const fileExists = fs.existsSync(ccpPath);
	if (!fileExists) {
		throw new Error(`no such file or directory: ${ccpPath}`);
	}
	const contents = fs.readFileSync(ccpPath, 'utf8');

	// build a JSON object from the file contents
	const ccp = JSON.parse(contents);

	logger.debug(`Loaded the network configuration located at ${ccpPath}`);
	return ccp;
};

const getCAClientByOrg = async (orgName) => {
	const ccp = getCCP(orgName);
	const clientOrg = ccp.client.organization;
	logger.debug("Client Org -> ", clientOrg);
	const org = ccp.organizations[clientOrg];
	logger.debug("Org -> ", org);
	const orgCAKey = org.certificateAuthorities[0];
	logger.debug("Org CA Key -> ", orgCAKey);
	const caURL = ccp.certificateAuthorities[orgCAKey].url;
	logger.debug("Org CA URL -> ", caURL);
	const caName = ccp.certificateAuthorities[orgCAKey].caName;
	logger.debug("Org CA Name -> ", caName);
	const caTLSCACerts = ccp.certificateAuthorities[orgCAKey].tlsCACerts.pem;
	const mspId = org.mspid;
	logger.debug("MSP Id -> ", mspId);

	// enroll user with certificate authority for orgName
	const tlsOptions = {
		trustedRoots: caTLSCACerts,
		verify: false,
	};
	const caClient = new FabricCAServices(caURL, tlsOptions, caName);
	return caClient;
}

const getAdminCreds = async (orgName) => {
	let admin = config.adminList.filter((admin) => admin.org == orgName)[0];
	let adminUserId = admin.username;
	let adminUserPasswd = admin.password;
	return { adminUserId, adminUserPasswd };
}


// To sign using the user private key
const userSignature = async function (username, orgName, msg) {
	try {
		const wallet = await createWallet(orgName)
		const userIdentity = await wallet.get(username);
		if (!userIdentity) {
			throw new Error(`An identity for the user ${username} does not exists in the wallet`);
		}

		// build a user object
		let provider = wallet.getProviderRegistry().getProvider(userIdentity.type);
		const user = await provider.getUserContext(userIdentity, username);

		if (user && user.isEnrolled()) {
			// get the signing identity of the user
			let csr = user.getSigningIdentity();
			let signedData = await csr.sign(msg);
			return signedData;
		}
		else {
			throw new Error('user is not enrolled');
		}
	} catch (err) {
		logger.error('Failed to sign data with user signature: ' + err.stack ? err.stack : err);
		throw new Error('Failed to sign data with user signature: ' + err.toString());
	}
};

const parseChainData = async (chainData) => {
	let result;
	if (chainData && chainData.status == "SUCCESS") {
		result = chainData.objectBytes ? JSON.parse(chainData.objectBytes) : null;
	} else {
		throw new Error(JSON.parse(chainData.detail));
	}
	return result;
}

const getLogger = (moduleName) => {
	var logger = log4js.getLogger(moduleName);
	logger.level = config.loglevel;
	return logger;
};

module.exports = {
	enrollAdmin,
	registerAndEnrollUser,
	getRegisteredUser,
	createIdentity,
	getCAClientByOrg,
	getAdminCreds,
	userSignature,
	getCCP,
	parseChainData,
	ledgerOpsStatus,
	createWallet
}
