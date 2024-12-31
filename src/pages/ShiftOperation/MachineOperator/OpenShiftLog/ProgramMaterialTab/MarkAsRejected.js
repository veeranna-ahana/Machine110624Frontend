import React from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";

export default function MarkAsRejected({
  MarkasReject,
  setMarkasReject,
  handleMarkasRejected,
}) {
  const handleClose = () => {
    setMarkasReject(false);
  };

  const handleYesClick = () => {
    handleMarkasRejected();
    setMarkasReject(false);
  };

  return (
    <div>
      <Modal show={MarkasReject} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{fontSize:'14px'}}>magod_machine</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{fontSize:'12px'}}>
          Material once Marked as Rejected cannot be used again. Are you sure?
        </Modal.Body>

        <Modal.Footer>
          <button className="group-button button-style" onClick={handleYesClick}>
            Yes
          </button>
          <button className="group-button button-style" onClick={handleClose}>
            No
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
