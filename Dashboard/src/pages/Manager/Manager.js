import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import {
  Navbar,
  Nav,
  NavItem,
  NavbarBrand,
  Container,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import MainTemplate from "../../components/templates/main.template";
import { projectStorage } from "../../firebase/firebase";

export const Manager = () => {
  const allInputs = { imgUrl: "" };
  const [imageAsFile, setImageAsFile] = useState("");
  const [imageAsUrl, setImageAsUrl] = useState(allInputs);
  console.log(imageAsFile);
  const handleImageAsFile = (e) => {
    const image = e.target.files[0];
    setImageAsFile((imageFile) => image);
    if (imageAsFile === "") {
      console.error(`not an image, the image file is a ${typeof imageAsFile}`);
    }
  };
  const handleFireBaseUpload = (e) => {
    e.preventDefault();
    console.log("start of upload");
    // async magic goes here...
    if (imageAsFile === "") {
      console.error(`not an image, the image file is a ${typeof imageAsFile}`);
    }
    const uploadTask = projectStorage.ref(`/images/logo`).put(imageAsFile);

    //initiates the firebase side uploading
    uploadTask.on(
      "state_changed",
      (snapShot) => {
        //takes a snap shot of the process as it is happening
        console.log(snapShot);
      },
      (err) => {
        //catches the errors
        console.log(err);
      },
      () => {
        // gets the functions from storage refences the image storage in firebase by the children
        // gets the download url then sets the image from firebase as the value for the imgUrl key:
        projectStorage
          .ref("images")
          .child("logo")
          .getDownloadURL()
          .then((fireBaseUrl) => {
            setImageAsUrl((prevObject) => ({
              ...prevObject,
              imgUrl: fireBaseUrl,
            }));
          });
      }
    );
  };
  return (
    <MainTemplate>
      <div className="App">
        <h2 className="pb-3 mt-2" style={{ textAlign: "center", fontSize: 50 }}>
          Manager
        </h2>
        <div>
          <h4>Upload Logo:</h4>

          <form onSubmit={handleFireBaseUpload}>
            <input type="file" onChange={handleImageAsFile} />
            <button
              onClick={() => {
                window.location.reload();
              }}
            >
              Upload Logo
            </button>
          </form>
        </div>
      </div>
    </MainTemplate>
  );
};
