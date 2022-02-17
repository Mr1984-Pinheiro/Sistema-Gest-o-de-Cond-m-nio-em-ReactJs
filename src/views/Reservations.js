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
    CTextarea,
    CSelect

} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import useApi from '../services/api'

export default () => {
    const api = useApi();

    const [loading, setLoding] = useState(true);
    const [list, setList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [modalTitleField, setModalTitleField] = useState('');
    const [modalFileField, setModalFileField] = useState('');
    const [modalId, setModalId] = useState('');
    const [modalUnitList, setModalUnitList] = useState([]);
    const [modalAreaList, setModalAreaList] = useState([]);
    const [modalUnitId, setModalUnitId] = useState(0);
    const [modalAreaId, setModalAreaId] = useState(0);

    const fields = [
        { label: 'Unidade', key: 'name_unit', sorter: false },
        { label: 'Área', key: 'name_area', sorter: false },
        { label: 'Data da reserva', key: 'reservation_date' },
        { label: 'Ações', key: 'actions', _style: { width: '1px' }, sorter: false, filter: false }
    ];

    useEffect(() => {
        getList();
        getUnitList();
        getAreaList();
    }, []);

    const getList = async () => {
        setLoding();
        const result = await api.getReservations();
        setLoding(false);
        if (result.error === '') {
            setList(result.list);
        } else {
            alert(result.error);
        }
    }

    const getUnitList = async () => {
        const result = await api.getUnits();
        if (result.error === '') {
            setModalUnitList(result.list);
        }
    }

    const getAreaList = async () => {
        const result = await api.getAreas();
        if (result.error === '') {
            setModalAreaList(result.list);
        }
    }

    const handleCloseModal = () => {
        setShowModal(false);
    }

    const handleEditButton = (index) => {
        setModalId(list[index]['id']);
        setModalTitleField(list[index]['title']);
        //setModalBodyField(list[index]['body']);
        setShowModal(true);
    }

    const handleRemoveButton = async (index) => {
        if (window.confirm('Tem certeza que deseja excluir?')) {
            const result = await api.removeDocument(list[index]['id']);
            if (result.error === '') {
                getList();
            } else {
                alert(result.error);
            }
        }
    }

    const handleNewButton = () => {
        setModalId('');
        setModalTitleField('');
        setModalFileField('');
        setShowModal(true);
    }

    const handleModalSave = async () => {
        if (modalTitleField) {
            setModalLoading(true);

            let result;
            let data = {
                title: modalTitleField,

            };

            if (modalId === '') {
                if (modalFileField) {
                    data.file = modalFileField;
                    result = await api.addDocument(data);
                } else {
                    alert("Selecione o sarquivo");
                    setModalLoading(false);
                    return;
                }

            } else {
                if (modalFileField) {
                    data.file = modalFileField;
                }
                result = await api.updateDocument(modalId, data);
            }

            setModalLoading(false);
            if (result.error === '') {
                setShowModal(false);
                getList();
            } else {
                alert(result.error);
            }
        } else {
            alert('Preencha os campos!');
        }
    }

    const handleDownloadButton = (index) => {
        window.open(list[index]['fileurl']);
    }


    return (
        <>
            <CRow>
                <CCol>
                    <h2>Reservas</h2>

                    <CCard>
                        <CCardHeader>
                            <CButton
                                color="primary"
                                onClick={handleNewButton}
                                disabled={modalUnitList.length === 0 || modalAreaList.length === 0}
                            >
                                <CIcon name="cil-check" /> Nova Reserva
                            </CButton>
                        </CCardHeader>
                        <CCardBody>
                            <CDataTable
                                items={list}
                                fields={fields}
                                loading={loading}
                                noItemsViewSlot=" "
                                columnFilter
                                sorter
                                hover
                                striped
                                bordered
                                pagination
                                itemsPerPage={5}
                                scopedSlots={{
                                    'reservations_date': (item) => (
                                        <td>
                                            {item.reservation_date_formatted}
                                        </td>
                                    ),
                                    'actions': (item, index) => (
                                        <td>
                                            <CButtonGroup >
                                                <CButton
                                                    color="info"
                                                    onClick={() => handleEditButton(index)}
                                                    disabled={modalUnitList.length === 0 || modalAreaList.length === 0}
                                                >
                                                    Editar</CButton>
                                                <CButton color="danger" onClick={() => handleRemoveButton(index)}>Excluir</CButton>
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
                    {modalId === '' ? 'Nova' : 'Editar'} Reserva
                </CModalHeader>
                <CModalBody>

                    <CFormGroup>
                        <CLabel htmlFor="modal-unit" >Unidade</CLabel>
                        <CSelect
                            id="modal-unit"
                            custom
                            onChange={e => setModalUnitId(e.target.value)}
                        >
                            {modalUnitList.map((item, index) => (
                                <option
                                    key={index}
                                    value={item.id}

                                >{item.name}</option>
                            ))}

                        </CSelect>
                    </CFormGroup>

                    <CFormGroup>
                        <CLabel htmlFor="modal-area" >Área</CLabel>
                        <CSelect
                            id="modal-area"
                            custom
                            onChange={e => setModalAreaId(e.target.value)}

                        >
                            {modalAreaList.map((item, index) => (
                                <option
                                    key={index}
                                    value={item.id}

                                >{item.title}</option>
                            ))}

                        </CSelect>
                    </CFormGroup>

                    <CFormGroup>
                        <CLabel htmlFor="modal-title">Título do documento</CLabel>
                        <CInput
                            type="text"
                            id="modal-title"
                            placeholder="Digite um título para o documento"
                            value={modalTitleField}
                            onChange={e => setModalTitleField(e.target.value)}
                            disabled={modalLoading}
                        />
                    </CFormGroup>



                </CModalBody>
                <CModalFooter>
                    <CButton
                        color="primary"
                        onClick={handleModalSave}
                        disabled={modalLoading}
                    >
                        {modalLoading ? 'Carregando...' : 'Salvar'}
                    </CButton>
                    <CButton
                        color="secondary"
                        onClick={handleCloseModal}
                        disabled={modalLoading}
                    >Cancelar</CButton>
                </CModalFooter>
            </CModal>
        </>
    );
}