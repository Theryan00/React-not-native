import React, { useContext, useState, useEffect } from 'react'

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import SchedulerDataService from '../../services/scheduler.service';
import { projectDatabase } from "../../firebase/firebase";

export default function AddSchedulerEvent() {
    const initialState = {
        inventoryList: []
    };

    var [employeeList, setEmployeeObjects] = useState({});


    useEffect(() => {
        projectDatabase.ref("employees").on("value", (snapshot) => {
            if (snapshot.val() != null)
                setEmployeeObjects({
                    ...snapshot.val(),
                });
        });
    }, []);

    console.log(employeeList)

    const initialSchedulerItemState = {
        id: "",
        title: "",
        startTime: "",
        endTime: "",
        color: "",
        daysOfWeek: []
    };
    const [schedulerItem, setSchedulerItem] = useState(initialSchedulerItemState);

    const handleInputChange = event => {
        const { name, value } = event.target;
        setSchedulerItem({ ...schedulerItem, [name]: value });
    };

    const saveEvent = () => {
        //Create an Array.
        var selected = new Array();

        //Reference the Table.
        var tblDays = document.getElementById("tblDays");

        //Reference all the CheckBoxes in Table.
        var chks = tblDays.getElementsByTagName("INPUT");

        // Loop and push the checked CheckBox value in Array.
        for (var i = 0; i < chks.length; i++) {
            if (chks[i].checked) {
                selected.push(chks[i].value);
            }
        }
        var data = {
            id: SchedulerDataService.createId(),
            title: schedulerItem.title,
            startTime:  schedulerItem.startTime,
            endTime: schedulerItem.endTime,
            color: schedulerItem.color,
            daysOfWeek: selected
        };
        SchedulerDataService.create(data);
        window.location.reload();
    }

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

    return (
        <div>
            <label>Choose an employee</label>
            <div>
                <select name="title" onChange={handleInputChange} defaultValue="No Name Selected">
                {Object.keys(employeeList).map((id) =>{
                    return(
                        <option value={employeeList[id].userName}>{
                        employeeList[id].firstName + " " + employeeList[id].lastName}</option>
                    )
                })} 
                </select>
            </div>
            <label>Start Time</label>
            <div>
                <TextField name="startTime" type="time" min={today} onChange={handleInputChange} />
            </div>
            <label>End Time</label>
            <div>
                <TextField name="endTime" type="time" onChange={handleInputChange} />
            </div>
            <label>Select days to repeat: </label>
            <table id="tblDays">
                <tr>
                    <td><input id="Sun" type="checkbox" value="0" /><label for="chkMango">Sunday</label></td>
                </tr>
                <tr>
                    <td><input id="Mon" type="checkbox" value="1" /><label for="chkApple">Monday</label></td>
                </tr>
                <tr>
                    <td><input id="Tue" type="checkbox" value="2" /><label for="chkBanana">Tuesday</label></td>
                </tr>
                <tr>
                    <td><input id="Wed" type="checkbox" value="3" /><label for="chkGuava">Wednesday</label></td>
                </tr>
                <tr>
                    <td><input id="Thurs" type="checkbox" value="4" /><label for="chkOrange">Thursday</label></td>
                </tr>
                <tr>
                    <td><input id="Fri" type="checkbox" value="5" /><label for="chkOrange">Friday</label></td>
                </tr>
                <tr>
                    <td><input id="Sat" type="checkbox" value="6" /><label for="chkOrange">Saturday</label></td>
                </tr>
            </table>
            <label>Choose color: </label>
            <div style={{ marginBottom: 0.3 + 'em' }}>
                <select name="color" onChange={handleInputChange} >
                    <option value=" ">--select--</option>
                    <option value="purple">Purple</option>
                    <option value="green">Green</option>
                    <option value="red">Red</option>
                    <option value="orange">Orange</option>
                    <option value="blue">Blue</option>
                    <option value="brown">Brown</option>
                    <option value="pink">Pink</option>
                </select>
            </div>
            <div>
                <Button variant="contained" color="primary" onClick={saveEvent}>Add</Button>
            </div>
        </div>
    )
}