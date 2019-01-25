import React, { PropTypes } from 'react';

import Header from '../../../components/Header';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Table } from 'antd';
import { Modal, Button, Row, Col, Pagination } from 'antd';
import moment from "moment";
import Tabs from 'antd/lib/tabs';
import message from 'antd/lib/message';
import Mtcpwh from "./Mtcpwh";
import Elmcpwh from "./Elmcpwh";

const TabPane = Tabs.TabPane;
function GlwmcpMain({ menu, dispatch, glwmcpConfig }) {
    const HeaderProps = {
        menu,
        dispatch,
    };


    // 切换tab
    function callback(key) {
        dispatch({
            type: "glwmcpConfig/updatePayload",
            payload: {
                targetTab: key, //展示第几个tab
                meituanYingSheUrl: "", //存储美团映射Url地址
                erpFoodList: [], //存储erp菜品地址
            }
        });
        if (key == "1") { //切换到美团页签
            dispatch({
                type: "glwmcpConfig/getMeiTuanYingShe",
                payload: {}
            });
            dispatch({
                type: "glwmcpConfig/getErpFoodList",
                payload: { platformType: key }
            });
        } else if (key == "2") { //切换到饿了么页签
            dispatch({
                type: "glwmcpConfig/getElmFoodList",
                payload: {}
            });

            dispatch({
                type: "glwmcpConfig/getErpFoodList",
                payload: { platformType: key }
            });

        }
    }


    return (
        <Header {...HeaderProps}>
            <div style={{ padding: "10px" }}>
                <Tabs activeKey={glwmcpConfig.targetTab} onChange={callback}>
                    <TabPane tab="美团外卖" key="1">
                        <Mtcpwh dispatch={dispatch} glwmcpConfig={glwmcpConfig} />
                    </TabPane>

                    {/* 藏起来饿了么页签 */}
                    <TabPane tab="饿了么外卖" key="2">
                        <Elmcpwh dispatch={dispatch} glwmcpConfig={glwmcpConfig} />
                    </TabPane>
                </Tabs>
               </div>

        </Header>
    );
}

GlwmcpMain.propTypes = {
    menu: PropTypes.object,
};


function mapStateToProps({ menu, glwmcpConfig }) {
    return { menu, glwmcpConfig, menu };
}

export default connect(mapStateToProps)(GlwmcpMain);

