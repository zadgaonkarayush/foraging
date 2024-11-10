import React from 'react';
import { Modal } from 'react-bootstrap'; // Import Modal from react-bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from '../assets/Modal.png';
import './SuccessModal.css';

const SuccessModal = ({ show, handleClose }) => {
  return (
   <div className='box'>
     <Modal show={show} onHide={handleClose} centered>

<Modal.Body>
  <div className='modal-logo'>
    <img src={Image} alt='logo' />
  </div>
  <h2>Congratulations</h2>
  <p>Account Created Successfully</p>
</Modal.Body>
<Modal.Footer>
  <button className='modal-btn' onClick={handleClose}>OK</button>
</Modal.Footer>
</Modal>
   </div>
  );
};

export default SuccessModal;
