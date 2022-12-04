
const calculateBtn = document.getElementById('calculate');
const dateStaked = document.getElementById('dateStaked')
const ethStaked = document.getElementById('ethStaked')
const rethStaked = document.getElementById('rethStaked')
const returns = document.getElementById('returns')

calculateBtn.addEventListener('click', async () => {
    // calculate the difference between the eth put in and how much eth I could receive right now from swapping reth to eth

    // find out the swap rate of reth/eth
    // data = fetchAsync('https://api.coingecko.com/api/v3/coins/rocket-pool-eth?localization=false&tickers=true&market_data=false&community_data=false&developer_data=false&sparkline=false');
    data = await fetchAsync('https://api.coingecko.com/api/v3/simple/price?ids=rocket-pool-eth%2Cethereum&vs_currencies=eth%2Cusd');
    console.log(data)
    // json = JSON.parse(data)
    // console.log(json)

    var currentRethRate = data["rocket-pool-eth"].eth;
    // debugger;

    var convertedToETH = rethStaked.valueAsNumber * currentRethRate;
    var convertedToUSD = convertedToETH * data["ethereum"].usd;
    // delta means here the difference between put in and how much I could theoretically get back right now
    var deltaInETH = convertedToETH - ethStaked.valueAsNumber;
    var deltaInUSD = deltaInETH * data["ethereum"].usd;

    returns.innerHTML = '';
    var returnsObject = document.createElement('p');
    returnsObject.innerText = `You currently have ${convertedToETH} ETH or ${convertedToUSD} USD.\n You gained ${deltaInETH} ETH or ${deltaInUSD} USD since staking`;
    returns.appendChild(returnsObject);
})

async function fetchAsync(url) {
    let response = await fetch(url);
    let data = await response.json();
    // let data = await response.text();
    return data;
}