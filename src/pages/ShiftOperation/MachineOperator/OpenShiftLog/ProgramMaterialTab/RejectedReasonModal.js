import React from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";

export default function RejectedReasonModal({openRejectionReason,setOpenRejectionReason,onclickofYes,onChangeInput}) {

    const handleClose=()=>{
        setOpenRejectionReason(false);
    }

  return (
    <div>
      <Modal show={openRejectionReason} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Rejected Reason</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="d-flex  col-md-12 mt-2">
            <label className="form-label col-md-3">Rejected Reason</label>
            <input
              className="in-field col-md-5"
              onChange={(e) => onChangeInput(e)}
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={onclickofYes}>Add</Button>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
