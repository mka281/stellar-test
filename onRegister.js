var StellarSdk = require("stellar-sdk");
var server = new StellarSdk.Server("https://horizon-testnet.stellar.org");

// Register
var pair = StellarSdk.Keypair.random();
console.log("Public Key:", pair.publicKey());
console.log("Secret Key:", pair.secret());
