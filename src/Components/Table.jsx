import React, { useState, useEffect } from "react";
import paginationFactory from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import axios from "axios";
import { Button, Modal, Dropdown } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Table() {
  const [data, setData] = useState([]);
  const [passengerName, setPassengerName] = useState([]);
  const [passengerTrips, setPassengerTrips] = useState([]);
  const [PassengerCompanyName, setPassengerCompanyName] = useState([]);
  const [PassengerCompanyLogo, setPassengerCompanyLogo] = useState([]);
  const [PassengerNameValue, setPassengerNameValue] = useState("");
  const [PassengerTripsValue, setPassengerTripsValue] = useState("");
  const [PassengerIdData, setPassengerIdData] = useState([]);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [show1, setShow1] = useState(false);

  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);

  const [show2, setShow2] = useState(false);

  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  useEffect(() => refresUsers(), []);

  function refresUsers() {
    axios(`https://api.instantwebtools.net/v1/passenger?page=0&size=100`).then(
      (data) => {
        setData(data.data.data);
      }
    );
  }
  function PostUser() {
    handleClose2();

    fetch("https://api.instantwebtools.net/v1/passenger", {
      method: "POST",
      body: JSON.stringify({
        name: `${PassengerNameValue}`,
        trips: `${PassengerTripsValue}`,
        airline: "1",
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        notifyNewUser();
        refresUsers();
      })
      .catch((error) => {
        notifyError();
      });
  }

  function PutChanges() {
    handleClose();
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `${PassengerNameValue}`,
        trips: `${PassengerTripsValue}`,
        airline: 8,
      }),
    };
    fetch(
      `https://api.instantwebtools.net/v1/passenger/${PassengerIdData._id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        notifyEdit();
        refresUsers();
      })
      .catch((error) => {
        notifyError();
      });
  }

  function DeleteUser() {
    handleClose1();

    fetch(
      `https://api.instantwebtools.net/v1/passenger/${PassengerIdData._id}`,
      {
        method: "DELETE",
      }
    )
      .then(() => {
        refresUsers();
        notifyDelete();
      })
      .catch((error) => {
        notifyError();
      });
  }

  function ShowButton(cell) {
    return (
      <Dropdown>
        <Dropdown.Toggle variant="light" id="dropdown-basic">
          Action
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={handleShow}>Edit</Dropdown.Item>
          <Dropdown.Item onClick={handleShow1}>Delete</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  function showImage(cell) {
    return <img src={cell} alt="img" width="100"></img>;
  }

  const notifyError = () => toast("There Was and Error!");

  const notifyEdit = () => toast("Successfully Edited!!");
  const notifyNewUser = () => toast("Successfully Added User!!");
  const notifyDelete = () => toast("Successfully deleted!!");

  const columns = [
    {
      dataField: "airline.id",
      text: "ID",
      sort: true,
      align: "left",
      style: {
        fontWeight: "bold",
      },

      headerAlign: (column, colIndex) => "left",
    },
    {
      dataField: "name",
      text: "Name",
      align: "left",
      style: {
        fontWeight: "bold",
      },
      headerAlign: (column, colIndex) => "left",
    },
    {
      dataField: "trips",
      text: "Trips",
      align: "left",
      style: {
        fontWeight: "bold",
      },
      headerAlign: (column, colIndex) => "left",
    },
    {
      dataField: "airline.name",
      text: "Company Name",
      align: "left",
      color: "black",
      style: {
        fontWeight: "bold",
      },
      headerAlign: (column, colIndex) => "left",
    },
    {
      dataField: "airline.logo",
      formatter: showImage,
      text: "Company logo",
      align: "left",

      headerAlign: (column, colIndex) => "left",
    },

    {
      dataField: "type",
      text: "Action",
      style: {
        fontWeight: "bold",
      },
      formatter: ShowButton,

      headerAlign: (column, colIndex) => "left",
      events: {
        onClick: (e, column, columnIndex, row, rowIndex) => {
          axios(`https://api.instantwebtools.net/v1/passenger/${row._id}`).then(
            (data) => {
              setPassengerIdData(data.data);
              setPassengerTrips(data.data.trips);
              setPassengerName(data.data.name);
              setPassengerCompanyName(data.data.airline.name);
              setPassengerCompanyLogo(data.data.airline.logo);
            }
          );
        },
      },
    },
  ];

  const rowStyle = { textalign: "left" };

  const options = {
    page: 2,
    sizePerPage: 5,
    lastPageText: ">>",
    firstPageText: "<<",
    nextPageText: ">",
    prePageText: "<",
    showTotal: true,
    alwaysShowAllBtns: true,

    onSizePerPageChange: (sizePerPage, page) => {
      page = page + 1;
      sizePerPage = sizePerPage + 1;
    },
    onPageChange: (page, sizePerPage) => {
      page = page + 1;
      sizePerPage = sizePerPage + 1;
    },
  };

  return (
    <div>
      <Modal show={show1} onHide={handleClose1}>
        <Modal.Header closeButton>
          <Modal.Title>Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this {passengerName} Name
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose1}>
            Close
          </Button>
          <Button variant="primary" onClick={DeleteUser}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add/Edit Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div class="form-group">
              <label for="passengerName" class="col-form-label">
                Passenger Name
              </label>
              <input
                onChange={(event) => setPassengerNameValue(event.target.value)}
                class="form-control"
                type="text"
                name="passengerName"
                placeholder={passengerName}
                value={PassengerNameValue}
              ></input>
            </div>
            <div class="form-group">
              <label for="passengerTrips" class="col-form-label">
                Trips
              </label>
              <input
                onChange={(event) => setPassengerTripsValue(event.target.value)}
                class="form-control"
                type="text"
                name="passengerTrips"
                placeholder={passengerTrips}
                value={PassengerTripsValue}
              ></input>
            </div>
            <div class="form-group">
              <label for="passengerCompany" class="col-form-label">
                Company Name
              </label>
              <input
                value={PassengerCompanyName}
                type="text"
                class="form-control"
                name="passengerCompany"
              ></input>
              <span className="p-4">Company Logo</span>
              <img alt="img" className="p-4" src={PassengerCompanyLogo}></img>
            </div>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={PutChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={show2} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Modal.Title>New Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div class="form-group">
              <label for="passengerName" class="col-form-label">
                Passenger Name
              </label>
              <input
                onChange={(event) => setPassengerNameValue(event.target.value)}
                class="form-control"
                type="text"
                name="passengerName"
                placeholder={passengerName}
                value={PassengerNameValue}
              ></input>
            </div>
            <div class="form-group">
              <label for="passengerTrips" class="col-form-label">
                Trips
              </label>
              <input
                onChange={(event) => setPassengerTripsValue(event.target.value)}
                class="form-control"
                type="text"
                name="passengerTrips"
                placeholder={passengerTrips}
                value={PassengerTripsValue}
              ></input>
            </div>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>
            Close
          </Button>
          <Button variant="primary" onClick={PostUser}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <Button onClick={handleShow2} text-align="left" variant="info">
        New
      </Button>
      <BootstrapTable
        keyField="id"
        data={data}
        columns={columns}
        pagination={paginationFactory(options)}
        selectRow={{ mode: "checkbox", clickToSelect: true }}
        cellEdit={cellEditFactory({ mode: "click", blurToSave: true })}
        striped
        hover
        condensed
        rowStyle={rowStyle}
      ></BootstrapTable>
      <ToastContainer />
    </div>
  );
}
