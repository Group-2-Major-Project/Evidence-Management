# grant access to the network file
#cd ..
#chmod -R +x ./local
#cd ./local

# bring down the current network
./network.sh down

# Pull the images
./bootstrap.sh 2.2.3 1.5.1

# bring up the network
./network.sh up -ca -s couchdb

# create the evidence
./network.sh createChannel -c evidence -p DefaultChannel

# package and install 'evidence' chaincode on all org nodes
./network.sh deployCC -ccn evidenceCC -ccp ../../chaincode -ccl go -ccsd true

# deploy chaincode on evidence
# ./network.sh deployCC -c defaultchannel -ccn evidenceCC -ccp ../../chaincode -ccl go -cci Init -ccsp true
./network.sh deployCC -c evidence -ccn evidenceCC -ccp ../../chaincode -ccl go -ccsp true


