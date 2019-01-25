import React, { PropTypes } from 'react';
import Form from 'antd/lib/form';
import Select from 'antd/lib/select';
import Button from 'antd/lib/button';
import Spin from 'antd/lib/spin';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import Rate from 'antd/lib/rate';
import InputNumber from 'antd/lib/input-number';
import DatePicker from 'antd/lib/date-picker';
import Table from 'antd/lib/table';
import styles from './BaseInfo.less';
const RangePicker = DatePicker.RangePicker;
import moment from 'moment';

import UpLoadImage from '../../../components/base/common/UpLoadImage';
import UploadMorePicture from '../../../components/base/common/UpLoadMorePicture';

import message from 'antd/lib/message';

const formItemLayout = {
	labelCol: {
		span: 6,
	},
	wrapperCol: {
		span: 12,
	},
};

const buttonItemLayout ={
      wrapperCol: { span: 8, offset: 6 },
    } 

const BaseInfo=({
	form: {
	    getFieldDecorator,
	    validateFields,
	    getFieldsValue,
	    resetFields,
	  },
  dispatch,baseInfo,baseInfoFormRest,imageUrls,ctglBaseSetting
}) => {

  const {
    	businessTypeList,businessType,cuisineList,cuisine,settlementTimeList,settlementTime
    } = baseInfo;



    	function resetFormTimeout(resetFields,dispatch){

    			if(resetFields){
    				resetFields();
    			}
    			
    			if(dispatch){
    				dispatch({
		            type: 'ctglBaseSetting/updateBaseInfoFormRest',
		            payload: {
		                baseInfoFormRest:0,
		            },
		          });
    			}
     
    	}

    	if(baseInfoFormRest){

    		setTimeout(function(){resetFormTimeout(resetFields,dispatch)},20);

    		
    	}

    function onImgRemove(e) {
    	
    	var url = '';
    	if (e.removeImage.url) {
    		url = e.removeImage.url;
    	}else if (e.removeImage.response.data) {
    		url = e.removeImage.response.data;
    	}

    	var index = imageUrls.indexOf(url);
    	if (index > -1) {
    		 imageUrls.splice(index,1);
    	}
       
        dispatch({type:'ctglBaseSetting/updatePayload',payload:{imageUrls:imageUrls}});
    };


    function onImgChange(e) {

    	let imgs = [];
  
    	 if (e.previewImage && e.previewImage.length > 0 ){

    	 	e.previewImage.map((i)=>{
    	 		if (i.url) {
		    	 	imgs.push(i.url);
		    	 }else if ( i.response && i.response.data) {
					imgs.push(i.response.data);
		    	 }
    	 	});
    	 }

    	 dispatch({type:'ctglBaseSetting/updatePayload',payload:{imageUrls:imgs}});
    	
	 };

    function onQRImgRemove(e) {

        dispatch({type:'ctglBaseSetting/updatePayload',payload:{QRcodeUrl:''}});
    };


    function onQRImgChange(e) {
   		
   		if (e.previewImage && e.previewImage.length > 0 && e.previewImage[0].response && e.previewImage[0].response.data) {
    
            dispatch({type: 'ctglBaseSetting/updatePayload', payload: {QRcodeUrl: e.previewImage[0].response.data}});
        }
	};

    function onQR1ImgRemove(e) {

        dispatch({type:'ctglBaseSetting/updatePayload',payload:{coverImageUrl:''}});
    };


    function onQR1ImgChange(e) {

        if (e.previewImage && e.previewImage.length > 0 && e.previewImage[0].response && e.previewImage[0].response.data) {

            dispatch({type: 'ctglBaseSetting/updatePayload', payload: {coverImageUrl: e.previewImage[0].response.data}});
        }
    };


    	
	 function handleSubmit(e) {
		    if(e){
		    	e.preventDefault();
		    }

		   	validateFields((errors) => {
		      if (!!errors) {
		        return;
		      }
		 


		    //检查营业时间
		    if(baseInfo.businessHours){

		    	var success = true ;

		    	baseInfo.businessHours.map((o)=>{
		    		if(o.name==''){
		    			success=false;
		    		}
		    	});

		    	if(!success){

		    		message.error("请完善营业时间！");

		      		return;
		    	}
		    }

		    if(isNaN(getFieldsValue().score)||getFieldsValue().score>100||getFieldsValue().score<0){
		    	message.error("请输入0-100的评分！");
				return;
		    }

	    	var data={...getFieldsValue()};

	   
			dispatch({type: 'ctglBaseSetting/updateBase',payload:{formdata:data}});
 		});
       }

    //业态选择处理
    const Option = Select.Option;
    var businessTypeOptionHtml=[];

     var businessTypeValue="";
    // businessTypeOptionHtml.push ( <Option key={0}>{"请选择"}</Option>)
    if(businessTypeList){
	      	businessTypeList.map((j) => {

	        businessTypeOptionHtml.push ( <Option key={j.value}>{j.key}</Option>)
	        if(businessType==j.value){

	        	businessTypeValue=j.key;
	        }

    	})

    }

    //菜系选择处理
    var cuisineOptionHtml=[];

    var cuisineValue="";
    //cuisineOptionHtml.push ( <Option key={0}>{"请选择"}</Option>)
    if(cuisineList){
	      	cuisineList.map((j) => {

	        cuisineOptionHtml.push ( <Option key={j.value}>{j.key}</Option>)
	        if(cuisine==j.value){

	        	cuisineValue=j.key;
	        }

    	})

    }


    //结算时间选择处理
    var settlementTimeOptionHtml=[];

    var settlementTimeValue="请选择";
    settlementTimeOptionHtml.push ( <Option key={-1}>{"请选择"}</Option>)
    if(settlementTimeList){
	      	settlementTimeList.map((j) => {

	        settlementTimeOptionHtml.push ( <Option key={j.value}>{j.key}</Option>)
	        if(settlementTime==j.value){

	        	settlementTimeValue=j.key;
	        }

    	})

    }

    var hourHtml = [];

    for (var i = 0; i < 24; i++) {
    	if(i<10){
    		i = "0"+i;
    	}
    	hourHtml.push ( <Option key={i}>{i}</Option>)
    }

    var minHtml = [];

    for (var i = 0; i < 60; i++) {
    	if(i<10){
    		i = "0"+i;
    	}
    	minHtml.push ( <Option key={i}>{i}</Option>)
    }


    //处理营业时段
    var businessHours=[];
    if(baseInfo.businessHours){
    	baseInfo.businessHours.map((o,i)=>{
    		businessHours.push({
    			"key":i,
    			"name":o.name,
    			"startHour":o.startHour,
    			"endHour":o.endHour,
    		});
    	});
    }
 
    const columns = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',  
            render: (text, record,index) => {

	          var inputHtml = "";

	            inputHtml = <Input style={{ width: 80,marginRight:20,marginLeft:10}} placeholder="市别" value={record.name} onChange={(e)=>{onBusinessChange(e.target.value,index,'name')}} />


	          const obj = {
	              children: inputHtml,
	              props: {},
	          }

	          return obj;
	        },
			width:80
        },{
            title: '开始时间',
            dataIndex: 'startHour',
            key: 'startHour',
            render: (text, record,index) => {

            	if (baseInfo.businessHours[index].startHour != -1) {
		        	var hour = baseInfo.businessHours[index].startHour.split(':')[0];
		        	var minute = baseInfo.businessHours[index].startHour.split(':')[1];
		        	
		        	var html = [];

			    	html.push(<span key={index} ><Select value = {hour} onChange = {(e)=>{
			    		var base = {...baseInfo};
			    		var item = base.businessHours[index];
			    		if (item.startHour!= -1) {
			    			
				    		var start = item.startHour.split(':')[0];
				    		var end = item.startHour.split(':')[1];
				    		item.startHour = e + ':' + end;
				    		base.businessHours[index] = item;

				    		dispatch({type: 'ctglBaseSetting/updatePayload',payload:{baseInfo:base}});
			    		}

			    	}} style={{ width: 60}}>{hourHtml}</Select>：<Select value = {minute} style={{ width: 60}} onChange = {(e)=>{
			    		var base = {...baseInfo};
			    		var item = base.businessHours[index];
			    		if (item.startHour!= -1) {
			    			
				    		var start = item.startHour.split(':')[0];
				    		var end = item.startHour.split(':')[1];
				    		item.startHour = start + ':' + e;
				    		base.businessHours[index] = item;

				    		dispatch({type: 'ctglBaseSetting/updatePayload',payload:{baseInfo:base}});
			    		}

			    	}}>{minHtml}</Select></span>)
		    	}
		    	return html;
	        },
        },{
          title: '标签',
          key: 'label',
          dataIndex: 'label',
          render: (text, record,index) => {
              return <span>至</span>
          },
      	},{
            title: '结束时间',
            dataIndex: 'endHour',
            key: 'endHour',
            render: (text, record,index) => {

	          	if (baseInfo.businessHours[index].endHour != -1) {
		        	var hour = baseInfo.businessHours[index].endHour.split(':')[0];
		        	var minute = baseInfo.businessHours[index].endHour.split(':')[1];
		   
		        	var html = [];

			    	html.push(<span key={index} ><Select value = {hour} onChange = {(e)=>{
			    		var base = {...baseInfo};
			    		var item = base.businessHours[index];
			    		if (item.endHour!= -1) {
			    			
				    		var start = item.endHour.split(':')[0];
				    		var end = item.endHour.split(':')[1];
				    		item.endHour = e + ':' + end;
				    		base.businessHours[index] = item;

				    		dispatch({type: 'ctglBaseSetting/updatePayload',payload:{baseInfo:base}});
			    		}

			    	}} style={{ width: 60}}>{hourHtml}</Select>：<Select value = {minute} style={{ width: 60}} onChange = {(e)=>{
			    		var base = {...baseInfo};
			    		var item = base.businessHours[index];
			    		if (item.endHour!= -1) {
			    			
				    		var start = item.endHour.split(':')[0];
				    		var end = item.endHour.split(':')[1];
				    		item.endHour = start + ':' + e;
				    		base.businessHours[index] = item;

				    		dispatch({type: 'ctglBaseSetting/updatePayload',payload:{baseInfo:base}});
			    		}

			    	}}>{minHtml}</Select></span>)
		    	}
		    	return html;
	        },
        },{
          title: '',
          key: 'operation',
          dataIndex: 'operation',
          render: (text, record,index) => {

	          var inputHtml = "";

	          if(index>0){
              	inputHtml =(<a  onClick={()=>{onBusinessDelete(index)}}><Icon type="close-circle" /></a>)
          	  }else {
          	   inputHtml = (<a  onClick={()=>{onBusinessAdd(index)}}><Icon type="plus-square" /></a>)
          	  }

	          const obj = {
	              children: inputHtml,
	              props: {},
	          }

	          return obj;
	        },    
      }
    ];
    
    function onBusinessChange(value,index,key) {
      dispatch({
            type: 'ctglBaseSetting/updateBusiness',
            payload:{value:value,index:index,key:key},
        });
  }

    function onBusinessDelete(index) {


        dispatch({
            type: 'ctglBaseSetting/deleteBusiness',
            payload:{index:index}
         });

    }

    function onBusinessAdd() {


        dispatch({
            type: 'ctglBaseSetting/addBusiness',
         });

    }

    //限制小数点后只能输入两位
	  function onChangeValueFormatter(value){
	      var regex = "^[0-9]*(\.[0-9]{0,2})?$";
	      var patt = new RegExp(regex);
	      let isPatt = patt.test(value);
	      let valueNew = value;

	      if(!isPatt && valueNew){

	        valueNew = valueNew.substring(0,valueNew.length-1);
	      }

	      return valueNew;
	  }

    function isInteger(obj) {
        return obj%1 === 0
    }


    return (
		 <div >
		    <Form onSubmit={handleSubmit}>

			   <Form.Item label="餐厅名称" {...formItemLayout} >
				    {
				    	getFieldDecorator('restaurantName', {
			            	rules: [{ required: true, message: '请填写餐厅名称!' }],
			            	initialValue:baseInfo.restaurantName
			          	})(
					            <Input  disabled/>
					          )
		           }	
			   </Form.Item>
                <Form.Item label="开业时间" {...formItemLayout} >
                    {

						<DatePicker format="YYYY-MM-DD" value = {ctglBaseSetting.restaurantStartTime ?moment(new Date(ctglBaseSetting.restaurantStartTime)):null} onChange = {(times)=>{

                            let newRestaurantStartTime = new Date(moment(times).format('YYYY-MM-DD 00:00:00')).getTime()
                            dispatch({type: 'ctglBaseSetting/updatePayload', payload: {restaurantStartTime: newRestaurantStartTime}});

						}}/>

                    }
                </Form.Item>
                <Form.Item label="开业设置" {...formItemLayout} >
                    {

						<div>
							<span style = {{float:'left'}}>开业</span>
							<InputNumber style = {{width:80,marginLeft:10,float:'left'}} min={0} max={Infinity} step={1} value = {ctglBaseSetting.couponStartDay == 0?'':ctglBaseSetting.couponStartDay} onChange = {(e)=>{

								if (isInteger(e)){

								    dispatch({
								        type: 'ctglBaseSetting/updatePayload',
								        payload:{
                                            couponStartDay:Number(e) ,
								        }
								    });
								}else{
                                    dispatch({
                                        type: 'ctglBaseSetting/updatePayload',
                                        payload:{
                                            couponStartDay:0 ,
                                        }
                                    });
                                }

							}}>
							</InputNumber>
							<span style = {{float:'left',marginLeft:5}}>天内不能使用优惠券</span>
						</div>
                    }
                </Form.Item>

                <Form.Item label="餐厅广告语" {...formItemLayout} >
                    {
                        getFieldDecorator('restaurantSlogan', {
                            rules: [{ required: true, message: '请填写餐厅广告语!' }],
                            initialValue:baseInfo.restaurantSlogan
                        })(
                            <Input  />
                        )
                    }
                </Form.Item>

                <Form.Item label="业态" {...formItemLayout} >
                    {
                        getFieldDecorator('businessType', {
                            rules: [{ required: true, message: '请选择业态!' }],
                            initialValue:businessTypeValue
                        })(
                            <Select   placeholder="请选择" >
                                { businessTypeOptionHtml}
                            </Select>
                        )
                    }
                </Form.Item>

			   <Form.Item label="菜系" {...formItemLayout} >
				    {
				    	getFieldDecorator('cuisine', {
			            	rules: [{ required: true, message: '请选择业态!' }],
			            	initialValue:cuisineValue
			          	})(
					            <Select   placeholder="请选择" >
					             { cuisineOptionHtml}
					            </Select>
					          )
		           }	
			   </Form.Item>

			   <Form.Item label="联系人" {...formItemLayout} >
				    {
				    	getFieldDecorator('contactName', {
			            	rules: [{ required: true, message: '请填写联系人!' }],
			            	initialValue:baseInfo.contactName
			          	})(
					            <Input  />
					          )
		           }	
			   </Form.Item>

			   <Form.Item label="联系人手机" {...formItemLayout} >
				    {
				    	getFieldDecorator('contactPhone', {
			            	rules: [{ required: true, message: '请填写联系人手机!' },{pattern:/^1[34578]\d{9}$/, message: '请输入正确格式的手机号'}],
			            	initialValue:baseInfo.contactPhone
			          	})(
					            <Input  />
					          )
		           }	
			   </Form.Item>

			   <Form.Item label="订餐电话" {...formItemLayout} >
				    {
				    	getFieldDecorator('bookPhone', {
                            rules: [{ required: true, message: '请填写订餐电话!' }],
			            	initialValue:baseInfo.bookPhone
			          	})(
					            <Input  />
					          )
		           }	
			   </Form.Item>

			   <Form.Item label="投诉电话" {...formItemLayout} >
				    {
				    	getFieldDecorator('servicePhone', {
			            	initialValue:baseInfo.servicePhone
			          	})(
					            <Input  />
					          )
		           }	
			   </Form.Item>

			   <Form.Item label="人均消费" {...formItemLayout} >
				    {
				    	getFieldDecorator('amtAverage', {
                            rules: [{ required: true, message: '请填写人均消费!' }],
			            	initialValue:baseInfo.amtAverage/100
			          	})(
					            <InputNumber className={styles.inputnumber} min={0} max={Infinity} step={0.01} formatter={onChangeValueFormatter}  />
					          )
		           }	
			   </Form.Item>

			   <Form.Item label="公告的标题" {...formItemLayout} >
				    {
				    	getFieldDecorator('noticeTitle', {
			            	initialValue:baseInfo.noticeTitle
			          	})(
					        <Input type="textarea" />
					    )
		           }	
			   </Form.Item>
			   <Form.Item label="公告的内容" {...formItemLayout} >
				    {
				    	getFieldDecorator('noticeContent', {
			            	initialValue:baseInfo.noticeContent
			          	})(
					        <Input type="textarea" />
					    )
		           }	
			   </Form.Item>
			   <Form.Item label="星级" {...formItemLayout} >
				    {
				    	getFieldDecorator('star', {
                            rules: [{ required: true, message: '请填写星级!' }],
				    		initialValue:baseInfo.star
			          	})(
					        <Rate allowClear={true}/>
					    )
		           }	
			   </Form.Item>
			   <Form.Item label="评分" {...formItemLayout} >
				    {
				    	getFieldDecorator('score', {
				    		rules: [{ required: true, message: '请填写评分!' },{pattern: /^(0|[1-9]\d?|100)$/, message: "请输入0-100的整数！" }],
			            	initialValue:baseInfo.score
			          	})(
					        <Input type="number" />
					    )
		           }	
			   </Form.Item>
			   

			   <Form.Item label="结算时间" {...formItemLayout} >
				    {
				    	getFieldDecorator('settlementTime', {
			            	rules: [{ required: true, message: '请选择结算时间!' }],
			            	initialValue:settlementTimeValue
			          	})(
					            <Select   placeholder="请选择" >
					             { settlementTimeOptionHtml}
					            </Select>
					          )
		           }	
			   </Form.Item>

			   <Form.Item label="营业时间" {...formItemLayout} >

                   {
                       getFieldDecorator('settlementTime', {
                           rules: [{ required: true, message: '请填写营业时间' }],

                       })(
                           <Table className={styles.table} columns={columns} dataSource={businessHours} pagination={false} showHeader = {false} />
                       )
                   }

		
			   </Form.Item>
                <Form.Item label="店长二维码" {...formItemLayout} >
                    {
                        getFieldDecorator('QRcodeUrl', {
                            rules: [{ required: true, message: '请上传店长二维码！' }],
                            initialValue:ctglBaseSetting.QRcodeUrl

                        })(
                            <UpLoadImage defaultUrl={ctglBaseSetting.QRcodeUrl} maxCount = {1} onChange= {(e)=>{onQRImgChange(e)}} info={"添加图片"} onRemove = {(e)=>{onQRImgRemove(e)}}> </UpLoadImage>
                        )
                    }

                </Form.Item>
				<Form.Item label="餐厅封面" {...formItemLayout} >
                    {
                        getFieldDecorator('coverImageUrl', {
                            rules: [{ required: true, message: '请上传餐厅封面图片！' }],
                            initialValue:ctglBaseSetting.coverImageUrl

                        })(
                            <UpLoadImage defaultUrl={ctglBaseSetting.coverImageUrl} maxCount = {1} onChange= {(e)=>{onQR1ImgChange(e)}} info={"添加图片"} onRemove = {(e)=>{onQR1ImgRemove(e)}}> </UpLoadImage>
                        )
                    }

                </Form.Item>
                <Form.Item label="餐厅图片" {...formItemLayout} >
                    {
                        getFieldDecorator('imgs', {
                            rules: [{ required: true, message: '请上传餐厅图片！' }],
                            initialValue:ctglBaseSetting.imageUrls

                        })(
                            <UploadMorePicture defaultUrl={imageUrls} maxCount = {6} onChange= {(e)=>{onImgChange(e)}} info={"添加图片"} onRemove = {(e)=>{onImgRemove(e)}}> </UploadMorePicture>
                        )
                    }

                </Form.Item>

			    
			   <Form.Item
		      	{...buttonItemLayout}
		      >
		      	<Button size="default" type="primary" htmlType="submit">保存</Button>  
		      </Form.Item>
		      
		    </Form>


		  </div>
	);
};


		      
		      
BaseInfo.propTypes = {
	visible: PropTypes.any,
	form: PropTypes.object,
	item: PropTypes.object,
};

export default Form.create()(BaseInfo);