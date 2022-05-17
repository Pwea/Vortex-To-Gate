import fetch from 'node-fetch';

async function getData() {
    const data = JSON.stringify({
      query: `query ($neqTokenAddress: String = "") {
  token(where: {symbol: {_neq: "XTZ"}, address: {_neq: $neqTokenAddress}}) {
  symbol
  token_address: address
  token_id: tokenId
  thumbnailUri: icon
  usd_token_price: lastPriceUsd
  ratio_token_xtz: lastPriceXtz
  decimals
  name
  pairsToken1 {
  pool_address: id
  }
  tokenHourData(limit: 24, order_by: {hourStartUnix: desc}) {
  tvl: reserveUsd
  priceUsd
  timestamp: hourStartUnix
  vol: hourlyVolumeUsd
  }
  }
  }`,
      variables: {
          "neqTokenAddress": ""
  },
    });
  
    const response = await fetch(
      'https://api-dev.vortex.network/v1/graphql',
      {
        method: 'post',
        body: data,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length,
          'User-Agent': 'Node',
        },
      }
    );
  
    const json = await response.json();
    let vortex_dogami_price = json.data.token[0].usd_token_price;
    let url = 'https://api.gateio.ws/api/v4/spot/trades?currency_pair=DOGA_USDT';

    fetch(url)
    . then(res => res. json())
    . then((gate) => {
    var pourcant = (((vortex_dogami_price - gate[0].price) / gate[0].price) * 100)
    if (pourcant < 0 && pourcant > -5) {
        console.log("You should buy on Vortex and sell on Gate. WARNING: Not a large difference!")
        console.log("Pourcantage difference (Price) (-5% to 0%): " + pourcant + "%")

        console.log("Gate Dogami: " + "$" + gate[0].price)
        console.log("Vortex Dogami: " + "$" + vortex_dogami_price)
    } else if (pourcant < -5) {
        console.log("%c You should buy on Vortex and sell on Gate. GOOD INVESTMENT!", 'color: #bada55')
        console.log("Pourcantage difference (Price) (-0%): " + pourcant + "%")

        console.log("Gate Dogami: " + "$" + gate[0].price)
        console.log("Vortex Dogami: " + "$" + vortex_dogami_price)
    }

    if (pourcant > 0 && pourcant < 5) {
        console.log("You should buy on Gate and sell on Vortex.\nWARNING: Not a large difference!")
        console.log("Pourcantage difference (Price) (0% to 5%): " + pourcant + "%")

        console.log("Gate Dogami: " + "$" + gate[0].price)
        console.log("Vortex Dogami: " + "$" + vortex_dogami_price)
    } else if (pourcant > 5) {
        console.log("%c You should buy on Gate and sell on Vortex. GOOD INVESTMENT!", 'color: #bada55')
        console.log("Pourcantage difference (Price) (5% +): " + pourcant + "%")

        console.log("Gate Dogami: " + "$" + gate[0].price)
        console.log("Vortex Dogami: " + "$" + vortex_dogami_price)
    }
    })
    . catch(err => { throw err });
  }
  
  getData();
  