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

const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
    }

const Registration = ({
    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
    }, dispatch,
    visible,
    ModalOrigin,
    dataSource,
    listIndex,
    baseInfoFormRest,
}) => {
	function resetFormTimeout(resetFields,dispatch){
		if(resetFields){
			resetFields();
		}
		if(dispatch){
			dispatch({
            type: 'dyjglPageConfig/updatePayload',
            payload: {
                baseInfoFormRest:0,
            },
          });
		}
	}

	if(baseInfoFormRest){
		setTimeout(function(){resetFormTimeout(resetFields,dispatch)},20);
	}
	function ModalHidden(){
		dispatch({
			type:'dyjglPageConfig/updatePayload',
			payload:{baseInfoFormRest:1,visible:false,loading:false}
		})
	}

	function Modalconfirm(){
		const value=getFieldsValue()
		validateFields((errors) => {
	        if (!!errors) {
	        	return false;
	        }
	        dispatch({
	        	type:'dyjglPageConfig/updatePayload',
				payload:{ModalOrigin:1,code:value.code,name:value.name,id:0,status:1}
	        })
	        dispatch({
				type:'dyjglPageConfig/checkN',
				payload:{}
			})
	    });	}

	return(
		<Modal
            visible={visible}
            title="添加出品部门"
            onCancel={ModalHidden}
            footer={[
                <Button key="back" onClick={ModalHidden}>取消</Button>,
                <Button key="submit" type="primary" onClick={Modalconfirm}>确认</Button>,
            ]}
		>		
			<Form>
				<FormItem {...formItemLayout} label="名称" extra="（填写出品部门名称，出品部门名称为必填项！）">
					{getFieldDecorator('name', {
	                    initialValue: '',
	                    rules: [
	                    	{required: true, message: '请输入名称'},{ pattern: /^[^ ]+$/, message: "请勿输入空格！" }
	                    ],
	                })(
	                    <Input />
	                )}
				</FormItem>
				<FormItem {...formItemLayout} label="编号" extra="（填写出品部门编号，出品部门编号为必填项！）">
					{getFieldDecorator('code', {
	                    initialValue: '',
	                    rules: [
	                    	{required: true, message: '请输入编号'},
	                    	{pattern:/^[0-9]+$/, message: '请输入纯数字编号'}
	                    ],
	                })(
	                    <Input />
	                )}
				</FormItem>
			</Form>
		</Modal>
	)
	
}
Registration.propTypes = {
    form: PropTypes.object.isRequired
};

const RegistrationForm = Form.create()(Registration);

const Registration2 = ({
    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
    }, dispatch,
    visible,
    ModalOrigin,
    dataSource,
    listIndex,
    baseInfoFormRest,
    defaultChecked,
}) => {
	function resetFormTimeout(resetFields,dispatch){
		if(resetFields){
			resetFields();
		}
		if(dispatch){
			dispatch({
            type: 'dyjglPageConfig/updatePayload',
            payload: {
                baseInfoFormRest:0
            },
          });
		}
	}

	if(baseInfoFormRest){
		setTimeout(function(){resetFormTimeout(resetFields,dispatch)},20);
	}



	function ModalHidden(){
		dispatch({
			type:'dyjglPageConfig/updatePayload',
			payload:{baseInfoFormRest:1,visible:false,loading:false}
		})
	}

	function Modalconfirm(){
		const value=getFieldsValue()
		console.log(value)
		validateFields((errors) => {
	        if (!!errors) {
	        	return false;
	        }
	        dispatch({
	        	type:'dyjglPageConfig/updatePayload',
				payload:{ModalOrigin:2,code:value.code,name:value.name,id:dataSource[listIndex].id,status:defaultChecked?'1':'2'}
	        })
	        dispatch({
				type:'dyjglPageConfig/checkN',
				payload:{}
			})
	    });
		
	}

	function statusChange(item){
		console.log(item)
		dispatch({
			type:'dyjglPageConfig/updatePayload',
			payload:{defaultChecked:item}
		})
	}


	return(
		<Modal
            visible={visible}
            title="添加出品部门"
            onCancel={ModalHidden}
            footer={[
                <Button key="back" onClick={ModalHidden}>取消</Button>,
                <Button key="submit" type="primary" onClick={Modalconfirm}>确认</Button>,
            ]}
		>
			<Form>
				<FormItem {...formItemLayout} label="名称" extra="（填写出品部门名称，出品部门名称为必填项！）">
					{getFieldDecorator('name', {
	                    initialValue:dataSource[listIndex].name,
	                    rules: [
	                    	{required: true, message: '请输入名称'},
	                    	{pattern: /^[^ ]+$/, message: "请勿输入空格！"}
	                    ],
	                })(
	                    <Input />
	                )}
				</FormItem>
				<FormItem {...formItemLayout} label="编号" extra="（填写出品部门编号，出品部门编号为必填项！）">
					{getFieldDecorator('code', {
	                    initialValue: dataSource[listIndex].code,
	                    rules: [
	                    	{required: true, message: '请输入编号'},
	                    	{pattern:/^[0-9]+$/, message: '请输入纯数字编号'}
	                    ],
	                })(
	                    <Input />
	                )}
				</FormItem>{/*dataSource[listIndex].status==1?true:false*/}
				<FormItem {...formItemLayout} label="状态">
	                <Switch checkedChildren="启用" unCheckedChildren="停用" checked={defaultChecked} onChange={statusChange}/>
				</FormItem>
			</Form>
		</Modal>
	)
	
}
Registration2.propTypes = {
    form: PropTypes.object.isRequired
};

