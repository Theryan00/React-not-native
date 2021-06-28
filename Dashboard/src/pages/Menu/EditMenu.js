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
import MenuDataService from '../../services/menu.service';
import {
    projectStorage,
    projectFirestore,
    timestamp,
  } from "../../firebase/firebase";

import { motion } from 'framer-motion';

const EditMenu = (props) => {
    const {edittedMenuItem, edittedMenuItemId} = props;
    const initialMenuItemState = {
        menuItemName: edittedMenuItem.menuItemName,
        description: edittedMenuItem.description,
        price: edittedMenuItem.price,
        ingredients: edittedMenuItem.ingredients,
        image: edittedMenuItem.image
    };
    const [menuItem, setMenuItem] = useState(initialMenuItemState);

    const handleInputChange = event => {
        const { name, value } = event.target;
        setMenuItem({ ...menuItem, [name]: value });
    };

    //
    const initialIngredientItemState = {
        ingredientId: "",
        ingredientQuantity: 0
    };
    const [ingredientItem, setIngredientItem] = useState(initialIngredientItemState);

    const handleIngredientInputChange = event => {
        const { name, value } = event.target;
        setIngredientItem({...ingredientItem, [name]: value });  
    };

    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);

    const types = ['image/png', 'image/jpeg'];

    const useStorage = (file) => {
        const [progress, setProgress] = useState(0);
        const [error, setError] = useState(null);
        const [url, setUrl] = useState(null);
      
        useEffect(() => {
          // references
          const storageRef = projectStorage.ref(file.name);
          const collectionRef = projectFirestore.collection("images");
      
          storageRef.put(file).on(
            "state_changed",
            (snap) => {
              let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
              setProgress(percentage);
            },
            (err) => {
              setError(err);
            },
            async () => {
              const url = await storageRef.getDownloadURL();
              const createdAt = timestamp();
              await collectionRef.add({ url, createdAt });
              console.log(url);
              setUrl(url);
              setMenuItem({ ...menuItem, ["image"]: url });
            }
          );
        }, [file]);
      
        return { progress, url, error };
      };

      const ProgressBar = ({ file, setFile }) => {
        const { progress, url } = useStorage(file);
      
        useEffect(() => {
          if (url) {
            setFile(null);
          }
        }, [url, setFile]);
      
        return (
          <motion.div className="progress-bar"
            initial={{ width: 0 }}
            animate={{ width: progress + '%' }}
          ></motion.div>
        );
      } 

    const handleChange = (e) => {
        let selected = e.target.files[0];
        if (selected && types.includes(selected.type)) {
        setError('');
        setFile(selected);
        } else {
        setFile(null);
        setError('Please select an image file (png or jpeg)');
        }
    };

    const saveMenu = () => {
        var data = {
            menuItemName: menuItem.menuItemName,
            description: menuItem.description,
            price: menuItem.price,
            ingredients: menuItem.ingredients,
            image: menuItem.image
        };
        MenuDataService.update(edittedMenuItemId, data);
    };

    const addIngredient = () => {
        const {ingredients} = menuItem;
        setMenuItem({ ...menuItem, ["ingredients"]: {...ingredients, [ingredientItem.ingredientId]: ingredientItem.ingredientQuantity} });
    };

    const deleteIngredient = (ingrId) => {
        var tempIngredients = menuItem.ingredients;
        delete tempIngredients[ingrId];
        setMenuItem({ ...menuItem, ["ingredients"]: tempIngredients});
    };

    const [inventoryIngredients, setInventoryIngredients] = useState({});
    const onDataChange = (items) => {
        let inventoryIngredients = {};
    
        items.forEach((item) => {
          let id = item.key;
          let value = item.val();
          inventoryIngredients[id] = value.productName;
        });
    
        setInventoryIngredients(inventoryIngredients);
    };
    
    useEffect(() => {
        InventoryDataService.getAll().on("value", onDataChange);

        return () => {
            InventoryDataService.getAll().off("value", onDataChange);
        };
    }, []);

    return (
        <div>
            <div>
                <TextField name="menuItemName" label="Name" defaultValue={edittedMenuItem.menuItemName} onChange={handleInputChange}>"dsfsf"</TextField>
            </div>
            <div>
                <TextField name="description" label="Description" defaultValue={edittedMenuItem.description} onChange={handleInputChange} />
            </div>
            <div>
                <TextField name="price" label="Price" defaultValue={edittedMenuItem.price} type="number" onChange={handleInputChange} />
            </div>
            <div> 
                <label>
                    <input type="file" onChange={handleChange} />
                </label>
                <div className="output">
                    { error && <div className="error">{ error }</div>}
                    { file && <div>{ file.name }</div> }
                    { file && <ProgressBar file={file} setFile={setFile} /> }
                </div>
                </div>
            <div>
                <TextField
                    name="ingredientId"
                    select
                    label="Ingredients"
                    variant="outlined"
                    onChange={handleIngredientInputChange}
                >
                    {Object.keys(inventoryIngredients).map(function(ingrId) {
                        return(<option value={ingrId}>{inventoryIngredients[ingrId]}</option>)
                    })}
                </TextField>
                <TextField name="ingredientQuantity" label="Quantity" type="number" onChange={handleIngredientInputChange}/>
                <Button variant="contained" color="primary" onClick={addIngredient}>Add Ingredient</Button>

                <List>
                {Object.keys(menuItem.ingredients).map(function(ingrId) {
                    return(
                        <ListItem>
                        <ListItemText
                            primary={inventoryIngredients[ingrId]}
                            secondary={menuItem.ingredients[ingrId]}
                        />
                        <ListItemSecondaryAction onClick={() => deleteIngredient(ingrId)}>
                            <IconButton edge="end" aria-label="delete">
                            <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                        </ListItem>
                    )
                })}
                </List>
            </div>
            <div>
                <Button variant="contained" color="primary" onClick={saveMenu}>Edit</Button>
            </div>
        </div>
    )
};

export default EditMenu;
