import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import s from './Modal.module.css';
import PropTypes from 'prop-types';
import Loader from 'components/Loader/Loader';


const modalRoot = document.querySelector('#modalRoot');


export default function Modal ({onClose, pic}){

  useEffect(()=>{
    const handleKeyDown = e => {
      if (e.code === 'Escape') {
        return onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return ()=>{
      window.removeEventListener('keydown', handleKeyDown);
    }
  })

 
    return createPortal(
      <div className={s.overlay}>
        <div className={s.modal}>
     <img src={pic} alt="" />  

        </div>
      </div>,
      modalRoot
    );
  }



Modal.propTypes = {
  onClose:PropTypes.func.isRequired,
  pic:PropTypes.string.isRequired
}
