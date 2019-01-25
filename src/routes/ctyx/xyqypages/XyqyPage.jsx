import React, { PropTypes } from 'react';

import Header from '../../../components/Header';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Table } from 'antd';
import { Modal, Button, Row, Col, Pagination } from 'antd';
import moment from "moment";
import AddEnterpriseFormModal from "./AddEnterpriseFormModal"; //添加企业modal组件
import StaffListModal from "./StaffListModal"; //查看员工modal组件
import {getRestaurantId,getCompanyId,getWxToken,getWxState} from '../../../services/CommonService';
import message from "antd/lib/message/index";

function XyqyPage({ menu, dispatch, xyqyConfig }) {
    const HeaderProps = {
        menu,
        dispatch,
    };

    const pagination = {
        total: xyqyConfig.total,
        current: xyqyConfig.current,
        pageSize: xyqyConfig.size,
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger: true,
        onShowSizeChange: SizeChange,
    };


    function SizeChange(current, pageSize) {
        dispatch({
            type: 'xyqyConfig/updatePayload', payload: {
                size: pageSize,
                current: 1,
                offset: 0
            }
        });
        dispatch({ type: 'xyqyConfig/query', payload: {} });
    }

    function onPageChange(pageNo) {
        var offset = pageNo * xyqyConfig.size - xyqyConfig.size;
        dispatch({ type: 'xyqyConfig/updatePayload', payload: { offset: offset, current: pageNo } });
        dispatch({ type: 'xyqyConfig/query', payload: {} });
    }

    // 以上是分页数据=====================================

    const columns = [
        {
            title: '序号',
            dataIndex: 'xuhao',
            key: 'xuhao',
            render: function (text, record, index) {
                return index + 1
            }
        },
        {
            title: '企业名称',
            dataIndex: 'companyName',
            key: 'companyName',
        },
        {
            title: '员工人数',
            dataIndex: 'employeesNum',
            key: 'employeesNum',

        },
        {
            title: '折扣',
            dataIndex: 'discount',
            key: 'discount',

        },
        {
            title: '企业码',
            dataIndex: 'companyCode',
            key: 'companyCode',

        },
        {
            title: '',
            dataIndex: 'eeee',
            key: 'eeee',
            render: function (text, record, index) {
                return <a href="javascript:;" onClick={()=>{

                    // var prefixUrl;
                    // const host = window.location.protocol + '//' + window.location.host;
                    // if (host == 'http://localhost:8989') {
                    //     prefixUrl = "http://dev.saas.27aichi.cn/";
                    // } else {
                    //     prefixUrl = window.location.protocol + '//' + window.location.host + '/';
                    // }
                    // window.location = prefixUrl + 'api/weixin/hq/in-zycompany.jpg/' + record.id + `?companyId=${getCompanyId()}&restaurantId=${getRestaurantId()}`;

                    dispatch({
                        type: 'xyqyConfig/checkCanLoad',
                        payload: record
                    });


                  }
                }>下载邀请二维码</a>
            }
        },

        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: function (text, record, index) {
                return <div>
                    <a href="javascript:;" style={{ textDecoration: "none" }} onClick={() => { lookDetail(record) }}>查看员工</a>
                    <span className="ant-divider" />
                    <a href="javascript:;" style={{ textDecoration: "none" }} onClick={() => { edit(record) }}>查看</a>
                </div>

            }
        }
    ];

    // 查看员工
    function lookDetail(record) {
        dispatch({
            type: "xyqyConfig/updatePayload",
            payload: { staffListVisible: true, currentZyCompanyId: record.id }
        })
        dispatch({
            type: "xyqyConfig/staffQuery",
            payload: {}
        })

    }

    // 编辑
    function edit(record) {
        dispatch({
            type: "xyqyConfig/updatePayload",
            payload: { enterpriseVisible: true, way: "edit" }
        })
        dispatch({
            type: "xyqyConfig/getEnterpriseDetail",
            payload: record
        })

    }


    // 点击添加企业
    function addEnterprise() {
        // console.log("添加企业")
        dispatch({
            type: "xyqyConfig/updatePayload",
            payload: { enterpriseVisible: true, way: "add" }
        })
    }


    return (
        <Header {...HeaderProps}>
            <div style={{ padding: "10px" }}>
                {/* <div style={{ textAlign: "right", padding: "20px 0" }}><Button type="primary" onClick={addEnterprise}>添加企业</Button>
                </div> */}
                <div style={{ margin: "0 0 20px 0", fontSize: "14px" }}>
                    *企业码为用户扫码验证是否为企业员工的识别码；企业码的作用主要为增强该营销方式在员工心中的仪式感，提高加入企业的积极性
                </div>
                <Table
                    columns={columns}
                    pagination={pagination}
                    dataSource={xyqyConfig.dataSource}
                    rowKey={record => record.id}
                    bordered />
            </div>

            {/* 添加企业modal */}
            <AddEnterpriseFormModal dispatch={dispatch} xyqyConfig={xyqyConfig} />
            {/* 查看员工modal */}
            <StaffListModal dispatch={dispatch} xyqyConfig={xyqyConfig} />
        </Header>
    );
}

XyqyPage.propTypes = {
    menu: PropTypes.object,
};


function mapStateToProps({ menu, xyqyConfig }) {
    return { menu, xyqyConfig, menu };
}

export default connect(mapStateToProps)(XyqyPage);

