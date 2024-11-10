import express from 'express';
import con from '../utils/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

import sendinBlue from 'nodemailer-sendinblue-transport';
import sendGridMail from '@sendgrid/mail';

dotenv.config();
const router = express.Router();

router.post('/register', (req, res) => {
    const { firstname, lastname, email, mobile, password } = req.body;
    const sql = "INSERT INTO users (firstname, lastname, email, mobile, password) VALUES (?, ?, ?, ?, ?)";

    bcrypt.hash(password, 10, (err, hashPassword) => {
        if (err) {
            return res.json({ Status: false, Error: "Error in hashing password" });
        }
        con.query(sql, [firstname, lastname, email, mobile, hashPassword], (err, result) => {
            if (err) return res.json({ Status: false, Error: "Query error" });

            const token = jwt.sign(
                { role: 'user', email: email, id: result.insertId },
                "my_forgaging_secretkey",
                { expiresIn: "1d" }
            );
            res.cookie('token', token);
            return res.json({ Status: true, Result: result });
        });
    });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT* FROM users WHERE email= ?";

    con.query(sql, [email], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" });
        if (result.length === 0) return res.json({ Status: false, Error: "User not found" });  // Check if user exists


        bcrypt.compare(password, result[0].password, (err, isMatch) => {
            if (err) return res.json({ Status: false, Error: "Error in Password comparison" });
            if (!isMatch) return res.json({ Status: false, Error: "Incorrect Password" });

            const token = jwt.sign(
                { id: result[0].id, email: result[0].email },
                "my_forgaging_secretkey",
                { expiresIn: "1d" }
            );
            res.cookie('token', token);
            return res.json({ Status: true, Token: token, UserId: result[0].id });
        });
    });
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'profileImage') {
            cb(null, 'Public/uploads')
        } else {
            cb(null, 'Public/Images')
        }
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({ storage: storage });

router.post('/add_plant', upload.single('file'), (req, res) => {


    const { plantname, description, category, location } = req.body;
    const imagePath = req.file ? req.file.filename : null;


    const sql = "INSERT INTO plants(name,description,category,image,location) VALUES(?,?,?,?,?)";
    con.query(sql, [plantname, description, category, imagePath, location], (err, result) => {
        // console.error('Query Error:', err);
        if (err) return res.json({ Status: false, Error: "Query Error" });
        return res.json({ Status: true, Result: result });
    });

});

router.get('/plant_records', (req, res) => {
    const sql = "SELECT id,name,description,image FROM plants LIMIT 8";

    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" });
        return res.json({ Status: true, Result: result });
    });
});
router.get('/plant_count', (req, res) => {
    const sql = "SELECT count(id) as plant from plants";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" });
        return res.json({ Status: true, Result: result[0].plant });
    });
});


router.get('/viewprofile/:id', (req, res) => {
    const userId = req.params.id;

    const sql = "SELECT image, firstname, lastname, email, mobile FROM users WHERE id = ?";

    con.query(sql, [userId], (err, result) => {
        if (err) {
            console.error("Query Error:", err);
            return res.json({ Status: false, Error: "Query Error" });
        }


        return res.json({ Status: true, Result: result[0] });

    });
});

router.get('/plant_detail/:id', (req, res) => {
    const id = req.params.id;
    con.query('SELECT * FROM plants WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ Status: false, Error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ Status: false, Error: 'Plant not found' });
        }
        res.json({ Result: results[0] });
    });
});

router.get('/plant_fullrecords', (req, res) => {
    const sql = "SELECT* FROM plants";

    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" });
        return res.json({ Status: true, Result: result });
    });
});

sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post('/forgotPassword', (req, res) => {


    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const sql1 = "SELECT * FROM users WHERE email = ?";

    con.query(sql1, [email], (err, result) => {
        if (err) {
            console.log('Database query error:', err);
            return res.json({ Status: false, Error: "Database error" });
        }

        if (result.length === 0) {
            return res.json({ Status: false, Error: "Email not found" });
        }

        const sql2 = "UPDATE users SET otp = ? WHERE email = ?";
        con.query(sql2, [otp, email], (err, result) => {
            if (err) {
                console.log('Database update error:', err);
                return res.json({ Status: false, Error: "Database update error" });
            }
            const msg = {
                to: email, // Recipient's email
                from: process.env.SENDGRID_VERIFIED_SENDER, // Sender's verified email address
                subject: 'Your password OTP',
                text: `Your OTP for the forgot password procedure is ${otp}. Do NOT share this OTP with anyone.`,
            };

            sendGridMail
                .send(msg)
                .then(() => {
                    console.log('OTP sent successfully');
                    return res.json({ Status: true, Result: 'OTP sent successfully' });
                })
                .catch((error) => {
                    console.log('Error sending OTP:', error);
                    console.error('Error sending email:', error.response.body.errors);

                    return res.json({ Status: false, Error: 'Error sending OTP' });
                });
        });
    });
});

