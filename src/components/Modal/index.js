import React from 'react';
import { Modal, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { modalActions } from '../../redux/actions';

import MetamaskImg from '../../assets/img/metamask.svg';

import './Modal.scss'

const ModalComponent = () => {
    const dispatch = useDispatch();

    const { isOpen, errorMsg } = useSelector((state) => {
        return {
            isOpen: state.modal.isOpen,
            errorMsg: state.user.errorMsg
        }
    })

    const handleOk = () => {
        dispatch(modalActions.toggleModal(false))
    }

    return (
        <Modal
            visible={isOpen}
            onOk={handleOk}
            onCancel={handleOk}
            footer={[
                <Button key="submit" type="primary" className="btn" onClick={handleOk}>
                    Ok
            </Button>,
            ]}
        >
            <img src={MetamaskImg} alt="" />
            <p>{errorMsg}</p>
        </Modal>
    );
}

export default ModalComponent;
