import React, { PropTypes } from 'react';
import styles from './StartDinnerPage.less';
import UpLoadImage from '../../../../components/base/common/UpLoadImage';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';


const PageSetting = ({deskQrCode,dispatch}) => {


    //处理商品图片
    function onImgChange(e) {

        if (e.previewImage && e.previewImage.length > 0 && e.previewImage[0].response && e.previewImage[0].response.data) {

            dispatch({type: 'deskQrCode/updatePayload', payload: {coverImageUrl:  e.previewImage[0].response.data}});
        }

    }

    function onImgRemove(e) {

        dispatch({type: 'deskQrCode/updatePayload', payload: {coverImageUrl: ''}});

    }

    return (
        <div>

            <div style={{marginTop:'40px',overflow:'hidden'}} >
                <div style={{float:'left'}}>

                    <span >图片尺寸:696x390</span>
                    <div  style={{marginTop:15}}>
                        <UpLoadImage  defaultUrl={deskQrCode.coverImageUrl} onChange={(e) => {onImgChange(e)}} maxCount={1} info={"添加图片"} onRemove={(e) => {onImgRemove(e)}}> </UpLoadImage>
                    </div>
                </div>

                <div style={{float:'left',marginLeft:'60px'}}>



                    <span style={{display:'block'}}>标题:</span>

                    <Input id="wxsettingsTitleInput"  style = {{width:'400px',display:'block',marginTop:'10px' }} onChange={(e)=>{
                        dispatch({type: 'deskQrCode/updatePayload', payload: {titleTemplate: e.target.value}});

                    }} value = {deskQrCode.titleTemplate}></Input>

                    <div style={{marginTop:10,marginLeft:50}}>

                        <a onClick = {()=>{

                            var ctrl = document.getElementById("wxsettingsTitleInput");

                            if (ctrl.selectionStart || ctrl.selectionStart == '0')
                            {
                                var currentPos = ctrl.selectionStart;

                                var newText =  '';

                                let startText = deskQrCode.titleTemplate.substring(0,currentPos);
                                let endText = deskQrCode.titleTemplate.substring(currentPos);
                                newText = startText + '{门店名称}' + endText;

                                dispatch({type: 'deskQrCode/updatePayload', payload: {titleTemplate: newText}});

                            }

                        }}>门店名称</a>

                        {/*<a style={{marginLeft:30}} onClick = {()=>{*/}

                            {/*var ctrl = document.getElementById("wxsettingsTitleInput");*/}

                            {/*if (ctrl.selectionStart || ctrl.selectionStart == '0')*/}
                            {/*{*/}
                                {/*var currentPos = ctrl.selectionStart;*/}

                                {/*var newText =  '';*/}

                                {/*let startText = deskQrCode.titleTemplate.substring(0,currentPos);*/}
                                {/*let endText = deskQrCode.titleTemplate.substring(currentPos);*/}
                                {/*newText = startText + '{桌号}' + endText;*/}

                                {/*dispatch({type: 'deskQrCode/updatePayload', payload: {titleTemplate: newText}});*/}

                            {/*}*/}



                        {/*}}>桌号</a>*/}
                    </div>

                    <span style={{display:'block',marginTop:30}}>文字内容:</span>

                    <Input  id="wxsettingsInput" style = {{width:'400px',display:'block',marginTop:'10px' }} onChange={(e)=> {
                        dispatch({type: 'deskQrCode/updatePayload', payload: {descTemplate: e.target.value}});
                    }} value = {deskQrCode.descTemplate}></Input>

                    <div style={{marginTop:10,marginLeft:50}}>

                        <a onClick = {()=>{

                            var ctrl = document.getElementById("wxsettingsInput");

                            if (ctrl.selectionStart || ctrl.selectionStart == '0')
                            {
                                var currentPos = ctrl.selectionStart;

                                var newText =  '';

                                let startText = deskQrCode.descTemplate.substring(0,currentPos);
                                let endText = deskQrCode.descTemplate.substring(currentPos);
                                newText = startText + '{门店名称}' + endText;

                                dispatch({type: 'deskQrCode/updatePayload', payload: {descTemplate: newText}});

                            }

                        }}>门店名称</a>

                        {/*<a style={{marginLeft:30}} onClick = {()=>{*/}
                        
                            {/*var ctrl = document.getElementById("wxsettingsInput");*/}
                        
                            {/*if (ctrl.selectionStart || ctrl.selectionStart == '0')*/}
                            {/*{*/}
                                {/*var currentPos = ctrl.selectionStart;*/}
                        
                                {/*var newText =  '';*/}
                        
                                {/*let startText = deskQrCode.descTemplate.substring(0,currentPos);*/}
                                {/*let endText = deskQrCode.descTemplate.substring(currentPos);*/}
                                {/*newText = startText + '{桌号}' + endText;*/}
                        
                                {/*dispatch({type: 'deskQrCode/updatePayload', payload: {descTemplate: newText}});*/}
                        
                            {/*}*/}
                        
                        
                        
                        {/*}}>桌号</a>*/}
                    </div>
                </div>
            </div>






            <div style={{marginTop:100}}>


                <Button type = 'primary' style={{width:120,marginLeft:'80px'}} onClick = {()=>{

                    dispatch({type: 'deskQrCode/updatePayload', payload: {coverImageUrl: deskQrCode.defaultUrl}});

                }}>使用默认图片</Button>

                <Button type = 'primary' style = {{width:120,marginLeft:60}} onClick = {()=>{
                    dispatch({type: 'deskQrCode/updatePayload', payload: {type: 1}});
                    dispatch({type: 'deskQrCode/updateWXSettings', payload: {}});

                }}>保存</Button>

            </div>


    </div>);



};





PageSetting.propTypes = {

};

export default PageSetting;