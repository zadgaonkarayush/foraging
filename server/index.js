import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import {userRouter} from './Routes/userRoute.js';
import { adminRouter } from './Routes/adminRoute.js';
import path from 'path';


const app = express()



app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ["GET","POST","PUT","DELETE"],
    credentials:true
}))
app.use(express.json())
app.use('/auth',userRouter)
app.use('/admin', adminRouter); // This should point to adminRouter
app.use(express.static('Public'))


const port = 3000;

app.listen(port,() =>{
    console.log("Server is Running");
})