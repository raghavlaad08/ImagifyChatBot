import express from 'express'
import dotenv from 'dotenv'
import "dotenv/config"
import cors from 'cors' 
import connectDB from './configs/db.js'
import userRouter from './routes/user.routes.js'
import chatRouter from './routes/chatRoute.js'



const app =express()


await connectDB()


//Middleware 
app.use(cors())
app.use(express.json())


//Routess
app.get('/', (req,res)=> res.send('Server is Live!!') )
app.use('/api/user',userRouter )
app.use('/api/chat',chatRouter)

const PORT = process.env.PORT || 3000


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)

})