const RegistrationForm2 = Form.create()(Registration2);



const DyjdlglInfo=({
	dyjglPageConfig,
    dispatch
}) => {
	const {visible,ModalOrigin,dataSource,listIndex,baseInfoFormRest,defaultChecked} = dyjglPageConfig;
	const BaseInfoProps = {
        visible,
        ModalOrigin,
        dataSource,
        listIndex,
        baseInfoFormRest,
        defaultChecked,
        dispatch
    };
	const columns=[
		{
			title:'',
			dataIndex:'key',
			key:'key',
			render:(text,record,index)=>(
				dyjglPageConfig.size*(dyjglPageConfig.current-1)+index+1
			)
		},
		{
			title:'出品部门名称',
			dataIndex:'name',
			key:'name'
		},
		{
			title:'出品部门编号',
			dataIndex:'code',
			key:'code'
		},
		{
			title:'状态',
			dataIndex:'status',
			key:'status',
			render:(text,record,index)=>{
				return text==1?'启用':'停用'
			}
		},
		{
			title:'操作',
			dataIndex:'action',
			key:'action',
			render:(text,record,index)=>(
				<span key={index}>
					<a onClick={()=>{editAction(text,record,index)}}>编辑</a>
					<span className="ant-divider" />
					<Popconfirm okText="确定" cancelText="取消" title="确定要删除吗？" onConfirm={() => deleteAction(record)}>
	                    <a>删除</a>
	                </Popconfirm>
				</span>
			)
		}
	]

	const pagination = {
        total: dyjglPageConfig.total,
		current:dyjglPageConfig.current,
		pageSize: dyjglPageConfig.size,		
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger:true,
        onShowSizeChange:SizeChange,
    };

    function SizeChange(current, pageSize){
        dispatch({type: 'dyjglPageConfig/updatePayload',payload:{size:pageSize,current:1,offset:0,listIndex:0}});
        dispatch({
        	type:'dyjglPageConfig/getList',
        	payload:{}
        })
    }

    function onPageChange(pageNo){
        var offset = pageNo*dyjglPageConfig.size-dyjglPageConfig.size;
        dispatch({type: 'dyjglPageConfig/updatePayload',payload:{offset:offset,current:pageNo,listIndex:0}});
        dispatch({
        	type:'dyjglPageConfig/getList',
        	payload:{}
        })
    }

	const confirm=Modal.confirm
	function deleteAction(record){
        dispatch({
    		type:'dyjglPageConfig/deleteAction',
    		payload:{id:record.id}
    	})
	}
	function editAction(text,record,index){
		var ModalOrigin=dyjglPageConfig.ModalOrigin,listIndex=dyjglPageConfig.listIndex
		ModalOrigin=2,listIndex=index
		console.log(listIndex)
		dispatch({
			type:'dyjglPageConfig/updatePayload',
			payload:{listIndex:listIndex,ModalOrigin:ModalOrigin,defaultChecked:dyjglPageConfig.dataSource[index].status==1?true:false,visible:true}
		})
	}

	function newDydl(){
		var ModalOrigin=dyjglPageConfig.ModalOrigin
		ModalOrigin=1
		dispatch({
			type:'dyjglPageConfig/updatePayload',
			payload:{ModalOrigin:1,visible:true}
		})
	}

	if(dyjglPageConfig.ModalOrigin==1){
		return (
			<div>
				<Button type="primary" size="large" style={{marginBottom:20}} onClick={newDydl}>添加出品部门<Icon type="plus" /></Button>
				<Table 
					bordered
					columns={columns}
					dataSource={dyjglPageConfig.dataSource}
					pagination={pagination}
				/>
				<RegistrationForm {...BaseInfoProps} />
			</div>
		)
	}else if(dyjglPageConfig.ModalOrigin==2){
		return (
			<div>
				<Button type="primary" size="large" style={{marginBottom:20}} onClick={newDydl}>添加出品部门<Icon type="plus" /></Button>
				<Table 
					bordered
					columns={columns}
					dataSource={dyjglPageConfig.dataSource}
					pagination={pagination}
				/>
				<RegistrationForm2 {...BaseInfoProps}/>
			</div>
		)
	}
	
};


function mapStateToProps({ dyjglPageConfig }) {
    return { dyjglPageConfig };
}

export default connect(mapStateToProps)(DyjdlglInfo);