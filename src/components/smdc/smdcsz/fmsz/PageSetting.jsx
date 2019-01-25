import React, { PropTypes } from 'react';
import styles from './PageSetting.less';
import UpLoadImage from '../../../../components/base/common/UpLoadPicture';
import Button from 'antd/lib/button';


const PageSetting = ({pageSettingRoute,dispatch,showImg}) => {


    function onImgRemove(e) {

        dispatch({type: 'pageSettingRoute/updatePayload',payload:{imgurl:''}});
        dispatch({type: 'pageSettingRoute/sendImg',payload:{}});

    };

    function onImgChange(e) {

        if(e.previewImage &&e.previewImage.length>0 && e.previewImage[0].response && e.previewImage[0].response.data){
            dispatch({type:'pageSettingRoute/updatePayload',payload:{imgurl:e.previewImage[0].response.data}});

        }
    };

    function send() {
        dispatch({type: 'pageSettingRoute/sendImg',payload:{}});
    }

    return (<div>

                {/*<img className={styles.uiImg} src={"http://img.zcool.cn/community/0142135541fe180000019ae9b8cf86.jpg@1280w_1l_2o_100sh.png"}/>*/}
                {/*<img className={styles.backImg} src={"http://img.zcool.cn/community/0142135541fe180000019ae9b8cf86.jpg@1280w_1l_2o_100sh.png"}/>*/}
                {/*<button className={styles.chooseImg}>选择图片</button>*/}
                {/*<button className={styles.deleteImg}>删除图片</button>*/}

                <div className={styles.sendImg}>
                    <UpLoadImage defaultUrl={showImg} maxCount = {1} onChange= {(e)=>{onImgChange(e)}} info={"添加图片"} onRemove = {(e)=>{onImgRemove(e)}}> </UpLoadImage>
                </div>

                <div>
                    <Button type="primary"  onClick={send}>上传到微餐厅</Button>
                </div>



    </div>);



};





PageSetting.propTypes = {

};

export default PageSetting;