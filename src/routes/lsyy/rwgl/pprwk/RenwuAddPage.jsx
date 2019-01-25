import React, { PropTypes } from 'react';
import Header from '../../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import Form from 'antd/lib/form';
const FormItem = Form.Item;
import Spin from 'antd/lib/spin';
import Button from 'antd/lib/button';
import Select from 'antd/lib/select';
import Input from 'antd/lib/input';
const Option = Select.Option
import { Switch, Radio, InputNumber, Popover, Icon } from 'antd';
const RadioGroup = Radio.Group;
import message from 'antd/lib/message';
import Popconfirm from 'antd/lib/popconfirm';
import Modal from 'antd/lib/modal';
import Breadcrumb from 'antd/lib/breadcrumb';
import common from './common.less';


var timer
const Form_yzy = ({
    form: {
        getFieldDecorator,
	validateFields,
	getFieldsValue,
	resetFields,
	setFieldsValue
    },
	renwuAdd,
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
				type: 'renwuAdd/updatePayload',
				payload: {
					baseInfoFormRest: 0,
				},
			});
		}
	}

	if (renwuAdd.baseInfoFormRest) {
		setTimeout(function () { resetFormTimeout(resetFields, dispatch) }, 20);
	}

	if (renwuAdd.baseInfoFormRest2) {
		setTimeout(() => {
			resetFields('taskModality')
			dispatch({
				type: 'renwuAdd/updatePayload',
				payload: {
					baseInfoFormRest2: 0,
				},
			});
		}, 20)
	}

	function back() {
		window.history.go(-1)
	}

	function newAction() {
		const value = getFieldsValue()
		if (value.taskType == 2 && renwuAdd.foodList.length == 0) {
			message.error('该品牌下菜品列表为空，无法完成创建')
			return
		}
		if (renwuAdd.nameExist) {
			message.error('名称重复了')
			return
		}
		validateFields((errors) => {
			if (!!errors) {
				return false;
			}
			//后厨任务判断工序
			if (value.taskType == 2) {
				if (renwuAdd.chainTaskDetailVos.length == 0) {
					message.error(renwuAdd.taskModality == 1 ? '请先添加工序' : '请先添加任务')
					return;
				}
				//流水线任务
				if (value.taskModality == 1) {
					//判断是否有二级工序
					var hasSecondeLevel = false
					for (var i = 0; i < renwuAdd.chainTaskDetailVos.length; i++) {
						if (renwuAdd.chainTaskDetailVos[i].yzyLevel >= 2) {
							hasSecondeLevel = true
							break;
						}
					}
					if (!hasSecondeLevel) {
						message.error('流水线任务必须要有二级工序')
						return;
					}
				}
			}

			if (value.taskType == 2) {
				var chainTaskDetailVos = renwuAdd.chainTaskDetailVos, arr = []
				chainTaskDetailVos.map(v => {
					let obj = {}
					for (var key in v) {
						obj[key] = v[key]
					}
					arr.push(obj)
				})
				arr.map(v => {
					delete v['yzyId']
					delete v['yzyLevel']
					v.staffState = v.staffState ? '1' : '2'
					v.code = +v.code
					v.parentCode = +v.parentCode
					v.executeTime = +v.executeTime
				})

				value.foodId = +value.foodId
				value.chainTaskDetailVos = arr
			} else {
				value.chainTaskDetailVos = [
					{
						taskName: value.taskName,
						taskReckonNum: value.taskReckonNum
					}
				]
				delete value['taskName']
				delete value['taskReckonNum']
			}

			if (renwuAdd.hasData) {
				dispatch({
					type: 'renwuAdd/chaintaskTaskUpdate',
					payload: value
				})
			} else {
				value.id = 0
				dispatch({
					type: 'renwuAdd/chaintaskTaskAdd',
					payload: value
				})
			}
		})
	}

	const content = (
		<div>
			<div>流水线任务：必须由多级工序组成，且自动分时执行；</div>
			<div>普通任务：由一个或多个任务组成，没有工序概念，且需要手动设置执行时间。</div>
		</div>
	)

	function addLevelOne() {
		dispatch({
			type: 'renwuAdd/updatePayload',
			payload: {
				visible: true,
				targetCode: 0,
				targetYzyId: 0,
				targetLevel: 0,
				executeType: 2,//流水线任务一级默认“自动分时执行”
				disabledChange: true,//流水线任务一级默认“自动分时执行”,不可修改
				editStep: {}
			}
		})
		setTimeout(() => {
			resetFields('executeType')
		}, 20)
	}

	function addChildren(record) {
		dispatch({
			type: 'renwuAdd/updatePayload',
			payload: {
				visible: true,
				targetCode: record.code,
				targetYzyId: record.yzyId,
				targetLevel: record.yzyLevel,
				executeType: 1,
				disabledChange: record.executeType == 1 ? true : false,//如果上一级是“按上级时间执行”，择下一级必须是“按上级时间执行”
				editStep: {}
			}
		})
		setTimeout(() => {
			resetFields('executeType')
		}, 20)
	}

	function edit(record) {
		record.staffState = record.staffState == 1 ? true : false

		var chainTaskDetailVos = renwuAdd.chainTaskDetailVos, disabledChange = false
		for (var i = 0; i < chainTaskDetailVos.length; i++) {
			//编辑的这一项有子级工序且子级工序的执行方式是2，就不让修改执行方式
			if (!disabledChange && (chainTaskDetailVos[i].parentCode == record.code)) {
				disabledChange = chainTaskDetailVos[i].executeType == 2 ? true : false
				if (disabledChange) break
			}
			// 编辑的这一项的父级工序执行方式是1，就不让修改执行方式
			if (!disabledChange && (record.parentCode == chainTaskDetailVos[i].code)) {
				disabledChange = chainTaskDetailVos[i].executeType == 1 ? true : false
				if (disabledChange) break
			}
		}

		dispatch({
			type: 'renwuAdd/updatePayload',
			payload: {
				editStep: record,
				targetCode: record.code,
				targetYzyId: record.yzyId,
				targetLevel: record.yzyLevel,
				disabledChange,
				visible: true
			}
		})
		setTimeout(() => {
			dispatch({
				type: 'renwuAdd/updatePayload',
				payload: {
					baseInfoFormRest1: 1,
				}
			})
		}, 20)
	}

	function del(record) {
		var chainTaskDetailVos = renwuAdd.chainTaskDetailVos
		for (var i = chainTaskDetailVos.length - 1; i >= 0; i--) {
			if (chainTaskDetailVos[i].code.indexOf(record.code) > -1) {
				chainTaskDetailVos.splice(i, 1)
			}
		}
		dispatch({
			type: 'renwuAdd/updatePayload',
			payload: {
				chainTaskDetailVos
			}
		})
	}

	function taskModalityChange(e) {
		dispatch({
			type: 'renwuAdd/updatePayload',
			payload: {
				taskModality: e.target.value,
				chainTaskDetailVos: []
			}
		})
	}

	function foodIdChange(e) {
		dispatch({
			type: 'renwuAdd/updatePayload',
			payload: {
				foodId: e || '0',
				randArr: []
			}
		})
		dispatch({
			type: 'renwuAdd/chaintaskTaskDetail',
			payload: {}
		})
	}

	function checkAction(e) {
		dispatch({
			type: 'renwuAdd/updatePayload',
			payload: {
				qiantingBtnIsDisabled: e.target.value.length > 0 && true,
				isQianTing: true
			}
		})
		clearTimeout(timer)
		var a = e.target.value
		if (a.length > 0) {
			timer = setTimeout(() => {
				dispatch({
					type: 'renwuAdd/chaintaskTaskCheckName',
					payload: {
						name: a,
						id: renwuAdd.renwuObj && renwuAdd.renwuObj.chainTaskDetailVos && renwuAdd.renwuObj.chainTaskDetailVos[0].id || '0'
					}
				})
			}, 1000)
		}
	}

	return (
		<Form style={{ padding: '50px 200px 30px 0' }}>
			{renwuAdd.hasData &&
				<FormItem {...formItemLayout} label="id" style={{ display: 'none' }}>
					{getFieldDecorator('id', {
						initialValue: renwuAdd.renwuObj.id,
						rules: [{ required: true, message: 'id' }]
					})(
						<Input />
						)}
				</FormItem>
			}
			<FormItem {...formItemLayout} label="任务类型">
				{getFieldDecorator('taskType', {
					initialValue: renwuAdd.hasData ? String(renwuAdd.renwuObj.taskType) : '2',
					rules: [{ required: true, message: '请选择任务类型' }]
				})(
					<RadioGroup onChange={() => { resetFields() }} disabled={renwuAdd.hasData}>
						<Radio value="2">后厨加工任务</Radio>
						<Radio value="1">前厅任务</Radio>
					</RadioGroup>
					)}
			</FormItem>
			{/* 前厅任务显示分类 */}
			{getFieldsValue().taskType == 1 && (
				<div>
					<FormItem {...formItemLayout} label="任务名称">
						{getFieldDecorator('taskName', {
							initialValue: renwuAdd.hasData ? renwuAdd.renwuObj.taskName : '',
							rules: [{ required: true, message: '请输入任务名称' }],
							onChange: checkAction
						})(
							<Input placeholder="请输入任务名称" maxLength="20" />
							)}
					</FormItem>
					<FormItem {...formItemLayout} label="计件数">
						{getFieldDecorator('taskReckonNum', {
							initialValue: renwuAdd.hasData ? renwuAdd.renwuObj.taskReckonNum : '',
							rules: [{ required: true, message: '请输入计件数' }]
						})(
							<InputNumber style={{ width: '100%' }} placeholder="输入计件数" min={1} />
							)}
					</FormItem>
				</div>
			)}
			{/* 后厨任务显示分类 */}
			{getFieldsValue().taskType == 2 && (
				<div>
					<FormItem {...formItemLayout} label="选择菜品">
						{getFieldDecorator('foodId', {
							initialValue: renwuAdd.hasData ? String(renwuAdd.renwuObj.foodId) : '-1',
							rules: [{ required: true, message: '请选择菜品' }, { pattern: /^[1-9]{1}\d*$/, message: '请选择菜品' }],
							onChange: foodIdChange
						})(
							<Select style={{ width: 300 }} showSearch optionFilterProp="children"
								filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
							>
								<Option key={-1}>选择菜品</Option>
								{renwuAdd.foodList.length > 0 && renwuAdd.foodList.map((v, i) => (
									<Option key={v.id}>{v.name}</Option>
								))}
							</Select>
							)}
					</FormItem>
					<div style={{ position: 'relative' }}>
						<FormItem {...formItemLayout} label="选择任务形式">
							{getFieldDecorator('taskModality', {
								initialValue: String(renwuAdd.taskModality),
								rules: [{ required: true, message: '请选择任务形式' }],
								onChange: taskModalityChange
							})(
								<RadioGroup>
									<Radio value="1">流水线任务</Radio>
									<Radio value="2">普通任务</Radio>
								</RadioGroup>
								)}
						</FormItem>
						<Popover placement="rightTop" content={content} >
							<Icon type="question-circle" style={{ position: 'absolute', top: 13, left: 'calc(25% + 210px)' }} />
						</Popover>
					</div>
					<div style={{ marginLeft: '25%', width: 1020 }}>
						<Button type="primary" className={common.btnG} onClick={addLevelOne}>{renwuAdd.taskModality == 1 ? '添加工序' : '添加任务'}</Button>
						<div style={{ marginBottom: 15 }}>
							{renwuAdd.chainTaskDetailVos.length > 0 && renwuAdd.chainTaskDetailVos.map((v, i) => (
								<div key={i}>
									<div className={common.box}>
										<div className={common.processTxt} style={{ width: renwuAdd.taskModality == 1 ? 'calc(100% - 560px)' : 'calc(100% - 323px)' }}>
											{renwuAdd.taskModality == 1 && <span style={{ marginRight: 10, paddingLeft: 20 * ((v.yzyLevel || 1) - 1) }}>工序{v.yzyLevel}</span>}
											<span>{v.taskName}</span>
										</div>
										<div className={common.processFloatR} style={{ width: renwuAdd.taskModality == 1 ? 560 : 323 }}>
											{renwuAdd.taskModality == 1 && (
												<div className={common.processFloat}>
													<div className={common.processTxt} style={{ width: 220 }}>
														<span className={common.color333}>执行方式：</span>
														<span>{v.executeType == 1 ? '上级完成' + v.executeTime + '分钟后执行' : '自动' + v.executeTime + '小时分时执行'}</span>
													</div>
												</div>
											)}
											<div className={common.processFloat}>
												<div className={common.inlineBlock}>
													<span className={common.color333}>计件数：</span>
													<span style={{ display: 'inline-block', width: 40, textAlign: 'center' }}>{v.taskReckonNum}</span>
												</div>
											</div>
											<div className={common.processFloat} style={{ width: 130 }}>
												<span>{v.staffState == true ? '允许指定岗位员工' : '不允许指定岗位员工'}</span>
											</div>
											<div style={{ float: 'left' }}>
												<a style={{ marginRight: 10 }} onClick={() => edit(v)}>编辑</a>
												<Popconfirm title={renwuAdd.taskModality == 1 ? "该操作会把所属下级工序一起删除，确定要删除该工序？" : "确定要删除该任务？"} onConfirm={() => del(v)} onCancel={() => { }} okText="确定删除" cancelText="取消">
													<a style={{ color: 'red' }}>删除</a>
												</Popconfirm>
											</div>
										</div>
									</div>
									{v.yzyLevel < 5 && renwuAdd.taskModality == 1 && <Button type="primary" className={common.btnGreen} onClick={() => addChildren(v)}>添加子级工序</Button>}
								</div>
							))}
						</div>
					</div>
				</div>
			)}

			<div style={{ marginTop: 50, paddingLeft: '25%' }}>
				<Popconfirm title={renwuAdd.hasData ? "确定要取消对该任务的修改?" : "确定要取消当前新建的任务?"} onConfirm={back} onCancel={() => { }} okText="确定" cancelText="取消">
					<Button style={{ width: 100 }}>取消</Button>
				</Popconfirm>
				<Button style={{ marginLeft: 20, width: 100 }} type="primary" disabled={getFieldsValue().taskType == 1 && renwuAdd.qiantingBtnIsDisabled} onClick={newAction}>创建</Button>
			</div>
		</Form>
	)

}
Form_yzy.propTypes = {
	form: PropTypes.object.isRequired
};

