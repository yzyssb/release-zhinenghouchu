import React, { PropTypes } from 'react';
import Header from '../../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import Form from 'antd/lib/form';
const FormItem = Form.Item;
import Spin from 'antd/lib/spin';
import moment from 'moment';
import DatePicker from 'antd/lib/date-picker';
import { TimePicker } from 'antd';
import Button from 'antd/lib/button';
import Table from 'antd/lib/table';
import Select from 'antd/lib/select';
import Input from 'antd/lib/input';
import { Radio, InputNumber, Transfer, Switch, Checkbox, Modal } from 'antd';
const { TextArea } = Input;
const Option = Select.Option
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
import message from 'antd/lib/message';
import Breadcrumb from 'antd/lib/breadcrumb';
import { Popover } from 'antd';
import Popconfirm from 'antd/lib/popconfirm';
import { TreeTransfer, getAllTreeData } from '../../../../components/treetransfer_yzy';

const Form_yzy = ({
    form: {
        getFieldDecorator,
	validateFields,
	getFieldsValue,
	resetFields,
    },
	newFangan,
	dispatch,
}) => {
	const formItemLayout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 12 },
	}

	function resetFormTimeout(resetFields, dispatch) {
		if (resetFields) {
			resetFields();
		}
		if (dispatch) {
			dispatch({
				type: 'newFangan/updatePayload',
				payload: {
					baseInfoFormRest: 0,
				},
			});
		}
	}

	if (newFangan.baseInfoFormRest) {
		setTimeout(function () { resetFormTimeout(resetFields, dispatch) }, 20);
	}

	function back() {
		window.history.go(-1)
	}

	function prevAction() {
		dispatch({
			type: 'newFangan/updatePayload',
			payload: {
				activeStop: (--newFangan.activeStop < 1 ? 1 : newFangan.activeStop)
			}
		})
	}

	function nextAction() {
		if (newFangan.activeStop == 1) {
			const value = getFieldsValue()
			validateFields((errors) => {
				if (!!errors) {
					return false;
				}

				value.programmeName = trim(value.programmeName)

				if (value.programmeStartTime) {
					value.programmeStartTime = new Date(value.programmeStartTime.format('YYYY-MM-DD 03:00:00')).getTime()
				}

				if (!(value.programmeName.length > 0 && value.programmeName == newFangan.static_programmeName)) {
					dispatch({
						type: 'newFangan/restaurantChoseCheckName',
						payload: {
							name: value.programmeName
						}
					})
				} else {
					dispatch({
						type: 'newFangan/updatePayload',
						payload: {
							activeStop: (++newFangan.activeStop > 3 ? 3 : newFangan.activeStop)
						}
					})
				}

				dispatch({
					type: 'newFangan/updatePayload',
					payload: {
						values: value
					}
				})
			})
		} else if (newFangan.activeStop == 2) {
			if (newFangan.pushTimes.length == 0) {
				message.error('至少有一个任务')
				return
			} else {
				for (let i = 0; i < newFangan.pushTimes.length; i++) {
					if (newFangan.pushTimes[i].timeOne == '' && newFangan.pushTimes[i].taskType == 1 || newFangan.pushTimes[i].timeOne == '' && newFangan.pushTimes[i].taskModality == 2) {
						message.error('抢单时间1必填')
						return
					}
				}
				dispatch({
					type: 'newFangan/updatePayload',
					payload: {
						activeStop: (++newFangan.activeStop > 3 ? 3 : newFangan.activeStop)
					}
				})
			}
		} else {
			if (newFangan.storeIds.length == 0) {
				message.error('请先选择要使用该方案的门店')
			} else {
				let postObj = {}
				for (var key in newFangan.values) {
					postObj[key] = newFangan.values[key]
				}

				var arr = []
				newFangan.pushTimes.map(v => {
					var obj = {}
					for (var key in v) {
						obj[key] = v[key]
					}
					if (obj.taskModality == 1) {
						obj.timeOne = ''
						obj.timeTwo = ''
						obj.timeThree = ''
						obj.timeFour = ''
						obj.timeFive = ''
					}
					delete obj['key']
					delete obj['taskDetails']
					arr.push(obj)
				})

				postObj['pushTimes'] = arr
				postObj['storeIds'] = newFangan.storeIds

				if (!newFangan.id || newFangan.id && newFangan.copy) {
					dispatch({
						type: 'newFangan/chainprogrammeAdd',
						payload: postObj
					})
				} else {
					dispatch({
						type: 'newFangan/chainprogrammeUpdate',
						payload: postObj
					})
				}
			}
		}

	}

	function trim(str) {
		return str.replace(/\s*/g, "");
	}

	function loadIn() {
		sessionStorage.setItem('selectedRightKeys_temp', sessionStorage.getItem('selectedRightKeys_yzy'))
		dispatch({
			type: 'newFangan/updatePayload',
			payload: {
				modal_show: true,
			}
		})
	}


	function saveModal() {
		var rightKeys = sessionStorage.getItem('selectedRightKeys_yzy')
		rightKeys = rightKeys.split(',')

		let pushTimes = []
		if (rightKeys.length >= 1) {
			rightKeys.map((v, i) => {
				if (newFangan.mockData.length > 0) {
					newFangan.mockData.map((vv, ii) => {
						if (v == vv.id+'S') {
							let obj = {}
							obj.taskId = vv.id
							obj.taskDetails = vv.taskDetails
							obj.taskModality = vv.taskModality
							obj.taskType = vv.taskType
							obj.timeOne = ''
							obj.timeTwo = ''
							obj.timeThree = ''
							obj.timeFour = ''
							obj.timeFive = ''
							pushTimes.push(obj)
						}
					})
				}
			})
		}

		pushTimes.sort(function(a,b){return parseFloat(a.taskId)-parseFloat(b.taskId)})

		for (var i = 0; i < pushTimes.length; i++) {
			pushTimes[i].key = (i + 1) < 10 ? ('0' + (i + 1)) : (i + 1)
		}

		if (newFangan.pushTimes.length > 0) {
			newFangan.pushTimes.map(v => {
				if (pushTimes.length > 0) {
					pushTimes.map(vv=> {
						if (v.taskId == vv.taskId) {
							vv.timeOne = v.timeOne
							vv.timeTwo = v.timeTwo
							vv.timeThree = v.timeThree
							vv.timeFour = v.timeFour
							vv.timeFive = v.timeFive
						}
					})
				}
			})
		}

		//处理数据
		handleForTreeTransfer(rightKeys)

		dispatch({
			type: 'newFangan/updatePayload',
			payload: {
				pushTimes: pushTimes,
				modal_show: false
			}
		})
	}

	function closeModal() {
		var rightKeys = sessionStorage.getItem('selectedRightKeys_temp')
		rightKeys = rightKeys.split(',')

		let pushTimes = []
		if (rightKeys.length >= 1) {
			rightKeys.map((v, i) => {
				if (newFangan.mockData.length > 0) {
					newFangan.mockData.map((vv, ii) => {
						if (v == vv.id+'S') {
							let obj = {}
							obj.taskId = vv.id
							obj.taskDetails = vv.taskDetails
							obj.taskModality = vv.taskModality
							obj.taskType = vv.taskType
							obj.timeOne = ''
							obj.timeTwo = ''
							obj.timeThree = ''
							obj.timeFour = ''
							obj.timeFive = ''
							pushTimes.push(obj)
						}
					})
				}
			})
		}

		pushTimes.sort(function(a,b){return parseFloat(a.taskId)-parseFloat(b.taskId)})

		for (var i = 0; i < pushTimes.length; i++) {
			pushTimes[i].key = (i + 1) < 10 ? ('0' + (i + 1)) : (i + 1)
		}

		if (newFangan.pushTimes.length > 0) {
			newFangan.pushTimes.map(v => {
				if (pushTimes.length > 0) {
					pushTimes.map(vv => {
						if (v.taskId == vv.taskId) {
							vv.timeOne = v.timeOne
							vv.timeTwo = v.timeTwo
							vv.timeThree = v.timeThree
							vv.timeFour = v.timeFour
							vv.timeFive = v.timeFive
						}
					})
				}
			})
		}

		//处理数据
		handleForTreeTransfer(rightKeys)

		dispatch({
			type: 'newFangan/updatePayload',
			payload: {
				modal_show: false,
				pushTimes
			}
		})
	}

	function delSome() {
		if (newFangan.disabled) {
			return
		}
		var pushTimes = newFangan.pushTimes, rightKeys = sessionStorage.getItem('selectedRightKeys_yzy')
		rightKeys = rightKeys.split(',')
		if (newFangan.selectedRowKeys.length == 0) {
			message.error('请先选择任务')
		} else {

			for(var i=rightKeys.length-1;i>=0;i--){
				var idx=newFangan.selectedRowKeys.indexOf(+rightKeys[i].split('S')[0])
				if(idx!=-1)
					rightKeys.splice(i,1)
			}

			for(var i=pushTimes.length-1;i>=0;i--){
				var idx=newFangan.selectedRowKeys.indexOf(pushTimes[i].taskId)
				if(idx!=-1)
					pushTimes.splice(i,1)
			}
			
			sessionStorage.setItem('selectedRightKeys_yzy',rightKeys)

			pushTimes.sort(function(a,b){ return a.taskId-b.taskId})

			for (var i = 0; i < pushTimes.length; i++) {
				pushTimes[i].key = (i + 1) < 10 ? ('0' + (i + 1)) : (i + 1)
			}

			//处理数据
			handleForTreeTransfer(rightKeys)

			dispatch({
				type: 'newFangan/updatePayload',
				payload: {
					pushTimes,
					selectedRowKeys: []
				}
			})
		}
	}


	//对穿梭框的处理
	function handleForTreeTransfer(rightKeys=[],leftData=[],rightData=[]){
		var isExist=false
		if (newFangan.mockData.length > 0) {
			newFangan.mockData.map(v => {
				isExist = false
				for(var i=0;i<rightKeys.length;i++){
					if(v.id+ 'S'==rightKeys[i]){
						isExist=true
						break
					}
				}
				function leftDataOrRight(newObj){
					let obj={}
					obj['key']=v.id+'S'
					obj['title']=(v.taskType==1||v.taskModality==2)?v.taskDetails[0].taskName:v.foodName
					newObj.push(obj)
					if(v.taskDetails&&v.taskDetails.length>0&&v.taskType==2&&v.taskModality==1){
						v.taskDetails.map(vv=>{
							let obj1={}
							obj1['key']=vv.id+''
							obj1['parentKey']=v.id+'S'
							obj1['title']=vv.taskName
							for(var key in vv){
								obj1[key]=vv[key]
							}
							obj1['disableCheckbox']=v.taskModality==1?true:false
							newObj.push(obj1)
						})
					}
				}
				leftDataOrRight(isExist?rightData:leftData)
			})
		}

		leftData.sort(function (a, b) { return parseFloat(a.key) - parseFloat(b.key) })
		rightData.sort(function (a, b) { return parseFloat(a.key) - parseFloat(b.key) })

		dispatch({
			type:'newFangan/updatePayload',
			payload:{
				leftData,
				rightData
			}
		})
	}

	function renderItem(item) {
		var arr = []
		const customLabel = (
			<span className="custom-item">
				{item.taskDetails && item.taskDetails.length > 0 && item.taskDetails.map((v, i) => {
					arr.push(v.taskName)
					return arr.join('+')
				})}
			</span>
		);

		return {
			label: customLabel, // for displayed item
			value: item.id, // for title and filter matching
		};
	}

	function transferChange1(targetKeys, direction, moveKeys) {
		dispatch({
			type: 'newFangan/updatePayload',
			payload: {
				targetKeys1: targetKeys,
				storeIds: targetKeys
			}
		})
	}

	function renderItem1(item) {
		const customLabel = (
			<span className="custom-item">
				{item.restaurantName}
			</span>
		);

		return {
			label: customLabel, // for displayed item
			value: item.restaurantId, // for title and filter matching
		};
	}

	function filterOption(inputValue, option) {
		var taskDetails = option.taskDetails, arr = []
		if (option.taskDetails.length > 0) {
			option.taskDetails.map(v => {
				arr.push(v.taskName)
			})
		}
		return arr.join('+').indexOf(inputValue) > -1;
	}

	function filterOption1(inputValue, option) {
		return option.restaurantName.indexOf(inputValue) > -1;
	}

	const rowSelection = {
		selectedRowKeys: newFangan.selectedRowKeys,
		onChange: (selectedRowKeys, selectedRows) => {
			dispatch({
				type: 'newFangan/updatePayload',
				payload: {
					selectedRowKeys,
					selectedRows
				}
			})
		}
	};
	

	const columns = [
		{ title: '序号', dataIndex: 'key', key: 'key', width: 80 },
		{
			title: '任务名称', dataIndex: 'taskName', key: 'taskName', width: 200, render: (text, record, index) => (
				<div>
					{record.taskDetails && record.taskDetails.length > 0 && record.taskDetails.map((v, i) => (
						<div key={i}>{v.taskName}</div>
					))}
				</div>
			)
		},
		{
			title: '抢单时间1(必填)', dataIndex: 'key1', key: 'key1', width: 180, render: (text, record, index) => {
				if (record.taskModality == 1) {
					return {
						children: <span>*按时自动触发任务</span>,
						props: {
							colSpan: 5,
						},
					}
				} else {
					return (<TimePicker value={record.timeOne.length == 0 ? null : moment(record.timeOne + ':00', 'HH:mm')} format="HH:mm" disabled={newFangan.disabled} onChange={(time, timeString) => timeChoose(time, timeString, record, index, 'timeOne')} />)
				}
			}
		},
		{
			title: '抢单时间2', dataIndex: 'key2', key: 'key2', width: 180, render: (text, record, index) => {
				if (record.taskModality == 1) {
					return {
						children: <span></span>,
						props: {
							colSpan: 0,
						},
					}
				} else {
					return (<TimePicker value={record.timeTwo.length == 0 ? null : moment(record.timeTwo + ':00', 'HH:mm')} format="HH:mm" disabled={newFangan.disabled||record.taskType==2&&record.taskModality==2} onChange={(time, timeString) => timeChoose(time, timeString, record, index, 'timeTwo')} />)
				}
			}
		},
		{
			title: '抢单时间3', dataIndex: 'key3', key: 'key3', width: 180, render: (text, record, index) => {
				if (record.taskModality == 1) {
					return {
						children: <span></span>,
						props: {
							colSpan: 0,
						},
					}
				} else {
					return (<TimePicker value={record.timeThree.length == 0 ? null : moment(record.timeThree + ':00', 'HH:mm')} format="HH:mm" disabled={newFangan.disabled||record.taskType==2&&record.taskModality==2} onChange={(time, timeString) => timeChoose(time, timeString, record, index, 'timeThree')} />)
				}
			}
		},
		{
			title: '抢单时间4', dataIndex: 'key4', key: 'key4', width: 180, render: (text, record, index) => {
				if (record.taskModality == 1) {
					return {
						children: <span></span>,
						props: {
							colSpan: 0,
						},
					}
				} else {
					return (<TimePicker value={record.timeFour.length == 0 ? null : moment(record.timeFour + ':00', 'HH:mm')} format="HH:mm" disabled={newFangan.disabled||record.taskType==2&&record.taskModality==2} onChange={(time, timeString) => timeChoose(time, timeString, record, index, 'timeFour')} />)
				}
			}
		},
		{
			title: '抢单时间5', dataIndex: 'key5', key: 'key5', width: 180, render: (text, record, index) => {
				if (record.taskModality == 1) {
					return {
						children: <span></span>,
						props: {
							colSpan: 0,
						},
					}
				} else {
					return (<TimePicker value={record.timeFive.length == 0 ? null : moment(record.timeFive + ':00', 'HH:mm')} format="HH:mm" disabled={newFangan.disabled||record.taskType==2&&record.taskModality==2} onChange={(time, timeString) => timeChoose(time, timeString, record, index, 'timeFive')} />)
				}
			}
		},
	]

	const columns_changeTime = [
		{ title: '抢单时间1', dataIndex: 'timeOne', key: 'timeOne', render: (text, record, index) => (<TimePicker placeholder="不改变" value={record.timeOne.length == 0 ? null : moment(record.timeOne + ':00', 'HH:mm')} format="HH:mm" onChange={(time, timeString) => timeChoose1(time, timeString, record, index, 'timeOne')} />) },
		{ title: '抢单时间2', dataIndex: 'timeTwo', key: 'timeTwo', render: (text, record, index) => (<TimePicker placeholder="不改变" value={record.timeTwo.length == 0 ? null : moment(record.timeTwo + ':00', 'HH:mm')} format="HH:mm" onChange={(time, timeString) => timeChoose1(time, timeString, record, index, 'timeTwo')} />) },
		{ title: '抢单时间3', dataIndex: 'timeThree', key: 'timeThree', render: (text, record, index) => (<TimePicker placeholder="不改变" value={record.timeThree.length == 0 ? null : moment(record.timeThree + ':00', 'HH:mm')} format="HH:mm" onChange={(time, timeString) => timeChoose1(time, timeString, record, index, 'timeThree')} />) },
		{ title: '抢单时间4', dataIndex: 'timeFour', key: 'timeFour', render: (text, record, index) => (<TimePicker placeholder="不改变" value={record.timeFour.length == 0 ? null : moment(record.timeFour + ':00', 'HH:mm')} format="HH:mm" onChange={(time, timeString) => timeChoose1(time, timeString, record, index, 'timeFour')} />) },
		{ title: '抢单时间5', dataIndex: 'timeFive', key: 'timeFive', render: (text, record, index) => (<TimePicker placeholder="不改变" value={record.timeFive.length == 0 ? null : moment(record.timeFive + ':00', 'HH:mm')} format="HH:mm" onChange={(time, timeString) => timeChoose1(time, timeString, record, index, 'timeFive')} />) }
	]

	function timeChoose(time, timeString, record, index, key) {
		let pushTimes = newFangan.pushTimes
		pushTimes[index][key] = timeString
		dispatch({
			type: 'newFangan/updatePayload',
			payload: {
				pushTimes: pushTimes
			}
		})
	}

	function timeChoose1(time, timeString, record, index, key) {
		let changeTimes = newFangan.changeTimes
		changeTimes[index][key] = timeString
		dispatch({
			type: 'newFangan/updatePayload',
			payload: {
				changeTimes: changeTimes
			}
		})
	}

	function leaveAction() {
		window.history.go(-1)
	}

	const disabledStartDate = (startValue) => {
		if (!startValue) {
			return false;
		}
		return startValue.valueOf() < new Date().valueOf();
	}

	const pagination = {
		pageSize: newFangan.pushTimes.length,
		hideOnSinglePage: true
	};

	return (
		<Form style={{ padding: '50px' }}>
			{newFangan.activeStop == 1 &&
				<div>
					<FormItem {...formItemLayout} label="名称">
						{getFieldDecorator('programmeName', {
							initialValue: Object.keys(newFangan.values).length > 0 ? newFangan.values.programmeName : '',
							rules: [{ required: true, message: '请填写名称' }]
						})(
							<Input placeholder="您想如何为任务添加方案命名？" disabled={newFangan.disabled} maxLength="40" />
							)}
					</FormItem>
					<FormItem {...formItemLayout} label="描述" extra="描述限制 200 个字">
						{getFieldDecorator('programmeDescribe', {
							initialValue: Object.keys(newFangan.values).length > 0 ? newFangan.values.programmeDescribe : '',
						})(
							<TextArea rows={4} maxLength="200" disabled={newFangan.disabled} placeholder="请描述您的任务方案" />
							)}
					</FormItem>
					<FormItem {...formItemLayout} label="方案开始执行时间">
						{getFieldDecorator('programmeIsNow', {
							initialValue: Object.keys(newFangan.values).length > 0 ? String(newFangan.values.programmeIsNow) : '1'
						})(
							<RadioGroup disabled={newFangan.disabled}>
								<Radio value="1">立即执行</Radio>
								<Radio value="2">指定时间</Radio>
							</RadioGroup>
							)}
					</FormItem>
					{getFieldsValue().programmeIsNow == 2 &&
						<FormItem {...formItemLayout} style={{ marginLeft: '25%' }}>
							{getFieldDecorator('programmeStartTime', {
								initialValue: Object.keys(newFangan.values).length > 0 ? newFangan.values.programmeStartTime && (new Date(newFangan.values.programmeStartTime).getTime() >= new Date(moment().add(1, 'day').format('YYYY-MM-DD 00:00:00')).getTime()) ? moment(new Date(newFangan.values.programmeStartTime), 'YYYY-MM-DD') : moment().add(1, 'day') : moment().add(1, 'day'),
								rules: [{ required: true, message: '请选择日期' }]
							})(
								<DatePicker disabled={newFangan.disabled} disabledDate={disabledStartDate} showToday={false} />
								)}
						</FormItem>
					}
				</div>
			}
			{newFangan.activeStop == 2 &&
				<div>
					<div style={{ lineHeight: '40px', paddingLeft: 24 }}>
						{/*<Checkbox onChange={allChoose}></Checkbox>*/}
						<a style={{ marginLeft: 20 }} onClick={() => {
							if (newFangan.disabled) {
								return
							}
							if (newFangan.selectedRowKeys.length == 0) {
								message.error('请先选择任务')
								return
							}
							dispatch({
								type: 'newFangan/updatePayload',
								payload: {
									editTimeModal: true
								}
							})
						}}>批量更改时间</a>
						<Popconfirm title="确定要批量删除选中的任务?" onConfirm={delSome} onCancel={() => { }} okText="确定" cancelText="取消">
							<a style={{ marginLeft: 20 }}>批量删除</a>
						</Popconfirm>
						<Button style={{ float: 'right' }} type="primary" disabled={newFangan.disabled} onClick={loadIn}>导入任务</Button>
					</div>
					<p style={{ color: '#999' }}>抢单时间最多可设置5个，代表每天可执行5次任务，至少填写一个。</p>
					<Table
						columns={columns}
						dataSource={newFangan.pushTimes}
						bordered
						rowSelection={newFangan.disabled ? null : rowSelection}
						rowKey={record => record.taskId}
						pagination={pagination}
						scroll={{ x: newFangan.pushTimes.length == 0 ? false : 1500, y: 400 }}
					/>

					<Modal
						title="批量修改时间"
						width="1000px"
						visible={newFangan.editTimeModal}
						onCancel={() => {
							dispatch({
								type: 'newFangan/updatePayload',
								payload: {
									changeTimes: [{ key: 1, timeOne: '', timeTwo: '', timeThree: '', timeFour: '', timeFive: '' }],
									editTimeModal: false
								}
							})
						}}
						onOk={() => {
							let pushTimes = newFangan.pushTimes
							newFangan.selectedRowKeys.map((v) => {
								pushTimes.map((vv) => {
									if (vv.taskId == v) {
										vv.timeOne = newFangan.changeTimes[0].timeOne == '' ? vv.timeOne : newFangan.changeTimes[0].timeOne
										vv.timeTwo = newFangan.changeTimes[0].timeTwo == '' ? vv.timeTwo : (vv.taskType == 2&&vv.taskModality == 2) ?'': newFangan.changeTimes[0].timeTwo
										vv.timeThree = newFangan.changeTimes[0].timeThree == '' ? vv.timeThree : (vv.taskType == 2&&vv.taskModality == 2) ? '':newFangan.changeTimes[0].timeThree
										vv.timeFour = newFangan.changeTimes[0].timeFour == '' ? vv.timeFour : (vv.taskType == 2&&vv.taskModality == 2) ?'': newFangan.changeTimes[0].timeFour
										vv.timeFive = newFangan.changeTimes[0].timeFive == '' ? vv.timeFive : (vv.taskType == 2&&vv.taskModality == 2) ? '':newFangan.changeTimes[0].timeFive
									}
								})
							})
							dispatch({
								type: 'newFangan/updatePayload',
								payload: {
									pushTimes: pushTimes,
									changeTimes: [{ key: 1, timeOne: '', timeTwo: '', timeThree: '', timeFour: '', timeFive: '' }],
									editTimeModal: false
								}
							})
						}}
					>
						<Table
							columns={columns_changeTime}
							dataSource={newFangan.changeTimes}
							bordered
							pagination={false}
						/>
					</Modal>
				</div>
			}
			{newFangan.activeStop == 3 &&
				<div style={{ height: 500, textAlign: 'center' }}>
					<div style={{ width: 650, margin: '0 auto', lineHeight: '30px' }}>
						<div style={{ display: 'inline-block', width: '50%' }}>可选门店</div>
						<div style={{ display: 'inline-block', width: '50%' }}>已选门店</div>
					</div>
					<Transfer
						dataSource={newFangan.mockData1}
						listStyle={{
							width: 300,
							height: 470,
							textAlign: 'left'
						}}
						targetKeys={newFangan.targetKeys1}
						onChange={transferChange1}
						render={renderItem1}
						showSearch
						filterOption={filterOption1}
					/>
				</div>
			}
			<Modal
				title="任务列表"
				width="800px"
				visible={newFangan.modal_show}
				onCancel={closeModal}
				footer={false}
				destroyOnClose={true}
			>
				<div style={{ height: 500, textAlign: 'center' }}>

					<div style={{ textAlign: 'left', padding: '15px 92px' }}>
						<TreeTransfer
							placeholder={'查找需要选择的菜品或任务'}
							showSearch={true}
							treeWidth={250}
							treeHeight={400}
							getAllTreeData={getAllTreeData} leftTreeData={newFangan.leftData} rightTreeData={newFangan.rightData}
							leftTitle={'可选任务'}
							rightTitle={'已选任务'}
						/>
					</div>

					<div style={{ textAlign: 'center', padding: '15px 0' }}>
						<Button onClick={closeModal}>取消</Button>
						<Button type="primary" style={{ marginLeft: 20 }} onClick={saveModal}>保存</Button>
					</div>
				</div>
			</Modal>

			<div style={{ textAlign: 'center', margin: '50px auto' }}>
				<Popconfirm title={Object.keys(newFangan.values).length > 0 ? newFangan.disabled ? "确定要退出查看该方案?" : "确定要取消编辑该方案?" : "确定要取消新创建的方案?"} onConfirm={leaveAction} onCancel={() => { }} okText="确定" cancelText="取消">
					<Button>取消</Button>
				</Popconfirm>
				{newFangan.activeStop > 1 && <Button style={{ marginLeft: 30 }} onClick={prevAction}>上一步</Button>}
				{!(newFangan.disabled && newFangan.activeStop == 3) && <Button style={{ marginLeft: 30 }} type="primary" onClick={nextAction}>{newFangan.activeStop < 3 ? '下一步' : '保存'}</Button>}
			</div>
		</Form>
	)

}
Form_yzy.propTypes = {
	form: PropTypes.object.isRequired
};

