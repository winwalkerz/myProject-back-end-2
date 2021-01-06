const express = require('express')
const app = express.Router()
const Users = require('./users')

app.get('', (req, res)=>{
    res.send('API users running.')
})

app.post('/search', new Users().search)
app.post('/create', new Users().createUser)
app.put('/update/:user_id', new Users().updateUser)
app.delete('/delete/:user_id', new Users().deleteUser)

module.exports = app