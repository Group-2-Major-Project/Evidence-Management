const ipfsClient = require('ipfs-http-client');
const { chunk } = require('lodash');

const ipfs = ipfsClient.create({ host: 'localhost', port: '5001', protocol: 'http' })

const uploadToIPFS = async (fileList) => {
    var i = 0;
    var jsonStr = "[";
    try {
        return new Promise(async (res, rej) => {
            var fileAdded;
            // Process multiple files
            if (fileList.length) {
                for (i; i < fileList.length; i++) {
                    var file = fileList[i];
                    const fileName = file.name;
                    const buffer = await file.data;
                    try {
                        fileAdded = await ipfs.add(buffer);
                    } catch (err) {
                        rej(err.message);
                    }

                    if (fileAdded.path !== '') {
                        jsonStr += "{\"name\":\"" + fileName + "\",\"value\":\"" + fileAdded.path + "\",\"mimetype\":\"" + file.mimetype + "\"},"
                    } else {
                        return rej('Could not upload the file to ipfs network');
                    }
                }
                if (i === fileList.length) {
                    // Remove the last comma from the string.
                    jsonStr = jsonStr.replace(/,\s*$/, "") + "]";
                    return res(jsonStr);
                }
            } else { // Single file upload
                try {
                    fileAdded = await ipfs.add(fileList.data);
                } catch (err) {
                    rej(err.message);
                }
                if (fileAdded.path !== '') {
                    jsonStr += "{\"name\":\"" + fileList.name + "\",\"value\":\"" + fileAdded.path + "\",\"mimetype\":\"" + fileList.mimetype + "\"}]"
                    return res(jsonStr);
                } else {
                    return rej('Could not upload the file to ipfs network');
                }
            }

        })
    } catch (err) {
        message.error(err.message);
    }
}

const getIpfsFile = async (cid) => {
    // https://github.com/ipfs/js-ipfs/blob/master/docs/core-api/FILES.md#ipfscatipfspath-options
    let chunks = []
    for await (const buf of ipfs.cat(cid)) {
        chunks.push(buf);
    }
    var buffer = Buffer.concat(chunks);
    return buffer;
}

module.exports = {
    uploadToIPFS,
    getIpfsFile
}