const express = require('express')
const app = express.Router()
const Users = require('./users')

app.get('', (req, res)=>{
    res.send('API users running.')
})

app.post('/create', new Users().createUser)

module.exports = app