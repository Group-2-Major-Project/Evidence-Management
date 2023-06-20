#!/bin/bash

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    local PP=$(one_line_pem $5)
    local CP=$(one_line_pem $6)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${P1PORT}/$3/" \
        -e "s/\${CAPORT}/$4/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        organizations/ccp-template.json
}

function yaml_ccp {
    local PP=$(one_line_pem $5)
    local CP=$(one_line_pem $6)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${P1PORT}/$3/" \
        -e "s/\${CAPORT}/$4/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        organizations/ccp-template.yaml | sed -e $'s/\\\\n/\\\n          /g'
}

## prepare connection profile for orgmotorvehicledepartment
ORG=motorvehicledepartment
P0PORT=4444
P1PORT=4454
CAPORT=4400
PEERPEM=organizations/peerOrganizations/motorvehicledepartment/tlsca/tlsca.motorvehicledepartment-cert.pem
CAPEM=organizations/peerOrganizations/motorvehicledepartment/ca/ca.motorvehicledepartment-cert.pem

echo "$(json_ccp $ORG $P0PORT $P1PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/motorvehicledepartment/connection-motorvehicledepartment.json
echo "$(yaml_ccp $ORG $P0PORT $P1PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/motorvehicledepartment/connection-motorvehicledepartment.yaml
# save another copy of json connection profile in a different directory
echo "$(json_ccp $ORG $P0PORT $P1PORT $CAPORT $PEERPEM $CAPEM)" > network-config/network-config-motorvehicledepartment.json

## prepare connection profile for orglicinsurance
ORG=licinsurance
P0PORT=5555
P1PORT=5565
CAPORT=5500
PEERPEM=organizations/peerOrganizations/licinsurance/tlsca/tlsca.licinsurance-cert.pem
CAPEM=organizations/peerOrganizations/licinsurance/ca/ca.licinsurance-cert.pem

echo "$(json_ccp $ORG $P0PORT $P1PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/licinsurance/connection-licinsurance.json
echo "$(yaml_ccp $ORG $P0PORT $P1PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/licinsurance/connection-licinsurance.yaml
# save another copy of json connection profile in a different directory
echo "$(json_ccp $ORG $P0PORT $P1PORT $CAPORT $PEERPEM $CAPEM)" > network-config/network-config-licinsurance.json

## prepare connection profile for orgbajajinsurance
ORG=bajajinsurance
P0PORT=6666
P1PORT=6676
CAPORT=6600
PEERPEM=organizations/peerOrganizations/bajajinsurance/tlsca/tlsca.bajajinsurance-cert.pem
CAPEM=organizations/peerOrganizations/bajajinsurance/ca/ca.bajajinsurance-cert.pem

echo "$(json_ccp $ORG $P0PORT $P1PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/bajajinsurance/connection-bajajinsurance.json
echo "$(yaml_ccp $ORG $P0PORT $P1PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/bajajinsurance/connection-bajajinsurance.yaml
# save another copy of json connection profile in a different directory
echo "$(json_ccp $ORG $P0PORT $P1PORT $CAPORT $PEERPEM $CAPEM)" > network-config/network-config-bajajinsurance.json

## prepare connection profile for orgbenzmanufacturer
ORG=benzmanufacturer
P0PORT=7777
P1PORT=7787
CAPORT=7700
PEERPEM=organizations/peerOrganizations/benzmanufacturer/tlsca/tlsca.benzmanufacturer-cert.pem
CAPEM=organizations/peerOrganizations/benzmanufacturer/ca/ca.benzmanufacturer-cert.pem

echo "$(json_ccp $ORG $P0PORT $P1PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/benzmanufacturer/connection-benzmanufacturer.json
echo "$(yaml_ccp $ORG $P0PORT $P1PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/benzmanufacturer/connection-benzmanufacturer.yaml
# save another copy of json connection profile in a different directory
echo "$(json_ccp $ORG $P0PORT $P1PORT $CAPORT $PEERPEM $CAPEM)" > network-config/network-config-benzmanufacturer.json




