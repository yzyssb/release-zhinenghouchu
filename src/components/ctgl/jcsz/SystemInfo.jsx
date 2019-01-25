import React, { PropTypes } from 'react';
import Select from 'antd/lib/select';
import Button from 'antd/lib/button';
import Spin from 'antd/lib/spin';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import Rate from 'antd/lib/rate';
import InputNumber from 'antd/lib/input-number';
import DatePicker from 'antd/lib/date-picker';
import Table from 'antd/lib/table';
import styles from './SystemInfo.less';
const RangePicker = DatePicker.RangePicker;
import moment from 'moment';

import UpLoadImage from '../../../components/base/common/UpLoadImage';
import UploadMorePicture from '../../../components/base/common/UpLoadMorePicture';


import Radio from "antd/lib/radio";
const RadioGroup = Radio.Group;
import message from 'antd/lib/message';

import Form from 'antd/lib/form';
const FormItem=Form.Item;
import TimePicker from 'antd/lib/time-picker';

const formItemLayout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};

const buttonItemLayout ={
      wrapperCol: { span: 8, offset: 6 },
    } 

const SystemInfo=({
	form: {
	    getFieldDecorator,
	    validateFields,
	    getFieldsValue,
	    resetFields,
	  },
  dispatch,xtszPageConfig
}) => {


    /**收银方式**/
    //系统抹零方式
    function wayChange(e){
        console.log(e)
    }
    //结账是否自动清台
    function cleanTable(e){
        dispatch({
            type:'xtszPageConfig/updatePayload',
            payload:{isAutoCleanTable:e.target.value}
        })
    }
    //连接收银端
    function linkCount(e){
        dispatch({
            type:'xtszPageConfig/updatePayload',
            payload:{isConnectCashier:e.target.value}
        })
    }


    //开台后自动进入页面
    function clientHomePage(e){
        dispatch({
            type:'xtszPageConfig/updatePayload',
            payload:{clientHomePageType:e.target.value}
        })
    }
    //临时菜
    function tempFoodChange(e){
        dispatch({
            type:'xtszPageConfig/updatePayload',
            payload:{isTempFoodEnable:e.target.value}
        })
    }
    //自动开台
    function autoOpenTable(e){
        dispatch({
            type:'xtszPageConfig/updatePayload',
            payload:{isAutoOpenTable:e.target.value}
        })
    }


    //开启用餐盒
    function boxChargeChange(e){
        dispatch({
            type:'xtszPageConfig/updatePayload',
            payload:{isUseBoxCharge:e.target.value}
        })
    }
    //餐盒价格
    function boxPriceInput(e){
        console.log(getFieldsValue())

    }
    //可售清单
    function saleListChange(e){
        dispatch({
            type:'xtszPageConfig/updatePayload',
            payload:{isUseSaleList:e.target.value}
        })
    }

    //POS收银
    function posChange(e){
        dispatch({
            type:'xtszPageConfig/updatePayload',
            payload:{isOpenPos:e.target.value}
        })
    }

    //结账是否自动打印小票
    function isPrintTicketChange(e){
        dispatch({
            type:'xtszPageConfig/updatePayload',
            payload:{isPrintTicket:e.target.value}
        })
    }

    //口味
    function isRequiredChange(e){
        dispatch({
            type:'xtszPageConfig/updatePayload',
            payload:{isRequired:e.target.value}
        })
    }

    //退菜原因
    function isRetireGoodsChange(e){
        dispatch({
            type:'xtszPageConfig/updatePayload',
            payload:{isRetireGoods:e.target.value}
        })
    }

    //赠菜原因
    function isGiftGoodsChange(e){
        dispatch({
            type:'xtszPageConfig/updatePayload',
            payload:{isGiftGoods:e.target.value}
        })
    }
    //免单原因
    function isExemptionChange(e){
        dispatch({
            type:'xtszPageConfig/updatePayload',
            payload:{isExemption:e.target.value}
        })
    }

    //折扣原因
    function isDiscountChange(e){
        dispatch({
            type:'xtszPageConfig/updatePayload',
            payload:{isDiscount:e.target.value}
        })
    }

    //原因备注
    function reasonRemarksChange(e){
        dispatch({
            type:'xtszPageConfig/updatePayload',
            payload:{reasonRemarks:e.target.value}
        })
    }




    function saveAction(){
        const value=getFieldsValue()
        validateFields((errors) => {
            if (!!errors) {
                return false;
            }
            console.log(getFieldsValue().boxCharge)
            console.log(getFieldsValue().retireGoodsTime)
            dispatch({
                type:'xtszPageConfig/saveAction',
                payload:{boxCharge:Number(getFieldsValue().boxCharge),
                        retireGoodsTime:Number(getFieldsValue().retireGoodsTime)}
            })
        });
    }

    function resetAction(){
        dispatch({
            type:'xtszPageConfig/updatePayload',
            payload:{isReset:true}
        })
        setTimeout(()=>{
            dispatch({
                type:'xtszPageConfig/updatePayload',
                payload:{isReset:false}
            })
        },20)
        dispatch({
            type:'xtszPageConfig/resetAction',
            payload:{}
        })
    }

    function isInteger(obj) {
        return obj%1 === 0
    }

    const format = 'HH:mm';

    var timeChildren = [];
    xtszPageConfig.timeArray&&xtszPageConfig.timeArray.length >0 &&xtszPageConfig.timeArray.map((i,j)=>{

        timeChildren.push(

            <div key = {j}>
                <TimePicker allowEmpty={false} value={moment(i, format)} format={format} onChange = {(time, timeString)=>{

                    let newTimeArray = xtszPageConfig.timeArray;
                    newTimeArray[j] = timeString;

                    dispatch({
                        type: "xtszPageConfig/updatePayload",
                        payload: {
                            timeArray:newTimeArray,
                        }
                    })
                }} />
                <Button type = 'primary' style = {{marginLeft:10,display:j==0?'none':'inline-block'}} onClick = {()=>{

                    let newTimeArray = xtszPageConfig.timeArray;

                    newTimeArray.splice(j,1);

                    dispatch({
                        type: "xtszPageConfig/updatePayload",
                        payload: {
                            timeArray: newTimeArray,
                        }
                    })


                }}>删除</Button>
            </div>
        );
    })

	return (
		 <div >
             <Form>
                 <Spin spinning={xtszPageConfig.loading} style={{position:'absolute',left:'50%',marginTop:'200px',zIndex:'99'}} size="large" />
                 <div style={{ width: "100%", background: "#eee", lineHeight: "40px", fontWeight: "700", textIndent: "10px", marginBottom: "40px" }}>收银方式</div>
                 <FormItem {...formItemLayout} label="系统抹零方式">
                     <Select value={String(xtszPageConfig.wipeType)} style={{width:200}} onChange={wayChange}>
                         <Option value="1">去零头到元</Option>
                     </Select>
                 </FormItem>
                 <FormItem {...formItemLayout} label="结账是否自动清台">
                     <RadioGroup onChange={cleanTable} value={String(xtszPageConfig.isAutoCleanTable)}>
                         <Radio value="1">清台</Radio>
                         <Radio value="2">不清台</Radio>
                     </RadioGroup>
                 </FormItem>
                 <FormItem {...formItemLayout} label="连接收银端">
                     <RadioGroup onChange={linkCount} value={String(xtszPageConfig.isConnectCashier)}>
                         <Radio value="1">连接</Radio>
                         <Radio value="2">不连接</Radio>
                     </RadioGroup>
                 </FormItem>


                 <div style={{ width: "100%", background: "#eee", lineHeight: "40px", fontWeight: "700", textIndent: "10px", marginBottom: "40px" }}>点餐设置</div>
                 <FormItem {...formItemLayout} label="开台后自动进入页面">
                     <RadioGroup onChange={clientHomePage} value={String(xtszPageConfig.clientHomePageType)}>
                         <Radio value="1">开启</Radio>
                         <Radio value="2">关闭</Radio>
                     </RadioGroup>
                 </FormItem>
                 <FormItem {...formItemLayout} label="临时菜">
                     <RadioGroup onChange={tempFoodChange} value={String(xtszPageConfig.isTempFoodEnable)}>
                         <Radio value="1">开启</Radio>
                         <Radio value="2">关闭</Radio>
                     </RadioGroup>
                 </FormItem>
                 <FormItem {...formItemLayout} label="自动开台">
                     <RadioGroup onChange={autoOpenTable} value={String(xtszPageConfig.isAutoOpenTable)}>
                         <Radio value="1">开启</Radio>
                         <Radio value="2">关闭</Radio>
                     </RadioGroup>
                 </FormItem>
                 <FormItem {...formItemLayout} label="开启用餐盒 ">
                     <RadioGroup onChange={boxChargeChange} value={String(xtszPageConfig.isUseBoxCharge)}>
                         <Radio value="1">开启</Radio>
                         <Radio value="2">关闭</Radio>
                     </RadioGroup>
                 </FormItem>
                 {(xtszPageConfig.isUseBoxCharge==1&&!xtszPageConfig.isReset||xtszPageConfig.isUseBoxCharge=='1'&&!xtszPageConfig.isReset)&&(
                     <FormItem {...formItemLayout} label="餐盒价钱">
                         {getFieldDecorator('boxCharge', {
                             initialValue:xtszPageConfig.boxCharge,
                             rules: [{
                                 required: true, message: '请输入餐盒价钱',
                             },{pattern:/^[0-9]+([.]{1}[0-9]+){0,1}$/, message: '请输入正确格式'}],
                         })(
                             <Input style={{width:200}}  onChange={boxPriceInput} />
                         )
                         }
                     </FormItem>
                 )}


                 <div style={{ width: "100%", background: "#eee", lineHeight: "40px", fontWeight: "700", textIndent: "10px", marginBottom: "40px" }}>其他设置</div>
                 <FormItem {...formItemLayout} label="可售清单">
                     <RadioGroup onChange={saleListChange} value={String(xtszPageConfig.isUseSaleList)}>
                         <Radio value="1">开启</Radio>
                         <Radio value="2">关闭</Radio>
                     </RadioGroup>
                 </FormItem>

                 <FormItem {...formItemLayout} label="POS收银">
                     <RadioGroup onChange={posChange} value={String(xtszPageConfig.isOpenPos)}>
                         <Radio value="1">开启</Radio>
                         <Radio value="2">关闭</Radio>
                     </RadioGroup>
                 </FormItem>

                 <FormItem {...formItemLayout} label="允许退菜时间">
                     {getFieldDecorator('retireGoodsTime', {
                         initialValue:xtszPageConfig.retireGoodsTime,
                         rules: [{
                             required: true, message: '允许退菜时间',
                         },{pattern:/^[0-9]*[0-9][0-9]*$/, message: '请输入整数'}],
                     })(
                         <Input style={{width:200}} addonAfter={'小时'}/>
                     )
                     }
                 </FormItem>

                 <FormItem {...formItemLayout} label="结账是否自动打印小票">
                     <RadioGroup onChange={isPrintTicketChange} value={String(xtszPageConfig.isPrintTicket)}>
                         <Radio value="1">开启</Radio>
                         <Radio value="2">关闭</Radio>
                     </RadioGroup>
                 </FormItem>

                 <div style={{ width: "100%", background: "#eee", lineHeight: "40px", fontWeight: "700", textIndent: "10px", marginBottom: "40px" }}>原因设置</div>

                 <FormItem {...formItemLayout} label="口味必填">
                     <RadioGroup onChange={isRequiredChange} value={String(xtszPageConfig.isRequired)}>
                         <Radio value="1">开启</Radio>
                         <Radio value="2">关闭</Radio>
                     </RadioGroup>
                 </FormItem>

                 <FormItem {...formItemLayout} label="退菜原因必填">
                     <RadioGroup onChange={isRetireGoodsChange} value={String(xtszPageConfig.isRetireGoods)}>
                         <Radio value="1">开启</Radio>
                         <Radio value="2">关闭</Radio>
                     </RadioGroup>
                 </FormItem>

                 <FormItem {...formItemLayout} label="赠菜原因必填">
                     <RadioGroup onChange={isGiftGoodsChange} value={String(xtszPageConfig.isGiftGoods)}>
                         <Radio value="1">开启</Radio>
                         <Radio value="2">关闭</Radio>
                     </RadioGroup>
                 </FormItem>

                 <FormItem {...formItemLayout} label="免单原因必填">
                     <RadioGroup onChange={isExemptionChange} value={String(xtszPageConfig.isExemption)}>
                         <Radio value="1">开启</Radio>
                         <Radio value="2">关闭</Radio>
                     </RadioGroup>
                 </FormItem>

                 <FormItem {...formItemLayout} label="折扣原因必填">
                     <RadioGroup onChange={isDiscountChange} value={String(xtszPageConfig.isDiscount)}>
                         <Radio value="1">开启</Radio>
                         <Radio value="2">关闭</Radio>
                     </RadioGroup>
                 </FormItem>
                 <FormItem {...formItemLayout} label="原因备注必填">
                     <RadioGroup onChange={reasonRemarksChange} value={String(xtszPageConfig.reasonRemarks)}>
                         <Radio value="1">开启</Radio>
                         <Radio value="2">关闭</Radio>
                     </RadioGroup>
                 </FormItem>

                 <div style={{ width: "100%", background: "#eee", lineHeight: "40px", fontWeight: "700", textIndent: "10px", marginBottom: "40px" }}>智能后厨设置</div>

                 <FormItem {...formItemLayout} label="预制任务未完成通知时间" extra={'（需在通知中心设置接收人；当没有在该时间完成的任务将通知到接收人）'}>
                     <div>
                         <Button type={"primary"} onClick={()=>{

                             var item = '00:00';

                             var newTimeArray = xtszPageConfig.timeArray?xtszPageConfig.timeArray:[];

                             if (newTimeArray.length < 3){
                                 newTimeArray.push(item);
                                 dispatch({
                                     type: "xtszPageConfig/updatePayload",
                                     payload: {
                                         timeArray: newTimeArray,
                                     }
                                 })
                             }else{
                                 message.warning('最多添加3个时段');
                             }


                         }}>新增时段</Button>
                         {timeChildren}
                     </div>
                 </FormItem>

                 <FormItem {...formItemLayout} label="智能后厨预制量报警">
                     <div style={{width:'100%',overflow: 'hidden',marginTop:5}}>
                         <span style = {{float:'left',lineHeight:'32px'}}>当任务推送给智能后厨</span>
                         <InputNumber style = {{width:80,marginLeft:10,float:'left'}} min={0} max={Infinity} step={1} value = {xtszPageConfig.prefabricateTime } onChange = {(e)=>{

                             if (isInteger(e)){

                                 dispatch({
                                     type: 'xtszPageConfig/updatePayload',
                                     payload:{
                                         prefabricateTime: Number(e),
                                     }
                                 });
                             }

                         }}>
                         </InputNumber>
                         <span style = {{float:'left',marginLeft:5,lineHeight:'32px'}}>分钟后，任务没有被承接时，则报警提示相关人员承接任务预制。</span>
                     </div>


                 </FormItem>

                 <FormItem {...formItemLayout} label="厨师抢单中，堂食打包订单变色预警">
                     <div style={{width:'100%',overflow: 'hidden',marginTop:5}}>
                         <span style = {{float:'left',lineHeight:'32px'}}>当任务推送给智能后厨</span>
                         <InputNumber style = {{width:80,marginLeft:10,float:'left'}} min={0} max={Infinity} step={1} value = {xtszPageConfig.cookYellowStart } onChange = {(e)=>{

                             if (isInteger(e)){

                                 dispatch({
                                     type: 'xtszPageConfig/updatePayload',
                                     payload:{
                                         cookYellowStart: Number(e),
                                     }
                                 });
                             }

                         }}>
                         </InputNumber>

                         <span style = {{float:'left',lineHeight:'32px',marginLeft:5}}>分钟以上为黄色预警</span>
                         <InputNumber style = {{width:80,marginLeft:20,float:'left'}} min={0} max={Infinity} step={1} value = {xtszPageConfig.cookRedStart } onChange = {(e)=>{

                             if (isInteger(e)){

                                 dispatch({
                                     type: 'xtszPageConfig/updatePayload',
                                     payload:{
                                         cookRedStart: Number(e),
                                     }
                                 });
                             }

                         }}>
                         </InputNumber>
                         <span style = {{float:'left',marginLeft:5,lineHeight:'32px'}}>分钟以上为红色预警</span>
                     </div>


                 </FormItem>

                 <FormItem {...formItemLayout} label="传菜抢单中，堂食打包订单变色预警">
                     <div style={{width:'100%',overflow: 'hidden',marginTop:5}}>
                         <span style = {{float:'left',lineHeight:'32px'}}>当任务推送给智能后厨</span>
                         <InputNumber style = {{width:80,marginLeft:10,float:'left'}} min={0} max={Infinity} step={1} value = {xtszPageConfig.foodYellowStart } onChange = {(e)=>{

                             if (isInteger(e)){

                                 dispatch({
                                     type: 'xtszPageConfig/updatePayload',
                                     payload:{
                                         foodYellowStart: Number(e),
                                     }
                                 });
                             }

                         }}>
                         </InputNumber>
                         
                         <span style = {{float:'left',lineHeight:'32px',marginLeft:5}}>分钟以上为黄色预警</span>
                         <InputNumber style = {{width:80,marginLeft:20,float:'left'}} min={0} max={Infinity} step={1} value = {xtszPageConfig.foodRedStart } onChange = {(e)=>{

                             if (isInteger(e)){

                                 dispatch({
                                     type: 'xtszPageConfig/updatePayload',
                                     payload:{
                                         foodRedStart: Number(e),
                                     }
                                 });
                             }

                         }}>
                         </InputNumber>
                         <span style = {{float:'left',marginLeft:5,lineHeight:'32px'}}>分钟以上为红色预警</span>
                     </div>


                 </FormItem>

                 <FormItem {...formItemLayout} label="外卖订单变色预警">
                     <div style={{width:'100%',overflow: 'hidden',marginTop:5}}>
                         <span style = {{float:'left',lineHeight:'32px'}}>当任务推送给智能后厨</span>
                         <InputNumber style = {{width:80,marginLeft:10,float:'left'}} min={0} max={Infinity} step={1} value = {xtszPageConfig.waimaiYellowStart } onChange = {(e)=>{

                             if (isInteger(e)){

                                 dispatch({
                                     type: 'xtszPageConfig/updatePayload',
                                     payload:{
                                         waimaiYellowStart: Number(e),
                                     }
                                 });
                             }

                         }}>
                         </InputNumber>

                         <span style = {{float:'left',lineHeight:'32px',marginLeft:5}}>分钟以上为黄色预警</span>
                         <InputNumber style = {{width:80,marginLeft:20,float:'left'}} min={0} max={Infinity} step={1} value = {xtszPageConfig.waimaiRedStart } onChange = {(e)=>{

                             if (isInteger(e)){

                                 dispatch({
                                     type: 'xtszPageConfig/updatePayload',
                                     payload:{
                                         waimaiRedStart: Number(e),
                                     }
                                 });
                             }

                         }}>
                         </InputNumber>
                         <span style = {{float:'left',marginLeft:5,lineHeight:'32px'}}>分钟以上为红色预警</span>
                     </div>


                 </FormItem>

                 <div style={{marginLeft:'25%',marginBottom:100,marginTop:50}}>
                     <Button type="primary" size="large" style={{marginLeft:30}} onClick={saveAction}>保存</Button>
                     <Button size="large" style={{marginLeft:30}} onClick={resetAction}>恢复初始化</Button>
                 </div>
             </Form>


		  </div>
	);
};


		      
		      
SystemInfo.propTypes = {
	visible: PropTypes.any,
	form: PropTypes.object,
	item: PropTypes.object,
};

export default Form.create()(SystemInfo);