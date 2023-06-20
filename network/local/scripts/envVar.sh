#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#

# This is a collection of bash functions used by different scripts

# imports
. scripts/utils.sh

export CORE_PEER_TLS_ENABLED=true

export ORDERER1_CA=${PWD}/organizations/ordererOrganizations/orderer1/msp/tlscacerts/tlsca-cert.pem
export PEER0_MOTORVEHICLEDEPARTMENT_CA=${PWD}/organizations/peerOrganizations/motorvehicledepartment/peers/peer0.motorvehicledepartment/tls/ca.crt
export PEER0_LICINSURANCE_CA=${PWD}/organizations/peerOrganizations/licinsurance/peers/peer0.licinsurance/tls/ca.crt
export PEER0_BAJAJINSURANCE_CA=${PWD}/organizations/peerOrganizations/bajajinsurance/peers/peer0.bajajinsurance/tls/ca.crt
export PEER0_BENZMANUFACTURER_CA=${PWD}/organizations/peerOrganizations/benzmanufacturer/peers/peer0.benzmanufacturer/tls/ca.crt

# Set environment variables for the peer org
setGlobals() {
  PEER=$1
  local USING_ORG=""
  if [ -z "$OVERRIDE_ORG" ]; then
    USING_ORG=$2
  else
    USING_ORG="${OVERRIDE_ORG}"
  fi
  infoln "Using organization ${USING_ORG}"
  if [ "$USING_ORG" == "motorvehicledepartment" ]; then
    export CORE_PEER_LOCALMSPID="motorvehicledepartmentmsp"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_MOTORVEHICLEDEPARTMENT_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/motorvehicledepartment/users/Admin@motorvehicledepartment/msp
    # export CORE_PEER_ADDRESS=localhost:4444
    if [ $PEER -eq 0 ]; then
      export CORE_PEER_ADDRESS=localhost:4444
    elif [ $PEER -eq 1 ]; then
      export CORE_PEER_ADDRESS=localhost:4454
    elif [ $PEER -eq 2 ]; then
      export CORE_PEER_ADDRESS=localhost:4464
    elif [ $PEER -eq 3 ]; then
      export CORE_PEER_ADDRESS=localhost:4474
    fi
  elif [ "$USING_ORG" == "licinsurance" ]; then
    export CORE_PEER_LOCALMSPID="licinsurancemsp"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_LICINSURANCE_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/licinsurance/users/Admin@licinsurance/msp
    # export CORE_PEER_ADDRESS=localhost:5555
    if [ $PEER -eq 0 ]; then
      export CORE_PEER_ADDRESS=localhost:5555
    elif [ $PEER -eq 1 ]; then
      export CORE_PEER_ADDRESS=localhost:5565
    elif [ $PEER -eq 2 ]; then
      export CORE_PEER_ADDRESS=localhost:5575
    elif [ $PEER -eq 3 ]; then
      export CORE_PEER_ADDRESS=localhost:5585
    fi
  elif [ "$USING_ORG" == "bajajinsurance" ]; then
    export CORE_PEER_LOCALMSPID="bajajinsurancemsp"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_BAJAJINSURANCE_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/bajajinsurance/users/Admin@bajajinsurance/msp
    # export CORE_PEER_ADDRESS=localhost:6666
    if [ $PEER -eq 0 ]; then
      export CORE_PEER_ADDRESS=localhost:6666
    elif [ $PEER -eq 1 ]; then
      export CORE_PEER_ADDRESS=localhost:6676
    elif [ $PEER -eq 2 ]; then
      export CORE_PEER_ADDRESS=localhost:6686
    elif [ $PEER -eq 3 ]; then
      export CORE_PEER_ADDRESS=localhost:6696
    fi
  elif [ "$USING_ORG" == "benzmanufacturer" ]; then
    export CORE_PEER_LOCALMSPID="benzmanufacturermsp"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_BENZMANUFACTURER_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/benzmanufacturer/users/Admin@benzmanufacturer/msp
    # export CORE_PEER_ADDRESS=localhost:7777
    if [ $PEER -eq 0 ]; then
      export CORE_PEER_ADDRESS=localhost:7777
    elif [ $PEER -eq 1 ]; then
      export CORE_PEER_ADDRESS=localhost:7787
    elif [ $PEER -eq 2 ]; then
      export CORE_PEER_ADDRESS=localhost:7797
    elif [ $PEER -eq 3 ]; then
      export CORE_PEER_ADDRESS=localhost:7807
    fi

  else
    errorln "ORG Unknown"
  fi

  if [ "$VERBOSE" == "true" ]; then
    env | grep CORE
  fi
}

# Set environment variables for use in the CLI container 
setGlobalsCLI() {
  setGlobals 0 $1

  local USING_ORG=""
  if [ -z "$OVERRIDE_ORG" ]; then
    USING_ORG=$1
  else
    USING_ORG="${OVERRIDE_ORG}"
  fi
  if [ "$USING_ORG" == "motorvehicledepartment" ]; then
    export CORE_PEER_ADDRESS=peer0.motorvehicledepartment:4444
  elif [ "$USING_ORG" == "licinsurance" ]; then
    export CORE_PEER_ADDRESS=peer0.licinsurance:5555
  elif [ "$USING_ORG" == "bajajinsurance" ]; then
    export CORE_PEER_ADDRESS=peer0.bajajinsurance:6666
  elif [ "$USING_ORG" == "benzmanufacturer" ]; then
    export CORE_PEER_ADDRESS=peer0.benzmanufacturer:7777

  else
    errorln "ORG Unknown"
  fi
}

# parsePeerConnectionParameters $@
# Helper function that sets the peer connection parameters for a chaincode
# operation
parsePeerConnectionParameters() {
  PEER_CONN_PARMS=""
  PEERS=""
  echo $1
  while [ "$#" -gt 0 ]; do
    setGlobals 0 $1
    PEER="peer0.$1"
    ## Set peer addresses
    PEERS="$PEERS $PEER"
    PEER_CONN_PARMS="$PEER_CONN_PARMS --peerAddresses $CORE_PEER_ADDRESS"
    ## Set path to TLS certificate
    TLSINFO=$(eval echo "--tlsRootCertFiles \$PEER0_$(echo $1 | tr 'a-z' 'A-Z')_CA")
    PEER_CONN_PARMS="$PEER_CONN_PARMS $TLSINFO"
    # shift by one to get to the next organization
    shift
  done
  # remove leading space for output
  PEERS="$(echo -e "$PEERS" | sed -e 's/^[[:space:]]*//')"
}

verifyResult() {
  if [ $1 -ne 0 ]; then
    fatalln "$2"
  fi
}

