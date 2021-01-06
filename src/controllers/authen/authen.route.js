const express = require('express')
const app = express.Router()

app.get('', (req, res)=>{
    res.send('API authen running.')
})


module.exports = app