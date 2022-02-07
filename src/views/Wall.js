import React, { useEffect, useState } from "react";
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CRow,
    CCol,
    CDataTable,
    CButtonGroup,
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter,
    CFormGroup,
    CLabel,
    CInput,
    CTextarea

} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import useApi from '../services/api'

export default () => {
    const api = useApi();

    const [loading, setLoding] = useState(true);
    const [list, setList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalTitleField, setModalTitleField] = useState('');
    const [modalBodyField, setModalBodyField] = useState('');

    const fields = [
        { label: 'Título', key: 'title' },
        { label: 'Data criaçao', key: 'datecreated' },
        { label: 'Ações', key: 'actions' }
    ];

    useEffect(() => {
        getList();
    }, []);

    const getList = async () => {
        setLoding();
        const result = await api.getWall();
        setLoding(false);
        if (result.error === '') {
            setList(result.list);
        } else {
            alert(result.error);
        }
    }

    const handleCloseModal = () => {
        setShowModal(false);
    }

    const handleEditButton = (index) => {
        setShowModal(true);
    }


    return (
        <>
            <CRow>
                <CCol>
                    <h2>Mural de Avisos</h2>

                    <CCard>
                        <CCardHeader>
                            <CButton color="primary" >
                                <CIcon name="cil-check" /> Novo Aviso
                            </CButton>
                        </CCardHeader>
                        <CCardBody>
                            <CDataTable
                                items={list}
                                fields={fields}
                                loading={loading}
                                noItemsViewSlot=" "
                                hover
                                striped
                                bordered
                                pagination
                                itemsPerPage={1}
                                scopedSlots={{
                                    'actions': (item, index) => (
                                        <td>
                                            <CButtonGroup color="info" onClick={() => handleEditButton(index)}>
                                                Editar
                                            </CButtonGroup>
                                            <CButtonGroup color="danger">
                                                Excluir
                                            </CButtonGroup>
                                        </td>
                                    )
                                }}
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            <CModal show={showModal} onClose={handleCloseModal}>
                <CModalHeader closeButton>
                    Editar Aviso
                </CModalHeader>
                <CModalBody>
                    <CFormGroup>
                        <CLabel htmlFor="modal-title">Título do aviso</CLabel>
                        <CInput
                            type="text"
                            id="modal-title"
                            placeholder="Digite um título para o aviso"
                            value={modalTitleField}
                            onChange={e => setModalTitleField(e.target.value)}
                        />
                    </CFormGroup>

                    <CFormGroup>
                        <CLabel htmlFor="modal-body">Corpo do aviso</CLabel>
                        <CTextarea
                            id="modal-body"
                            placeholder="Digite o conteúdo do aviso"
                            value={modalBodyField}
                            onChange={e => setModalBodyField(e.target.value)}
                        />
                    </CFormGroup>

                </CModalBody>
                <CModalFooter>
                    <CButton color="primary">Salvar</CButton>
                    <CButton color="secondary">Cancelar</CButton>
                </CModalFooter>
            </CModal>
        </>
    );
}