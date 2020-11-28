const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const cron = require('node-cron')

const DB = require('./model/db')
DB.once('open',()=>{
	console.log('mongoDB connected')
	
	cron.schedule('0 0 0 1 * *', () => {//每月的1號0時0分0秒執行
		console.log('first')
		require('./util/crawler')()
	})
	//post, get時的解碼json type
	app.use(bodyParser.urlencoded({ extended: true }))
	app.use(bodyParser.json())
	app.use((_, res, next) => {
		res.header('Access-Control-Allow-Origin', '*')
		res.header(
			'Access-Control-Allow-Headers',
			'Origin, X-Requested-With, Content-Type, Accept'
		)
		next()
	})
	app.use(require('./api/api'))
	
	app.get('/', (_,res) => {
		res.send('hello world')
	})
	
	app.listen(process.env.PORT || 4000,  () => {
		// require('./util/crawler')(true)
		console.log('server connect')
		console.log(`port name: ${process.env.PORT || 4000}`)
	})
})

