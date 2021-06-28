import React, { useContext, useState, useEffect } from "react";
import { render } from "@testing-library/react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Alert, ListGroup } from "react-bootstrap";
import { FaTrash, FaPen } from "react-icons/fa";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from '@material-ui/core/IconButton';
import MainTemplate from "../../components/templates/main.template";
import AddInventory from "./AddInventory";
import { projectDatabase } from "../../firebase/firebase";
import EditInventory from "./EditInventory";
import CreateIcon from '@material-ui/icons/Create';
import InventoryDataService from "../../services/inventory.service";
import DeleteIcon from '@material-ui/icons/Delete';


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
export const Inventory = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenEdit = (id) => {
    setOpenEdit(true);
    setCurrentId(id);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  //Get Data from Firebase
  // Initial State
  const initialState = {
    inventoryList: [],
  };

  var [inventoryObjects, setInventoryObjects] = useState({});
  var [currentId, setCurrentId] = useState("");

  useEffect(() => {
    projectDatabase.ref("inventory").on("value", (snapshot) => {
      if (snapshot.val() != null)
        setInventoryObjects({
          ...snapshot.val(),
        });
    });
  }, []);

  const onDelete = (id) => {
    if (window.confirm("Are you sure to delete this record?")) {
      InventoryDataService.remove(id);
    }
  };

  return (
    <MainTemplate>
      {/* Heading */}
      <div>
      <h2 className="pb-3 mt-2" style={{ textAlign:"center", fontSize: 50 }}>
        Inventory
      </h2>
        <Fab
          color="primary"
          aria-label="add"
          className={classes.fab}
          onClick={handleOpen}
        >
          <AddIcon />
        </Fab>
        {/* Staff List */}
        <ListGroup className="mt-4">
          <div className="col-md">
            {Object.keys(inventoryObjects).map((id) => {
              return (
                <Card className="inventorycard" key={id}>
                  <Card.Body>
                    <Card.Title>{inventoryObjects[id].productName}</Card.Title>
                    <Card.Text>
                      Current Quantity : {inventoryObjects[id].currQuantity}{" "}
                      {inventoryObjects[id].unitType}
                    </Card.Text>
                    <Card.Text>
                      Red Zone : {inventoryObjects[id].redZone}{" "}
                      {inventoryObjects[id].unitType}
                    </Card.Text>
                    <Card.Text>
                      Threshold : {inventoryObjects[id].threshold}{" "}
                      {inventoryObjects[id].unitType}
                    </Card.Text>
                    {(() => {
                      if (
                        inventoryObjects[id].currQuantity >
                        inventoryObjects[id].threshold &&
                        inventoryObjects[id].currQuantity >
                        inventoryObjects[id].redZone
                      ) {
                        return (
                          <Alert variant="success">Quantity is okay </Alert>
                        );
                      }
                      else if (
                        inventoryObjects[id].currQuantity <
                          inventoryObjects[id].threshold &&
                        inventoryObjects[id].currQuantity >
                          inventoryObjects[id].redZone
                      ) {
                        return (
                          <Alert variant="warning">
                            Quantity is below threshold{" "}
                          </Alert>
                        );
                      }
                      else if (
                        inventoryObjects[id].currQuantity <
                        inventoryObjects[id].redZone && 
                        inventoryObjects[id].currQuantity <
                        inventoryObjects[id].threshold 
                      ) {
                        return (
                          <Alert variant="danger">
                            Quantity is below redzone{" "}
                          </Alert>
                        );
                      }
                      else {
                        <Alert variant="success">Quantity is okay </Alert>
                      }
                    })()}
                    <div>
                      {/* <EditInventory {...({addOrEdit,currentId, contactObjects})} /> */}
                    </div>
                    {/* <Button variant="primary">Go somewhere</Button> */}
                    <div style={{ textAlign: "right" }}>
                      <a
                        style={{ marginRight: "5px" }}
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
              <h2 id="transition-modal-title">Add New Inventory Item</h2>
              <div className={classes.form} noValidate autoComplete="off">
                <AddInventory />
              </div>
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
                <EditInventory
                  edittedInventoryItem={inventoryObjects[currentId]}
                  edittedInventoryItemId={currentId}
                />
              </div>
            </div>
          </Fade>
        </Modal>
      </div>
    </MainTemplate>
  );
};

export default Inventory;
