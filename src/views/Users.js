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

    const [modalId, setModalId] = useState('');
    const [modalNameField, setModalNameField] = useState('');
    const [modalEmailField, setModalEmailField] = useState('');
    const [modalCpfField, setModalCpfField] = useState('');
    const [modalPass1Field, setModalPass1Field] = useState('');
    const [modalPass2Field, setModalPass2Field] = useState('');
    
    const fields = [
        { label: 'Nome', key: 'name'},
        { label: 'E-mail', key: 'email'},
        { label: 'CPF', key: 'cpf'},
        { label: 'Ações', key: 'actions', _style: { width: '1px' }, sorter: false, filter: false }
    ];

    useEffect(() => {
        getList();        
    }, []);

    const getList = async () => {
        setLoding();
        const result = await api.getUsers();
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

    const handleEditButton = (id) => {
        let index = list.findIndex(v => v.id === id);
        setModalId(list[index]['id']);
        setModalNameField(list[index]['iname']);
        setModalEmailField(list[index]['email']);
        setModalCpfField(list[index]['cpf']);
        setModalPass1Field('');
        setModalPass2Field('');
        setShowModal(true);
    }

    const handleRemoveButton = async (index) => {
        if (window.confirm('Tem certeza que deseja excluir?')) {
            const result = await api.removeReservation(list[index]['id']);
            if (result.error === '') {
                getList();
            } else {
                alert(result.error);
            }
        }
    }

    const handleNewButton = () => {
        setModalId('');
        setModalNameField('');
        setModalEmailField('');
        setModalCpfField('');
        setModalPass1Field('');
        setModalPass2Field('');
        setShowModal(true);
    }

    const handleModalSave = async () => {
        if (modalNameField && modalEmailField && modalCpfField) {
            setModalLoading(true);

            let result;
            let data = {
                name: modalNameField,
                email: modalEmailField,
                cpf: modalCpfField
            };
            if(modalPass1Field){
                if(modalPass1Field === modalPass2Field) {
                    data.password = modalPass1Field;
                }else {
                    alert("Senhas não batem");
                    setModalLoading(false);
                }
            }

            if (modalId === '') {
                result = await api.addUser(data);
            } else {
                result = await api.updateUser(modalId, data);
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

    
    return (
        <>
            <CRow>
                <CCol>
                    <h2>Usuários manos e minas</h2>

                    <CCard>
                        <CCardHeader>
                            <CButton
                                color="primary"
                                onClick={handleNewButton}
                                
                            >
                                <CIcon name="cil-check" /> Novo Usuário
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
                                itemsPerPage={10}
                                scopedSlots={{                                   
                                    'actions': (item, index) => (
                                        <td>
                                            <CButtonGroup >
                                                <CButton
                                                    color="info"
                                                    onClick={() => handleEditButton(item.id)}                                                    
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
                    {modalId === '' ? 'Nova' : 'Editar'} Usuário
                </CModalHeader>
                <CModalBody>

                    <CFormGroup>
                        <CLabel htmlFor="modal-unit" >Unidade</CLabel>
                        <CSelect
                            id="modal-unit"
                            custom
                            onChange={e => setModalUnitId(e.target.value)}
                            value={modalUnitId}
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
                            value={modalAreaId}

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
                        <CLabel htmlFor="modal-date">Data da reserva</CLabel>
                        <CInput
                            type="text"
                            id="modal-date"
                            value={modalDateField}
                            onChange={e => setModalDateField(e.target.value)}
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