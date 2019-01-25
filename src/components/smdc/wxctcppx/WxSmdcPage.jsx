import React, { PropTypes } from 'react';
import { connect } from 'dva';
import Table from 'antd/lib/table';
import Modal from 'antd/lib/modal';
import Button from 'antd/lib/button';
import Radio from 'antd/lib/radio';
const RadioGroup = Radio.Group;
import UpLoadImage from '../../../components/base/common/UpLoadImage';
import Input from 'antd/lib/input';
import Tabs from 'antd/lib/tabs';
const TabPane = Tabs.TabPane;
import StartDinnerPage from '../../../components/smdc/smdcsz/ympz/StartDinnerPage';
import EvaluatePage from '../../../components/smdc/smdcsz/ympz/EvaluatePage';
import WaiMaiDinnerPage from '../../../components/smdc/smdcsz/ympz/WaiMaiDinnerPage';
import WaidaiDinnerPage from '../../../components/smdc/smdcsz/ympz/WaidaiDinnerPage';
const WxctcppxPage = ({
                          deskQrCode, dispatch,
                      }) => {


    //处理商品图片
    function onImgChange(e) {

        if (e.previewImage && e.previewImage.length > 0 && e.previewImage[0].response && e.previewImage[0].response.data) {

            dispatch({type: 'deskQrCode/updatePayload', payload: {coverImageUrl:  e.previewImage[0].response.data}});
        }

    }

    function onImgRemove(e) {

        dispatch({type: 'deskQrCode/updatePayload', payload: {coverImageUrl: ''}});

    }

    const CpxxProps = {

        deskQrCode,
        dispatch,
    }

    function callback(key){

        dispatch({type: 'deskQrCode/updatePayload', payload: {tabkey: key}});
        if (key == '1'){
            dispatch({type: 'deskQrCode/updatePayload', payload: {type: '0'}});
            dispatch({type: 'deskQrCode/getWXSettings',payload: {}});
        }else if (key == '3'){
            dispatch({type: 'deskQrCode/updatePayload', payload: {type: '2'}});
            dispatch({type: 'deskQrCode/getWXSettings',payload: {}});
        }else if (key == '4'){
            dispatch({type: 'deskQrCode/updatePayload', payload: {type: '1'}});
            dispatch({type: 'deskQrCode/getWXSettings',payload: {}});
        }
    }

    return (
        <div style={{marginLeft:'60px',marginTop:30}}>
            <Tabs onChange={callback} activeKey = {deskQrCode.tabkey} >
                <TabPane tab="开始点餐推送" key="1">
                    <StartDinnerPage {...CpxxProps}></StartDinnerPage>
                </TabPane>
                <TabPane tab="评价推送" key="2">
                    <EvaluatePage {...CpxxProps}></EvaluatePage>
                </TabPane>
                <TabPane tab="自外卖推送" key="3">
                    <WaiMaiDinnerPage {...CpxxProps}></WaiMaiDinnerPage>
                </TabPane>
                <TabPane tab="外带点餐推送" key="4">
                    <WaidaiDinnerPage {...CpxxProps}></WaidaiDinnerPage>
                </TabPane>
            </Tabs>
        </div>
    );
};

WxctcppxPage.propTypes = {

};

function mapStateToProps({ deskQrCode }) {
    return { deskQrCode };
}

export default connect(mapStateToProps)(WxctcppxPage);