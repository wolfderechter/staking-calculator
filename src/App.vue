<template>
  <main>
    <h1>Ethereum staking returns calculator</h1>

    <form id="form" @submit.prevent="calculateReturns">
      <label>ETH staked</label>
      <input type="number" step="any" v-model="ethInput" />
      <label>rETH received</label>
      <input type="number" step="any" v-model="rethInput" />
      <label>Staking Date</label>
      <input type="date" v-model="dateStaked" />
      <input type="submit" id="calculateBtn" value="Calculate Returns" />
    </form>

    <div v-if="calculated" class="calculated">
      <h2>Returns</h2>
      <div class="returns-list">
        <ul>
          <li>
            <span>You currently have {{ output.convertedToETH }} ETH or {{ output.convertedToUSD }} USD at current market rate</span>
          </li>
          <li>
            <span>You gained {{ output.deltaInETH }} ETH or {{ output.deltaInUSD }} USD since staking</span>
          </li>
          <li v-if="dateStaked">
            <span>You earn ~ {{ output.deltaPer24hInETH }} ETH or ~ {{ output.deltaPer24hInUSD }} USD per 24H</span>
          </li>
        </ul>
      </div>
    </div>
  </main>
</template>


<script setup>
import { ref, onBeforeMount} from 'vue'

let marketRates;
const ethInput = ref(0);
const rethInput = ref(0);
let dateStaked = ref<Date>(null);

let output = ref(null);
let calculated = ref(false);



function calculateReturns() {
  var currentRethRate = marketRates["rocket-pool-eth"].eth;

  if(ethInput.value < 0 || rethInput < 0){
    return;
  }

  let convertedToETH = rethInput.value * currentRethRate;
  let convertedToUSD = convertedToETH * marketRates["ethereum"].usd;

  let deltaInETH = convertedToETH - ethInput.value;
  let deltaInUSD = deltaInETH * marketRates["ethereum"].usd;

  if(dateStaked){
    let today = new Date();
    let amountOfDays = (today.getTime() - new Date(dateStaked).getTime()) / (1000*3600*24);
    console.log(amountOfDays + " days");

    let deltaPer24hInETH = deltaInETH / amountOfDays;
    let deltaPer24hInUSD = deltaInUSD / amountOfDays;

    output.value = {
    convertedToETH: convertedToETH.toFixed(6),
    convertedToUSD: convertedToUSD.toFixed(2),
    deltaInETH: deltaInETH.toFixed(6),
    deltaInUSD: deltaInUSD.toFixed(2),
    deltaPer24hInETH: deltaPer24hInETH.toFixed(6),
    deltaPer24hInUSD: deltaPer24hInUSD.toFixed(2)
  };
  } else{
    output.value = {
    convertedToETH: convertedToETH.toFixed(6),
    convertedToUSD: convertedToUSD.toFixed(2),
    deltaInETH: deltaInETH.toFixed(6),
    deltaInUSD: deltaInUSD.toFixed(2),
    };
  }

  // without the .value it does not work
  calculated.value = true;
}

onBeforeMount( async () => {
  marketRates = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=rocket-pool-eth%2Cethereum&vs_currencies=eth%2Cusd')
  .then((resp) => resp.json());
})
</script>