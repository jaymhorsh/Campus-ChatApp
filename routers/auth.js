const express =  require('express')
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require("bcryptjs");

const jwt = require('jsonwebtoken')
// const config = require("./config")

// router.post('/api/register', async (req, res) => {
router.post('/api/register', async (req, res) => {
  const { firstName,lastName,matricNum,birthDate, deptValue, email, username, password: hashedPassword 
  } = req.body
  
  let minPass= 6;
  let maxPass= 20;
  
  const password = await bcrypt.hash(hashedPassword,10)
  
  if (!username || typeof username !== 'string') {
    return res.json({ status: 'error', error: 'Invalid username' })
  }
  if (!matricNum || matricNum.toString().length !== 9){
    return res.json({ status: 'error', error: 'Invalid matric number. Must be equal to 9' })
  }
  if(hashedPassword.length < minPass || hashedPassword.length > maxPass ){
    return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
  }

  console.log("From the frontend",req.body)
  // console.log(password)
  try {

		const response = await User.create({
      firstName,
      lastName,
      matricNum,
      birthDate,
      deptValue,
      email,
      username,
      password
		})
    console.log('User created successfully: ', response)
    }
    catch (error) {
      if (error.code === 11000) {
        // duplicate key
        return res.json({ status: 'error', error: 'User with this email already exist' })
        }
        res.status(400).send(error)
        throw(error.message)
    }
  res.json({status:'ok'})
})

router.post('/api/login', async (req, res) => {
	const { username,deptValue, password } = req.body
  const user = await User.findOne({ username}).lean()
  // console.log(username,deptValue,password)
  if (!user) {
		return res.json({ status: 'error', error: 'Invalid Login credentials' })
	}

  if(user.deptValue === deptValue && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign(
			{
				id: user._id,
				username: user.username,
        deptValue: user.deptValue
			},
			config.JWT_SECRET
		)

    return res.json({ status: 'ok', data: token })
  }

	res.json({ status: 'error', error: 'Invalid Login credentials' })

})

 module.exports= router


  
  