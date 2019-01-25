import React, { PropTypes } from 'react';
import styles from './JcpzPage.less';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
const { TextArea } = Input;
import InputNumber from 'antd/lib/input-number';
import moment from "moment/moment";

import Form from 'antd/lib/form';
import Switch from 'antd/lib/switch';
const FormItem=Form.Item;
import UpLoadImage from '../../../components/base/common/UpLoadImage';
const PageSetting = ({deskQrCode,dispatch,form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
},}) => {


    function isInteger(obj) {
        return obj%1 === 0
    }

    const formItemLayout = {
        labelCol: {
            span: 4,
        },
        wrapperCol: {
            span: 16,
        },
    };

    //处理商品图片
    function onImgChange(e) {

        if (e.previewImage && e.previewImage.length > 0 && e.previewImage[0].response && e.previewImage[0].response.data) {
            dispatch({type: 'deskQrCode/updatePayload', payload: {bgImg: e.previewImage[0].response.data}});
        }

    }

    function onImgRemove(e) {
        dispatch({type: 'deskQrCode/updatePayload', payload: {bgImg: ""}});

    }

    //处理商品图片
    function onImgChange1(e) {

        if (e.previewImage && e.previewImage.length > 0 && e.previewImage[0].response && e.previewImage[0].response.data) {
            dispatch({type: 'deskQrCode/updatePayload', payload: {img1: e.previewImage[0].response.data}});
        }

    }

    function onImgRemove1(e) {
        dispatch({type: 'deskQrCode/updatePayload', payload: {img1: ""}});

    }

    //处理商品图片
    function onImgChange2(e) {

        if (e.previewImage && e.previewImage.length > 0 && e.previewImage[0].response && e.previewImage[0].response.data) {
            dispatch({type: 'deskQrCode/updatePayload', payload: {img2: e.previewImage[0].response.data}});
        }

    }

    function onImgRemove2(e) {
        dispatch({type: 'deskQrCode/updatePayload', payload: {img2: ""}});

    }

    //处理商品图片
    function onImgChange3(e) {

        if (e.previewImage && e.previewImage.length > 0 && e.previewImage[0].response && e.previewImage[0].response.data) {
            dispatch({type: 'deskQrCode/updatePayload', payload: {img3: e.previewImage[0].response.data}});
        }

    }

    function onImgRemove3(e) {
        dispatch({type: 'deskQrCode/updatePayload', payload: {img3: ""}});

    }


    const UpLoadImageGen = () =>
        <UpLoadImage defaultUrl={deskQrCode.bgImg} onChange={(e) => {onImgChange(e)}} maxCount={1} info={"添加图片"} onRemove={(e) => {onImgRemove(e)}}> </UpLoadImage>

    const UpLoadImageGen1 = () =>
        <UpLoadImage defaultUrl={deskQrCode.img1} onChange={(e) => {onImgChange1(e)}} maxCount={1} info={"添加图片"} onRemove={(e) => {onImgRemove1(e)}}> </UpLoadImage>

    const UpLoadImageGen2 = () =>
        <UpLoadImage defaultUrl={deskQrCode.img2} onChange={(e) => {onImgChange2(e)}} maxCount={1} info={"添加图片"} onRemove={(e) => {onImgRemove2(e)}}> </UpLoadImage>

    const UpLoadImageGen3 = () =>
        <UpLoadImage defaultUrl={deskQrCode.img3} onChange={(e) => {onImgChange3(e)}} maxCount={1} info={"添加图片"} onRemove={(e) => {onImgRemove3(e)}}> </UpLoadImage>


    return (

            <div>


                <Form style={{padding: "20px"}} id="cjzhForm">
                    <div style={{
                        width: "100%",
                        background: "#eee",
                        lineHeight: "40px",
                        fontWeight: "700",
                        textIndent: "10px",
                        marginBottom: "40px"
                    }}>扫码点餐基础配置
                    </div>

                    <Form.Item  {...formItemLayout} label="订单合并时间" extra="同一个人同一个桌台同一个手机号在多少分钟内重复点餐进行订单合并">


                        <InputNumber style = {{width:'80px'}} min={0} max={Infinity} step={1} value = {deskQrCode.orderMergeTime} onChange = {(e)=>{


                            if (isInteger(e)){

                                dispatch({
                                    type: 'deskQrCode/updatePayload', payload: {
                                        orderMergeTime:  Number(e)
                                    }
                                })
                            }


                        }}>
                        </InputNumber>&nbsp;&nbsp;分钟

                    </Form.Item>

                    <Form.Item  {...formItemLayout} label="承诺上菜时间" extra="用户扫码点餐支付成功后，告知用户的承诺上菜的时间">
                        <div>
                            <Switch  checkedChildren="开" unCheckedChildren="关" checked={deskQrCode.isUseCountDown == '1' ? true : false} onChange={(e)=>{
                                let isUseCountDown = e ? 1 : 2;
                                dispatch({
                                    type: 'deskQrCode/updatePayload',
                                    payload: { isUseCountDown:isUseCountDown }
                                });

                            }} />
                        </div>
                        <InputNumber style = {{width:'80px'}} min={0} max={Infinity} step={1} value = {deskQrCode.countDownTime} onChange = {(e)=>{


                            if (isInteger(e)){

                                dispatch({
                                    type: 'deskQrCode/updatePayload', payload: {
                                        countDownTime:  Number(e)
                                    }
                                })
                            }


                        }}>
                        </InputNumber>&nbsp;&nbsp;分钟
                    </Form.Item>

                    <FormItem
                        {...formItemLayout}
                        label="活动背景图"

                    >
                        <UpLoadImageGen />
                    </FormItem>

                    <Form.Item  {...formItemLayout} label="扫码弹窗活动">

                        <div style={{overflow:'hidden'}}>

                            <div style={{float:'left'}}>
                                <UpLoadImageGen1 />
                            </div>
                            <div style={{float:'left',marginTop:30,marginLeft:10}}>

                                <div>点击图片链接内容地址：</div>
                                <Input style = {{width:400}} value = {deskQrCode.url1} onChange = {(e)=>{
                                    dispatch({
                                        type: 'deskQrCode/updatePayload', payload: {
                                            url1: e.target.value
                                        }
                                    })
                                }}/>
                            </div>
                        </div>

                        <div  style={{overflow:'hidden'}}>

                            <div style={{float:'left'}}>
                                <UpLoadImageGen2 />
                            </div>
                            <div style={{float:'left',marginTop:30,marginLeft:10}}>

                                <div>点击图片链接内容地址：</div>
                                <Input style = {{width:400}} value = {deskQrCode.url2} onChange = {(e)=>{
                                    dispatch({
                                        type: 'deskQrCode/updatePayload', payload: {
                                            url2: e.target.value
                                        }
                                    })
                                }}/>
                            </div>
                        </div>


                        <div  style={{overflow:'hidden'}}>

                            <div style={{float:'left'}}>
                                <UpLoadImageGen3 />
                            </div>
                            <div style={{float:'left',marginTop:30,marginLeft:10}}>

                                <div>点击图片链接内容地址：</div>
                                <Input style = {{width:400}} value = {deskQrCode.url3} onChange = {(e)=>{
                                    dispatch({
                                        type: 'deskQrCode/updatePayload', payload: {
                                            url3: e.target.value
                                        }
                                    })
                                }}/>
                            </div>
                        </div>


                    </Form.Item>


                    <FormItem
                        {...formItemLayout}
                        label="公告"
                        extra="为了保证显示内容的易读和完整性，公告字数限制在50个字符"
                    >

                        <TextArea autosize={{ minRows: 2 }} maxLength={50} value = {deskQrCode.adString} onChange ={(e)=>{
                            dispatch({
                                type: 'deskQrCode/updatePayload', payload: {
                                    adString: e.target.value
                                }
                            })
                        }}/>

                    </FormItem>


                </Form>

            <div style={{marginTop:100}}>

                <Button type = 'primary' style = {{width:120,marginLeft:'18%'}} onClick = {()=>{
                    dispatch({type: 'deskQrCode/updateOrderMergeTime', payload: {}});

                }}>保存</Button>

            </div>


    </div>);



};





PageSetting.propTypes = {

};

export default Form.create()(PageSetting);