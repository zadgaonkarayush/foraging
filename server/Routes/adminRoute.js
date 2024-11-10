import express from 'express';
import con from '../utils/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import nodemailer from 'nodemailer';

const router = express.Router();

router.post('/adminregister',(req,res) =>{
    const {name,email,mobile,password} = req.body;
    const sql = "INSERT INTO admins (name,email,mobile,password) VALUES (?,?,?,?) ";

    bcrypt.hash(password,10,(err,hashedPassword) =>{
        if(err) return res.json({Status:false,Error:'Error in hashing Password'});
        con.query(sql,[name,email,mobile,hashedPassword],(err,result) =>{
            if(err) return res.json({Status:false,Error:'Query Error'});

            const token = jwt.sign(
               {role:'admin',email:'email',id:result.insertId},
               "my_foraging_secretkey",
               {expiresIn:"1d"}

            );
            res.cookie('token',token);
            return res.json({Status:true,Result:result});
        });
    });
});

router.post('/adminlogin',(req,res) =>{
    const {email,password} = req.body;

    const sql = 'SELECT* FROM admins WHERE email=? ';
    con.query(sql,[email],(err,result) =>{
        if(err){
            console.error('Database query error:', err);
            return res.json({Status:false,Error:'Query Error'});
        } 

        bcrypt.compare(password,result[0].password,(err,isMatch) =>{
            if(err) return res.json({Status:false,Error:'Comparison Error'});
            if(!isMatch) return res.json({Status:false,Error:'Incorrect Password'});
            const token = jwt.sign(
             {id:result[0].id,email:result[0].email},
             "my_forgaging_secretkey",
             {expiresIn:"1d"}
            );
            res.cookie('token',token);
            return res.json({Status:true,Token:token,UserId: result[0].id });
        });
    });
});
router.get('/admin_count',(req,res) =>{
    const sql = "SELECT count(id) as admin from admins";
    con.query(sql,(err,result) =>{
        if(err) return res.json({Status:false,Error:'Query error'});
         return res.json({Status:true,Result:result})
    })
});
router.get('/user_count',(req,res) =>{
    const sql = "SELECT count(id) as user from users";
    con.query(sql,(err,result) =>{
        if(err) return res.json({Status:false,Error:'Query error'});
         return res.json({Status:true,Result:result})
    })
});
router.get('/plant_count',(req,res) =>{
    const sql = "SELECT count(id) as plant from plants";
    con.query(sql,(err,result) =>{
        if(err) return res.json({Status:false,Error:'Query error'});
         return res.json({Status:true,Result:result})
    })
});

router.delete('/delete_plant/:id',(req,res) =>{
    const plantId = req.params.id;
    const sql = 'DELETE FROM plants WHERE id=?';

    con.query(sql,[plantId],(err,result) =>{
    if(err) return res.json({Status:false,Error:"Query Error"});

    return res.json({Status:true,message:"plant deleted successfully!"});
    });
});
router.get('/user_data',(req,res) =>{
    const sql ="SELECT* FROM users ";
    con.query(sql,(err,result) =>{
        if(err) return res.json({Status:false,Error:'Query Error'});
        return res.json({Status:true,Result:result});
    });
});
router.delete('/delete_user/:id',(req,res) =>{
    const userId = req.params.id;
    const sql = 'DELETE FROM users WHERE id=?';
    con.query(sql,[userId],(err,result) =>{
        if(err) return res.json({Status:false,Error:'Query Error'});
        return res.json({Status:true,message:"USer deleted successfully!"});
    });
});
router.get('/categories',(req,res) =>{
    const sql = `SELECT category, COUNT(*) as count
    FROM plants GROUP BY category`;

    con.query(sql,(err,result) =>{
        if(err) return res.json({Status:false,Error:"Qury Error"})
        return res.json({Status:true,Result:result});
    });
});
router.post('/logout',(req,res) =>{
    res.clearCookie('taken');
    return res.json({Status:true});

});
export {router as  adminRouter}