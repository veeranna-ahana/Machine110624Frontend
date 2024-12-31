import React from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";

export default function LoadProgramInfoModal({
  setloadProgramInfo,
  loadProgramInfo,
}) {
  const handleClose = () => {
    setloadProgramInfo(false);
  };
  return (
    <div>
      <Modal show={loadProgramInfo} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{fontSize:'14px'}}>magod_machine</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{fontSize:'12px'}}>
          Program Currently Being Processed, Use Current Program Window to
          update values
        </Modal.Body>

        <Modal.Footer>
          <button className="group-button button-style">Ok</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
