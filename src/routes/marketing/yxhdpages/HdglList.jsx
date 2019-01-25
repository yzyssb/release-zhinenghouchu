import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import HdglFilterComponent from "./HdglFilterComponent"; //引入查询组件
import Table from 'antd/lib/table';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Modal from 'antd/lib/modal';
import Button from 'antd/lib/button';
import { routerRedux } from "dva/router";

const confirm = Modal.confirm;


function HdglList({ menu, dispatch, hdglConfig }) {
    const HeaderProps = {
        menu,
        dispatch,
    };
    const pagination = {
        total: hdglConfig.total,
        current: hdglConfig.page,
        pageSize: hdglConfig.size,
        onChange: (pageNo) => {
            dispatch({ type: 'hdglConfig/updatePayload', payload: { page: pageNo } });
            dispatch({ type: 'hdglConfig/query', payload: {} });
        },
        showSizeChanger: true,
        onShowSizeChange: (current, pageSize) => {
            dispatch({ type: 'hdglConfig/updatePayload', payload: { size: pageSize, page: 1 } });
            dispatch({ type: 'hdglConfig/query', payload: {} });
        },
    };
    // 以上是分页数据=====================================

    const columns = [
        {
            title: '活动ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '活动名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '活动类型',
            dataIndex: 'activityType',
            key: 'activityType',
            render: function (text, record, index) {
                {
                    let children = [];
                    if (record.activityType == '1') {
                        children.push(<span key={index}>注册赠送礼 </span>);
                    } else if (record.activityType == '2') {
                        children.push(<span key={index}>菜品返积分</span>);
                    } else if (record.activityType == "3") {
                        children.push(<span key={index}>注册送券 </span>);
                    } else if (record.activityType == "4") {
                        children.push(<span key={index}>付费开卡送券 </span>);
                    }

                    return children;
                }

            }

        },
        {
            title: '活动说明',
            dataIndex: 'activityDesc',
            key: 'activityDesc',
            width: 200,
            render: function (text, record, index) {
                if (record.activityDesc && record.activityDesc.length <= 20) {
                    return (<span key={index} title={record.activityDesc}>{record.activityDesc}</span>);
                } else {
                    let showActivityDesc = record.activityDesc.slice(0, 20);
                    return (<span key={index} title={record.activityDesc}>{showActivityDesc + "..."}</span>);
                }
            }

        },
        {
            title: '活动开始日期',
            dataIndex: 'gmtStart',
            key: 'gmtStart',
            render: function (text, record) {

                return hdglConfig.formatDate(record.gmtStart)

            }
        }, {
            title: '活动结束日期',
            dataIndex: 'gmtFinish',
            key: 'gmtFinish',
            render: function (text, record) {
                return hdglConfig.formatDate(record.gmtFinish)
            }
        }, {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: function (text, record) {
                return (
                    <div>
                        {
                            record.status == '1' && <span>启用</span>
                        }
                        {
                            record.status == '2' && <span>终止</span>
                        }
                        {
                            record.status == '3' && <span>过期</span>
                        }
                    </div>
                )
            }
        }, {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: function (text, record, index) {
                return (
                    <div>
                        <a href="javascript:;" onClick={() => {
                            lookFn(record)
                        }}>查看</a>
                        <span className="ant-divider" />
                        {
                            record.status == '1' && <a href="javascript:;" onClick={() => {
                                changeStatus(record)
                            }}>终止</a>
                        }
                        {
                            record.status == '2' && <a href="javascript:;" onClick={() => {
                                changeStatus(record)
                            }}>启用</a>
                        }
                        {record.activityType == 2 && <div style={{ display: "inline-block" }}> <span className="ant-divider" /> <a href="javascript:;" onClick={() => { editForm(record) }}>编辑</a></div>}

                    </div>

                )
            }
        }];

    function editForm(record) {

        dispatch({
            type: 'yxhdConfig/activityDetail',
            payload: { id: record.id },
        });

        dispatch({
            type: 'yxhdConfig/updatePayload',
            payload: { id: record.id },
        });

        dispatch(routerRedux.push({
            pathname: '/cpfjfedit',
            query: {

            },
        }));


    }

    // 点击查看调用接口,在modal显示对应信息
    function lookFn(record) {

        if (record.activityTemplate == 1) {

            dispatch({
                type: 'hdglConfig/activityDetail',
                payload: { id: record.id }
            })

            dispatch({
                type: 'hdglConfig/updatePayload',
                payload: { viewVisible: true }
            })

        } else {

            dispatch({
                type: 'yxhdConfig/activityDetail',
                payload: { id: record.id },
            });

            dispatch(routerRedux.push({
                pathname: '/cpfjfdetail',
                query: {

                },
            }));
        }


    }

    // 改变禁用或者启用状态
    function changeStatus(record) {
        let title = '', type = 0;
        if (record.status == '1') {
            title = '您确定要终止吗？';
            type = 2;
        } else if (record.status == '2') {
            title = '您确定要启用吗？';
            type = 1;
        }
        confirm({
            content: title,
            iconType: 'question-circle',
            onOk() {
                dispatch({
                    type: 'hdglConfig/activityOpenClose',
                    payload: { id: record.id, type: type }
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });



    }


    // 点击modal框的关闭,清空数据
    function hiddenViewModal() {
        dispatch({
            type: 'hdglConfig/updatePayload',
            payload: { viewVisible: false, hdlgListDetail: {} }
        })
    }

    return (
        <Header {...HeaderProps}>
            <div style={{ padding: "10px" }}>
                <HdglFilterComponent dispatch={dispatch} hdglConfig={hdglConfig} />
                <Table
                    style={{ marginTop: 10 }}
                    columns={columns}
                    pagination={pagination}
                    dataSource={hdglConfig.hdlgListData}
                    rowKey={record => record.id}
                    bordered />
            </div>

            {/*点击查看在modal中展示当前数据的详情*/}
            <Modal
                title="活动详情"
                visible={hdglConfig.viewVisible}
                onCancel={hiddenViewModal}
                footer={null}
                width={600}
            >
                <div style={{ maxHeight: 500, overflowY: "scroll" }}>
                    <Row style={{ padding: "8px 0", background: "#e3f2f7" }}>
                        <Col span="7" style={{
                            paddingRight: "10px",
                            marginRight: "10px",
                            textAlign: 'right',
                            borderRight: "1px solid #fff"
                        }}>活动名称:</Col>
                        <Col span="10">{hdglConfig.hdlgListDetail.id && hdglConfig.hdlgListDetail.name}</Col>
                    </Row>
                    <Row style={{ padding: "8px 0" }}>
                        <Col span="7" span="7" style={{
                            paddingRight: "10px",
                            marginRight: "10px",
                            textAlign: 'right',
                            borderRight: "1px solid #fff"
                        }}>活动日期:</Col>

                        {hdglConfig.hdlgListDetail.id &&
                            <Col span="16">
                                {hdglConfig.formatDate(hdglConfig.hdlgListDetail.gmtStart)} 至 {hdglConfig.formatDate(hdglConfig.hdlgListDetail.gmtFinish)}</Col>
                        }

                    </Row>
                    <Row style={{ padding: "8px 0", background: "#e3f2f7" }}>
                        <Col span="7" span="7" style={{
                            paddingRight: "10px",
                            marginRight: "10px",
                            textAlign: 'right',
                            borderRight: "1px solid #fff"
                        }}>活动类型:</Col>
                        {hdglConfig.hdlgListDetail.id &&
                            <div>
                                <Col span="16">{hdglConfig.hdlgListDetail.activityType == '1' && <span>注册赠送礼</span>}</Col>
                                <Col span="16">{hdglConfig.hdlgListDetail.activityType == '2' && <span>菜品返积分</span>}</Col>
                                <Col span="16">{hdglConfig.hdlgListDetail.activityType == '3' && <span>注册送券</span>}</Col>
                                <Col span="16">{hdglConfig.hdlgListDetail.activityType == '4' && <span>付费开卡送券</span>}</Col>
                            </div>
                        }

                    </Row>
                    <Row style={{ padding: "8px 0" }}>
                        <Col span="7" span="7" style={{
                            paddingRight: "10px",
                            marginRight: "10px",
                            textAlign: 'right',
                            borderRight: "1px solid #fff"
                        }}>优惠券名称:</Col>
                        <Col span="16">
                            {(hdglConfig.hdlgListDetail.id && hdglConfig.hdlgListDetail.couponNames && hdglConfig.hdlgListDetail.couponNames.length > 0) &&
                                hdglConfig.hdlgListDetail.couponNames.map(function (item, index) {
                                    return <span key={index} style={{
                                        display: "inline-block",
                                        border: "1px solid #e7e2e2",
                                        padding: "3px",
                                        borderRadius: "5px",
                                        background: "#fafafa",
                                        margin: "3px"
                                    }}>{item}</span>
                                })
                            }

                        </Col>
                    </Row>
                    <Row style={{ padding: "8px 0", background: "#e3f2f7" }}>
                        <Col span="7" span="7" style={{
                            paddingRight: "10px",
                            marginRight: "10px",
                            textAlign: 'right',
                            borderRight: "1px solid #fff"
                        }}>发放数量:</Col>
                        <Col span="16">{hdglConfig.hdlgListDetail.id && hdglConfig.hdlgListDetail.grantCount}张</Col>
                    </Row>


                    <Row style={{ padding: "8px 0" }}>
                        <Col span="7" span="7" style={{
                            paddingRight: "10px",
                            marginRight: "10px",
                            textAlign: 'right',
                            borderRight: "1px solid #fff"
                        }}>品牌:</Col>
                        <Col span="16">
                            {(hdglConfig.hdlgListDetail.id && hdglConfig.hdlgListDetail.brandNames && hdglConfig.hdlgListDetail.brandNames.length > 0) &&
                                hdglConfig.hdlgListDetail.brandNames.map(function (item, index) {
                                    return <span key={index} style={{
                                        padding: "3px",
                                        margin: "3px 5px"
                                    }}>{item}</span>
                                })
                            }

                        </Col>
                    </Row>

                    <Row style={{ padding: "8px 0", background: "#e3f2f7" }}>
                        <Col span="7" span="7" style={{
                            paddingRight: "10px",
                            marginRight: "10px",
                            textAlign: 'right',
                            borderRight: "1px solid #fff"
                        }}>适用用户:</Col>
                        <Col span="16">全部用户可用</Col>
                    </Row>
                    <Row style={{ padding: "8px 0" }}>
                        <Col span="7" span="7" style={{
                            paddingRight: "10px",
                            marginRight: "10px",
                            textAlign: 'right',
                            borderRight: "1px solid #fff"
                        }}>活动说明:</Col>
                        <Col span="16">{hdglConfig.hdlgListDetail.id && hdglConfig.hdlgListDetail.activityDesc}</Col>
                    </Row>
                </div>
            </Modal>
        </Header>
    );
}

HdglList.propTypes = {
    menu: PropTypes.object,
};


function mapStateToProps({ menu, hdglConfig }) {
    return { menu, hdglConfig, menu };
}

export default connect(mapStateToProps)(HdglList);

