import React, { PropTypes } from 'react';

import Header from '../../../components/Header';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import FilterComponent from "./FilterComponent"; //引入查询组件
import { Table } from 'antd';
import { Modal, Button, Row, Col, Pagination } from 'antd';
import Tooltip from "antd/lib/tooltip"
import moment from "moment";
import DdDetailModal from "./DdDetailModal"; //引入详情modal







function Ddgl({ menu, dispatch, ddglConfig }) {
    const HeaderProps = {
        menu,
        dispatch,
    };

    const columns = [
        {
            title: '外卖平台',
            dataIndex: 'platformType',
            key: 'platformType',
            render: function (text, record, index) {
                if (record.platformType == 0) {
                    return "总计"
                } else if (record.platformType == 1) {
                    return "美团"
                } else if (record.platformType == 2) {
                    return "饿了么"
                } else if (record.platformType == 3) {
                    return "百度"
                }
            }
        },
        {
            title: <Tooltip placement="top" title="说明：菜品销售额+餐盒费">
                营业额￥
                </Tooltip>,
            dataIndex: 'amountTotal',
            key: 'amountTotal',
            render: function (text, record, index) {
                return record.amountTotal / 100
            }
        },
        {
            title: '餐盒收入￥',
            dataIndex: 'boxFee',
            key: 'boxFee',
            render: function (text, record, index) {
                return record.boxFee / 100
            }
        },
        {
            title: '平台佣金￥',
            dataIndex: 'platformFee',
            key: 'platformFee',
            render: function (text, record, index) {
                return record.platformFee / 100
            }
        },
        {
            title: '在线支付额￥',
            dataIndex: 'onlinePayFee',
            key: 'onlinePayFee',
            render: function (text, record, index) {
                return record.onlinePayFee / 100
            }
        },
        {
            title: <Tooltip placement="top" title="说明：当前筛选条件下的订单总数，包含所有状态订单">
                当前订单数
                    </Tooltip>,
            dataIndex: 'usefulCount',
            key: 'usefulCount',
        },
        {
            // title: '客单价￥',
            title: <Tooltip placement="top" title="说明：客单价=营业额/当前订单数">
                客单价￥
                </Tooltip>,
            dataIndex: 'avgConsume',
            key: 'avgConsume',
            render: function (text, record, index) {
                return record.avgConsume / 100
            }
        },
        {
            title: <Tooltip placement="top" title="说明：无效订单包含：用户取消，商家取消和已退款状态单据">
                无效订单数
            </Tooltip>,
            dataIndex: 'drawbackCount',
            key: 'drawbackCount',

        },
        {
            title: <Tooltip placement="top" title="说明：无效订单金额总和">
               无效总金额￥
                </Tooltip>,
            dataIndex: 'amtDrawback',
            key: 'amtDrawback',
            render: function (text, record, index) {
                return record.amtDrawback / 100
            }
        },
    ]

    // 点击详情去订单详情页面
    function showDdDetail(platformOrderId) {
        dispatch({
            type: "ddglConfig/updatePayload",
            payload: { currentOrderDetail: {} }
        });

        dispatch({
            type: 'ddglConfig/getOrderDetail',
            payload: { platformOrderId }
        });
    }


    // 分页
    function onChangePage(pageNumber) {
        dispatch({
            type: "ddglConfig/updatePayload",
            payload: { current: pageNumber, offset: (pageNumber - 1) * 10 }
        })
        // 调取tab列表数据
        dispatch({
            type: "ddglConfig/query",
            payload: {}
        })
        // 调取订单列表数据
        dispatch({
            type: "ddglConfig/getOrderList",
            payload: {}
        })

    }

    //获取配送状态
    function getDeliveryStatus(deliveryState) {
        if (!deliveryState) {
            return "无"
        }
        for (var i = 0; i < ddglConfig.filterOrderDeliveryStatusList.length; i++) {
            for (var key in ddglConfig.filterOrderDeliveryStatusList[i]) {
                if (ddglConfig.filterOrderDeliveryStatusList[i].value == deliveryState) {
                    return ddglConfig.filterOrderDeliveryStatusList[i].label;
                }
            }
        }
    }

    // 获取订单状态
    function getOrderStatus(orderStatus) {
        if (!orderStatus) {
            return "无"
        }
        for (var i = 0; i < ddglConfig.filterOrderStatusList.length; i++) {
            for (var key in ddglConfig.filterOrderStatusList[i]) {
                if (ddglConfig.filterOrderStatusList[i].value == orderStatus) {
                    return ddglConfig.filterOrderStatusList[i].label;
                }
            }
        }
    }

    //  获取订单对应的logo
    function getOrderImgUrl(platformType) {
        if (ddglConfig.filterOrderPlatformList.length > 0) {
            for (var i = 0; i < ddglConfig.filterOrderPlatformList.length; i++) {
                for (var key in ddglConfig.filterOrderPlatformList[i]) {
                    if (ddglConfig.filterOrderPlatformList[i].id == platformType) {
                        return ddglConfig.filterOrderPlatformList[i].imageUrl;
                    }
                }
            }
        } else {
            return ""
        }

    }

    return (
        <Header {...HeaderProps}>
            <div style={{ padding: "10px" }}>
                <FilterComponent dispatch={dispatch} ddglConfig={ddglConfig} />
                <div style={{ margin: "20px 0 10px 0", fontSize: "12px" }}>*此数据为查询条件下的数据，如需查看有效营业收入数据，请移至“路上会员宝”-“报表”-“营业报表”查看</div>
                <Table
                    columns={columns}
                    pagination={false}
                    dataSource={ddglConfig.dataSource}
                    rowKey={record => record.platformType}
                    bordered />

                <div style={{ margin: "30px 0 0 0" }}>
                    {ddglConfig.orderData.length > 0 &&
                        ddglConfig.orderData.map(function (item, index) {
                            return <div key={item.platformOrderId} style={{ border: "1px solid #e8e8e8", borderTopLeftRadius: "5px", borderTopRightRadius: "5px", marginBottom: "15px" }}>
                                <Row style={{ background: "#f8f8f8", height: "50px", lineHeight: "50px", textAlign: "left", }}>
                                    <Col span="2" style={{ background: "#fff", overflow: "hidden", lineHeight: 0, textAlign: "center" }}><img style={{ height: "50px" }} src={getOrderImgUrl(item.platformType)} />
                                    </Col>
                                    <Col span="6" style={{ textIndent: "10px" }}>下单时间：{ddglConfig.formatDate(item.createTime)}</Col>
                                    <Col span="6">预约送达时间：{item.deliveryTime}</Col>
                                    <Col span="6" style={{ fontWeight: 700 }}>配送状态: {getDeliveryStatus(item.deliveryState)}</Col>
                                    <Col span="4" style={{ textAlign: "right" }}>
                                        <span style={{ marginRight: "20px" }}>订单状态：{getOrderStatus(item.orderStatus)}</span>
                                    </Col>
                                </Row>
                                <Row style={{ lineHeight: "36px" }}>
                                    <Col span="2" style={{ textAlign: "center" }}>
                                        <div>平台流水号</div>
                                        <div style={{ color: "red" }}>#{item.daySeq}</div>
                                    </Col>
                                    <Col span="6" style={{ textIndent: "10px" }}>
                                        <div> 外卖订单号：{item.platformOrderViewId}</div>
                                        <div>
                                            用户名称：{item.customerName}
                                            <span style={{ color: "red" }}>{item.isNew && "(新顾客)"}</span>
                                        </div>
                                    </Col>
                                    <Col span="6">
                                        <div>订单总金额：{item.amount / 100}元</div>
                                        <div>
                                            电话：{item.customerPhone}
                                        </div>
                                    </Col>
                                    <Col span="6">
                                        送餐地址：{item.deliveryAddress}
                                    </Col>
                                    <Col span="4" style={{ textAlign: "right" }}>
                                        <Button onClick={() => showDdDetail(item.systemOrderId)} type="primary" style={{ marginTop: "20px", marginRight: "20px" }}>查看详情</Button>
                                    </Col>
                                </Row>
                            </div>
                        })

                    }

                </div>
                <div style={{ textAlign: "right", padding: "20px 0" }}>
                    {ddglConfig.orderData.length > 0 && <Pagination showQuickJumper current={ddglConfig.current} total={ddglConfig.total} onChange={onChangePage} />}
                </div>
            </div>
            <DdDetailModal dispatch={dispatch} ddglConfig={ddglConfig} />
        </Header>
    );
}

Ddgl.propTypes = {
    menu: PropTypes.object,
};


function mapStateToProps({ menu, ddglConfig }) {
    return { menu, ddglConfig, menu };
}

export default connect(mapStateToProps)(Ddgl);