const Form_YZY = Form.create()(Form_yzy);


function NewFanganPage({ menu, dispatch, newFangan }) {
	const HeaderProps = {
		menu,
		dispatch,
	};

	function back() {
		window.history.go(-1)
	}

	return (
		<Header {...HeaderProps}>
			<div style={{ background: '#eee', padding: '10px 20px', marginBottom: 15 }}>
				<Breadcrumb separator=">">
					<Breadcrumb.Item onClick={back} style={{ cursor: 'pointer' }}>任务方案</Breadcrumb.Item>
					<Breadcrumb.Item>{Object.keys(newFangan.values).length > 0 ? '编辑方案' : '添加方案'}</Breadcrumb.Item>
				</Breadcrumb>
			</div>
			<Spin spinning={newFangan.loading} style={{ position: 'absolute', width: 'calc(100% - 50px)', paddingTop: '300px', zIndex: '99' }} size="large" />
			<div style={{ width: '80%', margin: '10px auto', position: 'relative' }}>
				<div style={{ textAlign: 'center' }}>
					{newFangan.activeStop == 1 ?
						<span style={{ display: 'flex', justifyContent: 'space-between' }}>
							<span style={{ color: '#0F8FEA' }}>基本设置</span>
							<span>任务推送</span>
							<span>门店限制</span>
						</span>
						: newFangan.activeStop == 2 ?
							<span style={{ display: 'flex', justifyContent: 'space-between' }}>
								<span style={{ color: '#0F8FEA' }}>基本设置</span>
								<span style={{ color: '#0F8FEA' }}>任务推送</span>
								<span>门店限制</span>
							</span>
							: newFangan.activeStop == 3 &&
							<span style={{ display: 'flex', justifyContent: 'space-between' }}>
								<span style={{ color: '#0F8FEA' }}>基本设置</span>
								<span style={{ color: '#0F8FEA' }}>任务推送</span>
								<span style={{ color: '#0F8FEA' }}>门店限制</span>
							</span>
					}

				</div>
				<div style={{ margin: '10px 0', textAlign: 'center', position: 'relative', zIndex: '10' }}>
					{newFangan.activeStop == 1 ?
						<span style={{ display: 'flex', justifyContent: 'space-between' }}>
							<span style={{ width: 20, height: 20, borderRadius: '50%', border: '1px solid #ddd', background: '#fff', marginLeft: '18px', border: '1px solid #0F8FEA' }}></span>
							<span style={{ width: 20, height: 20, borderRadius: '50%', border: '1px solid #ddd', background: '#fff' }}></span>
							<span style={{ width: 20, height: 20, borderRadius: '50%', border: '1px solid #ddd', background: '#fff', marginRight: '18px' }}></span>
						</span>
						: newFangan.activeStop == 2 ?
							<span style={{ display: 'flex', justifyContent: 'space-between' }}>
								<span style={{ width: 20, height: 20, borderRadius: '50%', border: '1px solid #ddd', background: '#0F8FEA', marginLeft: '18px', border: '1px solid #0F8FEA' }}></span>
								<span style={{ width: 20, height: 20, borderRadius: '50%', border: '1px solid #ddd', background: '#fff', border: '1px solid #0F8FEA' }}></span>
								<span style={{ width: 20, height: 20, borderRadius: '50%', border: '1px solid #ddd', background: '#fff', marginRight: '18px' }}></span>
							</span>
							: newFangan.activeStop == 3 &&
							<span style={{ display: 'flex', justifyContent: 'space-between' }}>
								<span style={{ width: 20, height: 20, borderRadius: '50%', border: '1px solid #ddd', background: '#0F8FEA', marginLeft: '18px', border: '1px solid #0F8FEA' }}></span>
								<span style={{ width: 20, height: 20, borderRadius: '50%', border: '1px solid #ddd', background: '#0F8FEA', border: '1px solid #0F8FEA' }}></span>
								<span style={{ width: 20, height: 20, borderRadius: '50%', border: '1px solid #ddd', background: '#fff', marginRight: '18px', border: '1px solid #0F8FEA' }}></span>
							</span>
					}
				</div>
				<div style={{ position: 'absolute', top: '41px', left: '18px', display: 'flex', width: 'calc(100% - 36px)', height: 1 }}>
					{newFangan.activeStop == 1 ?
						<span style={{ width: '100%', display: 'flex' }}>
							<span style={{ borderTop: '1px solid #dddd', width: '50%' }}></span>
							<span style={{ borderTop: '1px solid #dddd', width: '50%' }}></span>
						</span>
						: newFangan.activeStop == 2 ?
							<span style={{ width: '100%', display: 'flex' }}>
								<span style={{ borderTop: '1px solid #0F8FEA', width: '50%' }}></span>
								<span style={{ borderTop: '1px solid #dddd', width: '50%' }}></span>
							</span>
							: newFangan.activeStop == 3 &&
							<span style={{ width: '100%', display: 'flex' }}>
								<span style={{ borderTop: '1px solid #0F8FEA', width: '50%' }}></span>
								<span style={{ borderTop: '1px solid #0F8FEA', width: '50%' }}></span>
							</span>
					}
				</div>
			</div>
			<Form_YZY dispatch={dispatch} newFangan={newFangan} />
		</Header>
	);

}

NewFanganPage.propTypes = {
	menu: PropTypes.object,
};

function mapStateToProps({ menu, newFangan }) {
	return { menu, newFangan };
}

export default connect(mapStateToProps)(NewFanganPage);

