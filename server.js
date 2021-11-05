const express = require('express')
const path = require('path')
const app = express()
const port = 3000
const bcrypt = require('bcryptjs')
const bodyParser = require('body-parser')
const User = require('./model/user')
app.use('/', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json())
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Candidate = require('./model/candidates')
const Admin = require('./model/admin')


const JWT_SECRET = 'sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk'


mongoose.connect('mongodb+srv://kevin:rajula1971@cluster0.sqf4q.mongodb.net/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})

app.post('/api/candidate', async (req,res) => {
  const { Name, ID, Department} = req.body

  try{  
    const responses = await Candidate.create({
      Name,
      ID,
      Department
    })
    console.log('Candidate Added Successfully: ', responses)
  } catch(error) {
    if (error.code === 11000){
      return res.json({status: 'error', error: 'Candidate ID already exists'})
    }
    throw error
  }
  return res.json({ status: 'ok' })
})

app.post('/api/login', async (req, res) => {
	const { username, password } = req.body
	const user = await User.findOne({ username }).lean()

	if (!user) {
		return res.json({ status: 'error', error: 'Invalid username/password' })
	}

	if (await bcrypt.compare(password, user.password)) {
		// the username, password combination is successful

		const token = jwt.sign(
			{
				id: user._id,
				username: user.username
			},
			JWT_SECRET
		)
		return res.json({ status: 'ok', data: token })
	}

	res.json({ status: 'error', error: 'Invalid username/password' })
})

app.post('/api/register', async (req, res) => {

  const {username, password: plainTextPassword} = req.body

  if(!username || typeof username !== 'string') {
    return res.json({status: 'error',error: 'Invalid Username'})
  }

  if(!plainTextPassword || typeof plainTextPassword !== 'string') {
    return res.json({status: 'error',error: 'Invalid Password'})
  }
  if(plainTextPassword.length < 5) {
    return res.json({status: 'error',error: 'Password too small'})
  }


  const password = await bcrypt.hash(plainTextPassword, 10)

  try{
    const response = await User.create({
      username,
      password
    })
    console.log('User Created Successfully: ', response)
  } catch(error) {
    if (error.code === 11000){
      return res.json({status: 'error', error: 'Username already in use'})
    }
    throw error
  }d
  return res.json({ status: 'ok' })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


app.get('/api/get', async (req,res) => {
  const records = await Candidate.find({})
  res.send(records)
})


app.post('/api/cast', async (req,res)=> {

  const { Iden } = req.body
  try{
    const resp = await Candidate.updateOne(
    { 
      "ID" : Iden
    },
    {
      $inc: {"Votes": 1}
    })
  }catch(error){
    throw error
  }
  return res.json({ status: 'ok' })
})

app.get('/api/load', async (req,res) => {
  const records = await Candidate.find().sort({"Votes":-1}).limit(1)
  res.send(records)
})

app.post('/api/adminlogin', async (req,res) => {
  const { username, password } = req.body
	const user = await Admin.findOne({ username }).lean()

  if (!user) {
		return res.json({ status: 'error', error: 'Invalid username/password' })
	} 
  else{
    return res.json({ status: 'ok' })
  }
})