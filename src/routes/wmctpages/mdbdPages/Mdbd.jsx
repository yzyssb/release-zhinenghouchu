import React, { PropTypes } from 'react';

import Header from '../../../components/Header';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Table } from 'antd';
import ShouquanModal from './ShouquanModal';
import JieBangModal from './JieBangModal';
import BdElmMenDianModal from "./BdElmMenDianModal";

import { Modal, Button, Row, Col, Popconfirm, message } from 'antd';
import { platform } from 'os';
const confirm = Modal.confirm;
import Tooltip from "antd/lib/tooltip"

// let releaseCounter = 0;
// let bindingCounter = 0;
// let messageCounter = 0;

function Mdbd({ menu, dispatch, mdbdConfig }) {
    const HeaderProps = {
        menu,
        dispatch,
    };




    // 授权按钮,点击授权获取门店映射地址,拿到iframe中的链接地址
    function shouquan(platformType) {

        if (platformType == 1) { //点击美团外卖授权
            dispatch({
                type: "mdbdConfig/getIframeStoreMap",
                payload: { platformType: platformType }
            })
            dispatch({
                type: "mdbdConfig/updatePayload",
                payload: { shouquanModalVisible: true }
            })
        } else if (platformType == 2) {  //点击饿了么授权
            dispatch({
                type: "mdbdConfig/getIframeStoreMap",
                payload: { platformType: platformType }
            })
            dispatch({
                type: "mdbdConfig/updatePayload",
                payload: { shouquanModalVisible: true }
            })

        }

    }

    // 点击查看信息跳转至查看信息页面
    function goLookInfo(platformType) {
        dispatch({
            type: "mdbdConfig/updatePayload",
            payload: { currentStoreInfo: {}, currentPlatformType: platformType }
        })

        dispatch(routerRedux.push({
            pathname: "/lookinfo",
            query: { platformType: platformType } //传入对应的平台类型
        }));
    }

    // 将状态改为休息或营业
    function changeRestOrBusiness(platformType, nowStatus) {
        dispatch({
            type: "mdbdConfig/storeOpenOrClose",
            payload: { platformType, isOpen: nowStatus == 1 ? 3 : 1 }
        })
    }

    //  点击取消授权
    function quxiaoshouquan(platformType) {
        if (platformType == 1) {  //美团取消授权
            dispatch({
                type: "mdbdConfig/jiebangStore",
                payload: { platformType }
            })
            // 展示解绑的modal
            dispatch({
                type: "mdbdConfig/updatePayload",
                payload: { jiebangModalVisible: true }
            })
        } else if (platformType == 2) {  //饿了么取消授权
            message.error("本系统不可以进行解绑，请前往饿了么后台进行解绑操作!");
        }

    }

    // 接收从iframe中传递出来的信息
    window.addEventListener('message', function (e) {
        console.log(e)
        if (e.origin == "https://open-erp.meituan.com") {
            var eventType = e.data.event;
            // console.log("[" + new Date().toString() + "][MeituanEvent]type=" + eventType);
            if (eventType == "msg-token") {
                // if (++bindingCounter == 1) {  //门店绑定成功
                updateState("已绑定"); //调用接口，更新状态
                // }
            } else if (eventType == "releaseBinding") {
                // if (++releaseCounter == 1) { //门店解绑成功
                updateState("已解绑"); //调用接口，更新状态
                // }
            }
        } else {
            // 饿了么用户点击同意授权后后端知道，但是前段不知道，后端返回了一段html文本，并附上<script>window.parent.postMessage(autoMessage,'*');</script>： 
            if (e && e.data && e.data.auth && e.data.auth == "success") {
                dispatch({
                    type: "mdbdConfig/updatePayload",
                    payload: {
                        shouquanModalVisible: false,  //关闭授权接口
                        shouquanPageUrl: "",
                        elmBdStoreVisible: true, //展示门店列表选择modal
                    }
                })

                // 调取饿了么可选门店列表
                dispatch({
                    type: "mdbdConfig/getElmModalStoreList",
                    payload: {}
                });
            } else if (e && e.data && e.data.auth && e.data.auth == "error") {  //用户点击了取消授权
                dispatch({
                    type: "mdbdConfig/updatePayload",
                    payload: {
                        shouquanModalVisible: false,  //关闭授权接口
                        shouquanPageUrl: "",
                    }
                })
            }
        }
    }, false);

    // 2秒钟之后重新获取门店状态
    function updateState(msg) {
        setTimeout(function () {
            if (msg == "已绑定") {
                // 关闭modal,重新调取状态列表数据
                console.log("进入了定时器---绑定成功")
                dispatch({
                    type: "mdbdConfig/updatePayload",
                    payload: {
                        shouquanPageUrl: "", //iframe中美团页面请求地址
                        shouquanModalVisible: false, //控制授权包裹iframe的modal的显示                       
                    }
                });

            } else if (msg == "已解绑") {
                console.log("进入了定时器---解绑成功")
                dispatch({
                    type: "mdbdConfig/updatePayload",
                    payload: {
                        jiebangPageUrl: "", //解绑时iframe中的请求地址
                        jiebangModalVisible: false, //控制解绑包裹iframe的modal的显示
                    }
                });
            }
            // 重新调取门店状态
            dispatch({
                type: 'mdbdConfig/getMenDianStatus',
                payload: {}
            });
        }, 3000)
    }

    return (
        <Header {...HeaderProps}>
            <div style={{ padding: "10px" }}>

                <h2 style={{ color: "#000", fontWeight: "700", marginBottom: "40px", background: "#f8f8f8", padding: "10px " }}>餐厅外卖授权</h2>

                <Row>
                    {
                        mdbdConfig.RestaurantStatusInfo.length > 0 &&
                        mdbdConfig.RestaurantStatusInfo.map(function (item, index) {

                            // 添加条件藏起来饿了么入口
                            // if(item.platformType == 1){
                            return <Col key={index} span="6" offset="1" style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "5px" }}>
                                <div>
                                    <div><span style={{ fontSize: "16px", paddingRight: "20px", fontWeight: "700" }}>
                                        {item.platformType == 1 && "美团外卖"}
                                        {item.platformType == 2 && "饿了么"}
                                        {item.platformType == 3 && "百度外卖"}
                                    </span>

                                        {item.status == 0 && <span style={{ color: 'orange' }}>未授权</span>}
                                        {item.status == 1 && <span style={{ color: 'green' }}>可配送</span>}
                                        {item.status == 3 && <span style={{ color: 'red' }}>餐厅休息</span>}
                                        <div style={{ paddingTop: "10px", overflow: "hidden" }}>
                                            {
                                                item.platformType == 1 && <img style={{ height: "180px" }} src="http://order-27aichi.oss-cn-beijing.aliyuncs.com/hestia/upload/2018-09-28/388f2903-ce5e-40f0-bd95-47bbf4cda516.png" />
                                            }
                                            {
                                                item.platformType == 2 && <img style={{ height: "180px" }} src="https://gss3.bdstatic.com/-Po3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=9273c93d53ee3d6d22c680cd7b2d0a1f/d0c8a786c9177f3ea44726977acf3bc79f3d563d.jpg" />
                                            }


                                        </div>
                                        <div style={{ padding: "20px 0 0 0" }}>

                                            {/* 饿了么授权 --手动模式下,不允许点击授权按钮*/}
                                            {(item.platformType == 1 && item.status == 0 && mdbdConfig.checked == 0) && <Tooltip placement="topLeft" title="美团授权请联系美团业务人员开通"><Button type="primary" disabled onClick={() => { shouquan(item.platformType) }}>授权</Button> </Tooltip>}

                                            {/* 饿了么授权 --线上模式下*/}
                                            {(item.platformType == 1 && item.status == 0 && mdbdConfig.checked == 1) && <Button type="primary" onClick={() => { shouquan(item.platformType) }}>授权</Button>}

                                            {/* 百度授权 */}
                                            {(item.platformType == 2 && item.status == 0) && <Button type="primary" onClick={() => { shouquan(item.platformType) }}>授权</Button>}

                                            {/* 外卖迭代之前的授权展示条件是一样的，如下 */}
                                            {/* {item.status == 0 && <Button type="primary" onClick={() => { shouquan(item.platformType) }}>授权</Button>} */}

                                            {item.status == 1 && <Button type="primary" onClick={() => { changeRestOrBusiness(item.platformType, item.status) }}>休息</Button>}
                                            {item.status == 3 && <Button type="primary" onClick={() => { changeRestOrBusiness(item.platformType, item.status) }}>营业</Button>}

                                            {/* 未授权时隐藏查看信息按钮 */}
                                            {
                                                item.status != 0 &&
                                                <a href="javascript:;" style={{ border: "none", margin: "0 20px", textDecoration: "none" }} onClick={() => { goLookInfo(item.platformType) }}>查看信息</ a>
                                            }

                                            {/* 未授权时隐藏解除授权按钮 */}
                                            {
                                                item.status != 0 &&
                                                <a href="javascript:;" style={{ border: "none", textDecoration: "none" }} onClick={() => { quxiaoshouquan(item.platformType) }}>
                                                    解除授权</ a>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </Col>

                            // }

                        })
                    }

                </Row>

                <ShouquanModal dispatch={dispatch} mdbdConfig={mdbdConfig} />
                <JieBangModal dispatch={dispatch} mdbdConfig={mdbdConfig} />

                <BdElmMenDianModal dispatch={dispatch} mdbdConfig={mdbdConfig} />

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

