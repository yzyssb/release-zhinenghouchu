import React, { PropTypes } from 'react';
import styles from './DeskCodeSetting.less';
import Form from 'antd/lib/form';
import {config} from '../../../../services/HttpService';
import Button from 'antd/lib/button';
const FormItem = Form.Item;
import message from 'antd/lib/message';


const formItemLayout = {
    labelCol: {
        span: 5,
    },
    wrapperCol: {
        span: 16,
    },
};

const CodeSetting = ({dispatch,wxState,wxToken,deskQrCode}) => {


    function getUserToken() {

        const userStatus = myApp._store.getState().account.token;

        return userStatus;

    }

    function getCompanyId() {

        const userStatus = myApp._store.getState().account.companyId;

        return userStatus;

    }


    function getRestaurantId() {

        const userStatus = myApp._store.getState().menu.currentRestaurantId;

        return userStatus;

    }

    function downloadQrCode() {

        var prefixUrl;

        const host = window.location.protocol + '//' + window.location.host;

        if (host == 'http://localhost:8989') {

            prefixUrl = "http://dev.saas.27aichi.cn/";

        } else {

            prefixUrl = window.location.protocol + '//' + window.location.host + '/';

        }

        if (wxState == 1){

            window.location = prefixUrl + 'open/weixin/qrcodes.zip' + `?companyId=${getCompanyId()}&restaurantId=${getRestaurantId()}&t=${wxToken}`;

        } else{
            message.warning('公众号未授权')
        }

    }

    function downloadTaCode(){

        if (deskQrCode.wxState == 1){

            dispatch({
                type: 'deskQrCode/updatePayload',
                payload:{modalVisible:true}
            });

            dispatch({
                type: 'deskQrCode/getTaImg',
                payload:{}
            });

        } else{
            message.warning('公众号未授权')
        }
    }

    return (<div>

        {/*<div className={styles.chooseForm}>*/}
            {/*<form action="" method="get">*/}
                {/*二维码类型<br /><br />*/}
                {/*<label><input name="Fruit" type="radio" value="" />公众号二维码 </label>*/}
                {/*<label><input name="Fruit" type="radio" value="" />非公众号二维码 </label>*/}
            {/*</form>*/}
        {/*</div>*/}


        <Button onClick={downloadQrCode} style={{marginLeft: 20}}>批量导出</Button>

        <Button type = 'primary' onClick={downloadTaCode} style={{marginRight: 20,float:'right'}}>查看门店外带二维码</Button>


    </div>);
};



CodeSetting.propTypes = {

};

export default CodeSetting;