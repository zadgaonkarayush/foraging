import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const AdminUser = ({ id }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000/admin/user_data')
            .then(result => {
                if (result.data.Status) {
                    console.log(result.data.Result);
                    setUsers(result.data.Result);
                }
            })
    }, [])
 
    const handleDelete = (userId) =>{
       axios.delete(`http://localhost:3000/admin/delete_user/${userId}`)
       .then(result =>{
          if(result.data.Status){
            setUsers(users.filter((user)=> user.id !== userId))
          }
       })
       .catch((err) => console.log(err));
    }
    return (
        <>
            <header className='form-header'>
                <Link to={`/admindashboard/${id}`}>
                    <Button sx={{ fontSize: '26px', color: 'black' }} >&lt;</Button>
                </Link>
                <Typography variant='h5'>User's List</Typography>
            </header>
            <TableContainer component={Paper}>
              <Table aria-label="user table">
              <TableHead>
                    <TableRow>
                        <TableCell>First Name</TableCell>
                        <TableCell>Last Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Mobile</TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.firstname}</TableCell>
                            <TableCell>{user.lastname}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.mobile}</TableCell>
                            <TableCell>
                                <Button
                                variant='contained'
                                color='secondary'
                                onClick={() => handleDelete(user.id)}
                                >Delete</Button>
                            </TableCell>

                        </TableRow>
                    ))

                    }
                </TableBody>
              </Table>
            </TableContainer>
        </>
    )
}

export default AdminUser
