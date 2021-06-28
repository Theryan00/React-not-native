import React, { useState, useEffect } from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const EditStaff = (props) => {
    const initialStaffItemState = {
        firstName : "",
        id:0,
        lastNmae : "",
        password : "",
        userName : ""
    }

    var [values, setValues] = useState(initialStaffItemState)

    

    const handleInputChange = e => {
        var { name, value } = e.target;
        setValues({
            ...values,
            [name]: value
        })
    }

    const handleFormSubmit = e => {
        e.preventDefault()
        props.editEmployee(values);
    }

    return (
        <div>
        <div>
            <TextField name="firstName"  label="First Name" onChange={handleInputChange} />
        </div>
        {/* <div>
            <TextField name="id"  label="Identiy Number" onChange={handleInputChange} />
        </div> */}
        <div>
            <TextField name="lastName" label="Last Name" onChange={handleInputChange} />
        </div>
        <div>
            <TextField name="password"  label="Password" onChange={handleInputChange} />
        </div>
        <div>
            <TextField name="userName"  label="User Name" onChange={handleInputChange} />
        </div>
        <div>
            <Button variant="contained" color="primary" onClick={handleFormSubmit} >Edit Employee</Button>
        </div>
    </div>
    );
}

export default EditStaff;