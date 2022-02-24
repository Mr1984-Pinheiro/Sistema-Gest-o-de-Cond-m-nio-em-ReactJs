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
    const [photoList, setPhotoList] = useState([]);
    const [photoListIndex, setPhotoListIndex] = useState(0);


    const fields = [
        { label: 'Resolvido', key: 'status', filter: false },
        { label: 'Unidade', key: 'name_unit', sorter: false },
        { label: 'Titulo', key: 'title', sorter: false },
        { label: 'Fotos', key: 'photos', sorter: false, filter: false },
        { label: 'Data', key: 'datecreated' }

    ];

    useEffect(() => {
        getList();
    }, []);

    const getList = async () => {
        setLoding();
        const result = await api.getWarnings();
        setLoding(false);
        if (result.error === '') {
            setList(result.list);
        } else {
            alert(result.error);
        }
    }

    const handleSwitchClick = () => {

    }

    const showLightbox = (photos) => {
        setPhotoListIndex(0);
        setPhotoList(photos);
    }

    return (
        <>
            <CRow>
                <CCol>
                    <h2>Ocorrências</h2>

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
                                    'photos': (item) => (
                                        <td>
                                            {item.photos.length > 0 &&
                                                <CButton
                                                    color="success"
                                                    onClick={() => showLightbox(item.photos)}

                                                >
                                                    {item.photos.length} foto{item.photos.length !== 1 ? 's' : ''}
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
                                                checked={item.status === 'RESOLVED'}
                                                onChange={(e) => handleSwitchClick(e, item)}
                                            />

                                        </td>
                                    )
                                }}
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {photoList.length > 0 &&
                <Lightbox
                    mainSrc={photoList[photoListIndex]}
                    nextSrc={photoList[photoListIndex+1]}
                    prevSrc={photoList[photoListIndex-1]}
                    onCloseRequest={() => setPhotoList([])}
                    onMovePrevRequest={() => {
                        if (photoList[photoListIndex-1] !== undefined) {
                            setPhotoListIndex(photoListIndex - 1);
                        }
                    }}
                    onMoveNextRequest={() => {
                        if (photoList[photoListIndex + 1] !== undefined) {
                            setPhotoListIndex(photoListIndex + 1);
                        }
                    }}
                    reactModalStyle={{ overlay: { zIndex: 9999 } }}
                />

            }
        </>
    );
}