import React from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";

export default function RejectedReasonModal({
  openRejectionReason,
  setOpenRejectionReason,
  onclickofYes,
  onChangeInput,
  setSelectedMtrlTable,
}) {
  const handleClose = () => {
    setOpenRejectionReason(false);
    setSelectedMtrlTable([]);
  };

  return (
    <div>
      <Modal show={openRejectionReason} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "14px" }}>
            Rejected Reason
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ fontSize: "12px" }}>
          <div className="d-flex  col-md-12 mt-2">
            <label className="form-label col-md-3">Rejected Reason</label>
            <input
              className="in-field col-md-5"
              onChange={(e) => onChangeInput(e)}
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button className="group-button button-style" onClick={onclickofYes}>
            Add
          </button>
          <button className="group-button button-style" onClick={handleClose}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
