import React from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";

export default function SaveConfirmationModal({
  confirmModal,
  setConfirmModal,
  onclickSaveYes
}) {
  const handleClose = () => {
    setConfirmModal(false);
  };
  return (
    <div>
      <Modal show={confirmModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Save Program Parts</Modal.Title>
        </Modal.Header>

        <Modal.Body>
              Once saved cannot be changed again. Are you sure?
              {/* Are you sure you want save ? Once saved, this action cannot be changed. */}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={onclickSaveYes}>
          Save
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
