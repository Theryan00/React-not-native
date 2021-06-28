import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Navbar,
  Nav,
  NavItem,
  NavbarBrand,
  Container,
  ListGroup,
  ListGroupItem,
  Button,
} from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
import { projectDatabase } from "../../firebase/firebase";
import { Fab, Modal, Backdrop, Fade } from "@material-ui/core";
import MainTemplate from "../../components/templates/main.template";
import AddStaff from "./AddStaff";
import EditStaff from "./EditStaff";

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
}));

{
  /* npm i react-router bootstrap reactstrap uuid*/
}
export const Staff = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [openEdit, setEditOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditOpen = () => {
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };
  //Get Data from Firebase
  // Initial State
  const initialState = {
    staffList: [],
  };

  var [employeeObjects, setEmployeeObjects] = useState({});
  var [currentId, setCurrentId] = useState("");

  useEffect(() => {
    projectDatabase.ref("employees").on("value", (snapshot) => {
      if (snapshot.val() != null)
        setEmployeeObjects({
          ...snapshot.val(),
        });
    });
    console.log(employeeObjects);
  }, []); //Similar to componentDidMount

  const editEmployee = (obj) => {
    projectDatabase.ref(`employees/${obj.id}`).set(obj, (err) => {
      if (err) console.log(err);
      else setCurrentId("");
    });
  };
  const onDelete = (id) => {
    if (window.confirm("Are you sure to delete this record?")) {
      projectDatabase.ref(`employees/${id}`).remove((err) => {
        if (err) console.log(err);
        else setCurrentId("");
      });
    }
  };

  return (
    <MainTemplate>
      {/* Heading */}
      <Navbar color="dark" dark>
        <Container>
          <NavbarBrand href="/staff"> Employees</NavbarBrand>
          <Nav>
            <NavItem>
              <Link
                className="btn btn-primary"
                aria-label="Add User"
                onClick={handleOpen}
              >
                Add Employee
              </Link>

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
                    <h2 id="transition-modal-title">Add New Employee</h2>
                    <div className={classes.form} noValidate autoComplete="off">
                      <AddStaff 
                      {...{
                        employeeObjects
                      }}/>
                    </div>
                  </div>
                </Fade>
              </Modal>
            </NavItem>
          </Nav>
        </Container>
      </Navbar>

      {/* Staff List */}
      <ListGroup className="mt-4">
        <div className="col-md">
          <table className="table table-borderlese table-stripped">
            <thead className="thead-light">
              <tr>
                <th>Full Name</th>
                <th>User Name</th>
                <th>Password</th>
                <th>Employee ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(employeeObjects).map((id) => {
                return (
                  <tr key={id}>
                    <td>
                      {employeeObjects[id].lastName}{" "}
                      {employeeObjects[id].firstName}
                    </td>
                    <td>{employeeObjects[id].userName}</td>
                    <td>{employeeObjects[id].password}</td>
                    <td>{employeeObjects[id].id}</td>
                    <td>
                      <a className="btn text-primary" onClick={handleEditOpen}>
                        <i className="fas fa-pencil-alt">
                          <Modal
                            aria-labelledby="transition-modal-title"
                            aria-describedby="transition-modal-description"
                            className={classes.modal}
                            open={openEdit}
                            onClose={handleEditClose}
                            closeAfterTransition
                            BackdropComponent={Backdrop}
                          >
                            <Fade in={openEdit}>
                              <div className={classes.paper}>
                                <h2 id="spring-modal-title">Edit Employee</h2>
                                <div
                                  className={classes.form}
                                  noValidate
                                  autoComplete="off"
                                >
                                  <EditStaff
                                    {...{
                                      currentId,
                                      employeeObjects,
                                      editEmployee,
                                    }}
                                  ></EditStaff>
                                </div>
                              </div>
                            </Fade>
                          </Modal>
                        </i>
                      </a>
                      <a
                        className="btn text-danger"
                        onClick={() => {
                          onDelete(id);
                        }}
                      >
                        <i className="far fa-trash-alt"></i>
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </ListGroup>
    </MainTemplate>
  );
};
