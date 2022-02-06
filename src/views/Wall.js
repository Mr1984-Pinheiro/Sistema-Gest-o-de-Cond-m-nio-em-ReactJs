import React, { useEffect, useState } from "react";
import { CButton, CCard, CCardBody, CCardHeader, CRow, CCol, CDataTable, CButtonGroup } from '@coreui/react'
import CIcon from '@coreui/icons-react'

import useApi from '../services/api'

export default () => {
    const api = useApi();

    const [loading, setLoding] = useState(true);
    const [list, setList] = useState([]);

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
                                'title': () => (
                                    <td>
                                        <CButtonGroup color="info">
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
    );
}