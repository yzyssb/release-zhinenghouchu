import React, { PropTypes } from 'react';
import { connect } from 'dva';
import Button from 'antd/lib/button';
import Icon from 'antd/lib/icon';
import message from 'antd/lib/message';
import Table from 'antd/lib/table';
import Modal from 'antd/lib/modal';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Switch from 'antd/lib/switch';
const FormItem=Form.Item
import {Popconfirm} from 'antd/lib';
import Pagination from 'antd/lib/pagination';
import Radio from 'antd/lib/radio';
const RadioGroup = Radio.Group;
import Select from 'antd/lib/select';
const Option = Select.Option;   
import Checkbox from 'antd/lib/checkbox';
const CheckboxGroup = Checkbox.Group;


import styles from './PrinterInfo.less';

const Registration2 = ({
    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
    }, 
    record,
    printer,
    dispatch,
}) => {
	const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
    }

	function resetFormTimeout(resetFields,dispatch){
		if(resetFields){
			resetFields();
		}
		if(dispatch){
			dispatch({
            type: 'printer/updatePayload',
            payload: {
                baseInfoFormRest:0,
            },
          });
		}
	}

	if(printer.baseInfoFormRest){
		setTimeout(function(){resetFormTimeout(resetFields,dispatch)},20);
	}
	
	function ModalHidden(){
		dispatch({
    		type:'printer/updatePayload',
    		payload:{printSortList:[],printCategoryId:[],ModalIndex:1,visible:false}
    	})
    }


    const options11 = [
		{ label: '点菜整单', value: '1' },
		{ label: '点菜分单', value: '2' },
		{ label: '退菜单', value: '3' },
		{ label: '结账单', value: '4' },
		{ label: '活动单', value: '5' },
		{ label: '外带单', value: '6' },
		{ label: '外卖单', value: '7' },
	];
	const options12 = [
		{ label: '点菜整单', value: '1' },
		{ label: '点菜分单', value: '2' },
		{ label: '退菜单', value: '3' }
	];

	let options1=[]
	
	if(printer.printerCate&&printer.printerCate.length>0){
		printer.printerCate.forEach((value,index)=>{
			options1.push({
				label:value.value,
				value:value.key
			})
		})
	}
	

	function next(){
		const value=getFieldsValue()
		console.log(value)
		validateFields((errors) => {
	        if (!!errors) {
	        	console.log('报错')
	        	return
	        }
	        console.log('1')
	        if(printer.printSortList.length>0){
	        	record.printSortList=printer.printSortList
	        }
	        console.log('2')
	        if(printer.printCategoryId.length>0){
	        	let list=[]
	        	printer.printCategoryId.forEach((value)=>{
	        		list.push(+value)
	        	})
	        	record.printCategoryId=list
	        }
	        console.log('3')
	        for(var i in value){
	        	record[i]=value[i]
	        }
	        console.log('modalIndex:'+printer.modalIndex==1?2:3)
	        dispatch({
				type:'printer/updatePayload',
				payload:{modalIndex:printer.modalIndex==1?2:3}
			})
			console.log('4')
	    })
	}

	function back(){
		const value=getFieldsValue()
		for(var i in value){
        	record[i]=value[i]
        }
		dispatch({
			type:'printer/updatePayload',
			payload:{modalIndex:printer.modalIndex==3?2:1}
		})
	}

	function sucTap(){
		const value=getFieldsValue()
		validateFields((errors) => {
	        if (!!errors) {
	        	return false;
	        }
	        for(var i in value){
        		record[i]=value[i]
        	}
	        if(value.printSort){//第二步，选择的是收银
	        	record.printCategoryId=[]
	        }else{//第三步
	        }

			dispatch({
				type:'printer/updatePayload',
				payload:{record:record,printSortList:[],printCategoryId:[],ModalIndex:1,visible:false}
			})
			record.id=+record.id
			let list=[]
			record.printCategoryId.forEach((value)=>{
				list.push(+value)
			})
			record.printCategoryId=list

			record.printSort=+record.printSort
			if(typeof record.printSortList=='string'){
				record.printSortList=record.printSortList.split(',')
			}
			if(record.printSort==2&&record.printSortList.indexOf('4')>-1){
				let idx=record.printSortList.indexOf('4')
				record.printSortList.splice(idx,1)
			}
			record.printType=+record.printType
			record.printWidth=+record.printWidth
			dispatch({
				type:'printer/UpdateList',
				payload:record
			})
	    })
	}

	let footer=[]
	if(printer.modalIndex==1){
		footer=[
			<Button key = {1} type="primary" onClick={next}>下一步</Button>
		]
	}else if(printer.modalIndex==2&&record.printSort==1||printer.modalIndex==2&&record.printSort==''){
		footer=[
			<Button key = {2} onClick={back}>上一步</Button>,
			<Button key = {3} type="primary" onClick={sucTap}>完成配置</Button>
		]
	}else if(printer.modalIndex==2&&record.printSort==2){
		footer=[
			<Button key = {4} onClick={back}>上一步</Button>,
			<Button key = {5} type="primary" onClick={next}>下一步</Button>
		]
	}else if(printer.modalIndex==3){
		footer=[
			<Button key = {6} onClick={back}>上一步</Button>,
			<Button key = {7} type="primary" onClick={sucTap}>完成配置</Button>
		]
	}

	function change1(e){
		record.printSort=e.target.value
		console.log(record.printSort)
	}

	

	return(
		<Modal
            visible={printer.visible}
            title={!record.key?'添加打印机':'修改打印机'}
            width="800px"
            onCancel={ModalHidden}
            footer={footer}
		>		
			<div className={styles.header}>
				{printer.modalIndex==1?(
					<span>
						<span className={styles.active}>1、添加打印机</span>
						<span className={styles.arrow}>></span>
						<span className={styles.item}>2、配置打印机</span>
						<span className={styles.arrow}>></span>
						<span className={styles.item}>3、给打印机添加出品部门</span>
					</span>
					):printer.modalIndex==2?(
					<span>
						<span className={styles.item}>1、添加打印机</span>
						<span className={styles.arrow}>></span>
						<span className={styles.active}>2、配置打印机</span>
						<span className={styles.arrow}>></span>
						<span className={styles.item}>3、给打印机添加出品部门</span>
					</span>
					):(
					<span>
						<span className={styles.item}>1、添加打印机</span>
						<span className={styles.arrow}>></span>
						<span className={styles.item}>2、配置打印机</span>
						<span className={styles.arrow}>></span>
						<span className={styles.active}>3、给打印机添加出品部门</span>
					</span>	
				)}
			</div>
			<Form>
				{printer.modalIndex==1?(
					<div>
					<FormItem {...formItemLayout} label="打印机类型">
						{getFieldDecorator('printType', {
		                    initialValue: String(record.printType),
		                    rules: [{required: true, message: '请选择打印机类型'}]
		                })(
		                    <RadioGroup>
						        <Radio key="1" value="1">网络打印</Radio>
						    </RadioGroup>
		                )}
					</FormItem>
					<FormItem {...formItemLayout} label="打印机名称" extra="自定义命名，区分打印机用途">
						{getFieldDecorator('printName', {
		                    initialValue: record.printName,
		                    rules: [
		                    	{required: true, message: '请输入打印机名称'},{ pattern: /^[^ ]+$/, message: "请勿输入空格！" }
		                    ],
		                })(
		                    <Input placeholder="例如：后台打印机" />
		                )}
					</FormItem>
					<FormItem {...formItemLayout} label="打印机宽度" extra="打印机支持的打印纸宽度">
						{getFieldDecorator('printWidth', {
		                    initialValue: String(record.printWidth),
		                    rules: [{required: true, message: '请选择打印机宽度'}]
		                })(
		                    <Select style={{ width: 120 }}>
						        <Option key="1" value="1">40mm</Option>
						        <Option key="2" value="2">58mm</Option>
						        <Option key="3" value="3">80mm</Option>
						    </Select>
		                )}
					</FormItem>
					<FormItem {...formItemLayout} label="打印机IP地址">
						{getFieldDecorator('printIp', {
		                    initialValue: record.printIp,
		                    rules: [{required: true, message: '请输入打印机IP地址'},{ pattern: /^[^ ]+$/, message: "请勿输入空格！" }]
		                })(
		                    <Input />
		                )}
					</FormItem>
					<FormItem {...formItemLayout} label="打印机端口" extra="打印机默认端口9100，一般不需要修改">
						{getFieldDecorator('printPort', {
		                    initialValue: record.printPort,
		                    rules: [{required: true, message: '请输入打印机端口'},{ pattern: /^[^ ]+$/, message: "请勿输入空格！" }]
		                })(
		                    <Input type="number" />
		                )}
					</FormItem>
					</div>
				):printer.modalIndex==2?(
					<div>
					<FormItem {...formItemLayout} label="打印机配置">
						{getFieldDecorator('printSort', {
		                    initialValue: String(record.printSort),
		                    rules: [{required: true, message: '请选择打印机配置'}]
		                })(
		                    <RadioGroup onChange={change1}>
						        <Radio key="1" value="1">收银</Radio>
						        <Radio key="2" value="2">后厨</Radio>
						    </RadioGroup>
		                )}
					</FormItem>
					{record.printSort==1?(
						<FormItem {...formItemLayout} label="勾选">
							{getFieldDecorator('printSortList', {
			                    initialValue: !record.printTicket?[]:(record.printTicket.split(',')),
			                    rules: [{required: true, message: '请选择分类'}]
			                })(
			                	<CheckboxGroup options={options11} />
			                )}
						</FormItem>
					):(
						<FormItem {...formItemLayout} label="勾选">
							{getFieldDecorator('printSortList', {
			                    initialValue: !record.printTicket?[]:(record.printTicket.split(',')),
			                    rules: [{required: true, message: '请选择分类'}]
			                })(
			                	<CheckboxGroup options={options12} />
			                )}
						</FormItem>
					)}
					</div>
				):(
					<div>
					<FormItem {...formItemLayout} label="出品部门">
						{getFieldDecorator('printCategoryId', {
		                    initialValue: record.printCategoryId,
		                    rules: [{required: true, message: '请选择打印机配置'}]
		                })(
		                    <CheckboxGroup options={options1} />
		                )}
					</FormItem>
					</div>
				)}
			</Form>
		</Modal>
	)
	
}
Registration2.propTypes = {
    form: PropTypes.object.isRequired
};

