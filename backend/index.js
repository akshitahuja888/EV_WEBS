const express = require('express');
const app = express();


app.get('/',(req,res) => {
    res.send('connected');
})


app.listen(3000,()=>{
    console.log('server connected on port 3000');
})