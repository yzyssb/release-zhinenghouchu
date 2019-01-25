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
import Select from 'antd/lib/select';
import styles from './DyjcpszInfo.less';
const FormItem = Form.Item
const Option = Select.Option

import Menu from 'antd/lib/menu';
const SubMenu = Menu.SubMenu;

const DyjcpszInfo = ({
	dyjglPageConfig,
	dispatch
}) => {
	const columns = [
		{
			title: '',
			dataIndex: 'key',
			key: 'key',
			render: (text, record, index) => (
				dyjglPageConfig.sub_size * (dyjglPageConfig.sub_current - 1) + index + 1
			)
		},
		{
			title: '菜品编码',
			dataIndex: 'code',
			key: 'code'
		},
		{
			title: '菜品名称',
			dataIndex: 'name',
			key: 'name'
		},
		{
			title: '所属类别',
			dataIndex: 'categoryName',
			key: 'categoryName'
		},
		{
			title: '出品部门',
			dataIndex: 'printCategoryName',
			key: 'printCategoryName'
		}
	]

	var pagination = {
		total: dyjglPageConfig.sub_total,
		current: dyjglPageConfig.sub_current,
		pageSize: dyjglPageConfig.sub_size,
		onChange: (pageNo) => {
			onPageChange(pageNo)
		},
		showSizeChanger: true,
		onShowSizeChange: SizeChange,
	};

	function SizeChange(current, pageSize) {
		dispatch({ type: 'dyjglPageConfig/updatePayload', payload: { sub_size: pageSize, sub_current: 1, sub_offset: 0, choosedIndex: [] } });
		dispatch({
			type: 'dyjglPageConfig/getFoodList',
			payload: {}
		})
	}

	function onPageChange(pageNo) {
		var offset = pageNo * dyjglPageConfig.sub_size - dyjglPageConfig.sub_size;
		dispatch({ type: 'dyjglPageConfig/updatePayload', payload: { sub_offset: offset, sub_current: pageNo, choosedIndex: [] } });
		dispatch({
			type: 'dyjglPageConfig/getFoodList',
			payload: {}
		})
	}


	const ltColumns = [
		{
			title: '菜品类别',
			dataIndex: 'name',
			key: 'name',
		}
	]

	//点击表格选择框
	const rowSelection = {
		selectedRowKeys: dyjglPageConfig.choosedIndex,
		onChange: (item) => {
			console.log(item)
			dispatch({
				type: 'dyjglPageConfig/updatePayload',
				payload: { choosedIndex: item }
			})
		}
	}

	//分配出品部门
	const confirm = Modal.confirm
	function distribute() {
		if(dyjglPageConfig.dataSource.length==0){
			message.warning('请先去“出品部门管理”添加出品部门!')
			return
		}
		if (dyjglPageConfig.choosedIndex.length > 0) {
			dispatch({
				type: 'dyjglPageConfig/updatePayload',
				payload: { visible1: true }
			})
		} else {
			message.warning('您还没有选择任何菜品!')
		}

	}

	//取消
	function ModalHidden() {
		dispatch({
			type: 'dyjglPageConfig/updatePayload',
			payload: { visible1: false }
		})
	}

	const formItemLayout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 14 }
	}

	var openKeys = ['sub1']

	//菜品分类
	var children = []
	if (dyjglPageConfig.cpCate && dyjglPageConfig.cpCate.length) {
		dyjglPageConfig.cpCate.forEach(function (value, index) {
			children.push(<Menu.Item key={value.id}>{value.name}</Menu.Item>)
		})
	}


	//点击菜品分类
	function menuClick(item, key, selectedKeys) {
		dispatch({
			type: 'dyjglPageConfig/updatePayload',
			payload: { id: key, choosedIndex: [], selectedKeys: selectedKeys }
		})
		dispatch({
			type: 'dyjglPageConfig/getFoodList',
			payload: {}
		})
	}

	function onOpenChange(openKeys) {

	}

	function handleChange(key) {
		var printCategoryId = key != 20 ? 0 : dyjglPageConfig.printCategoryId
		dispatch({
			type: 'dyjglPageConfig/updatePayload',
			payload: { type: key, printCategoryId: printCategoryId, sub_current: 1, choosedIndex: [], sub_offset: 0 }
		})
		dispatch({
			type: 'dyjglPageConfig/getFoodList',
			payload: {}
		})

	}

	function handleChange1(item) {
		dispatch({
			type: 'dyjglPageConfig/updatePayload',
			payload: { printCategoryId: item, sub_current: 1, sub_offset: 0, choosedIndex: [] }
		})
		dispatch({
			type: 'dyjglPageConfig/getFoodList',
			payload: {}
		})
	}

	var subChildren = []
	dyjglPageConfig.dataSource.map((value, index) => {
		subChildren.push(<Option key={String(value.id)} value={String(value.id)}>{value.name}</Option>)
	})


	function changePrintCate(item) {
		dispatch({
			type: 'dyjglPageConfig/updatePayload',
			payload: { printIndex: item }
		})
	}

	function ModalConfirm() {
		var choosedIndex = dyjglPageConfig.choosedIndex, cpData = dyjglPageConfig.cpData, foodIds = []
		if (choosedIndex.length > 0) {
			choosedIndex.forEach(function (value) {
				if (value <= cpData.length) {
					foodIds.push(cpData[value - 1].id)
				}

			})
			dispatch({
				type: 'dyjglPageConfig/printFoodEdit',
				payload: {
					foodIds: foodIds,
					printCategoryId: dyjglPageConfig.printIndex == 0 ? dyjglPageConfig.dataSource[0].id : +dyjglPageConfig.printIndex,
					type: '1'
				}
			})
			dispatch({
				type: 'dyjglPageConfig/updatePayload',
				payload: { visible1: false, choosedIndex: [] }
			})
		} else {
			confirm({
				title: '请先选择菜品！',
				content: '',
				okText: '确定',
				okType: 'danger',
				cancelText: '取消',
				onOk() {

				},
				onCancel() { },
			});
		}
	}

	function cancelAction() {
		var choosedIndex = dyjglPageConfig.choosedIndex, cpData = dyjglPageConfig.cpData, foodIds = [], isOk = false
		if (choosedIndex.length > 0) {
			dyjglPageConfig.choosedIndex.forEach(function (value, index) {
				if (dyjglPageConfig.cpData[value - 1].printCategoryId) {
					isOk = true
				}
			})
			if (isOk) {
				confirm({
					title: '',
					content: '您确定消除所选菜品的出品部门吗？',
					okText: '确定',
					okType: 'primary',
					cancelText: '取消',
					onOk() {
						choosedIndex.forEach(function (value) {
							if (value <= cpData.length) {
								foodIds.push(cpData[value - 1].id)
							}

						})
						dispatch({
							type: 'dyjglPageConfig/printFoodEdit',
							payload: {
								foodIds: foodIds,
								printCategoryId: +dyjglPageConfig.printIndex,
								type: '2'
							}
						})
						dispatch({
							type: 'dyjglPageConfig/updatePayload',
							payload: { choosedIndex: [] }
						})
					},
					onCancel() { },
				});
			} else {
				message.warning('请先选择一个设置了出品部门的菜品！')
			}
		} else {
			message.warning('您还没有选择任何菜品!')
		}
	}

	function onTitleClick(item) {
		dispatch({
			type: 'dyjglPageConfig/updatePayload',
			payload: { id: '0', choosedIndex: [], selectedKeys: [] }
		})
		dispatch({
			type: 'dyjglPageConfig/getFoodList',
			payload: {}
		})
	}

	return (
		<div>
			<div className={styles.box}>
				<Button type="primary" size="large" style={{ marginRight: 20 }} onClick={distribute}>分配出品部门</Button>
				<Button type="primary" size="large" style={{ marginRight: 20 }} onClick={cancelAction}>消除出品部门 </Button>
				<span style={{ marginRight: 20 }}>菜品划分</span>
				<Select defaultValue={String(dyjglPageConfig.type)} style={{ width: 120 }} onChange={handleChange}>
					<Option value="0">全部</Option>
					<Option value="1">未分配</Option>
					<Option value="2">已分配</Option>
				</Select>
				{dyjglPageConfig.type == 2 && (
					<span>
						<span style={{ marginLeft: 20, marginRight: 20 }}>出品部门</span>
						<Select placeholder="请选择" style={{ width: 120 }} onChange={handleChange1}>
							{subChildren}
						</Select>
					</span>
				)}

			</div>
			<div className={styles.clearfix}>
				<div className={styles.lt}>
					<Menu
						mode="inline"
						defaultOpenKeys={openKeys}
						selectedKeys={dyjglPageConfig.selectedKeys}
						onOpenChange={onOpenChange}
						onSelect={({ item, key, selectedKeys }) => menuClick(item, key, selectedKeys)}
						className={styles.menu}
					>
						<SubMenu key="sub1" onTitleClick={onTitleClick} title={<span>全部分类</span>}>
							{children}
						</SubMenu>
					</Menu>
				</div>
				<div className={styles.rt}>
					<Table
						bordered
						rowSelection={rowSelection}
						columns={columns}
						dataSource={dyjglPageConfig.cpData}
						pagination={pagination}
					/>
				</div>
			</div>
			<Modal
				visible={dyjglPageConfig.visible1}
				title="选择菜品出品部门"
				onCancel={ModalHidden}
				footer={[
					<Button key="submit" type="primary" onClick={ModalConfirm}>确认</Button>,
				]}
			>
				{dyjglPageConfig.visible1 && dyjglPageConfig.choosedIndex.length > 0 && (
					<FormItem {...formItemLayout} label="菜品出品部门">
						<Select defaultValue={dyjglPageConfig.cpData[dyjglPageConfig.choosedIndex[0] - 1].printCategoryId && String(dyjglPageConfig.cpData[dyjglPageConfig.choosedIndex[0] - 1].printCategoryId) || String(dyjglPageConfig.dataSource[0].id)} onChange={changePrintCate} style={{ width: 200 }}>
							{subChildren}
						</Select>
					</FormItem>
				)}
			</Modal>
		</div>
	)
}


function mapStateToProps({ dyjglPageConfig }) {
	return { dyjglPageConfig };
}

export default connect(mapStateToProps)(DyjcpszInfo);