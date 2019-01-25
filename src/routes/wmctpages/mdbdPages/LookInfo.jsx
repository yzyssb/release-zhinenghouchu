import React, { PropTypes } from 'react';

import Header from '../../../components/Header';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import LookInfoChangeTimeModal from "./LookInfoChangeTimeModal"; //引入查看信息组件
import { Table } from 'antd';
import { Modal, Button, Row, Col } from 'antd';
import moment from 'moment';

function Mdbd({ menu, dispatch, mdbdConfig }) {
    const HeaderProps = {
        menu,
        dispatch,
    };

    // 返回门店绑定页面
    function goBack() {
        dispatch(routerRedux.push({
            pathname: "/mdbd",
            query: {}
        }));

        // 清空当前门店信息
        dispatch({
            type: "mdbdConfig/updatePayload",
            payload: { currentStoreInfo: {} }
        })
    }

    // 点击修改时间展示修改营业时间modal
    function showChangeTimeMOdal() {
        dispatch({
            type: "mdbdConfig/updatePayload",
            payload: { LookInfoChangeTimeModalVisible: true }
        })
    }


    return (
        <Header {...HeaderProps}>
            <div style={{ padding: "10px" }}>
                <Row style={{ fontSize: "14px", lineHeight: "40px" }}>
                    <Col style={{ textAlign: "right" }} span="6">门店名称:</Col>
                    <Col style={{ textIndent: "10px", fontWeight: 700 }} span="14">{mdbdConfig.currentStoreInfo.name}</Col>
                </Row>

                <Row style={{ fontSize: "14px", lineHeight: "40px" }}>
                    <Col style={{ textAlign: "right" }} span="6">营业时间:</Col>
                    <Col style={{ textIndent: "10px", fontWeight: 700 }} span="14">
                        {mdbdConfig.currentStoreInfo.openTime && mdbdConfig.currentStoreInfo.openTime.length > 0 &&
                            mdbdConfig.currentStoreInfo.openTime.map(function (item, index) {
                                return item.startTime + "-" + item.endTime + "   "
                            })
                        }
                        <Button style={{ margin: "0 20px" }} type="primary" onClick={showChangeTimeMOdal}>修改时间</Button>
                    </Col>
                </Row>
                <Row style={{ fontSize: "14px", lineHeight: "40px" }}>
                    <Col style={{ textAlign: "right" }} span="6">门店公告信息:</Col>
                    <Col style={{ textIndent: "10px", fontWeight: 700 }} span="14">{mdbdConfig.currentStoreInfo.noticeInfo}</Col>
                </Row>
                <Row style={{ fontSize: "14px", lineHeight: "40px" }}>
                    <Col style={{ textAlign: "right" }} span="6">门店地址:</Col>
                    <Col style={{ textIndent: "10px", fontWeight: 700 }} span="14">{mdbdConfig.currentStoreInfo.address}</Col>
                </Row>
                <Row style={{ fontSize: "14px", lineHeight: "40px" }}>
                    <Col style={{ textAlign: "right" }} span="6">
                        {mdbdConfig.currentPlatformType == 1 && "美团"}
                        {mdbdConfig.currentPlatformType == 2 && "饿了么"}
                        品类名称:</Col>
                    <Col style={{ textIndent: "10px", fontWeight: 700 }} span="14">{mdbdConfig.currentStoreInfo.tagName}</Col>
                </Row>
                <Row style={{ fontSize: "14px", lineHeight: "40px" }}>
                    <Col style={{ textAlign: "right" }} span="6">门店经纬度:</Col>
                    <Col style={{ textIndent: "10px", fontWeight: 700 }} span="14">
                        经度： {mdbdConfig.currentStoreInfo.latitude}  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                       维度： {mdbdConfig.currentStoreInfo.longitude}

                    </Col>
                </Row>
                <Row style={{ fontSize: "14px", lineHeight: "40px" }}>
                    <Col style={{ textAlign: "right" }} span="6">门店电话:</Col>
                    <Col style={{ textIndent: "10px", fontWeight: 700 }} span="14">{mdbdConfig.currentStoreInfo.phone}</Col>
                </Row>
                <Row style={{ fontSize: "14px", lineHeight: "40px" }}>
                    <Col style={{ textAlign: "right" }} span="6">门店图片url:</Col>
                    <Col style={{ textIndent: "10px", fontWeight: 700 }} span="14">{mdbdConfig.currentStoreInfo.pictureUrl}</Col>
                </Row>
                {/* 饿了么没有相应字段--隐藏此列,美团展示*/}
                {mdbdConfig.currentPlatformType == 1 &&
                    <Row style={{ fontSize: "14px", lineHeight: "40px" }}>
                        <Col style={{ textAlign: "right" }} span="6">是否在线:</Col>
                        <Col style={{ textIndent: "10px", fontWeight: 700 }} span="14">
                            {mdbdConfig.currentStoreInfo.isOnline == 1 && "上线"}
                            {mdbdConfig.currentStoreInfo.isOnline == 0 && "下线"}
                        </Col>
                    </Row>}

                <Row style={{ fontSize: "14px", lineHeight: "40px" }}>
                    <Col style={{ textAlign: "right" }} span="6">配送费:</Col>
                    <Col style={{ textIndent: "10px", fontWeight: 700 }} span="14">{mdbdConfig.currentStoreInfo.shippingFee}元</Col>
                </Row>
                <Row style={{ fontSize: "14px", lineHeight: "40px" }}>
                    <Col style={{ textAlign: "right" }} span="6">门店是否支持发票:</Col>
                    <Col style={{ textIndent: "10px", fontWeight: 700 }} span="14">
                        {mdbdConfig.currentStoreInfo.invoiceSupport == 1 && "可开发票"}
                        {mdbdConfig.currentStoreInfo.invoiceSupport == 0 && "不支持"}
                    </Col>
                </Row>

                <Row style={{ fontSize: "14px", lineHeight: "40px" }}>
                    <Col style={{ textAlign: "right" }} span="6">门店支持开发票的最小订单价:</Col>
                    <Col style={{ textIndent: "10px", fontWeight: 700 }} span="14">{mdbdConfig.currentStoreInfo.invoiceMinPrice}元</Col>
                </Row>

                {/* 饿了么没有相应字段--隐藏此列,美团展示*/}
                {mdbdConfig.currentPlatformType == 1 &&
                    <Row style={{ fontSize: "14px", lineHeight: "40px" }}>
                        <Col style={{ textAlign: "right" }} span="6">发票相关说明:</Col>
                        <Col style={{ textIndent: "10px", fontWeight: 700 }} span="14">{mdbdConfig.currentStoreInfo.invoiceDescription}</Col>
                    </Row>
                }

                {/* 饿了么没有相应字段--隐藏此列,美团展示*/}
                {mdbdConfig.currentPlatformType == 1 &&
                    <Row style={{ fontSize: "14px", lineHeight: "40px" }}>
                        <Col style={{ textAlign: "right" }} span="6">是否支持营业时间范围外预下单:</Col>
                        <Col style={{ textIndent: "10px", fontWeight: 700 }} span="14">
                            {mdbdConfig.currentStoreInfo.preBook == 1 && "支持"}
                            {mdbdConfig.currentStoreInfo.preBook == 0 && "不支持"}
                        </Col>
                    </Row>

                }



                {/* 饿了么没有相应字段--隐藏此列,美团展示*/}
                {mdbdConfig.currentPlatformType == 1 &&
                    <Row style={{ fontSize: "14px", lineHeight: "40px" }}>
                        <Col style={{ textAlign: "right" }} span="6">预下单最小日期:</Col>
                        <Col style={{ textIndent: "10px", fontWeight: 700 }} span="14">
                            提前 {mdbdConfig.currentStoreInfo.preBookMinDays} 天下单
                 </Col>
                    </Row>
                }

                <Row style={{ fontSize: "14px", lineHeight: "40px" }}>
                    <Col style={{ textAlign: "right" }} span="6">预下单最大日期:</Col>
                    <Col style={{ textIndent: "10px", fontWeight: 700 }} span="14">
                        提前 {mdbdConfig.currentStoreInfo.preBookMaxDays} 天下单
                    </Col>
                </Row>

                {/* 饿了么没有相应字段--隐藏此列,美团展示*/}
                {mdbdConfig.currentPlatformType == 1 &&
                    <Row style={{ fontSize: "14px", lineHeight: "40px" }}>
                        <Col style={{ textAlign: "right" }} span="6">是否支持营业时间内预下单:</Col>
                        <Col style={{ textIndent: "10px", fontWeight: 700 }} span="14">
                            {mdbdConfig.currentStoreInfo.timeSelect == 1 && "支持"}
                            {mdbdConfig.currentStoreInfo.timeSelect == 0 && "不支持"}
                        </Col>
                    </Row>
                }

                <LookInfoChangeTimeModal dispatch={dispatch} mdbdConfig={mdbdConfig} />
                <div style={{ textAlign: "right" }}>  <Button type="default" icon="rollback" onClick={goBack}>返回门店绑定页面</Button></div>
            </div>
        </Header>
    );
}

Mdbd.propTypes = {
    menu: PropTypes.object,
};


function mapStateToProps({ menu, mdbdConfig }) {
    return { menu, mdbdConfig, menu };
}

export default connect(mapStateToProps)(Mdbd);

