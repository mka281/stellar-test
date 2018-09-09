var StellarSdk = require("stellar-sdk");

const axios = require("axios");
const accountId = "GDUV4N3HNKG3HPRGTU3CTKA7YWDKUBO6SMK4SLXUQYDCYMI7SOC6JUOD";
const url = `https://horizon-testnet.stellar.org/accounts/${accountId}`;
axios
  .get(url)
  .then(response => {
    console.log("AccountID", response.data.id);
    console.log("Sequence", response.data.sequence);
    const { balances } = response.data;
    for (i of balances) {
      if (i["asset_type"] == "native") {
        console.log("XLM", i.balance);
      } else {
        console.log(i.asset_code, i.balance);
      }
    }
  })
  .catch(error => {
    console.log(error);
  });
