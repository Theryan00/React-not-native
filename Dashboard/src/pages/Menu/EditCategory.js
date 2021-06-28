import React, { useState, useEffect } from "react";
import { projectDatabase } from "../../firebase/firebase";
import MainTemplate from "../../components/templates/main.template";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, ListGroup, Button } from "react-bootstrap";
import { FaTrash, FaPen } from "react-icons/fa";
import TextField from '@material-ui/core/TextField';

import { 
  Fab, 
  Modal, 
  Backdrop, 
  Fade, 
  IconButton, 
  AppBar, 
  Tab, 
  Tabs, 
  makeStyles 
} from "@material-ui/core";

import AddIcon from "@material-ui/icons/Add";
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';

import CategoryDataService from "../../services/menuCategory.service";

import AddMenu from "./AddMenu";
import AddCategory from "./AddCategory";
import EditMenu from "./EditMenu";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  form: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  fab: {
    margin: 0,
    top: "auto",
    right: 20,
    bottom: 20,
    left: "auto",
    position: "fixed",
  },
}));

const onDelete = (id) => {
    if (window.confirm("Are you sure to delete this record?")) {
        CategoryDataService.remove(id);
    }
  };

{
  /* npm i react-router bootstrap reactstrap uuid*/
}
export const EditCategory = () => {
  const classes = useStyles();

  //Get Data from Firebase
  // Initial State
  const initialState = {
    inventoryList: [],
  };

  var [categoryObjects, setCategoryObjects] = useState({});

  useEffect(() => {
    projectDatabase.ref("menuCategories").on("value", (snapshot) => {
      if (snapshot.val() != null)
        setCategoryObjects({
          ...snapshot.val(),
        });
    });
  }, []);

  //AAAA EDIT
  const [oldMenuCategory, setOldMenuCategory] = useState("");
  const [newMenuCategory, setNewMenuCategory] = useState();

  const handleInputChange = event => {
    const {value} = event.target;
    setOldMenuCategory({value});
    // var point = oldMenuCategory.value;
    // setNewMenuCategory(point);
};

  // const saveCategory = () => {
  //   var data = oldMenuCategory.value;
  //   CategoryDataService.update(edittedCategoryItemId , data);
  // };

  function saveCategory(Ikey){
    // CategoryDataService.update(Ikey , Idata);
    var data = oldMenuCategory.value;
    // console.log(Ikey);
    // console.log(data);
    CategoryDataService.update(Ikey , data);
  }


  const onDataChange = (items) => {
      items.forEach((item) => {
        let id = item.key;
        let value = item.val();
      });
  };

  useEffect(() => {
      CategoryDataService.getAll().on("value", onDataChange);

      return () => {
          CategoryDataService.getAll().off("value", onDataChange);
      };
  }, []);

  return (
    <div>
      {/* Staff List */}
        <div className="col-md">
          {Object.keys(categoryObjects).map((id) => {
            return (
                <div>

                  <div>
                 
                  <div style={{fontSize: 20, marginTop: 10}}>
                  <TextField name="menuItemName" label="Name" 
                  defaultValue={categoryObjects[id]}
                  onChange={handleInputChange}
                  >"dsfsf"</TextField>
                   <a
                     style={{float: 'right'}}                    
                    >
                      <IconButton edge="end" aria-label="edit"
                      onClick={() => {
                        var data = oldMenuCategory.value;
                        saveCategory(id, data);
                      }}
                      >
                        <CreateIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="edit"
                      onClick={() => {
                        onDelete(id);
                      }}
                      >
                        <DeleteIcon />
                      </IconButton>
                      
                    </a>
                    <a
                     style={{visibility: 'hidden'}}     
                    >
                      <IconButton edge="end" aria-label="edit">
                        <CreateIcon />
                      </IconButton>
                    </a> 
                    
                    </div>
                  </div>
                  </div>
            );
          })}

        </div>
    </div>
  );
};

export default EditCategory;
