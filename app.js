const { Worker, isMainThread, parentPort } = require('worker_threads');


const app = require('express')()
const PORT = 5000;
app.get('/',(req, res)=>{  
res.status(200).json({success : true, data : "hare krishna", pid: process.pid})
} )
app.get('/heavy',(req, res)=>{  

let counter = 1;
    if (isMainThread) {
        const worker = new Worker('./worker.js');
        worker.postMessage({ type: 'increment', data: counter });
        console.log(counter)
        worker.on('message', (message) => {
             if (message.type === 'finished') {
                console.log(message)
            
                 res.status(200).json({success : true, data : "hare krishna" , counter: message.data, pid: message.pid})
            }
          });

        worker.on('exit', (code) => {
            console.log('Worker thread exited with code:', code);
        });
    } 


} )


app.listen(PORT,()=>{console.log(`Server is listening at ${PORT}`)});
