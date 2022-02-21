const Web3 = require('web3') //HIDE KEYS WITH "Linux Environment Variables" https://www.youtube.com/watch?v=himEMfYQJ1w "vim .bashrc" > "i" > update > "esc" > ":w" enter
const rpcURL =  process.env.rinkebyWebSocketSecureEventsInfuraAPIKey //Use WSS to get live event data instead of polling constantly,
const web3 = new Web3(rpcURL)
const contractAddress_JS = '0xcCd74CAc275693e8BFB877Ac937C5320225AB27b'
const contractABI_JS =
[{"inputs":[{"internalType":"uint64","name":"subscriptionId","type":"uint64"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"have","type":"address"},{"internalType":"address","name":"want","type":"address"}],"name":"OnlyCoordinatorCanFulfill","type":"error"},{"anonymous":false,"inputs":[],"name":"lightShowUpdate","type":"event"},{"inputs":[{"internalType":"uint256","name":"requestId","type":"uint256"},{"internalType":"uint256[]","name":"randomWords","type":"uint256[]"}],"name":"rawFulfillRandomWords","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"requestRandomWords","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"s_randomWords","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"s_requestId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]

const contractDefined_JS = new web3.eth.Contract(contractABI_JS, contractAddress_JS)

//https://github.com/sarfata/pi-blaster
//Build and install directly from source
// var piblaster = require('pi-blaster.js');
const timeMilliSec = 1000;
const pulseWidthMin = 0.00;
const pulseWidthMax = 0.35;

let objectLED = {"pin":   [17   ,27    ,23      ,22     ,24      ,25      ,18    ,21     ],
                 "color": ['RED','BLUE','YELLOW','GREEN','PURPLE','ORANGE','GREY','WHITE']}

function timeout(ms) {
	return new Promise(resolve => setTimeout(resolve,ms));
}

async function checkValueLatest() { //get() contract value,

  for(let randomNumbers = 0; randomNumbers < 2; randomNumbers++ ) {
    contractDefined_JS.methods.s_randomWords(randomNumbers).call((err, balance) => {
      console.log(balance)
    })
    await timeout(3000)
  }
  // }
    //
    // for(let ledValue = 0; ledValue < 8; ledValue++ ) {
    //   contractDefined_JS.methods.LED(ledValue).call((err, balance) => {
    //     if(balance.Voltage == 1){
    //       console.log("COLOR " + objectLED['color'][ledValue] + " PIN " + objectLED['pin'][ledValue] + " ON!" )
    //       // piblaster.setPwm(objectLED['pin'][ledValue], pulseWidthMax);
    //     }
    //     if(balance.Voltage == 0){
    //       console.log("COLOR " + objectLED['color'][ledValue]  + " PIN " +  objectLED['pin'][ledValue] + " OFF!" )
    //       // piblaster.setPwm(objectLED['pin'][ledValue], pulseWidthMin);
    //     }
    //   })
    // }

}

console.log("Contract starting value:")
checkValueLatest();
//
// contractDefined_JS.events.VoltageChange({ //Subscribe to event.
//      fromBlock: 'latest'
//  }, function(error, eventResult){})
//  .on('data', function(eventResult){
//    console.log("EVENT DETECTED! NEW STATE VALUE: ")
//    checkValueLatest();  //Call the get function to get the most accurate present state for the value.
//    })
//  .on('changed', function(eventResult){
//      // remove event from local database
//  })
//  .on('error', console.error);