const Registration2Form = Form.create()(Registration2);

const PrinterInfo=({
	printer,
    dispatch
}) => {
	const columns=[
		{
			title:'',
			dataIndex:'key',
			key:'key',
			render:(index)=>(
				printer.size*(printer.current-1)+index
			)
		},
		{
			title:'打印机名称',
			dataIndex:'printName',
			key:'printName'
		},
		{
			title:'打印机类型',
			dataIndex:'printType',
			key:'printType',
			render:()=>(
				'网络打印'
			)
		},
		{
			title:'IP地址',
			dataIndex:'printIp',
			key:'printIp'
		},
		{
			title:'端口',
			dataIndex:'printPort',
			key:'printPort'
		},
		{
			title:'打印机分类',
			dataIndex:'printSort',
			key:'printSort',
			render:(text,record,index)=>(
				record.printSort==1?'收银':record.printSort==2?'后厨':''
			)
		},
		{
			title:'操作',
			dataIndex:'action',
			key:'action',
			render:(text,record,index)=>(
				<span key={index}>
					<a onClick={()=>addPrinter(record)}>修改</a>
					<span className="ant-divider" />
					<Popconfirm okText="确定" cancelText="取消" title="确定要删除吗？" onConfirm={() => delPrinter(record)}>
	                    <a>删除</a>
	                </Popconfirm>
				</span>
			)
		}
	]

	function onChangeShowPage(pageNumber) {
        const offset = (pageNumber - 1) * 10;

        dispatch({
            type: 'printer/updatePayload',
            payload: { offset:offset, current: pageNumber }
        });

        dispatch({
            type: 'printer/getList',
            payload: {}
        });
    }

    
    function addPrinter(record={}){
    	var static_record={
    		id:0,
			printType:'1',
			printName:'',
			printWidth:'1',
			printIp:'',
			printPort:'9100',
			printSort:'1',
			printSortList:[],
			printCategoryId:[]
		}
		
		if(record.key){
			/*dispatch({
				type:'printer/printerchoosedL',
				payload:{id:record.id}
			})*/
			if(record.printSort==2){
				dispatch({
					type:'printer/printerchoosedD',
					payload:{id:record.id}
				})
			}
		}
    	dispatch({
    		type:'printer/updatePayload',
    		payload:{modalIndex:1,baseInfoFormRest:1,visible:true}
    	})
    	setTimeout(()=>{
    		dispatch({
	    		type:'printer/updatePayload',
	    		payload:{record:!record.key?static_record:record}
	    	})
    	},100)
    	
    }
    
    function delPrinter(record){
    	dispatch({
    		type:'printer/DeletePrinter',
    		payload:{id:record.id}
    	})
    }

    const {record}=printer
	const BaseInfoProps = {
		record,
        printer,
        dispatch
    };
	return (
		<div>
			<Button type="primary" size="large" style={{marginBottom:20}} onClick={addPrinter}>添加打印机<Icon type="plus" /></Button>
			<Table
				bordered
				columns={columns}
				dataSource={printer.data}
				pagination={false}
			/>
			<Pagination current={printer.current} style={{ float: "right", paddingTop: "20px" }} showQuickJumper defaultCurrent={1} total={printer.total} onChange={onChangeShowPage} hideOnSinglePage={true} />

			<Registration2Form {...BaseInfoProps} />
			
		</div>
	)
	
};


function mapStateToProps({ printer }) {
    return { printer };
}

export default connect(mapStateToProps)(PrinterInfo);