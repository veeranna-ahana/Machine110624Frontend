import axios from "axios";
import React, { useMemo } from "react";
import { Table } from "react-bootstrap";
import { baseURL } from "../../../api/baseUrl";
import { useState } from "react";
import { useEffect } from "react";
import OpenShiftModal from "./OpenShiftLogModal";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../../Context/Context";


export default function MachineOperator() {
  const {
    setAfterRefreshData,
    NcId,
    setFormData,
    setAfterloadService,
    setShiftSelected,
    setServiceTopData,
    setNcProgramId,
    setShowTable,
    setSelectedProgram,
    setMachinetaskdata,
    machineShiftStatus,
    setMachineShiftStatus,
  } = useGlobalContext();

  //get Machine List
  const [machineList, setMachineList] = useState([]);
  const getMachineList = () => {
    axios.get(baseURL + "/ShiftOperator/getallMachines").then((response) => {
      setMachineList(response.data);
      // console.log(response.data);
    });
  };

  useEffect(() => {
    getMachineList();
  }, []);

  // const [ShiftInformation, setShiftInformation] = useState([]);
  // useEffect(() => {
  //   axios
  //     .post(baseURL + "/ShiftOperator/getCurrentShiftDetails", {})
  //     .then((response) => {
  //       console.log("response is", response);
  //       setShiftInformation(response.data);
  //     });
  // }, []);

  // console.log("ShiftInformation is", ShiftInformation);

  const moment = require("moment");
  const today = moment();
  let Date = today.format("YYYY-MM-DD HH:mm:ss");

  console.log('Date with time', Date);
  

  let array = Date.split(" ");
  let date = array[0];

  console.log('Date', date);

  // Date Format  Change
  let date1 = date.split("-");
  let year1 = date1[0];
  let month1 = date1[1];
  let day1 = date1[2];
  let finalDay1 = day1 + "/" + month1 + "/" + year1;
  let Time = array[1].split(":");
  let hour = parseInt(Time[0]); // Ensure hour is parsed as an integer
  let Shift = "";
  if (hour >= 6 && hour < 14) {
    Shift = "First";
  } else if (hour >= 14 && hour < 22) {
    Shift = "Second";
  } else {
    Shift = "Third";
  }

  const [selectedMachine, setSelectedMachine] = useState("");
  const [shiftDetails, setShiftDetails] = useState([]);
  const handleMachineChange = (e) => {
    setSelectedMachine(e.target.value);
    axios
      .post(baseURL + "/ShiftOperator/getShiftDetails", {
        refName: e.target.value,
        ShiftDate: date,
        Shift: Shift,
      })
      .then((response) => {
        setShiftDetails(response.data);
      });
    setFormData([]);
  };

  //Open ShiftLog  Modal
  const [openmodal, setOpenmodal] = useState("");
  const [requiredProgram, setRequiredProgram] = useState("");
  // const formattedFromTime = format(new Date(selectshifttable?.FromTime), 'MM/dd/yyyy hh:mm:ss a');
  // const formattedToTime = format(new Date(selectshifttable?.ToTime), 'MM/dd/yyyy hh:mm:ss a');

  const navigate = useNavigate();

  //selecting table
  const [selectshifttable, setSelectshifttable] = useState({});
  const selectShifttableRow = (item, index) => {
    let list = { ...item, index: index };
    setSelectshifttable(list);
  };

  useMemo(() => {
    setSelectshifttable({ ...shiftDetails[0], index: 0 });
  }, [shiftDetails[0]]);

  const data = {
    selectedMachine: selectedMachine || "",
    finalDay1: finalDay1 || "",
    selectshifttable: selectshifttable || "",
    Shift: Shift || "",
    date: date || "",
  };

  //Sheets API after open Program
  const getmiddleTbaleData = () => {
    axios
      .post(baseURL + "/ShiftOperator/ProgramMaterialAfterRefresh", {
        selectshifttable,
        NcId,
      })
      .then((response) => {
        setAfterRefreshData(response?.data?.complexData1);
        setShowTable(true);
        if (!response.data.complexData1) {
          setAfterRefreshData([]);
          setShowTable(false);
        }
        setFormData(response?.data?.complexData2[0]);
        if (!response?.data?.complexData2[0]) {
          setFormData([]);
        }
        setNcProgramId(response?.data.complexData2[0].Ncid);
        setShowTable(true);
      });
  };

  useEffect(() => {
    getmiddleTbaleData();
  }, []);

  //Parts API after open Program Button
  const serviceMiddleTableData = () => {
    axios
      .post(baseURL + "/ShiftOperator/ServiceAfterpageOpen", {
        selectshifttable,
        NcId,
      })
      .then((response) => {
        setAfterloadService(response?.data);
        if (!response.data) {
          setAfterloadService([]);
        }
      });
  };

  // const getProgramParts = () => {
  //   axios
  //     .post(baseURL + "/ShiftOperator/getprogramParts", {
  //       NcId: NcId,
  //     })
  //     .then((response) => {
  //       setProgramPartsData(response.data);
  //     });
  // };

  ////
  const countUserDefinedProperties = (obj) => {
    let count = 0;
    for (let key in obj) {
      if (obj.hasOwnProperty(key) && key !== "index") {
        count++;
      }
    }
    return count;
  };

  const numberOfProperties = countUserDefinedProperties(selectshifttable);

  //openShiftLog Button
  const openShiftLogModal = () => {
    axios
      .post(baseURL + "/ShiftOperator/getRowCounts", {
        selectshifttable,
      })
      .then((response) => {
        setRequiredProgram(response.data);
        if (response.data.length !== 0 && numberOfProperties !== 0) {
          // //ProcessTaskStatus
          // axios
          //   .post(baseURL + "/rocessTShiftOperator/PaskStatus", {
          //     ShiftDate: date,
          //   })
          //   .then((response) => {
          //     // console.log(response.data);
          //   });
          setOpenmodal(true);
          setShiftSelected(selectshifttable);
          serviceMiddleTableData();
          getmiddleTbaleData();
          axios
            .post(
              baseURL + "/ShiftOperator/getTableTopDeatailsAfterPageRefresh",
              {
                selectshifttable,
              }
            )
            .then((response) => {
              setServiceTopData(response.data);
            });
        } else if (response.data.length === 0 && numberOfProperties === 0) {
          setOpenmodal(true);
          setShiftSelected(selectshifttable);
          serviceMiddleTableData();
          getmiddleTbaleData();
        } else {
          navigate("OpenShiftLog", { state: { data } });
        }
      });
    setSelectedProgram({});
    axios
      .post(baseURL + "/ShiftOperator/MachineTasksData", {
        MachineName: selectshifttable?.Machine,
      })
      .then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].Qty === 0) {
            response.data[i].rowColor = "#DC143C";
          } else if (response.data[i].QtyAllotted === 0) {
            response.data[i].rowColor = "#E0FFFF";
          } else if (response.data[i].QtyCut === 0) {
            response.data[i].rowColor = "#778899";
          } else if (response.data[i].QtyCut === response.data[i].Qty) {
            response.data[i].rowColor = "#008000";
          } else if (response.data[i].QtyCut === response.data[i].QtyAllotted) {
            response.data[i].rowColor = "#ADFF2F";
          } else if (response.data[i].Remarks !== null) {
            response.data[i].rowColor = "#DC143C";
          }
        }
        setMachinetaskdata(response.data);
      })
      .catch((error) => {
        console.error("Error occurred:", error);
      });
    axios
      .post(baseURL + "/ShiftOperator/getmachineShiftStatus", {
        selectshifttable,
      })
      .then((response) => {
        // console.log(response.data);
        setMachineShiftStatus(response.data);
      });
  };

  const onClickofClose = () => {
    navigate("/Machine");
  };

  useEffect(() => {
    getmiddleTbaleData();
    serviceMiddleTableData();
    axios
      .post(baseURL + "/ShiftOperator/getmachineShiftStatus", {
        selectshifttable,
      })
      .then((response) => {
        setMachineShiftStatus(response.data);
      });
  }, []);

  //update Machine Time
  const updateMachineTime = () => {
    axios
      .post(baseURL + "/ShiftOperator/updateMachineTime", {
        Machine: selectshifttable?.Machine,
      })
      .then((response) => {});
  };

  useEffect(() => {
    updateMachineTime();
  }, [selectshifttable]);

  //Shift Date Formating
  const shiftDate = selectshifttable?.ShiftDate;
  let formattedDate = "";
  
  if (shiftDate) {
    // Split by space to separate the date and time portions
    const dateOnly = shiftDate.split(" ")[0];
    const [year, month, day] = dateOnly.split("-");
    formattedDate = `${day}/${month}/${year}`;
  }
  

  // //Formating From Time and ToTime
  // const fromTime = ShiftInformation[0]?.FromTime;
  // const toTime = ShiftInformation[0]?.ToTime;

  // let formattedFromTime = "";
  // let formattedToTime = "";

  // if (fromTime) {
  //   const [date, time] = fromTime.split(" ");
  //   const [year, month, day] = date.split("-");
  //   formattedFromTime = `${day}/${month}/${year} ${time}`;
  // }

  // if (toTime) {
  //   const [date, time] = toTime.split(" ");
  //   const [year, month, day] = date.split("-");
  //   formattedToTime = `${day}/${month}/${year} ${time}`;
  // }

  // const formatDateTime = (dateTimeString) => {
  //   if (!dateTimeString) return "";

  //   const [date, time] = dateTimeString.split(" "); // Split into date and time
  //   const [year, month, day] = date.split("-"); // Split the date part
  //   return `${day}/${month}/${year} ${time}`; // Format as 'dd/mm/yyyy HH:MM:SS'
  // };

  console.log("selectshifttable is",selectshifttable);

  return (
    <div>
      <OpenShiftModal
        openmodal={openmodal}
        setOpenmodal={setOpenmodal}
        selectedMachine={selectedMachine}
        finalDay1={finalDay1}
        selectshifttable={selectshifttable}
        Shift={Shift}
        date={date}
        requiredProgram={requiredProgram}
        numberOfProperties={numberOfProperties}
      />

      <div className="row">
        <h4 className="title">Shift Selection Form</h4>
      </div>

      <div className="row">
        <div className="col-md-11">
          <label className="form-label">
            Operator Current Shift Selector Form
          </label>
        </div>
        <div className="col-md-1">
          <button
            className="button-style group-button"
            onClick={onClickofClose}
          >
            Close
          </button>
        </div>
      </div>

      <div className="row mt-1">
        <div className="d-flex col-md-3 mt-2" style={{ gap: "10px" }}>
          <label className="form-label" style={{ whiteSpace: "nowrap" }}>
            Select Machine
          </label>
          <select className="ip-select" onChange={handleMachineChange}>
            <option selected>Select Machine</option>
            {machineList?.map((dataMachineList) => (
              <option value={dataMachineList.refName}>
                {dataMachineList.refName}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <button
            className="button-style group-button"
            onClick={openShiftLogModal}
          >
            Open Shift Log
          </button>
        </div>
      </div>

      {/* <div className="row">
        <div className="col-md-1">
          <label className="form-label">Shift Date</label>
        </div>
        <div className="col-md-1">
          <label className="form-label">{finalDay1}</label>
        </div>
        <div className="col-md-1">
          <label className="form-label">Shift</label>
        </div>
        <div className="col-md-1">
          <label className="form-label">{Shift}</label>
        </div>
      </div>

      <div className="row">
        <div className="col-md-1">
          <label className="form-label">{finalDay1}</label>
        </div>
        <div className="col-md-1">
          <label className="form-label">
            <div>
              {Shift === "First" ? (
                <p>6:00:00</p>
              ) : Shift === "Second" ? (
                <p>14:00:00</p>
              ) : Shift === "Third" ? (
                <p>22:00:00</p>
              ) : null}
            </div>
          </label>
          <span className="mt-1">-</span>
        </div>
        <div className="col-md-1">
          <label className="form-label">Shift</label>
        </div>
        <div className="col-md-1">
          <label className="form-label">{Shift}</label>
        </div>
      </div> */}

      <div className="row">
        {/* <div className="col-md-3 col-sm-12 mt-2">
          <h6 className="mt-2" style={{ whiteSpace: "nowrap" }}>
            <b>Operator Current Shift Selector Form</b>
          </h6>
        </div> */}

        {/* <div className="row mt-2">
          <div className="col-md-4" style={{ display: "flex" }}>
            <label style={{ whiteSpace: "nowrap" }} className="form-label">
              Select Machine
            </label>
            <select className="ip-select ms-5" onChange={handleMachineChange}>
              <option selected>Select Machine</option>
              {machineList.map((dataMachineList) => (
                <option value={dataMachineList.refName}>
                  {dataMachineList.refName}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <button
              className="button-style   group-button"
              onClick={openShiftLogModal}
            >
              Open Shift Log
            </button>
            <button
              className="button-style group-button ms-2"
              style={{ width: "130px" }}
              onClick={onClickofClose}
            >
              Close
            </button>
          </div>
        </div> */}
        <div></div>

        <div className="row mt-3 mb-5">
          <div
            className="col-md-3  col-sm-12"
            style={{ display: "flex", gap: "30px" }}
          >
            <label className="form-label">Shift Date</label>
            <label className="form-label">{formattedDate}</label>
          </div>
          <div
            className="col-md-3 col-sm-12"
            style={{ display: "flex", gap: "40px", marginLeft: "-80px" }}
          >
            <label className="form-label">Shift</label>
            <label className="form-label">
              {selectshifttable?.Shift}
            </label>
          </div>
        </div>
        <div></div>

        <div
          style={{ display: "flex", gap: "30px", marginTop: "-30px" }}
          className="ms-2"
        >
          <label className="form-label">
            {selectshifttable?.FromTime
             }
          </label>{" "}
          <div
            className="col-md-3"
            style={{ display: "flex", marginLeft: "-18px" }}
          ></div>

          <span style={{ marginLeft: "-320px" }}>-</span>

          <div
            className="col-md-3"
            style={{ display: "flex", gap: "10px", marginLeft: "20px" }}
          >
            <label className="form-label">
              {selectshifttable?.ToTime}
            </label>{" "}
          </div>
        </div>

        <div
          style={{
            height: "275px",
            width: "600px",
            overflowY: "scroll",
            overflowX: "scroll",
          }}
        >
          <Table striped className="table-data border">
            <thead className="tableHeaderBGColor">
              <tr>
                <th>Operator</th>
                <th>Shift Remarks</th>
              </tr>
            </thead>
            <tbody className="tablebody">
              {shiftDetails.map((item, key) => {
                return (
                  <>
                    <tr
                      onClick={() => {
                        selectShifttableRow(item, key);
                      }}
                      className={
                        key === selectshifttable?.index ? "selcted-row-clr" : ""
                      }
                    >
                      <td>{item.Operator}</td>
                      <td>{item.ShiftRemarks}</td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
