import React, {  useState } from 'react'

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import EmployeeDataService from '../../services/employee.service';
import { List } from '@material-ui/core';

export default function AddStaff(props){
    const initialStaffItemState = {
        firstName : "",
        id: 0,
        lastName : "",
        password : "",
        userName : ""
    }

    const [staffItem, setStaffItem] = useState(initialStaffItemState);
    var exist = false;
    const handleInputChange = event => {
        const { name, value } = event.target;
        setStaffItem({ ...staffItem, [name]: value});
    }

    const saveStaff = () =>{
        
        Object.keys(props.employeeObjects).map((id)=>{
            if(props.employeeObjects[id].userName==staffItem.userName){
                console.log("Existing");
                exist=true;
                window.confirm("User Name already exist!");
            }
        })
        
        if(exist==false){
            var newId = uuidv4();
            var data = {
                firstName: staffItem.firstName,
                id: newId,
                lastName : staffItem.lastName,
                password : staffItem.password,
                userName : staffItem.userName
            };
            EmployeeDataService.create(data,newId);
        }
    }
    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
    }

    return (
        <div>
            <div>
                <TextField name="firstName" label="First Name" onChange={handleInputChange} />
            </div>
            {/* <div>
                <TextField name="id" label="Identiy Number" onChange={handleInputChange} />
            </div> */}
            <div>
                <TextField name="lastName" label="Last Name" onChange={handleInputChange} />
            </div>
            <div>
                <TextField name="password" label="Password" onChange={handleInputChange} />
            </div>
            <div>
                <TextField name="userName" label="User Name" onChange={handleInputChange} />
            </div>
            <div>
                <Button variant="contained" color="primary" onClick={saveStaff} >Add Employee</Button>
            </div>
        </div>
    )
}