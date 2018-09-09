var StellarSdk = require("stellar-sdk");

// The source account is the account we will be signing and sending from.
var sourceSecretKey = 'SBYXSKOYQWU5XNI76KSRUTTUZZLYMRHS7P23N43BS2LQPGI4WA54YDO6';

// Derive Keypair object and public key (that starts with a G) from the secret
var sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecretKey);
var sourcePublicKey = sourceKeypair.publicKey();

var issuerPublicKey = 'GAU75JD4PRSSMXHZXN2SQIWL34QDQMYHP6UL6URRCPR2DTHYYTCUWT37';

// Configure StellarSdk to talk to the horizon instance hosted by Stellar.org
// To use the live network, set the hostname to 'horizon.stellar.org'
var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

// Uncomment the following line to build transactions for the live network. Be
// sure to also change the horizon hostname.
// StellarSdk.Network.usePublicNetwork();
StellarSdk.Network.useTestNetwork();

const amount = '1000'
const asset = 'KKK'
//
const axios = require("axios");
const accountId = "GC7PSQ543KRZTMIQ6E6MZ5V7LVLZ4LVCMP2ELX2BLYNCWESERICAV2DT";
const url = `https://horizon-testnet.stellar.org/accounts/${accountId}`;
axios
  .get(url)
  .then(response => {
    console.log("AccountID", response.data.id);
    console.log("Sequence", response.data.sequence);
    const { balances } = response.data;
    let ourAsset = balances.filter(i => i["asset_code"] == asset)
    if ((ourAsset[0].balance + parseInt(amount)) > 1000) {
      console.log('You can purchase max 1000 token')
    } else {
      makeTransaction()
    }
  })
  .catch(error => {
    console.log(error);
  });

//

// Transactions require a valid sequence number that is specific to this account.
// We can fetch the current sequence number for the source account from Horizon.
const makeTransaction = function() {
  server.loadAccount(sourcePublicKey)
  .then(function(account) {
    var transaction = new StellarSdk.TransactionBuilder(account)
      // Add a payment operation to the transaction
      .addOperation(StellarSdk.Operation.manageOffer({
        selling: StellarSdk.Asset.native(),
        buying: new StellarSdk.Asset(asset, issuerPublicKey),
        amount,
        price: 1
      }))
      .build();

    transaction.sign(sourceKeypair);

    // Let's see the XDR (encoded in base64) of the transaction we just built
    console.log(transaction.toEnvelope().toXDR('base64'));

    // Submit the transaction to the Horizon server. The Horizon server will then
    // submit the transaction into the network for us.
    server.submitTransaction(transaction)
      .then(function(transactionResult) {
        console.log(JSON.stringify(transactionResult, null, 2));
        console.log('\nSuccess! View the transaction at: ');
        console.log(transactionResult._links.transaction.href);
      })
      .catch(function(err) {
        console.log('An error has occured:');
        console.log(err);
      });
  })
  .catch(function(e) {
    console.error(e);
  });
}
