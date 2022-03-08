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
    CSelect,
    CSwitch

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

    const [modalAllowedField, setModalAllowedField] = useState(1);
    const [modalTitleField, setModalTitleField] = useState('');
    const [ modalCoverField, setModalCoverField] = useState(''); 
    const [modalDaysField, setModalDaysField] = useState([]);
    const [modalStartTimeField, setModalStartTimeField] = useState('');
    const [modalEndTimeField, setModalEndTimeField] = useState('');










    
    const [modalFileField, setModalFileField] = useState('');   
    const [modalUnitList, setModalUnitList] = useState([]);
    const [modalAreaList, setModalAreaList] = useState([]);
    const [modalUnitId, setModalUnitId] = useState(0);
    const [modalAreaId, setModalAreaId] = useState(0);
    const [modalDateField, setModalDateField] = useState('');

    const fields = [
        { label: 'Ativo', key: 'allowed', sorter: false },
        { label: 'Capa', key: 'cover', sorter: false },
        { label: 'Título', key: 'title' },
        { label: 'Dias de funcionamento', key: 'days' },
        { label: 'Horário de início', key: 'start_time' },
        { label: 'Horário de fim', key: 'end_time' },
        { label: 'Ações', key: 'actions', _style: { width: '1px' }, sorter: false, filter: false }
    ];

    useEffect(() => {
        getList();        
    }, []);

    const getList = async () => {
        setLoding();
        const result = await api.getAreas();
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
        setModalUnitId(list[index]['id_unit']);
        setModalAreaId(list[index]['id_area']);
        setModalDateField(list[index]['reservation_date']);
        setShowModal(true);
    }

    const handleRemoveButton = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir?')) {
            const result = await api.removeReservation(id);
            if (result.error === '') {
                getList();
            } else {
                alert(result.error);
            }
        }
    }

    const handleNewButton = () => {
        setModalId('');
       setModalAllowedField(1);
       setModalTitleField('');
       setModalCoverField('');
       setModalDaysField([]);
       setModalStartTimeField('');
       setModalEndTimeField('');
        setShowModal(true);
    }

    const handleModalSave = async () => {
        if (modalUnitId && modalAreaId && modalDateField) {
            setModalLoading(true);

            let result;
            let data = {
                id_unit: modalUnitId,
                id_area: modalAreaId,
                reservation_date: modalDateField

            };

            if (modalId === '') {
                result = await api.addReservation(data);
            } else {
                result = await api.updateReservation(modalId, data);
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

    const handleSwitchClick = () => {

    }

    const handleModalSwitchClick = () =>{
        setModalAllowedField(1 - modalAllowedField);
    }

    return (
        <>
            <CRow>
                <CCol>
                    <h2>Áreas Comuns</h2>

                    <CCard>
                        <CCardHeader>
                            <CButton
                                color="primary"
                                onClick={handleNewButton}                                
                            >
                                <CIcon name="cil-check" /> Nova Área Comum
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
                                    'allowed': (item) => (
                                        <td>
                                            <CSwitch 
                                                color="success"
                                                checked={item.allowed}
                                                onChange={()=>handleSwitchClick(item)}
                                            />
                                        </td>
    ),  
                                    'cover' : (item) => (
                                        <td>
                                            <img src={item.cover}width={100}/>
                                        </td>
                                    ),
                                    'days' : (item) => {
                                        let dayWords = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo' ];
                                        let days = item.days.split(',');
                                        let dayString = [];
                                        for(let i in days ){
                                            if(days[i] && dayWords[days[i]]) {
                                                dayString.push( dayWords[days[i]]);
                                            }
                                        }


                                        return (
                                            <td>
                                                {dayString.join(', ')}
                                            </td>
                                        );
                                    },
                                    'actions': (item) => (
                                        <td>
                                            <CButtonGroup >
                                                <CButton color="info" onClick={() => handleEditButton(item.id)}>Editar</CButton>
                                                <CButton color="danger" onClick={() => handleRemoveButton(item.id)}>Excluir</CButton>
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
                    {modalId === '' ? 'Nova' : 'Editar'} Área Comum
                </CModalHeader>
                <CModalBody>

                    <CFormGroup>
                        <CLabel htmlFor="modal-allowed" >Ativo</CLabel>
                        <CSwitch 
                            color="success"
                            checked={modalAllowedField}
                            onChange={handleModalSwitchClick}
                        />
                    </CFormGroup>

                    <CFormGroup>
                        <CLabel htmlFor="modal-cover">Capa</CLabel>
                        <CInput 
                            type="file"
                            id="modal-cover"
                            name="cover"
                            placeholder="Escolha uma imagem"
                            onChange={(e)=>setModalCoverField(e.target.files[0])}
                        />
                    </CFormGroup>
                    
                    <CFormGroup>
                        <CLabel htmlFor="modal-days">Dias de funcionamento</CLabel>
                        
                    </CFormGroup>  

                    <CFormGroup>
                        <CLabel htmlFor="modal-start-time">Horário de início</CLabel>
                        <CInput 
                            type="time"
                            id="modal-start-time"
                            name="start_time"
                            value={modalStartTimeField}                            
                            onChange={(e)=>setModalStartTimeField(e.target.value)}
                        />
                    </CFormGroup> 

                    <CFormGroup>
                        <CLabel htmlFor="modal-end-time">Horário de Fim</CLabel>
                        <CInput 
                            type="time"
                            id="modal-end-time"
                            name="end_time"
                            value={modalEndTimeField}                            
                            onChange={(e)=>setModalEndTimeField(e.target.value)}
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