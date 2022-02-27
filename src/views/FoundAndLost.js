import React, { useEffect, useState } from "react";
import {
    CButton,
    CCard,
    CCardBody,
    CRow,
    CCol,
    CDataTable,
    CSwitch,


} from '@coreui/react'
import Lightbox from "react-image-lightbox";
import 'react-image-lightbox/style.css';

import useApi from '../services/api'


export default () => {
    const api = useApi();

    const [loading, setLoding] = useState(true);
    const [list, setList] = useState([]);
    const [photoUrl, setPhotoUrl] = useState('');


    const fields = [
        {key: 'status', label: 'Recuperado', filter: false},
        {key: 'where', label: 'Local encontrado', sorter: false},
        {key: 'description', label: 'Descrição', sorter: false},
        {key:'photo', label: 'Foto', sorter: false, filter: false},
        {key: 'datecreated', label: 'Data'}

    ];

    useEffect(() => {
        getList();
    }, []);

    const getList = async () => {
        setLoding();
        const result = await api.getFoundAndLost();
        setLoding(false);
        if (result.error === '') {
            setList(result.list);
        } else {
            alert(result.error);
        }
    }

    const handleSwitchClick = async (item) => {
        setLoding(true);
        const result = await api.updateFoundAndLost(item.id);
        setLoding(false);
        if(result.error === '') {
            getList();
        }else {
            alert(result.error);
        }
    }

    const showLightbox = (url) => {
        setPhotoUrl(url);
    }

    return (
        <>
            <CRow>
                <CCol>
                    <h2>Achados e Perdidos</h2>

                    <CCard>

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
                                    'photo': (item) => (
                                        <td>
                                            {item.photo &&
                                                <CButton
                                                    color="success"
                                                    onClick={() => showLightbox(item.photo)}

                                                >
                                                    Ver Foto
                                                </CButton>
                                            }
                                        </td>

                                    ),
                                    'datecreated': (item) => (
                                        <td>
                                            {item.datecreated_formatted}
                                        </td>
                                    ),
                                    'status': (item) => (
                                        <td>
                                            <CSwitch
                                                color="success"
                                                checked={item.status === 'recovered'}
                                                onChange={(e) => handleSwitchClick(item)}
                                            />

                                        </td>
                                    )
                                }}
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {photoUrl &&
                <Lightbox
                    mainSrc={photoUrl}                    
                    onCloseRequest={() => setPhotoUrl ('')}                    
                    reactModalStyle={{ overlay: { zIndex: 9999 } }}
                />

            }
        </>
    );
}