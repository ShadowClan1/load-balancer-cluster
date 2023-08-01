const { parentPort } = require('worker_threads');

// Listen for messages from the main thread.
parentPort.on('message', (message) => {
    let counter = message.data;
 
   
    for(let i = 1; i<= 10000000000; i++){
     counter+=i;
    }
   
    


      parentPort.postMessage({ type: "finished", data : counter, pid : process.pid });

});