router.post('/verifyotp', (req, res) => {
    const { email, otp } = req.body;

    const sql = 'SELECT otp FROM users WHERE email = ?';

    con.query(sql, [email], (err, result) => {
        if (err) return res.json({ Status: false, Error: 'Query Error' });

        if (result.length === 0) {
            return res.json({ Status: false, Error: 'Email not found!' });
        }

        const StoredOtp = result[0].otp;
        console.log(`Stored OTP: ${StoredOtp}, Entered OTP: ${otp}`);

        if (StoredOtp == otp) { // Use == to allow comparison of different types
            return res.json({ Status: true, Result: 'OTP verified successfully!' });
        } else {
            return res.json({ Status: false, Error: 'Invalid OTP!' });
        }
    });
});

 router.post('/resetpassword',(req,res) =>{
    const {email,newPassword} = req.body;

    bcrypt.hash(newPassword,10,(err,hashPassword) => {
        if(err) return res.json({Status:false,Error:'Query Error'});

        const sql = 'UPDATE users SET password = ? WHERE email=?';

        con.query(sql,[hashPassword,email],(err,result) =>{
              if(err) return res.json({Status:false,Error:'Query Error'});

              return res.json({Status:true,Result:'Password reset Successfully!'});
        });
    });
 });

// Route for uploading profile image
router.post('/uploadProfileImage', upload.single('profileImage'), (req, res) => {
    const userId = req.body.id;
    const imagePath = req.file ? req.file.filename : null;



    const sql = 'UPDATE users SET image = ? WHERE id = ?';
    con.query(sql, [imagePath, userId], (err, result) => {
        if (err) {
            return res.status(500).json({ Status: false, Error: err });
        }
        res.json({ Status: true, imagePath });
    });
});


router.put('/editprofile/:id', (req, res) => {
    const id = req.params.id;
    const sql = `UPDATE users SET firstname=?, lastname=?, email=?, mobile=? WHERE id=?`;
    const values = [
        req.body.firstname,
        req.body.lastname,
        req.body.email,
        req.body.mobile,
        id  // The ID should be passed as the last value
    ];

    con.query(sql, values, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" });
        return res.json({ Status: true, Result: result });
    });
});

router.post('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ Status: true });
});
router.get('/wishlist/:id', (req, res) => {
    const id = req.params.id;
    const sql = `SELECT p.id,p.name,p.description,p.image
    FROM wishlist w
    JOIN plants p ON w.plant_id= p.id
    WHERE w.user_id=?`;

    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Status: false, Error: 'Query Error' })
        return res.json({ Status: true, Result: result });
    });
});
router.post('/wishlist', (req, res) => {
    const { id, plantId } = req.body;
    const checkquery = "SELECT* FROM wishlist WHERE user_id =? AND plant_id =?";
    con.query(checkquery, [id, plantId], (err, result) => {
        if (err) return res.json({ Status: false, Error: 'Query Error' });

        if (result.length > 0) {
            //plant already in the wishlist remove it
            const removeQuery = 'DELETE FROM wishlist  WHERE user_id =? AND plant_id = ?';
            con.query(removeQuery, [id, plantId], (err, result) => {
                if (err) return res.json({ Status: false, Error: 'Query Erro' })
                return res.json({ Status: true });
            });
        } else {
            //Add plant to  the wishlist
            const Addquery = 'INSERT INTO wishlist (user_id,plant_id) VALUES(?,?)';
            con.query(Addquery, [id, plantId], (err, result) => {
                if (err) return res.json({ Status: false, Error: 'Query Error' })
                return res.json({ Status: true });
            });
        }
    })
})



router.put('/changepassword/:id', (req, res) => {
    const id = req.params.id;
    const { previousPassword, newPassword } = req.body;

    console.log('Changing password for ID:', id);
    console.log('Previous Password:', previousPassword);
    console.log('New Password:', newPassword);

    // Query to get the current password
    con.query('SELECT password FROM users WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Query Error:', err);
            return res.json({ Status: false, Error: 'Error executing query.' });
        }

        if (results.length === 0) {
            return res.json({ Status: false, Error: 'User not found.' });
        }

        const user = results[0];
        bcrypt.compare(previousPassword, user.password, (err, isMatch) => {
            if (err) {
                console.error('Error in Password comparison:', err);
                return res.json({ Status: false, Error: 'Error comparing passwords.' });
            }

            if (!isMatch) {
                return res.json({ Status: false, Error: 'Previous Password is incorrect.' });
            }

            // Hash the new password
            bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
                if (err) {
                    console.error('Error in hashing new password:', err);
                    return res.json({ Status: false, Error: 'Error hashing new password.' });
                }

                // Update the password
                con.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id], (err, result) => {
                    if (err) {
                        console.error('Query Error:', err);
                        return res.json({ Status: false, Error: 'Error updating password.' });
                    }

                    return res.json({ Status: true, Result: result });
                });
            });
        });
    });
});


export { router as userRouter };
