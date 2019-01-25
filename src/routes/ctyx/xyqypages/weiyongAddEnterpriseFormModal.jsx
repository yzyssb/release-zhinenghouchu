import React, { PropTypes } from 'react';

import Header from '../../../components/Header';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import FilterComponent from "./AddEnterpriseFormModal"; //引入查询组件
import { Table } from 'antd';
import { Modal, Button, Row, Col } from 'antd';







function AddEnterpriseFormModal({ menu, dispatch, ddglConfig }) {
    const HeaderProps = {
        menu,
        dispatch,
    };

    const columns = [
        {
            title: '商品编号',
            dataIndex: 'foodId',
            key: 'foodId'
        },
        {
            title: '商品名称',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: '规格',
            dataIndex: 'spec',
            key: 'spec'
        },
        {
            title: '数量',
            dataIndex: 'count',
            key: 'count'
        },
        {
            title: '单价￥',
            dataIndex: 'price',
            key: 'price',
            render: function (text, record, index) {
                return record.price / 100
            }
        },
        {
            title: '退款数量',
            dataIndex: 'drawbackCount',
            key: 'drawbackCount'
        },
        {
            title: '部分退款额￥',
            dataIndex: 'drawbackAmount',
            key: 'drawbackAmount',
            render: function (text, record, index) {
                return record.drawbackAmount / 100
            }
        },
        {
            title: '小计￥',
            dataIndex: 'amount',
            key: 'amount',
            render: function (text, record, index) {
                return record.amount / 100
            }
        },
        {
            title: '属性',
            dataIndex: 'attr',
            key: 'attr'
        },
    ]

    function handleCancel() {
        dispatch({
            type: "ddglConfig/updatePayload",
            payload: { orderDetailModalVisible: false, currentOrderDetail: {} }
        });
    }

    return (

        <Modal
            visible={ddglConfig.orderDetailModalVisible}
            footer={null}
            onCancel={handleCancel}
            width={1200}
        >
            <div style={{ padding: "10px" }}>
                <h2 style={{ color: "#000", lineHeight: "50px" }}>订单详情</h2>
                <Table
                    columns={columns}
                    pagination={false}
                    dataSource={ddglConfig.currentOrderDetail.details}
                    rowKey={record => record.foodId}
                    bordered />

                <div style={{ margin: "30px 0 0 0", fontSize: "14px", lineHeight: "32px" }}>
                    <Row>
                        <Col span="7" offset="1">
                            <div>
                                骑手姓名：{ddglConfig.currentOrderDetail.shipperName}
                            </div>
                            <div>
                                商品金额：{ddglConfig.currentOrderDetail.foodAmount / 100} 元
                            </div>
                            <div>
                                订单总金额：{ddglConfig.currentOrderDetail.orderAmount / 100} 元
                            </div>
                            <div>
                                商家补贴：{ddglConfig.currentOrderDetail.merchantPay / 100} 元
                            </div>
                            <div>
                                结算金额：{ddglConfig.currentOrderDetail.cashFee / 100} 元
                            </div>
                            <div>
                                门店名称：{ddglConfig.currentOrderDetail.poiName}
                            </div>

                        </Col>
                        <Col span="7">
                            <div>
                                骑手电话：{ddglConfig.currentOrderDetail.shipperPhone}                      </div>
                            <div>餐盒费：{ddglConfig.currentOrderDetail.boxFee / 100} 元 </div>
                            <div>优惠金额：{ddglConfig.currentOrderDetail.discountAmount / 100} 元</div>
                            <div>平台佣金：{ddglConfig.currentOrderDetail.platformFee / 100} 元 </div>
                            <div>优惠活动：{ddglConfig.currentOrderDetail.activityDesc} </div>
                            <div>门店电话：{ddglConfig.currentOrderDetail.poiPhone} </div>
                        </Col>
                        <Col span="7">
                            <div>退单理由：{ddglConfig.currentOrderDetail.reason} </div>
                            <div>配送费：{ddglConfig.currentOrderDetail.shippingFee / 100} 元</div>
                            <div>客付价：{ddglConfig.currentOrderDetail.userRealPay / 100} 元</div>
                            <div>净收入：{ddglConfig.currentOrderDetail.realRecv / 100} 元 </div>
                            <div>备注：{ddglConfig.currentOrderDetail.memo} </div>
                        </Col>
                    </Row>
                </div>
            </div>
            <div style={{ textAlign: "right" }}>
                <Button type="primary" onClick={handleCancel}>取消</Button>
            </div>
        </Modal>





    );
}

AddEnterpriseFormModal.propTypes = {
    menu: PropTypes.object,
};


function mapStateToProps({ menu, ddglConfig }) {
    return { menu, ddglConfig, menu };
}

export default connect(mapStateToProps)(AddEnterpriseFormModal);

