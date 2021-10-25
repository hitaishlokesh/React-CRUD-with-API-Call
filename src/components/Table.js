import React, { useState, useEffect } from "react";
import { forwardRef } from "react";
import Avatar from "react-avatar";
import Grid from "@mui/material/Grid";
import MaterialTable from "material-table";
import AddBox from "@material-ui/icons/AddBox";
import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import axios from "axios";
import Alert from "@mui/material/Alert";

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
};

const api = axios.create({
  baseURL: `https://reqres.in/api`,
});

function Table() {
  var columns = [
    { title: "id", field: "id", hidden: true },
    {
      title: "Avatar",
      render: (rowData) => (
        <Avatar
          maxInitials={1}
          size={40}
          round={true}
          name={rowData === undefined ? " " : rowData.first_name}
        />
      ),
    },
    { title: "First name", field: "first_name" },
    { title: "Last name", field: "last_name" },
    { title: "email", field: "email" },
  ];
  const [data, setData] = useState([]);
  const [iserror, setIserror] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessages, setSuccessMessages] = useState([]);

  useEffect(() => {
    api
      .get("/users")
      .then((res) => {
        setData(res.data.data);
      })
      .catch((error) => {
        console.log("Error");
      });
  }, []);

  const handleRowUpdate = (newData, oldData, resolve) => {
    let errorList = [];
    let successList = [];
    if (newData.first_name === "") {
      errorList.push("Please enter first name");
    }
    if (newData.last_name === "") {
      errorList.push("Please enter last name");
    }
    if (newData.email === "" || newData.email === false) {
      errorList.push("Please enter a valid email");
    }
    if (newData.first_name || newData.last_name || newData.email) {
      successList.push("Data edited");
    }

    if (errorList.length < 1 && successList.length === 1) {
      api
        .patch("/users/" + newData.id, newData)
        .then((res) => {
          const dataUpdate = [...data];
          const index = oldData.tableData.id;
          dataUpdate[index] = newData;
          setData([...dataUpdate]);
          resolve();
          setIsSuccess(true);
          setSuccessMessages(successList);
          setIserror(false);
          setErrorMessages([]);
        })
        .catch((error) => {
          setErrorMessages(["Update failed! Server error"]);
          setIserror(true);

          resolve();
        });
    } else {
      setErrorMessages(errorList);
      setIserror(true);
      resolve();
      setIsSuccess(false);
      setSuccessMessages([]);
    }
  };

  const handleRowAdd = (newData, resolve) => {
    debugger;
    let errorList = [];
    let successList = [];
    if (newData.first_name === undefined) {
      errorList.push("Please enter first name");
    }
    if (newData.last_name === undefined) {
      errorList.push("Please enter last name");
    }
    if (newData.email === undefined || newData.email === false) {
      errorList.push("Please enter a valid email");
    }
    if (newData.first_name && newData.last_name && newData.email) {
      successList.push("Data added");
    }

    if (errorList.length < 1 && successList.length === 1) {
      api
        .post("/users", newData)
        .then((res) => {
          let dataToAdd = [...data];
          dataToAdd.push(newData);
          setData(dataToAdd);
          resolve();
          setSuccessMessages(successList);
          setIsSuccess(true);
          setErrorMessages([]);
          setIserror(false);
        })
        .catch((error) => {
          setErrorMessages(["Cannot add data. Server error!"]);
          setIserror(true);
          resolve();
        });
    } else {
      setErrorMessages(errorList);
      setIserror(true);
      resolve();
      setIsSuccess(false);
      setSuccessMessages([]);
    }
  };

  const handleRowDelete = (oldData, resolve) => {
    api
      .delete("/users/" + oldData.id)
      .then((res) => {
        const dataDelete = [...data];
        const index = oldData.tableData.id;
        dataDelete.splice(index, 1);
        setData([...dataDelete]);
        resolve();
      })
      .catch((error) => {
        setErrorMessages(["Delete failed! Server error"]);
        setIserror(true);
        resolve();
      });
  };

  return (
    <div className="App">
      <Grid container spacing={1}>
        <Grid item xs={3}></Grid>
        <Grid item xs={6}>
          <div>
            {iserror && (
              <Alert severity="error">
                {errorMessages.map((msg, i) => {
                  return <div key={i}>{msg}</div>;
                })}
              </Alert>
            )}
          </div>
          <div>
            {isSuccess && (
              <Alert severity="success">
                {successMessages.map((sucMsg, j) => {
                  return <div key={j}>{sucMsg}</div>;
                })}
              </Alert>
            )}
          </div>
          <MaterialTable
            title="User table"
            columns={columns}
            data={data}
            options={{
              search: false,
              paging: false,
            }}
            icons={tableIcons}
            editable={{
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve) => {
                  handleRowUpdate(newData, oldData, resolve);
                }),
              onRowAdd: (newData) =>
                new Promise((resolve) => {
                  handleRowAdd(newData, resolve);
                }),
              onRowDelete: (oldData) =>
                new Promise((resolve) => {
                  handleRowDelete(oldData, resolve);
                }),
            }}
          />
        </Grid>
        <Grid item xs={3}></Grid>
      </Grid>
    </div>
  );
}

export default Table;
