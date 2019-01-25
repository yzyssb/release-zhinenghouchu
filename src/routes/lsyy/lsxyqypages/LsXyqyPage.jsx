import React, { PropTypes } from 'react';

import Header from '../../../components/Header';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Table } from 'antd';
import { Modal, Button, Row, Col, Pagination } from 'antd';
import moment from "moment";
import AddEnterpriseFormModal from "./LsAddEnterpriseFormModal"; //添加企业modal组件
import StaffListModal from "./LsStaffListModal"; //查看员工modal组件
import { getRestaurantId, getCompanyId, getWxToken, getWxState } from '../../../services/CommonService';
import message from "antd/lib/message/index";
import Select from 'antd/lib/select';
const Option = Select.Option;

function XyqyPage({ menu, dispatch, lsxyqyConfig }) {
    const HeaderProps = {
        menu,
        dispatch,
    };

    const pagination = {
        total: lsxyqyConfig.total,
        current: lsxyqyConfig.current,
        pageSize: lsxyqyConfig.size,
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger: true,
        onShowSizeChange: SizeChange,
    };


    function SizeChange(current, pageSize) {
        dispatch({
            type: 'lsxyqyConfig/updatePayload', payload: {
                size: pageSize,
                current: 1,
                offset: 0
            }
        });
        dispatch({ type: 'lsxyqyConfig/query', payload: {} });
    }

    function onPageChange(pageNo) {
        var offset = pageNo * lsxyqyConfig.size - lsxyqyConfig.size;
        dispatch({ type: 'lsxyqyConfig/updatePayload', payload: { offset: offset, current: pageNo } });
        dispatch({ type: 'lsxyqyConfig/query', payload: {} });
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
                return <a href="javascript:;" onClick={() => {
                    // var prefixUrl;
                    // const host = window.location.protocol + '//' + window.location.host;
                    // if (host == 'http://localhost:8989') {
                    //     prefixUrl = "http://dev.saas.27aichi.cn/";
                    // } else {
                    //     prefixUrl = window.location.protocol + '//' + window.location.host + '/';
                    // }
                    // window.location = prefixUrl + 'api/weixin/hq/in-zycompany.jpg/' + record.id + `?companyId=${getCompanyId()}&restaurantId=${getRestaurantId()}`;

                    dispatch({
                        type: 'lsxyqyConfig/checkCanLoad',
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
                    <a href="javascript:;" style={{ textDecoration: "none" }} onClick={() => { edit(record) }}>编辑</a>
                </div>

            }
        }
    ];

    // 查看员工
    function lookDetail(record) {
        dispatch({
            type: "lsxyqyConfig/updatePayload",
            payload: { staffListVisible: true, currentZyCompanyId: record.id }
        })
        dispatch({
            type: "lsxyqyConfig/staffQuery",
            payload: {}
        })

    }

    // 编辑
    function edit(record) {
        dispatch({
            type: "lsxyqyConfig/updatePayload",
            payload: { enterpriseVisible: true, way: "edit" }
        })
        dispatch({
            type: "lsxyqyConfig/getEnterpriseDetail",
            payload: record
        })

    }


    // 点击添加企业
    function addEnterprise() {
        // console.log("添加企业")
        dispatch({
            type: "lsxyqyConfig/updatePayload",
            payload: { enterpriseVisible: true, way: "add", restaurantIds: [] }
        })
    }



    const formItemLayout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 12 },
    };


    // 每次切换品牌都需要清空之前的可选门店列表，然后重新调取新的门店列表
    // 切换品牌=》调取刷网关数据的接口=》列表接口
    function changeBrandId(e) {
        dispatch({
            type: "lsxyqyConfig/updatePayload",
            payload: {
                checkedBrandId: e,
                storeList: [],
                offset: 0,
                total: 0, //数据总条数,默认初始为10条
                current: 1, //当前页码   
                offset: 0, //第几行开始
                dataSource: [], //
            }
        })

        // 然后调取对应的可选门店门店列表
        dispatch({
            type: "lsxyqyConfig/getStoreList",
            payload: { brandId: e }
        })
        // 去网关中刷品牌Id
        dispatch({
            type: "lsxyqyConfig/updateBrandIdWangGuan",
            payload: { brandId: e }
        })


    }





    return (
        <Header {...HeaderProps}>
            <div style={{ padding: "10px" }}>
                {/*  切换选择品牌 */}

                <Row>
                    <Col span="2" style={{ lineHeight: "32px" }}>请选择品牌：</Col>
                    <Col span="18">
                        <Select style={{ width: "200px" }} value={lsxyqyConfig.checkedBrandId} onChange={changeBrandId}>
                            {lsxyqyConfig.brandList.length && lsxyqyConfig.brandList.map(function (item, index) {
                                return <Option key={item.key} value={item.key}>{item.value}</Option>
                            })}
                        </Select>
                    </Col>
                    <Col span="3" style={{ textAlign: "right" }}>
                        <Button type="primary" onClick={addEnterprise}>添加企业</Button>
                    </Col>
                </Row>


                <div style={{ margin: "20px 0 20px 0", fontSize: "14px" }}>
                    *企业码为用户扫码验证是否为企业员工的识别码；企业码的作用主要为增强该营销方式在员工心中的仪式感，提高加入企业的积极性
                </div>
                <Table
                    columns={columns}
                    pagination={pagination}
                    dataSource={lsxyqyConfig.dataSource}
                    rowKey={record => record.id}
                    bordered />
            </div>

            {/* 添加企业modal */}
            <AddEnterpriseFormModal dispatch={dispatch} lsxyqyConfig={lsxyqyConfig} />
            {/* 查看员工modal */}
            <StaffListModal dispatch={dispatch} lsxyqyConfig={lsxyqyConfig} />
        </Header>
    );
}

XyqyPage.propTypes = {
    menu: PropTypes.object,
};


function mapStateToProps({ menu, lsxyqyConfig }) {
    return { menu, lsxyqyConfig, menu };
}

export default connect(mapStateToProps)(XyqyPage);

