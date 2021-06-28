import React, {  useState } from 'react'

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import InventoryDataService from '../../services/inventory.service';

export default function AddInventory() {    
    const initialInventoryItemState = {
        productName: "",
        currQuantity: 0,
        unitType: "",
        threshold: 0,
        redZone: 0
    };
    const [inventoryItem, setInventoryItem] = useState(initialInventoryItemState);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setInventoryItem({ ...inventoryItem, [name]: value });
      };

    const [errorIngredientQty, setErrorIngredientQty] = useState(false);

    const saveInventory = () => {
        if (inventoryItem.productName === "") setErrorName(true);
        if (inventoryItem.currQuantity <= 0) setErrorQuantity(true);
        if (inventoryItem.unitType === "") setErrorUnit(true);
        if (inventoryItem.threshold <= 0) setErrorThreshold(true);
        if (inventoryItem.redZone <= 0) setErrorRedzone(true);
        if (
            !(
              inventoryItem.productName === "" || inventoryItem.currQuantity <= 0 
              || inventoryItem.redZone <= 0  || inventoryItem.threshold <= 0 ||
              inventoryItem.unitType === "" 
            )
          ) {
            var data = {
            productName: inventoryItem.productName,
            currQuantity: inventoryItem.currQuantity,
            unitType: inventoryItem.unitType,
            threshold: inventoryItem.threshold,
            redZone: inventoryItem.redZone
            };
            InventoryDataService.create(data);
          }
    }


    //Validation
    const [errorName, setErrorName] = useState(false);
    const validateName = (event) => {
    const { value } = event.target;

    if (value === "") setErrorName(true);
    else setErrorName(false);
    };

    const [errorUnit, setErrorUnit] = useState(false);
    const validateUnit = (event) => {
    const { value } = event.target;

    if (value === "") setErrorUnit(true);
    else setErrorUnit(false);
    };

    const [errorQuantity, setErrorQuantity] = useState(false);
    const validateQuantity = (event) => {
    const { value } = event.target;

    if (value < 0) setErrorQuantity(true);
    else setErrorQuantity(false);
    };

    const [errorRedzone, setErrorRedzone] = useState(false);
    const validateRedzone = (event) => {
    const { value } = event.target;

    if (value < 0) setErrorRedzone(true);
    else setErrorRedzone(false);
    };

    const [errorThreshold, setErrorThreshold] = useState(false);
    const validateThreshold = (event) => {
    const { value } = event.target;

    if (value < 0) setErrorThreshold(true);
    else setErrorThreshold(false);
    };

    return (
        <div>
            <div>
                <TextField name="productName" label="Name" 
                  onChange={(e) => {
                    handleInputChange(e);
                    validateName(e);
                  }}
                error={errorName}
                helperText={errorName ? "Name cannot be empty." : ""}
                />
            </div>
            <div>
            <TextField name="currQuantity" label="Quantity" type="number" 
            onChange={(e) => {
                handleInputChange(e);
                validateQuantity(e);
              }} 
            error={errorQuantity}
            helperText={errorQuantity ? "Quantity cannot be lower than 0." : ""}
            />
            <TextField
                    onChange={(e) => {
                        handleInputChange(e);
                        validateUnit(e);
                      }} 
                    name="unitType"
                    select
                    label="Unit"
                    variant="outlined"
                    error={errorUnit}
                    helperText={errorUnit ? "Unit cannot be empty." : ""}
                >
                    <option value="g">g</option>
                    <option value="ml">ml</option>                                
                </TextField>
            </div>
            <div>
                <TextField name="threshold" label="Threshold" type="number" 
                onChange={(e) => {
                    handleInputChange(e);
                    validateThreshold(e);
                  }} 
                error={errorThreshold}
                helperText={errorThreshold ? "Threshold cannot be lower than 0." : ""} />
            </div>
            <div>
                <TextField name="redZone" label="Red Zone Threshold" type="number" 
                onChange={(e) => {
                    handleInputChange(e);
                    validateRedzone(e);
                  }} 
                error={errorRedzone}
                helperText={errorRedzone ? "Redzone cannot be lower than 0." : ""} />
            </div>
            <div>
                <Button variant="contained" color="primary" onClick={saveInventory}>Add</Button>
            </div>
        </div>
    )
}
