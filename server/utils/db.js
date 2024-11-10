// import mysql from 'mysql' // Import the promise-based API


// const con = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'foraging'
// });
// con.connect(function(err){
//     if(err){
//         console.log("connection Failed")
//     }
//     else{
//         console.log("Connected")
//     }
// })


// export default con;
import mysql from 'mysql';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

con.connect(function(err) {
    if (err) {
        console.log("Connection Failed");
    } else {
        console.log("Connected");
    }
});

export default con;
