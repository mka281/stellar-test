var StellarSdk = require("stellar-sdk");

// Configure StellarSdk to talk to the horizon instance hosted by Stellar.org
// To use the live network, set the hostname to 'horizon.stellar.org'
var server = new StellarSdk.Server("https://horizon-testnet.stellar.org");

// Uncomment the following line to build transactions for the live network. Be
// sure to also change the horizon hostname.
// StellarSdk.Network.usePublicNetwork();
StellarSdk.Network.useTestNetwork();

var tokenName = "TRY";
var amount = "1000000";
var issuerPublicKey = "GAU75JD4PRSSMXHZXN2SQIWL34QDQMYHP6UL6URRCPR2DTHYYTCUWT37";
var distributorPublicKey = "GDUV4N3HNKG3HPRGTU3CTKA7YWDKUBO6SMK4SLXUQYDCYMI7SOC6JUOD";
/// *** Trust *** ///

// Distributor
var sourceSecretKey = "SBDRWDEK5SWA52YIVNTWRJENZCAFODX2SBIHUBJ22YEC4UU2UZTTMPM7";

// Derive Keypair object and public key (that starts with a G) from the secret
var sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecretKey);
var sourcePublicKey = sourceKeypair.publicKey();

// Transactions require a valid sequence number that is specific to this account.
// We can fetch the current sequence number for the source account from Horizon.
server
  .loadAccount(sourcePublicKey)
  .then(function(account) {
    var transaction = new StellarSdk.TransactionBuilder(account)
      // Add a payment operation to the transaction
      .addOperation(
        StellarSdk.Operation.changeTrust({
          asset: new StellarSdk.Asset(tokenName, issuerPublicKey)
        })
      )
      .build();

    transaction.sign(sourceKeypair);

    // Let's see the XDR (encoded in base64) of the transaction we just built
    console.log(transaction.toEnvelope().toXDR("base64"));

    // Submit the transaction to the Horizon server. The Horizon server will then
    // submit the transaction into the network for us.
    server
      .submitTransaction(transaction)
      .then(function(transactionResult) {
        // console.log(JSON.stringify(transactionResult, null, 2));
        // console.log('\nSuccess! View the transaction at: ');
        // console.log(transactionResult._links.transaction.href);
        console.log(`New trust for ${tokenName} on Issuer Account ${issuerPublicKey}`);
      })
      .catch(function(err) {
        console.log("An error has occured:");
        console.log(err);
      });
  })
  .catch(function(e) {
    console.error(e);
  });
