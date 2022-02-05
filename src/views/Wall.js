import React, { useEffect, useState } from "react";
import { CButton, CCard, CCardBody, CCardHeader, CRow, CCol } from '@coreui/react'
import CIcon from '@coreui/icons-react'

import useApi from '../services/api'

export default () => {
    const api = useApi();

    const [loading, setLoding] = useState(true);
    const [list, setList] = useState([]);

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


    return (
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
                        ...+++
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
}