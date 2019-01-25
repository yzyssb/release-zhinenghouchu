import React, {PropTypes} from 'react';
import Header from '../../components/Header';
import {connect} from 'dva';
import Tabs from 'antd/lib/tabs';
import CzgzPage from "./hyandhyksz/czgz/CzgzPage";
import HydjPage from "./hyandhyksz/hydj/HydjPage";
import TksqPage from "./hyandhyksz/tksq/TksqPage";
import TkshPage from "./hyandhyksz/tksh/TkshPage";
import JfgzPage from "./hyandhyksz/jfgz/JfgzPage";

const TabPane = Tabs.TabPane;

function Hyandhyksz({menu, dispatch, hysz}) {


    const HeaderProps = {
        menu,
        dispatch,
    };


    const HyszProps = {
        hysz,
        dispatch,
    };

    function callback(key) {

        if (key == "1") {
            //积分规则列表
            dispatch({
                type: 'jfgz/listScoreRule',
                payload: {},
            });
            //查看门店列表，并保存起来,在添加积分规则的时候需要
              dispatch({
                type: 'jfgz/queryStoreList',
                payload: {},
            });
              //查看会员等级列表，并保存起来，在添加积分规则的时候需要
              dispatch({
                type: 'jfgz/listVipLevel',
                payload: {},
            });

        } else if (key == "3") {
            dispatch({
                type: 'jfgz/listVipLevel',
                payload: {},
            });
        }
        else if (key == "4") {

        }
        else if (key == "5") {
            dispatch({
                type: 'jfgz/listOpBackCard',
                payload: {},
            });
        }
    }

    return (
        <Header {...HeaderProps}>

            <div>
                <Tabs onChange={callback}>
                    <TabPane tab="积分规则" key="1">
                        <JfgzPage {...HeaderProps}></JfgzPage>
                    </TabPane>
                    {/*<TabPane tab="储值规则" key="2">*/}
                    {/*<CzgzPage {...HeaderProps}></CzgzPage>*/}
                    {/*</TabPane>*/}
                    <TabPane tab="会员等级" key="3">
                        <HydjPage {...HeaderProps}></HydjPage>
                    </TabPane>
                    <TabPane tab="退卡申请" key="4">
                        <TksqPage {...HeaderProps}></TksqPage>
                    </TabPane>
                    <TabPane tab="退卡审核" key="5">
                        <TkshPage {...HeaderProps}></TkshPage>
                    </TabPane>
                </Tabs>
            </div>

        </Header>
    );

}

Hyandhyksz.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu, hysz}) {
    return {menu, hysz};
}

export default connect(mapStateToProps)(Hyandhyksz);

