import React, {  useState, useEffect  } from 'react'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import InventoryDataService from '../../services/inventory.service';


const EditInventory = (props) => {
    const {edittedInventoryItem, edittedInventoryItemId} = props;
    const initialInventoryItemState = {
        productName: edittedInventoryItem.productName,
        redZone: edittedInventoryItem.redZone,
        threshold: edittedInventoryItem.threshold,
        currQuantity: edittedInventoryItem.currQuantity,
    };
    const [inventoryItem, setInventoryItem] = useState(initialInventoryItemState);

    const handleInputChange = event => {
        const { name, value } = event.target;
        setInventoryItem({ ...inventoryItem, [name]: value });
      };

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
            InventoryDataService.update(edittedInventoryItemId, data);
          }
    }

    const onDataChange = (items) => {
        items.forEach((item) => {
          let id = item.key;
          let value = item.val();
        });
    };
    
    useEffect(() => {
        InventoryDataService.getAll().on("value", onDataChange);

        return () => {
            InventoryDataService.getAll().off("value", onDataChange);
        };
    }, []);

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
                <TextField name="productName" label="Name" defaultValue={edittedInventoryItem.productName} 
                onChange={handleInputChange}
                onChange={(e) => {validateName(e);}}
                error={errorName}
                helperText={errorName ? "Name cannot be empty." : ""}
                >"dsfsf"</TextField>
            </div>
            <div>
                <TextField name="currQuantity" label="Current Quantity" defaultValue={edittedInventoryItem.currQuantity} type="number" onChange={handleInputChange} 
                onChange={(e) => {
                    validateQuantity(e);
                  }} 
                error={errorQuantity}
                helperText={errorQuantity ? "Quantity cannot be lower than 0." : ""}
                />
            </div>
            <div>
                <TextField name="redZone" label="Red Zone" defaultValue={edittedInventoryItem.redZone} type="number" 
                onChange={handleInputChange} 
                onChange={(e) => {
                    validateRedzone(e);
                  }} 
                error={errorRedzone}
                helperText={errorRedzone ? "Redzone cannot be lower than 0." : ""}
                />
            </div>
            <div>
                <TextField name="threshold" label="Threshold" defaultValue={edittedInventoryItem.threshold} type="number" onChange={handleInputChange} 
                onChange={(e) => {
                    validateThreshold(e);
                  }} 
                error={errorThreshold}
                helperText={errorThreshold ? "Threshold cannot be lower than 0." : ""} 
                />
            </div>
            <div>
                <Button variant="contained" color="primary" onClick={saveInventory}>Edit</Button>
            </div>
        </div>
    )
};

export default EditInventory;
