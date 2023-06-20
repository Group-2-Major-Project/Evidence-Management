#!/bin/bash

function createmotorvehicledepartment() {
  infoln "Enrolling the CA admin"
  mkdir -p organizations/peerOrganizations/motorvehicledepartment/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/motorvehicledepartment/


  fabric-ca-client enroll -u https://admin:adminpw@localhost:4400 --caname ca-motorvehicledepartment --tls.certfiles ${PWD}/organizations/fabric-ca/motorvehicledepartment/tls-cert.pem


  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-4400-ca-motorvehicledepartment.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-4400-ca-motorvehicledepartment.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-4400-ca-motorvehicledepartment.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-4400-ca-motorvehicledepartment.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/organizations/peerOrganizations/motorvehicledepartment/msp/config.yaml

  infoln "Registering peer0"

  fabric-ca-client register --caname ca-motorvehicledepartment --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles ${PWD}/organizations/fabric-ca/motorvehicledepartment/tls-cert.pem


  infoln "Registering peer1"

  fabric-ca-client register --caname ca-motorvehicledepartment --id.name peer1 --id.secret peer1pw --id.type peer --tls.certfiles ${PWD}/organizations/fabric-ca/motorvehicledepartment/tls-cert.pem


  infoln "Registering user"

  fabric-ca-client register --caname ca-motorvehicledepartment --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/organizations/fabric-ca/motorvehicledepartment/tls-cert.pem


  infoln "Registering the org admin"

  fabric-ca-client register --caname ca-motorvehicledepartment --id.name motorvehicledepartmentadmin --id.secret motorvehicledepartmentadminpw --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/motorvehicledepartment/tls-cert.pem


  infoln "Generating the peer0 msp"

  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:4400 --caname ca-motorvehicledepartment -M ${PWD}/organizations/peerOrganizations/motorvehicledepartment/peers/peer0.motorvehicledepartment/msp --csr.hosts peer0.motorvehicledepartment --tls.certfiles ${PWD}/organizations/fabric-ca/motorvehicledepartment/tls-cert.pem


  infoln "Generating the peer1 msp"

  fabric-ca-client enroll -u https://peer1:peer1pw@localhost:4400 --caname ca-motorvehicledepartment -M ${PWD}/organizations/peerOrganizations/motorvehicledepartment/peers/peer1.motorvehicledepartment/msp --csr.hosts peer1.motorvehicledepartment --tls.certfiles ${PWD}/organizations/fabric-ca/motorvehicledepartment/tls-cert.pem


  cp ${PWD}/organizations/peerOrganizations/motorvehicledepartment/msp/config.yaml ${PWD}/organizations/peerOrganizations/motorvehicledepartment/peers/peer0.motorvehicledepartment/msp/config.yaml
  cp ${PWD}/organizations/peerOrganizations/motorvehicledepartment/msp/config.yaml ${PWD}/organizations/peerOrganizations/motorvehicledepartment/peers/peer1.motorvehicledepartment/msp/config.yaml

  infoln "Generating the peer0-tls certificates"
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:4400 --caname ca-motorvehicledepartment -M ${PWD}/organizations/peerOrganizations/motorvehicledepartment/peers/peer0.motorvehicledepartment/tls --enrollment.profile tls --csr.hosts peer0.motorvehicledepartment --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/motorvehicledepartment/tls-cert.pem

  infoln "Generating the peer1-tls certificates"
  fabric-ca-client enroll -u https://peer1:peer1pw@localhost:4400 --caname ca-motorvehicledepartment -M ${PWD}/organizations/peerOrganizations/motorvehicledepartment/peers/peer1.motorvehicledepartment/tls --enrollment.profile tls --csr.hosts peer1.motorvehicledepartment --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/motorvehicledepartment/tls-cert.pem

  cp ${PWD}/organizations/peerOrganizations/motorvehicledepartment/peers/peer0.motorvehicledepartment/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/motorvehicledepartment/peers/peer0.motorvehicledepartment/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/motorvehicledepartment/peers/peer0.motorvehicledepartment/tls/signcerts/* ${PWD}/organizations/peerOrganizations/motorvehicledepartment/peers/peer0.motorvehicledepartment/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/motorvehicledepartment/peers/peer0.motorvehicledepartment/tls/keystore/* ${PWD}/organizations/peerOrganizations/motorvehicledepartment/peers/peer0.motorvehicledepartment/tls/server.key



  cp ${PWD}/organizations/peerOrganizations/motorvehicledepartment/peers/peer1.motorvehicledepartment/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/motorvehicledepartment/peers/peer1.motorvehicledepartment/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/motorvehicledepartment/peers/peer1.motorvehicledepartment/tls/signcerts/* ${PWD}/organizations/peerOrganizations/motorvehicledepartment/peers/peer1.motorvehicledepartment/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/motorvehicledepartment/peers/peer1.motorvehicledepartment/tls/keystore/* ${PWD}/organizations/peerOrganizations/motorvehicledepartment/peers/peer1.motorvehicledepartment/tls/server.key



  mkdir -p ${PWD}/organizations/peerOrganizations/motorvehicledepartment/msp/tlscacerts
  cp ${PWD}/organizations/peerOrganizations/motorvehicledepartment/peers/peer0.motorvehicledepartment/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/motorvehicledepartment/msp/tlscacerts/ca.crt

  mkdir -p ${PWD}/organizations/peerOrganizations/motorvehicledepartment/tlsca
  cp ${PWD}/organizations/peerOrganizations/motorvehicledepartment/peers/peer0.motorvehicledepartment/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/motorvehicledepartment/tlsca/tlsca.motorvehicledepartment-cert.pem

  mkdir -p ${PWD}/organizations/peerOrganizations/motorvehicledepartment/ca
  cp ${PWD}/organizations/peerOrganizations/motorvehicledepartment/peers/peer0.motorvehicledepartment/msp/cacerts/* ${PWD}/organizations/peerOrganizations/motorvehicledepartment/ca/ca.motorvehicledepartment-cert.pem

  infoln "Generating the user msp"

  fabric-ca-client enroll -u https://user1:user1pw@localhost:4400 --caname ca-motorvehicledepartment -M ${PWD}/organizations/peerOrganizations/motorvehicledepartment/users/User1@motorvehicledepartment/msp --tls.certfiles ${PWD}/organizations/fabric-ca/motorvehicledepartment/tls-cert.pem


  cp ${PWD}/organizations/peerOrganizations/motorvehicledepartment/msp/config.yaml ${PWD}/organizations/peerOrganizations/motorvehicledepartment/users/User1@motorvehicledepartment/msp/config.yaml

  infoln "Generating the org admin msp"

  fabric-ca-client enroll -u https://motorvehicledepartmentadmin:motorvehicledepartmentadminpw@localhost:4400 --caname ca-motorvehicledepartment -M ${PWD}/organizations/peerOrganizations/motorvehicledepartment/users/Admin@motorvehicledepartment/msp --tls.certfiles ${PWD}/organizations/fabric-ca/motorvehicledepartment/tls-cert.pem


  cp ${PWD}/organizations/peerOrganizations/motorvehicledepartment/msp/config.yaml ${PWD}/organizations/peerOrganizations/motorvehicledepartment/users/Admin@motorvehicledepartment/msp/config.yaml
}
function createlicinsurance() {
  infoln "Enrolling the CA admin"
  mkdir -p organizations/peerOrganizations/licinsurance/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/licinsurance/


  fabric-ca-client enroll -u https://admin:adminpw@localhost:5500 --caname ca-licinsurance --tls.certfiles ${PWD}/organizations/fabric-ca/licinsurance/tls-cert.pem


  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-5500-ca-licinsurance.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-5500-ca-licinsurance.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-5500-ca-licinsurance.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-5500-ca-licinsurance.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/organizations/peerOrganizations/licinsurance/msp/config.yaml

  infoln "Registering peer0"

  fabric-ca-client register --caname ca-licinsurance --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles ${PWD}/organizations/fabric-ca/licinsurance/tls-cert.pem


  infoln "Registering peer1"

  fabric-ca-client register --caname ca-licinsurance --id.name peer1 --id.secret peer1pw --id.type peer --tls.certfiles ${PWD}/organizations/fabric-ca/licinsurance/tls-cert.pem


  infoln "Registering user"

  fabric-ca-client register --caname ca-licinsurance --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/organizations/fabric-ca/licinsurance/tls-cert.pem


  infoln "Registering the org admin"

  fabric-ca-client register --caname ca-licinsurance --id.name licinsuranceadmin --id.secret licinsuranceadminpw --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/licinsurance/tls-cert.pem


  infoln "Generating the peer0 msp"

  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:5500 --caname ca-licinsurance -M ${PWD}/organizations/peerOrganizations/licinsurance/peers/peer0.licinsurance/msp --csr.hosts peer0.licinsurance --tls.certfiles ${PWD}/organizations/fabric-ca/licinsurance/tls-cert.pem


  infoln "Generating the peer1 msp"

  fabric-ca-client enroll -u https://peer1:peer1pw@localhost:5500 --caname ca-licinsurance -M ${PWD}/organizations/peerOrganizations/licinsurance/peers/peer1.licinsurance/msp --csr.hosts peer1.licinsurance --tls.certfiles ${PWD}/organizations/fabric-ca/licinsurance/tls-cert.pem


  cp ${PWD}/organizations/peerOrganizations/licinsurance/msp/config.yaml ${PWD}/organizations/peerOrganizations/licinsurance/peers/peer0.licinsurance/msp/config.yaml
  cp ${PWD}/organizations/peerOrganizations/licinsurance/msp/config.yaml ${PWD}/organizations/peerOrganizations/licinsurance/peers/peer1.licinsurance/msp/config.yaml

  infoln "Generating the peer0-tls certificates"
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:5500 --caname ca-licinsurance -M ${PWD}/organizations/peerOrganizations/licinsurance/peers/peer0.licinsurance/tls --enrollment.profile tls --csr.hosts peer0.licinsurance --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/licinsurance/tls-cert.pem

  infoln "Generating the peer1-tls certificates"
  fabric-ca-client enroll -u https://peer1:peer1pw@localhost:5500 --caname ca-licinsurance -M ${PWD}/organizations/peerOrganizations/licinsurance/peers/peer1.licinsurance/tls --enrollment.profile tls --csr.hosts peer1.licinsurance --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/licinsurance/tls-cert.pem

  cp ${PWD}/organizations/peerOrganizations/licinsurance/peers/peer0.licinsurance/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/licinsurance/peers/peer0.licinsurance/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/licinsurance/peers/peer0.licinsurance/tls/signcerts/* ${PWD}/organizations/peerOrganizations/licinsurance/peers/peer0.licinsurance/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/licinsurance/peers/peer0.licinsurance/tls/keystore/* ${PWD}/organizations/peerOrganizations/licinsurance/peers/peer0.licinsurance/tls/server.key



  cp ${PWD}/organizations/peerOrganizations/licinsurance/peers/peer1.licinsurance/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/licinsurance/peers/peer1.licinsurance/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/licinsurance/peers/peer1.licinsurance/tls/signcerts/* ${PWD}/organizations/peerOrganizations/licinsurance/peers/peer1.licinsurance/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/licinsurance/peers/peer1.licinsurance/tls/keystore/* ${PWD}/organizations/peerOrganizations/licinsurance/peers/peer1.licinsurance/tls/server.key



  mkdir -p ${PWD}/organizations/peerOrganizations/licinsurance/msp/tlscacerts
  cp ${PWD}/organizations/peerOrganizations/licinsurance/peers/peer0.licinsurance/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/licinsurance/msp/tlscacerts/ca.crt

  mkdir -p ${PWD}/organizations/peerOrganizations/licinsurance/tlsca
  cp ${PWD}/organizations/peerOrganizations/licinsurance/peers/peer0.licinsurance/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/licinsurance/tlsca/tlsca.licinsurance-cert.pem

  mkdir -p ${PWD}/organizations/peerOrganizations/licinsurance/ca
  cp ${PWD}/organizations/peerOrganizations/licinsurance/peers/peer0.licinsurance/msp/cacerts/* ${PWD}/organizations/peerOrganizations/licinsurance/ca/ca.licinsurance-cert.pem

  infoln "Generating the user msp"

  fabric-ca-client enroll -u https://user1:user1pw@localhost:5500 --caname ca-licinsurance -M ${PWD}/organizations/peerOrganizations/licinsurance/users/User1@licinsurance/msp --tls.certfiles ${PWD}/organizations/fabric-ca/licinsurance/tls-cert.pem


  cp ${PWD}/organizations/peerOrganizations/licinsurance/msp/config.yaml ${PWD}/organizations/peerOrganizations/licinsurance/users/User1@licinsurance/msp/config.yaml

  infoln "Generating the org admin msp"

  fabric-ca-client enroll -u https://licinsuranceadmin:licinsuranceadminpw@localhost:5500 --caname ca-licinsurance -M ${PWD}/organizations/peerOrganizations/licinsurance/users/Admin@licinsurance/msp --tls.certfiles ${PWD}/organizations/fabric-ca/licinsurance/tls-cert.pem


  cp ${PWD}/organizations/peerOrganizations/licinsurance/msp/config.yaml ${PWD}/organizations/peerOrganizations/licinsurance/users/Admin@licinsurance/msp/config.yaml
}
function createbajajinsurance() {
  infoln "Enrolling the CA admin"
  mkdir -p organizations/peerOrganizations/bajajinsurance/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/bajajinsurance/


  fabric-ca-client enroll -u https://admin:adminpw@localhost:6600 --caname ca-bajajinsurance --tls.certfiles ${PWD}/organizations/fabric-ca/bajajinsurance/tls-cert.pem


  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-6600-ca-bajajinsurance.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-6600-ca-bajajinsurance.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-6600-ca-bajajinsurance.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-6600-ca-bajajinsurance.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/organizations/peerOrganizations/bajajinsurance/msp/config.yaml

  infoln "Registering peer0"

  fabric-ca-client register --caname ca-bajajinsurance --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles ${PWD}/organizations/fabric-ca/bajajinsurance/tls-cert.pem


  infoln "Registering peer1"

  fabric-ca-client register --caname ca-bajajinsurance --id.name peer1 --id.secret peer1pw --id.type peer --tls.certfiles ${PWD}/organizations/fabric-ca/bajajinsurance/tls-cert.pem


  infoln "Registering user"

  fabric-ca-client register --caname ca-bajajinsurance --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/organizations/fabric-ca/bajajinsurance/tls-cert.pem


  infoln "Registering the org admin"

  fabric-ca-client register --caname ca-bajajinsurance --id.name bajajinsuranceadmin --id.secret bajajinsuranceadminpw --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/bajajinsurance/tls-cert.pem


  infoln "Generating the peer0 msp"

  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:6600 --caname ca-bajajinsurance -M ${PWD}/organizations/peerOrganizations/bajajinsurance/peers/peer0.bajajinsurance/msp --csr.hosts peer0.bajajinsurance --tls.certfiles ${PWD}/organizations/fabric-ca/bajajinsurance/tls-cert.pem


  infoln "Generating the peer1 msp"

  fabric-ca-client enroll -u https://peer1:peer1pw@localhost:6600 --caname ca-bajajinsurance -M ${PWD}/organizations/peerOrganizations/bajajinsurance/peers/peer1.bajajinsurance/msp --csr.hosts peer1.bajajinsurance --tls.certfiles ${PWD}/organizations/fabric-ca/bajajinsurance/tls-cert.pem


  cp ${PWD}/organizations/peerOrganizations/bajajinsurance/msp/config.yaml ${PWD}/organizations/peerOrganizations/bajajinsurance/peers/peer0.bajajinsurance/msp/config.yaml
  cp ${PWD}/organizations/peerOrganizations/bajajinsurance/msp/config.yaml ${PWD}/organizations/peerOrganizations/bajajinsurance/peers/peer1.bajajinsurance/msp/config.yaml

  infoln "Generating the peer0-tls certificates"
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:6600 --caname ca-bajajinsurance -M ${PWD}/organizations/peerOrganizations/bajajinsurance/peers/peer0.bajajinsurance/tls --enrollment.profile tls --csr.hosts peer0.bajajinsurance --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/bajajinsurance/tls-cert.pem

  infoln "Generating the peer1-tls certificates"
  fabric-ca-client enroll -u https://peer1:peer1pw@localhost:6600 --caname ca-bajajinsurance -M ${PWD}/organizations/peerOrganizations/bajajinsurance/peers/peer1.bajajinsurance/tls --enrollment.profile tls --csr.hosts peer1.bajajinsurance --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/bajajinsurance/tls-cert.pem

  cp ${PWD}/organizations/peerOrganizations/bajajinsurance/peers/peer0.bajajinsurance/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/bajajinsurance/peers/peer0.bajajinsurance/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/bajajinsurance/peers/peer0.bajajinsurance/tls/signcerts/* ${PWD}/organizations/peerOrganizations/bajajinsurance/peers/peer0.bajajinsurance/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/bajajinsurance/peers/peer0.bajajinsurance/tls/keystore/* ${PWD}/organizations/peerOrganizations/bajajinsurance/peers/peer0.bajajinsurance/tls/server.key



  cp ${PWD}/organizations/peerOrganizations/bajajinsurance/peers/peer1.bajajinsurance/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/bajajinsurance/peers/peer1.bajajinsurance/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/bajajinsurance/peers/peer1.bajajinsurance/tls/signcerts/* ${PWD}/organizations/peerOrganizations/bajajinsurance/peers/peer1.bajajinsurance/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/bajajinsurance/peers/peer1.bajajinsurance/tls/keystore/* ${PWD}/organizations/peerOrganizations/bajajinsurance/peers/peer1.bajajinsurance/tls/server.key



  mkdir -p ${PWD}/organizations/peerOrganizations/bajajinsurance/msp/tlscacerts
  cp ${PWD}/organizations/peerOrganizations/bajajinsurance/peers/peer0.bajajinsurance/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/bajajinsurance/msp/tlscacerts/ca.crt

  mkdir -p ${PWD}/organizations/peerOrganizations/bajajinsurance/tlsca
  cp ${PWD}/organizations/peerOrganizations/bajajinsurance/peers/peer0.bajajinsurance/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/bajajinsurance/tlsca/tlsca.bajajinsurance-cert.pem

  mkdir -p ${PWD}/organizations/peerOrganizations/bajajinsurance/ca
  cp ${PWD}/organizations/peerOrganizations/bajajinsurance/peers/peer0.bajajinsurance/msp/cacerts/* ${PWD}/organizations/peerOrganizations/bajajinsurance/ca/ca.bajajinsurance-cert.pem

  infoln "Generating the user msp"

  fabric-ca-client enroll -u https://user1:user1pw@localhost:6600 --caname ca-bajajinsurance -M ${PWD}/organizations/peerOrganizations/bajajinsurance/users/User1@bajajinsurance/msp --tls.certfiles ${PWD}/organizations/fabric-ca/bajajinsurance/tls-cert.pem


  cp ${PWD}/organizations/peerOrganizations/bajajinsurance/msp/config.yaml ${PWD}/organizations/peerOrganizations/bajajinsurance/users/User1@bajajinsurance/msp/config.yaml

  infoln "Generating the org admin msp"

  fabric-ca-client enroll -u https://bajajinsuranceadmin:bajajinsuranceadminpw@localhost:6600 --caname ca-bajajinsurance -M ${PWD}/organizations/peerOrganizations/bajajinsurance/users/Admin@bajajinsurance/msp --tls.certfiles ${PWD}/organizations/fabric-ca/bajajinsurance/tls-cert.pem


  cp ${PWD}/organizations/peerOrganizations/bajajinsurance/msp/config.yaml ${PWD}/organizations/peerOrganizations/bajajinsurance/users/Admin@bajajinsurance/msp/config.yaml
}
function createbenzmanufacturer() {
  infoln "Enrolling the CA admin"
  mkdir -p organizations/peerOrganizations/benzmanufacturer/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/benzmanufacturer/


  fabric-ca-client enroll -u https://admin:adminpw@localhost:7700 --caname ca-benzmanufacturer --tls.certfiles ${PWD}/organizations/fabric-ca/benzmanufacturer/tls-cert.pem


  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-7700-ca-benzmanufacturer.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-7700-ca-benzmanufacturer.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-7700-ca-benzmanufacturer.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-7700-ca-benzmanufacturer.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/organizations/peerOrganizations/benzmanufacturer/msp/config.yaml

  infoln "Registering peer0"

  fabric-ca-client register --caname ca-benzmanufacturer --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles ${PWD}/organizations/fabric-ca/benzmanufacturer/tls-cert.pem


  infoln "Registering peer1"

  fabric-ca-client register --caname ca-benzmanufacturer --id.name peer1 --id.secret peer1pw --id.type peer --tls.certfiles ${PWD}/organizations/fabric-ca/benzmanufacturer/tls-cert.pem


  infoln "Registering user"

  fabric-ca-client register --caname ca-benzmanufacturer --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/organizations/fabric-ca/benzmanufacturer/tls-cert.pem


  infoln "Registering the org admin"

  fabric-ca-client register --caname ca-benzmanufacturer --id.name benzmanufactureradmin --id.secret benzmanufactureradminpw --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/benzmanufacturer/tls-cert.pem


  infoln "Generating the peer0 msp"

  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7700 --caname ca-benzmanufacturer -M ${PWD}/organizations/peerOrganizations/benzmanufacturer/peers/peer0.benzmanufacturer/msp --csr.hosts peer0.benzmanufacturer --tls.certfiles ${PWD}/organizations/fabric-ca/benzmanufacturer/tls-cert.pem


  infoln "Generating the peer1 msp"

  fabric-ca-client enroll -u https://peer1:peer1pw@localhost:7700 --caname ca-benzmanufacturer -M ${PWD}/organizations/peerOrganizations/benzmanufacturer/peers/peer1.benzmanufacturer/msp --csr.hosts peer1.benzmanufacturer --tls.certfiles ${PWD}/organizations/fabric-ca/benzmanufacturer/tls-cert.pem


  cp ${PWD}/organizations/peerOrganizations/benzmanufacturer/msp/config.yaml ${PWD}/organizations/peerOrganizations/benzmanufacturer/peers/peer0.benzmanufacturer/msp/config.yaml
  cp ${PWD}/organizations/peerOrganizations/benzmanufacturer/msp/config.yaml ${PWD}/organizations/peerOrganizations/benzmanufacturer/peers/peer1.benzmanufacturer/msp/config.yaml

  infoln "Generating the peer0-tls certificates"
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7700 --caname ca-benzmanufacturer -M ${PWD}/organizations/peerOrganizations/benzmanufacturer/peers/peer0.benzmanufacturer/tls --enrollment.profile tls --csr.hosts peer0.benzmanufacturer --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/benzmanufacturer/tls-cert.pem

  infoln "Generating the peer1-tls certificates"
  fabric-ca-client enroll -u https://peer1:peer1pw@localhost:7700 --caname ca-benzmanufacturer -M ${PWD}/organizations/peerOrganizations/benzmanufacturer/peers/peer1.benzmanufacturer/tls --enrollment.profile tls --csr.hosts peer1.benzmanufacturer --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/benzmanufacturer/tls-cert.pem

  cp ${PWD}/organizations/peerOrganizations/benzmanufacturer/peers/peer0.benzmanufacturer/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/benzmanufacturer/peers/peer0.benzmanufacturer/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/benzmanufacturer/peers/peer0.benzmanufacturer/tls/signcerts/* ${PWD}/organizations/peerOrganizations/benzmanufacturer/peers/peer0.benzmanufacturer/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/benzmanufacturer/peers/peer0.benzmanufacturer/tls/keystore/* ${PWD}/organizations/peerOrganizations/benzmanufacturer/peers/peer0.benzmanufacturer/tls/server.key



  cp ${PWD}/organizations/peerOrganizations/benzmanufacturer/peers/peer1.benzmanufacturer/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/benzmanufacturer/peers/peer1.benzmanufacturer/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/benzmanufacturer/peers/peer1.benzmanufacturer/tls/signcerts/* ${PWD}/organizations/peerOrganizations/benzmanufacturer/peers/peer1.benzmanufacturer/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/benzmanufacturer/peers/peer1.benzmanufacturer/tls/keystore/* ${PWD}/organizations/peerOrganizations/benzmanufacturer/peers/peer1.benzmanufacturer/tls/server.key



  mkdir -p ${PWD}/organizations/peerOrganizations/benzmanufacturer/msp/tlscacerts
  cp ${PWD}/organizations/peerOrganizations/benzmanufacturer/peers/peer0.benzmanufacturer/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/benzmanufacturer/msp/tlscacerts/ca.crt

  mkdir -p ${PWD}/organizations/peerOrganizations/benzmanufacturer/tlsca
  cp ${PWD}/organizations/peerOrganizations/benzmanufacturer/peers/peer0.benzmanufacturer/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/benzmanufacturer/tlsca/tlsca.benzmanufacturer-cert.pem

  mkdir -p ${PWD}/organizations/peerOrganizations/benzmanufacturer/ca
  cp ${PWD}/organizations/peerOrganizations/benzmanufacturer/peers/peer0.benzmanufacturer/msp/cacerts/* ${PWD}/organizations/peerOrganizations/benzmanufacturer/ca/ca.benzmanufacturer-cert.pem

  infoln "Generating the user msp"

  fabric-ca-client enroll -u https://user1:user1pw@localhost:7700 --caname ca-benzmanufacturer -M ${PWD}/organizations/peerOrganizations/benzmanufacturer/users/User1@benzmanufacturer/msp --tls.certfiles ${PWD}/organizations/fabric-ca/benzmanufacturer/tls-cert.pem


  cp ${PWD}/organizations/peerOrganizations/benzmanufacturer/msp/config.yaml ${PWD}/organizations/peerOrganizations/benzmanufacturer/users/User1@benzmanufacturer/msp/config.yaml

  infoln "Generating the org admin msp"

  fabric-ca-client enroll -u https://benzmanufactureradmin:benzmanufactureradminpw@localhost:7700 --caname ca-benzmanufacturer -M ${PWD}/organizations/peerOrganizations/benzmanufacturer/users/Admin@benzmanufacturer/msp --tls.certfiles ${PWD}/organizations/fabric-ca/benzmanufacturer/tls-cert.pem


  cp ${PWD}/organizations/peerOrganizations/benzmanufacturer/msp/config.yaml ${PWD}/organizations/peerOrganizations/benzmanufacturer/users/Admin@benzmanufacturer/msp/config.yaml
}
function createorderer1() {
  infoln "Enrolling the CA admin"
  mkdir -p organizations/ordererOrganizations/orderer1

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/ordererOrganizations/orderer1


  fabric-ca-client enroll -u https://admin:adminpw@localhost:2200 --caname ca-orderer1 --tls.certfiles ${PWD}/organizations/fabric-ca/orderer1/tls-cert.pem


  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-2200-ca-orderer1.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-2200-ca-orderer1.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-2200-ca-orderer1.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-2200-ca-orderer1.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/organizations/ordererOrganizations/orderer1/msp/config.yaml

  infoln "Registering orderer"

  fabric-ca-client register --caname ca-orderer1 --id.name orderer --id.secret ordererpw --id.type orderer --tls.certfiles ${PWD}/organizations/fabric-ca/orderer1/tls-cert.pem


  infoln "Registering the orderer admin"

  fabric-ca-client register --caname ca-orderer1 --id.name ordererAdmin --id.secret ordererAdminpw --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/orderer1/tls-cert.pem


  infoln "Generating the orderer msp"

  fabric-ca-client enroll -u https://orderer:ordererpw@localhost:2200 --caname ca-orderer1 -M ${PWD}/organizations/ordererOrganizations/orderer1/config.orderers/msp --csr.hosts orderer1 --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/orderer1/tls-cert.pem


  cp ${PWD}/organizations/ordererOrganizations/orderer1/msp/config.yaml ${PWD}/organizations/ordererOrganizations/orderer1/config.orderers/msp/config.yaml

  infoln "Generating the orderer-tls certificates"

  fabric-ca-client enroll -u https://orderer:ordererpw@localhost:2200 --caname ca-orderer1 -M ${PWD}/organizations/ordererOrganizations/orderer1/config.orderers/tls --enrollment.profile tls --csr.hosts orderer1 --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/orderer1/tls-cert.pem


  cp ${PWD}/organizations/ordererOrganizations/orderer1/config.orderers/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/orderer1/config.orderers/tls/ca.crt
  cp ${PWD}/organizations/ordererOrganizations/orderer1/config.orderers/tls/signcerts/* ${PWD}/organizations/ordererOrganizations/orderer1/config.orderers/tls/server.crt
  cp ${PWD}/organizations/ordererOrganizations/orderer1/config.orderers/tls/keystore/* ${PWD}/organizations/ordererOrganizations/orderer1/config.orderers/tls/server.key

  mkdir -p ${PWD}/organizations/ordererOrganizations/orderer1/config.orderers/msp/tlscacerts
  cp ${PWD}/organizations/ordererOrganizations/orderer1/config.orderers/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/orderer1/config.orderers/msp/tlscacerts/tlsca-cert.pem

  mkdir -p ${PWD}/organizations/ordererOrganizations/orderer1/msp/tlscacerts
  cp ${PWD}/organizations/ordererOrganizations/orderer1/config.orderers/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/orderer1/msp/tlscacerts/tlsca-cert.pem

  infoln "Generating the admin msp"

  fabric-ca-client enroll -u https://ordererAdmin:ordererAdminpw@localhost:2200 --caname ca-orderer1 -M ${PWD}/organizations/ordererOrganizations/orderer1/users/Admin@example.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/orderer1/tls-cert.pem


  cp ${PWD}/organizations/ordererOrganizations/orderer1/msp/config.yaml ${PWD}/organizations/ordererOrganizations/orderer1/users/Admin@example.com/msp/config.yaml
}



