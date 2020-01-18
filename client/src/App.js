import React, { useState } from "react";
import {
  Button,
  FormGroup,
  Label,
  Input,
  Container,
  Spinner,
  Alert
} from "reactstrap";
import Dropzone from "react-dropzone";
import axios from "axios";
import { FilePicker } from "react-file-picker";
import { CompactPicker } from "react-color";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faImages } from "@fortawesome/free-solid-svg-icons";
import "./App.scss";

import { Transition } from "react-spring/renderprops";

import FileList from "./components/FileList";

function App() {
  const initialState = {
    title: "",
    logo: null,
    files: [],
    colors: {
      bg: "#000000"
      // text: '#FFFFFF'
    },
    isUploading: false
  };

  const [appState, setAppState] = useState(initialState);

  const [alerts, setAlerts] = useState({
    error: false,
    msg: null,
    alertIsOpen: false
  });

  const [timer, setTimer] = useState(null);

  const onDrop = acceptedFiles => {
    Array.from(acceptedFiles).map(i => {
      if (!/image\//g.test(i.type)) {
        setAlerts({
          error: true,
          msg: "You selected file(s) that are not images.",
          alertIsOpen: true
        });
        removeAlert();
      } else {
        setAppState({
          ...appState,
          files: [...appState.files, ...acceptedFiles]
        });
      }
    });
  };

  const handleChange = e => {
    setAppState({
      ...appState,
      [e.target.id]: e.target.value
    });
  };

  const onChoice = e => {
    setAppState({
      ...appState,
      logo: [e]
    });
  };

  const removeAlert = () => {
    if (timer) {
      clearTimeout(timer);
    }
    var id = setTimeout(() => {
      setAlerts({
        error: false,
        msg: null,
        alertIsOpen: false
      });
    }, 3000);
    setTimer(id);
  };

  const handleSubmit = e => {
    e.preventDefault();
    setAppState({
      ...appState,
      isUploading: true
    });
    const fd = new FormData();
    fd.append("title", appState.title);
    fd.append("titleBgColor", appState.colors.bg);
    Array.from(appState.logo).forEach(file => {
      fd.append("logo", file);
    });
    Array.from(appState.files).forEach(file => {
      fd.append("file", file);
    });
    axios
      .post("http://localhost:5000/upload", fd, {
        "Content-Type": "multipart/form-data"
      })
      .then(res => {
        window.open(`http://localhost:5000/download/${res.data.link}`);
        setAppState({
          ...initialState,
          isUploading: false
        });
        setAlerts({
          alertIsOpen: true,
          msg: res.data.msg,
          files: []
        });
        removeAlert();
      })
      .catch(err => {
        setAlerts({
          alertIsOpen: true,
          msg: err.response.data.msg,
          error: true
        });
        setAppState({
          ...appState,
          isUploading: false
        });
        removeAlert();
      });
  };

  const removeItem = e => {
    const newArr = appState.files.filter(i => {
      return i.name !== e.target.id;
    });
    setAppState({
      ...appState,
      files: newArr
    });
  };

  return (
    <div
      className="App"
      style={{
        background: "#fafafa"
      }}
    >
      <div
        className="p-4 text-center text-white mb-3"
        style={{
          background:
            "linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)"
        }}
      >
        <FontAwesomeIcon
          icon={faInstagram}
          style={{
            fontSize: "6rem"
          }}
        />
        <h1
          className="font-weight-bold"
          style={{ fontSize: "1.75rem", margin: 0 }}
        >
          Instagram Image Brander
        </h1>
      </div>
      <Container>
        <Transition
          items={appState.isUploading}
          from={{ opacity: 0 }}
          enter={{ opacity: 1 }}
          leave={{ opacity: 0 }}
        >
          {show =>
            show &&
            (aniProps => (
              <div
                style={aniProps}
                className="bg-info rounded text-white text-center p-4 mb-2"
              >
                <Spinner color="white" />
                <p className="m-0">Processing images. Please wait...</p>
              </div>
            ))
          }
        </Transition>
        <Alert
          isOpen={alerts.alertIsOpen}
          color={alerts.error ? "danger" : "success"}
        >
          {alerts.msg}
        </Alert>
        <FormGroup>
          <Label for="logo">Logo</Label>
          <FilePicker
            extensions={["jpg", "jpeg", "png", "svg"]}
            onChange={onChoice}
          >
            <Button
              block
              color={appState.logo ? "warning" : "success"}
              size="sm"
            >
              {!appState.logo ? `Select a logo` : `Replace logo`}
            </Button>
          </FilePicker>
          <small>
            {appState.logo ? (
              <div>
                <span className="font-weight-bold">Current selection: </span>{" "}
                <span>{appState.logo[0].name}</span>
              </div>
            ) : null}
          </small>
        </FormGroup>
        <FormGroup>
          <Label for="title">Caption </Label>
          <small className="text-muted float-right">
            {appState.title.length}/20 characters
          </small>
          <Input
            id="title"
            name="title"
            value={appState.title}
            onChange={handleChange}
            maxLength={20}
            placeholder="Optional"
          />
        </FormGroup>
        {appState.title.length > 0 ? (
          <FormGroup>
            <Label style={{ display: "block" }}>Title Background Color</Label>
            <CompactPicker
              color={appState.colors.bg}
              section="bg"
              onChange={color => {
                const newData = Object.assign({}, appState);
                newData.colors.bg = color.hex;
                setAppState(newData);
              }}
            />
          </FormGroup>
        ) : null}

        <Dropzone onDrop={onDrop}>
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div
              {...getRootProps()}
              style={{
                border: "1px dashed grey",
                color: "grey",
                height: "14rem",
                borderRadius: ".25rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer"
              }}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="mb-0">Drop files here</p>
              ) : (
                <div className="text-center">
                  <FontAwesomeIcon
                    icon={faImages}
                    style={{ fontSize: "3rem" }}
                  />
                  <p className="mb-0">Drop files or click here to upload</p>
                </div>
              )}
            </div>
          )}
        </Dropzone>
        <FileList files={appState.files} removeItem={removeItem} />
        <Button
          block
          color="danger"
          onClick={handleSubmit}
          className="mt-2"
          disabled={
            appState.files.length > 0 ? (appState.logo ? false : true) : true
          }
        >
          Process
        </Button>
      </Container>
    </div>
  );
}

export default App;
