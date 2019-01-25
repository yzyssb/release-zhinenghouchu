import React, {PropTypes} from 'react';
import {connect} from 'dva';
import Tabs from 'antd/lib/tabs';
import Header from "../../../components/Header";
import JfglPage from "../hyandhyksz/jfgz/JfgzPage";
import XfmxPage from "./xfmx/XfmxPage";
import GkmxPage from "./gkmx/GkmxPage";
import JfqsPage from "./jfqs/JfqsPage";

const TabPane = Tabs.TabPane;

function HymxPage({menu, dispatch, hymx}) {


    const HeaderProps = {
        menu,
        dispatch,
    };


    const HyszProps = {
        hymx,
        dispatch,
    };

    function callback(key) {
        hymx.searchWhere={
            regStartTime: '',
            regEndTime: '',
            vipStartTime: '',
            vipEndTime: '',
            isBackCard: '0',
            cardCode: '',
            mobile: '',
            nickname: '',
            storeName: '',
            startDate: '',
            endDate: '',
            startTime:'',
            endTime:'',
            page:'',
            rows:'',
        }
        if (key == "1") {
            dispatch({
                type: 'hymx/listConsume',
                payload: {},
            });
        } else if (key == "3") {
            dispatch({
                type: 'hymx/VipCardList',
                payload: {},
            });
        }
        else if (key == "4") {
            dispatch({
                type: 'hymx/scoreList',
                payload: {},
            });
        }

    }

    return (
        <Header {...HeaderProps}>

            <div>
                <Tabs onChange={callback}>
                    <TabPane tab="消费明细列表" key="1">
                        <XfmxPage {...HeaderProps}></XfmxPage>
                    </TabPane>
                    {/*<TabPane tab="储值明细列表" key="2">*/}
                    {/*<CzmxPage {...HeaderProps}></CzmxPage>*/}
                    {/*</TabPane>*/}
                    <TabPane tab="购卡明细" key="3">
                        <GkmxPage {...HeaderProps}></GkmxPage>
                    </TabPane>
                    <TabPane tab="积分清算" key="4">
                        <JfqsPage {...HeaderProps}></JfqsPage>
                    </TabPane>
                </Tabs>
            </div>

        </Header>
    );

}

HymxPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu, hymx}) {
    return {menu, hymx};
}

export default connect(mapStateToProps)(HymxPage);

