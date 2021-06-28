import React, { useState, useEffect } from "react";
import { projectDatabase } from "../../firebase/firebase";
import MainTemplate from "../../components/templates/main.template";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, ListGroup, Button } from "react-bootstrap";
import { FaTrash, FaPen } from "react-icons/fa";

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

import MenuDataService from "../../services/menu.service";

import AddMenu from "./AddMenu";
import AddCategory from "./AddCategory";
import EditMenu from "./EditMenu";
import EditCategory from "./EditCategory";

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

{
  /* npm i react-router bootstrap reactstrap uuid*/
}
export const Menu = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openCategory, setOpenCategory] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenCategory = () => {
    setOpenCategory(true);
  };

  const handleCloseCategory = () => {
    setOpenCategory(false);
  };

  const handleOpenEdit = (id) => {
    setOpenEdit(true);
    setCurrentId(id);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  // For tabs in Add New Menu Item/Category modal
  const [tabsValue, setTabsValue] = React.useState(0);
  const handleTabs = (e, val) => {
    setTabsValue(val);
  }

  //Get Data from Firebase
  // Initial State
  const initialState = {
    inventoryList: [],
  };

  var [inventoryObjects, setInventoryObjects] = useState({});
  var [currentId, setCurrentId] = useState("");

  useEffect(() => {
    projectDatabase.ref("menuItems").on("value", (snapshot) => {
      if (snapshot.val() != null)
        setInventoryObjects({
          ...snapshot.val(),
        });
    });
  }, []);

  const onDelete = (id) => {
    if (window.confirm("Are you sure to delete this record?")) {
      MenuDataService.remove(id);
    }
  };

  return (
    <MainTemplate>
      {/* Heading */}
      <h2 className="pb-3 mt-2" style={{ textAlign:"center", fontSize: 50 }}>
        Menu
      </h2>

      <Button style={{ marginLeft: 3 + 'em', alignItems: 'right' }}
       onClick={handleOpenCategory}
       class="btn  btn-primary">Category </Button>

      {/* Staff List */}
      <ListGroup className="mt-4">
        <div className="col-md">
          {Object.keys(inventoryObjects).map((id) => {
            return (
              <Card className="inventorycard" key={id} 
              >
                <Card.Body>
                  <Card.Img
                    variant="top"
                    src="holder.js/100px180"
                    src={inventoryObjects[id].image}
                    style={{width:"250px", height:"200px"}}
                  />
                  <Card.Title>{inventoryObjects[id].menuItemName}</Card.Title>
                  <Card.Text>
                    Description : {inventoryObjects[id].description}
                  </Card.Text>
                  <Card.Text>Price : {inventoryObjects[id].price}</Card.Text>
                  <div>
                    {/* <EditInventory {...({addOrEdit,currentId, contactObjects})} /> */}
                  </div>
                  {/* <Button variant="primary">Go somewhere</Button> */}
                  <div style={{ textAlign: "right" }}>
                    <a
                      style={{ marginRight: "10px" }}
                      onClick={() => {
                        onDelete(id);
                      }}
                    >
                      <IconButton edge="end" aria-label="edit">
                        <DeleteIcon />
                      </IconButton>
                    </a>
                    <a
                      onClick={() => {
                        handleOpenEdit(id);
                      }}
                    >
                      <IconButton edge="end" aria-label="edit">
                        <CreateIcon />
                      </IconButton>
                    </a>
                  </div>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      </ListGroup>

      {/* Add New Menu Item Button */}
      <Fab
        color="primary"
        aria-label="add"
        className={classes.fab}
        onClick={handleOpen}
      >
        <AddIcon />
      </Fab>

      {/* Add new menu item modal */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <AppBar position="static">
              <Tabs value={tabsValue} onChange = {handleTabs}>
                <Tab label="Add New Menu Item" />
             
              </Tabs>
            </AppBar>
            <TabPanel value={tabsValue} index={0}> {/* Add new menu item */}
              <div className={classes.form} noValidate autoComplete="off">
                <AddMenu OnAddSetOpen={setOpen}/>
              </div>
            </TabPanel>
            
          </div>
        </Fade>
      </Modal>

      {/* Edit menu item modal */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openEdit}
        onClose={handleCloseEdit}
        closeAfterTransition
        BackdropComponent={Backdrop}
      >
        <Fade in={openEdit}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">Edit Menu Item</h2>
            <div className={classes.form} noValidate autoComplete="off">
              <EditMenu
                edittedMenuItem={inventoryObjects[currentId]}
                edittedMenuItemId={currentId}
              />
            </div>
          </div>
        </Fade>
      </Modal>

      {/* Add new category modal */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openCategory}
        onClose={handleCloseCategory}
        closeAfterTransition
        BackdropComponent={Backdrop}
      >
        <Fade in={openCategory}>
          <div className={classes.paper}>
            <AppBar position="static">
              <Tabs value={tabsValue} onChange = {handleTabs}>
                <Tab label="Add New Menu Category" />
                <Tab label="Edit/Delete Menu Category" />
              </Tabs>
            </AppBar>
            <TabPanel value={tabsValue} index={0}> {/* Add new menu Category */}
              <div className={classes.form} noValidate autoComplete="off">
              <AddCategory />
              </div>
            </TabPanel>
            <TabPanel value={tabsValue} index={1}> {/* Add new menu category */}
              <div className={classes.form} noValidate autoComplete="off">
                <EditCategory />
              </div>
            </TabPanel>
          </div>
        </Fade>
      </Modal>
    </MainTemplate>
  );
};

function TabPanel(props){
  const {children, value, index} = props;
  
  return(
    <div>
      {
        value === index && (
          children
        )
      }
    </div>
  );
}

export default Menu;