const Form_YZY = Form.create()(Form_yzy);


const Modal_yzy = ({
    form: {
        getFieldDecorator,
	validateFields,
	getFieldsValue,
	resetFields,
	setFieldsValue,
    },
	renwuAdd,
	dispatch,
}) => {
	const formItemLayout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 14 },
	}

	function resetFormTimeout(resetFields, dispatch) {
		if (resetFields) {
			resetFields();
		}
		if (dispatch) {
			dispatch({
				type: 'renwuAdd/updatePayload',
				payload: {
					baseInfoFormRest1: 0,
				},
			});
		}
	}

	if (renwuAdd.baseInfoFormRest1) {
		setTimeout(function () { resetFormTimeout(resetFields, dispatch) }, 20);
	}

	function closeModal() {
		dispatch({
			type: 'renwuAdd/updatePayload',
			payload: {
				visible: false,
			},
		})
	}

	function parseNum(t) {
		if (t < 10) {
			t = '0' + t
		}
		return t
	}

	function saveAction() {
		const value = getFieldsValue()
		if (renwuAdd.nameExist) {
			message.error('名称重复了')
			return
		}
		validateFields((errors) => {
			if (!!errors) {
				return false;
			}
			var chainTaskDetailVos = renwuAdd.chainTaskDetailVos

			value.taskReckonNum = +value.taskReckonNum

			var randArr = renwuAdd.randArr
			if (!value.yzyId) {
				var rand = parseInt(Math.random() * 10000000)
				while (randArr.indexOf(rand) > -1) {
					rand = parseInt(Math.random() * 10000000)
				}
				randArr.push(rand)
				value.yzyId = rand
			}

			if (Object.keys(renwuAdd.editStep).length == 0) {
				var idx = 0
				if (chainTaskDetailVos.length > 0) {
					chainTaskDetailVos.map(v => {
						if (v.parentCode == renwuAdd.targetCode) {
							idx++
						}
					})
				}

				if (renwuAdd.targetLevel == 0) {
					value.code = String(+idx + 1)
				} else {
					value.code = String(+renwuAdd.targetCode + parseNum(+idx + 1))
				}

				value.parentCode = +renwuAdd.targetCode
				value.yzyLevel = +renwuAdd.targetLevel + 1


				if (value.executeType == 2 && renwuAdd.taskModality == 1 && renwuAdd.targetLevel >= 1) {
					for (var i = 0; i < chainTaskDetailVos.length; i++) {
						if (chainTaskDetailVos[i].code == value.parentCode) {
							if (value.executeTime > chainTaskDetailVos[i].executeTime) {
								message.error('子级工序的分时时间不能大于父级的分时时间:' + chainTaskDetailVos[i].executeTime + '小时')
								randArr.pop()
								return;
							}
						}
					}
				}

				if (renwuAdd.targetYzyId == 0) {
					chainTaskDetailVos.push(value)
				} else {
					var spliceIndex = 0
					for (var i = chainTaskDetailVos.length - 1; i >= 0; i--) {
						if (chainTaskDetailVos[i].code.indexOf(renwuAdd.targetCode) > -1) {
							spliceIndex = i
							break;
						}
					}

					chainTaskDetailVos.splice(spliceIndex + 1, 0, value)
				}

			} else {

				var editStep = renwuAdd.editStep

				if (renwuAdd.taskModality == 1 && value.executeType == 2) {
					for (var i = 0; i < chainTaskDetailVos.length; i++) {
						if (chainTaskDetailVos[i].parentCode == editStep.code && chainTaskDetailVos[i].executeTime > value.executeTime) {
							message.error('父级工序的分时时间不能小于子级的分时时间:' + chainTaskDetailVos[i].executeTime + '小时')
							return
						}
						if (editStep.parentCode == chainTaskDetailVos[i].code && value.executeTime > chainTaskDetailVos[i].executeTime) {
							message.error('子级工序的分时时间不能大于父级的分时时间:' + chainTaskDetailVos[i].executeTime + '小时')
							return
						}
					}
				}

				editStep = Object.assign(editStep, value)

				for (var i = 0; i < chainTaskDetailVos.length; i++) {
					if (chainTaskDetailVos[i].yzyId == renwuAdd.targetYzyId) {
						chainTaskDetailVos.splice(i, 1, editStep)
					}
				}
			}

			dispatch({
				type: 'renwuAdd/updatePayload',
				payload: {
					chainTaskDetailVos,
					visible: false,
					randArr
				}
			})
		})
	}

	function executeTypeChange(e) {
		dispatch({
			type: 'renwuAdd/updatePayload',
			payload: {
				executeType: e.target.value
			},
		})
		resetFields('executeType')
	}

	function staffStateChange(e) {
		var editStep = renwuAdd.editStep
		if (Object.keys(editStep).length > 0) editStep.staffState = e
		dispatch({
			type: 'renwuAdd/updatePayload',
			payload: {
				staffState: e,
				editStep
			}
		})
		setTimeout(() => { setFieldsValue({ staffState: e }) }, 20)
	}

	function checkAction(e) {
		dispatch({
			type: 'renwuAdd/updatePayload',
			payload: {
				modalBtnIsDisabled: e.target.value.length > 0 && true,
				isQianTing: false
			}
		})

		clearTimeout(timer)
		var a = e.target.value
		if (a.length > 0) {
			timer = setTimeout(() => {
				dispatch({
					type: 'renwuAdd/chaintaskTaskCheckName',
					payload: {
						name: a,
						id: renwuAdd.editStep.id || '0'
					}
				})
			}, 1000)
		}
	}

	return (
		<Modal
			width="800px"
			title={renwuAdd.taskModality == 1 ? '工序' : '任务'}
			visible={renwuAdd.visible}
			onCancel={closeModal}
			footer={null}
			afterClose={() => {
				resetFields()
				dispatch({
					type: 'renwuAdd/updatePayload',
					payload: {
						executeType: 1,
						staffState: false,
						modalBtnIsDisabled: false
					}
				})
			}}
		>
			<Form>
				<FormItem {...formItemLayout} label={renwuAdd.taskModality == 1 ? '工序名称' : '任务名称'}>
					{getFieldDecorator('taskName', {
						initialValue: renwuAdd.editStep.taskName || '',
						rules: [{ required: true, message: '请填写名称' }],
						onChange: checkAction
					})(
						<Input />
						)}
				</FormItem>
				{renwuAdd.taskModality == 1 && (
					<div>
						<FormItem {...formItemLayout} label="执行方式">
							{getFieldDecorator('executeType', {
								initialValue: renwuAdd.editStep.executeType || renwuAdd.executeType,
								rules: [{ required: true, message: '请选择执行方式' }],
								onChange: executeTypeChange
							})(
								<RadioGroup disabled={renwuAdd.disabledChange}>
									<Radio value={1}>按上级时间执行</Radio>
									<Radio value={2}>自动分时执行</Radio>
								</RadioGroup>
								)}
						</FormItem>
						{getFieldsValue().executeType == 1 ? (
							<FormItem {...formItemLayout} label="上级任务执行完后">
								{getFieldDecorator('executeTime', {
									initialValue: renwuAdd.editStep.executeTime || '',
									rules: [{ required: true, message: '请填写时间' }, { pattern: /^[1-9]{1}\d*$/, message: '请填写正整数' }]
								})(
									<Input addonAfter="分钟后推送" />
									)}
							</FormItem>
						) : (
								<FormItem {...formItemLayout} label="分时时间">
									{getFieldDecorator('executeTime', {
										initialValue: renwuAdd.editStep.executeTime || '',
										rules: [{ required: true, message: '请填写分时时间' }, { pattern: /^[1-9]{1}\d*$/, message: '请填写正整数' }]
									})(
										<Input addonAfter="小时" />
										)}
								</FormItem>
							)}
					</div>
				)}
				<FormItem {...formItemLayout} label="计件数">
					{getFieldDecorator('taskReckonNum', {
						initialValue: renwuAdd.editStep.taskReckonNum || '',
						rules: [{ required: true, message: '请填写计件数' }, { pattern: /^[1-9]{1}\d*$/, message: '请填写正整数' }]
					})(
						<InputNumber style={{ width: '100%' }} min={1} />
						)}
				</FormItem>
				<FormItem {...formItemLayout} label="指定岗位员工">
					{getFieldDecorator('staffState', {
						initialValue: renwuAdd.editStep.staffState || renwuAdd.staffState,
						onChange: staffStateChange
					})(
						<Switch checkedChildren="开" unCheckedChildren="关" checked={renwuAdd.editStep.staffState || renwuAdd.staffState} />
						)}
				</FormItem>

				<div style={{ textAlign: 'center' }}>
					<Button onClick={closeModal}>取消</Button>
					<Button style={{ marginLeft: 20 }} disabled={renwuAdd.modalBtnIsDisabled} type="primary" onClick={saveAction}>保存</Button>
				</div>
			</Form>
		</Modal>
	)

}
Modal_yzy.propTypes = {
	form: PropTypes.object.isRequired
};

const Modal_YZY = Form.create()(Modal_yzy);



function RenwuAddPage({ menu, dispatch, renwuAdd }) {
	const HeaderProps = {
		menu,
		dispatch,
	};

	return (
		<Header {...HeaderProps}>
			<Spin spinning={renwuAdd.loading} style={{ position: 'absolute', width: 'calc(100% - 50px)', paddingTop: '300px', zIndex: '99' }} size="large" />
			<div style={{ background: '#eee', padding: '10px 20px' }}>
				<Breadcrumb separator=">">
					<Breadcrumb.Item onClick={() => window.history.go(-1)} style={{ cursor: "pointer" }}>品牌任务库</Breadcrumb.Item>
					<Breadcrumb.Item>编辑预制任务</Breadcrumb.Item>
				</Breadcrumb>
			</div>

			<Form_YZY dispatch={dispatch} renwuAdd={renwuAdd} />

			<Modal_YZY dispatch={dispatch} renwuAdd={renwuAdd} />
		</Header>
	);

}

RenwuAddPage.propTypes = {
	menu: PropTypes.object,
};

function mapStateToProps({ menu, renwuAdd }) {
	return { menu, renwuAdd };
}

export default connect(mapStateToProps)(RenwuAddPage);

