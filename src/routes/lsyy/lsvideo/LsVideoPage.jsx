import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import UploadVideoFile from '../../../components/base/common/UploadVideoFile';
import Tabs from 'antd/lib/tabs';


const TabPane = Tabs.TabPane;

function CdglPage ({menu,dispatch}) {



    const HeaderProps = {
        menu,
        dispatch,
    };

    function onImgChange(e){

        if(e.previewImage &&e.previewImage.length>0 && e.previewImage[0].response){

            if (!(e.previewImage[0].response.code == 200)) {
                alert(e.previewImage[0].response.msg);
            }else{
                alert('导入成功');

            }


        }


    }


    function onImgRemove(e){


    }

    return(
        <Header {...HeaderProps}>

            视频文件管理

            <div>
                <div>
                    <span>视频文件上传：</span>

                    <UploadVideoFile  onChange= {(e)=>{onImgChange(e)}} maxCount = {1} info={"添加文件"} onRemove = {(e)=>{onImgRemove(e)}} > </UploadVideoFile>
                </div>
                <div>
                    <span>
                        视频地址：{}
                    </span>

                </div>
            </div>

        </Header>
    );

}

CdglPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,}) {
    return { menu,};
}

export default connect(mapStateToProps)(CdglPage);


