import React, { useState, useEffect } from "react";

import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@material-ui/core";

import DeleteIcon from "@material-ui/icons/Delete";

import InventoryDataService from "../../services/inventory.service";
import MenuDataService from "../../services/menu.service";
import MenuCategoryDataService from "../../services/menuCategory.service";

import {
  projectStorage,
  projectFirestore,
  timestamp,
} from "../../firebase/firebase";

import { motion } from "framer-motion";

export default function AddMenu({ OnAddSetOpen }) {
  const initialMenuItemState = {
    menuItemName: "",
    description: "",
    menuCategoryId: "",
    price: 0,
    image: "",
    ingredients: {},
  };
  const [menuItem, setMenuItem] = useState(initialMenuItemState);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setMenuItem({ ...menuItem, [name]: value });
  };

  const initialIngredientItemState = {
    ingredientId: "",
    ingredientQuantity: 0,
  };
  const [ingredientItem, setIngredientItem] = useState(
    initialIngredientItemState
  );

  const handleIngredientInputChange = (event) => {
    const { name, value } = event.target;

    if (name == "ingredientId") setErrorIngredient(false);
    else if (name == "ingredientQuantity") {
      if (value <= 0) setErrorIngredientQty(true);
      else setErrorIngredientQty(false);
    }

    setIngredientItem({ ...ingredientItem, [name]: value });
  };

  const saveMenu = () => {
    if (menuItem.menuItemName === "") setErrorName(true);
    if (menuItem.price < 0) setErrorPrice(true);
    if (menuItem.menuCategoryId === "") setErrorCategory(true);

    if (
      !(
        menuItem.menuItemName === "" ||
        menuItem.price < 0 ||
        menuItem.menuCategoryId === ""
      )
    ) {
      var data = {
        menuItemName: menuItem.menuItemName,
        description: menuItem.description,
        menuCategoryId: menuItem.menuCategoryId,
        price: menuItem.price,
        image: menuItem.image,
        ingredients: menuItem.ingredients,
      };
      MenuDataService.create(data);

      OnAddSetOpen(false);
    }
  };

  const addIngredient = () => {
    if (ingredientItem.ingredientId === "") setErrorIngredient(true);
    if (ingredientItem.ingredientQuantity <= 0) setErrorIngredientQty(true);

    if (
      !(
        ingredientItem.ingredientId === "" ||
        ingredientItem.ingredientQuantity <= 0
      )
    ) {
      const { ingredients } = menuItem;
      setMenuItem({
        ...menuItem,
        ["ingredients"]: {
          ...ingredients,
          [ingredientItem.ingredientId]: ingredientItem.ingredientQuantity,
        },
      });
    }
  };

  const deleteIngredient = (ingrId) => {
    var tempIngredients = menuItem.ingredients;
    delete tempIngredients[ingrId];
    setMenuItem({ ...menuItem, ["ingredients"]: tempIngredients });
  };

  // Input validation
  const [errorPrice, setErrorPrice] = useState(false);
  const validatePrice = (event) => {
    const { value } = event.target;

    if (value < 0) setErrorPrice(true);
    else setErrorPrice(false);
  };

  const [errorName, setErrorName] = useState(false);
  const validateName = (event) => {
    const { value } = event.target;

    if (value === "") setErrorName(true);
    else setErrorName(false);
  };

  const [errorCategory, setErrorCategory] = useState(false);
  const validateCategory = (e) => {
    const { value } = e.target;

    if (value != "") setErrorCategory(false);
  };

  const [errorIngredient, setErrorIngredient] = useState(false);
  const [errorIngredientQty, setErrorIngredientQty] = useState(false);

  // Getting ingredients from firebase
  const [inventoryIngredients, setInventoryIngredients] = useState({});
  const onInventoryDataChange = (items) => {
    let inventoryIngredients = {};

    items.forEach((item) => {
      let id = item.key;
      let value = item.val();
      inventoryIngredients[id] = [value.productName, value.unitType];
    });

    setInventoryIngredients(inventoryIngredients);
  };

  // Getting menu categories from firebase
  const [menuCategories, setMenuCategories] = useState({});
  const onMenuCategoryDataChange = (items) => {
    let menuCategories = {};

    items.forEach((item) => {
      let id = item.key;
      let value = item.val();
      menuCategories[id] = value;
    });

    setMenuCategories(menuCategories);
  };

  useEffect(() => {
    InventoryDataService.getAll().on("value", onInventoryDataChange);
    MenuCategoryDataService.getAll().on("value", onMenuCategoryDataChange);

    return () => {
      InventoryDataService.getAll().off("value", onInventoryDataChange);
      MenuCategoryDataService.getAll().off("value", onMenuCategoryDataChange);
    };
  }, []);

  // Menu image
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const types = ["image/png", "image/jpeg"];

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
      <motion.div
        className="progress-bar"
        initial={{ width: 0 }}
        animate={{ width: progress + "%" }}
      ></motion.div>
    );
  };

  const handleChange = (e) => {
    let selected = e.target.files[0];
    if (selected && types.includes(selected.type)) {
      setError("");
      setFile(selected);
    } else {
      setFile(null);
      setError("Please select an image file (png or jpeg)");
    }
  };

  return (
    <div>
      {/* Name */}
      <div>
        <TextField
          name="menuItemName"
          label="Name"
          onChange={(e) => {
            handleInputChange(e);
            validateName(e);
          }}
          error={errorName}
          helperText={errorName ? "Name cannot be empty." : ""}
        />
      </div>

      {/* Description */}
      <div>
        <TextField
          name="description"
          label="Description"
          onChange={handleInputChange}
        />
      </div>

      {/* Category */}
      <TextField
        name="menuCategoryId"
        select
        label="Category"
        onChange={(e) => {
          handleInputChange(e);
          validateCategory(e);
        }}
        error={errorCategory}
        helperText={errorCategory ? "Category cannot be empty." : ""}
      >
        {Object.keys(menuCategories).map(function (menuCatId) {
          return <option value={menuCatId}>{menuCategories[menuCatId]}</option>;
        })}
      </TextField>

      {/* Price */}
      <div>
        <TextField
          name="price"
          label="Price"
          type="number"
          onChange={(e) => {
            handleInputChange(e);
            validatePrice(e);
          }}
          error={errorPrice}
          helperText={errorPrice ? "Price cannot be lower than 0." : ""}
          InputProps={{
            inputProps: {
              min: 0,
            },
          }}
        />
      </div>

      {/* Images */}
      <div>
        <label>
          <input type="file" onChange={handleChange} />
        </label>
        <div className="output">
          {error && <div className="error">{error}</div>}
          {file && <div>{file.name}</div>}
          {file && <ProgressBar file={file} setFile={setFile} />}
        </div>
      </div>

      {/* Ingredients */}
      <div>
        <TextField
          name="ingredientId"
          select
          label="Ingredients"
          onChange={handleIngredientInputChange}
          error={errorIngredient}
          helperText={errorIngredient ? "Ingredient cannot be empty" : ""}
        >
          {Object.keys(inventoryIngredients).map(function (ingrId) {
            return (
              <option value={ingrId}>
                {inventoryIngredients[ingrId][0]} (
                {inventoryIngredients[ingrId][1]})
              </option>
            );
          })}
        </TextField>
        <TextField
          name="ingredientQuantity"
          label="Quantity"
          type="number"
          onChange={handleIngredientInputChange}
          error={errorIngredientQty}
          helperText={
            errorIngredientQty
              ? "Ingredient quantity must be higher than 0."
              : ""
          }
        />

        <Button variant="contained" color="primary" onClick={addIngredient}>
          Add Ingredient
        </Button>

        <List>
          {Object.keys(menuItem.ingredients).map(function (ingrId) {
            return (
              <ListItem>
                <ListItemText
                  primary={inventoryIngredients[ingrId][0]}
                  secondary={
                    menuItem.ingredients[ingrId] +
                    " " +
                    inventoryIngredients[ingrId][1]
                  }
                />
                <ListItemSecondaryAction
                  onClick={() => deleteIngredient(ingrId)}
                >
                  <IconButton edge="end" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      </div>
      <div>
        <Button variant="contained" color="primary" onClick={saveMenu}>
          Add
        </Button>
      </div>
    </div>
  );
}
