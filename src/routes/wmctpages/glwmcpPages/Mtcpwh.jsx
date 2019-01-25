import React, { PropTypes } from 'react';

import Header from '../../../components/Header';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Table } from 'antd';
import { Modal, Button, Row, Col, Pagination } from 'antd';
import moment from "moment";
import Tabs from 'antd/lib/tabs';
import message from 'antd/lib/message';


const TabPane = Tabs.TabPane;
function Mtcpwh({ menu, dispatch, glwmcpConfig }) {
    const HeaderProps = {
        menu,
        dispatch,
    };

    // 接收与传递iframe消息
    window.addEventListener('message', function (e) {
        if (e.origin == "https://open-erp.meituan.com") {
            var eventType = e.data.event;
            console.log("[" + new Date().toString() + "][MeituanEvent]type=" + eventType);
            if (eventType == "getErpDishData") {
                document.getElementById('child2').contentWindow.postMessage({
                    event: 'erpDishData', // postMessage消息名
                    value: {
                        dishes: glwmcpConfig.erpFoodList // 以JSON格式发送的数据
                    }
                }, "*");
            } else if (eventType == "setWaimaiDish") {
                //当用户点击完成时（按钮被我隐藏了，修改 iframe父级盒子的高度即可看到），美团会自动检测哪些菜品没有关联，让用户新建外卖菜品更新到erp，或者在“关联菜品”页面更新至收银系统（erp）
                //  这一步产品暂时不做了
                console.log(e.data.value)
                // 取出未关联的菜品上传到erp,调用接口
            }
        }
    }, false);


    return (
        <div style={{ width: "100%", height: window.innerHeight - 220 + "px" }}>
            <div style={{ textAlign: "right"}}> <a href="https://waimaie.meituan.com/#/v2/shop/productManage" title="脚本之家" target="_blank">去维护外卖菜品</a></div>
            <div style={{ width: "100%", height: window.innerHeight - 220 + 60 + "px" }}>
                <iframe id="child2" frameBorder={0} width="100%" height="100%" scrolling="yes" src={glwmcpConfig.
                    meituanYingSheUrl}></iframe>}
           </div>
        </div>
    );
}

Mtcpwh.propTypes = {
    menu: PropTypes.object,
};


function mapStateToProps({ menu, glwmcpConfig }) {
    return { menu, glwmcpConfig, menu };
}

export default connect(mapStateToProps)(Mtcpwh);

