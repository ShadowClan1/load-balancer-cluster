const app = require('express')()
app.use(require('morgan')('dev'))
const cluster = require('cluster')
const { Worker, isMainThread, parentPort } = require('worker_threads');

const PORT = 5000;
const numCpus = require('os').cpus().length;
if(cluster.isMaster){
    for(let i = 0; i< numCpus; i++){
        cluster.fork();
    }
    cluster.on("exit",(worker, code, signal)=>{
        console.log(`worker ${worker.process.pid} closed`)
        cluster.fork()
    }) 
    console.log(`main process id = ${process.pid}`)
}
else {
    console.log(`workers process id = ${process.pid}`)

    app.get('/',(req, res)=>{  
    res.status(200).json({success : true, pid : process.pid})
    })

    app.get('/heavy',(req, res)=>{  

        let counter = 1;
            if (isMainThread) {
                const worker = new Worker('./worker.js');
                worker.postMessage({ type: 'increment', data: counter });
                // console.log(counter)
                worker.on('message', (message) => {
                     if (message.type === 'finished') {
                        // console.log(message)
                    
                         res.status(200).json({success : true, data : "hare krishna" , counter: message.data, pid: message.pid})
                    }
                  });
        
                worker.on('exit', (code) => {
                    console.log('Worker thread exited with code:', code);
                });
            } 
        
        
        } )


    app.listen(PORT,()=>{console.log(`Server is listening at ${PORT} ${process.pid}`)});

}













