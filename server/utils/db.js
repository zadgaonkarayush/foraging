import mysql from 'mysql' // Import the promise-based API


const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'foraging'
});
con.connect(function(err){
    if(err){
        console.log("connection Failed")
    }
    else{
        console.log("Connected")
    }
})


export default con;