import React, { PropTypes } from 'react';
import UpLoadImage from '../../../../components/base/common/UpLoadPicture';
import styles from './WxSetting.less'

const WxSetting = ({dispatch,turnWxUrl,showAgree,showRemake,pageSettingRoute,wxContent}) => {



    function agree() {
        window.open(turnWxUrl);

    }

    function remake() {
        dispatch({
            type:'pageSettingRoute/getWX',
            payload: {

            },
        });
    }

    function cancle() {
        dispatch({
            type:'pageSettingRoute/cancleWx',
            payload: {

            },
        });

    }

    return (<div>

        <div className={styles.topBack}>
            <div className={styles.uiLabel}>微信授权</div>
            <div className={styles.uiLabel}>1.把微信公众号授权给路上微信第三方平台</div>
            <div className={styles.uiLabel}>2.配置后用户扫码必须关注服务号</div>
            <div className={styles.uiLabel}>3.该功能只支持通过微信认证的服务号</div>
            <div className={styles.uiLabel}>{wxContent}</div>
        </div>

        {/*显示是block 隐藏式none*/}
        <div style={{display:showAgree}}>
            <button className={styles.aggree} onClick={agree}>同意授权</button>
        </div>

        <div style={{display:showRemake}}>
            <button className={styles.aggree} onClick={remake}>重新授权</button>
            <button className={styles.aggree} onClick={cancle}>取消授权</button>
        </div>


        {/*<div className={styles.sendImg}>*/}
            {/*<UpLoadImage  maxCount = {1} info={"添加图片"}> </UpLoadImage>*/}
        {/*</div>*/}
        {/*<button className={styles.send}>上传</button>*/}

    </div>);
};

WxSetting.propTypes = {

};

export default WxSetting;