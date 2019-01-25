import React, { PropTypes } from 'react';
import Header from '../../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import Spin from 'antd/lib/spin';
import Button from 'antd/lib/button';
import Table from 'antd/lib/table';
import Select from 'antd/lib/select';
import Input from 'antd/lib/input';
const Option = Select.Option

function PprwkPage({ menu, dispatch, pprwk }) {
	const HeaderProps = {
		menu,
		dispatch,
	};

	const columns = [
		{ title: '编号', dataIndex: 'key', key: 'key', render: (text, record, index) => (<span>{(pprwk.size * (pprwk.current - 1) + index + 1) < 10 ? ('0' + (pprwk.size * (pprwk.current - 1) + index + 1)) : (pprwk.size * (pprwk.current - 1) + index + 1)}</span>) },
		{ title: '任务类型', dataIndex: 'taskType', key: 'taskType', render: (text, record, index) => (<span>{record.taskType == 1 ? '前厅任务' : record.taskType == 2 ? '后厨加工任务' : ''}</span>) },
		{ title: '任务名称', dataIndex: 'taskName', key: 'taskName',render:(text,record,index)=>(
			<div style={{width:500,textOverflow:'ellipsis',overflow:'hidden',whiteSpace:'nowrap'}} title={(record.taskName&&record.taskName instanceof Array)?record.taskName.join('、'):record.taskName}>{(record.taskName&&record.taskName instanceof Array)?record.taskName.join('、'):record.taskName}</div>
		) },
		{ title: '所属菜品', dataIndex: 'foodName', key: 'foodName', render: (text, record, index) => (<span>{record.taskType == 1 ? '— —' : record.foodName}</span>) },
		{
			title: '操作', dataIndex: 'action', key: 'action', render: (text, record, index) => (
				<span>
					<a onClick={() => {
						sessionStorage.setItem('renwuObj',JSON.stringify(record))
						dispatch(
							routerRedux.push({
								pathname: "/renwuAdd",
								query: {
									brandId: pprwk.brandId,
									foodId: record.foodId,
									id: record.id,
									taskType:record.taskType,
								}
							})
						)
					}}>编辑</a>
					<span className="ant-divider"></span>
					<a onClick={() => {
						dispatch({
							type: 'pprwk/chaintaskTaskDelete',
							payload: {
								id: +record.id,
								foodId:record.foodId,
								taskType:record.taskType,
							}
						})
					}}>删除</a>
				</span>)
		},
	]

	const pagination = {
		total: pprwk.total,
		current: pprwk.current,
		pageSize: pprwk.size,
		onChange: (pageNo) => {
			onPageChange(pageNo)
		},
		showSizeChanger: true,
		onShowSizeChange: SizeChange
	};

	function SizeChange(current, pageSize) {
		dispatch({ type: 'pprwk/updatePayload', payload: { size: pageSize, current: 1, offset: 0 } });
		dispatch({
			type: 'pprwk/chaintaskTaskPage',
			payload: {}
		})
	}

	function onPageChange(pageNo) {
		var offset = (pageNo - 1) * pprwk.size;
		dispatch({ type: 'pprwk/updatePayload', payload: { offset: offset, current: pageNo } });
		dispatch({
			type: 'pprwk/chaintaskTaskPage',
			payload: {}
		})
	}


	function addTask() {
		sessionStorage.removeItem('renwuObj')
		dispatch(
			routerRedux.push({
				pathname: "/renwuAdd",
				query: {
					brandId: pprwk.brandId
				}
			})
		);
	}

	function brandChange(e) {
		dispatch({
			type: 'pprwk/updatePayload',
			payload: {
				brandId: +e
			}
		})
		sessionStorage.setItem('brandId_yzy', +e)
		dispatch({
			type: 'pprwk/chooseBrandUrl',
			payload: {}
		})
	}

	function taskNameChange(e) {
		dispatch({
			type: 'pprwk/updatePayload',
			payload: {
				taskName: e.target.value
			}
		})
	}

	function searchAction() {
		dispatch({
			type: 'pprwk/updatePayload',
			payload: {
				offset: 0,
				current: 1
			}
		})
		dispatch({
			type: 'pprwk/chaintaskTaskPage',
			payload: {}
		})
	}

	function taskTypeChange(e){
		dispatch({
			type: 'pprwk/updatePayload',
			payload: {
				taskType:e
			}
		})
	}

	function foodIdChange(e){
		dispatch({
			type: 'pprwk/updatePayload',
			payload: {
				foodId:e||'0'
			}
		})
	}

	return (
		<Header {...HeaderProps}>
			<Spin spinning={pprwk.loading} style={{ position: 'absolute', width: 'calc(100% - 50px)', height: 'calc(100% - 70px)', paddingTop: '300px', zIndex: '99' }} size="large" />
			<div style={{ marginBottom: 15 }}>
				请选择品牌：
      			<Select value={String(pprwk.brandId)} style={{ width: 200 }} onChange={brandChange}>
					{pprwk.brandList.length > 0 && pprwk.brandList.map((v, i) => (
						<Option key={v.key}>{v.value}</Option>
					))}
				</Select>
			</div>

			<div>
				<div style={{ display: 'inline-block', margin:'0 30px 15px 0' }}>
					<span>请选择任务类型</span>
					<Select style={{ minWidth: 150, marginLeft: 10 }} value={String(pprwk.taskType)} onChange={taskTypeChange}>
						<Option key="0">全部</Option>
						<Option key="1">前厅任务</Option>
						<Option key="2">后厨加工任务</Option>
					</Select>
				</div>
				<div style={{ display: 'inline-block', margin:'0 30px 15px 0' }}>
					<span>请选择关联菜品</span>
					<Select style={{ minWidth: 300, marginLeft: 10 }} allowClear={true} showSearch optionFilterProp="children"
								filterOption={(input, option) => option.props.children.indexOf(input) >= 0} value={String(pprwk.foodId)} onChange={foodIdChange}>
						<Option key="0">全部</Option>
						{pprwk.foodList.length>0&&pprwk.foodList.map(v=>(
							<Option key={v.id}>{v.name}</Option>
						))}
					</Select>
				</div>
				<div style={{ display: 'inline-block', margin:'0 30px 15px 0' }}>
					<Input style={{ width: 300 }} placeholder="输入任务名称" value={pprwk.taskName.length == 0 ? null : pprwk.taskName} onChange={taskNameChange} />
					<Button type="primary" style={{ marginLeft: 20 }} onClick={searchAction}>搜索</Button>
				</div>
			</div>


			<Button style={{ marginBottom: 10 }} type="primary" onClick={addTask}>添加任务</Button>
			<p style={{ color: '#999' }}>任务如果被执行中的方案引用，编辑或删除任务会直接同步修改。</p>

			<Table
				columns={columns}
				dataSource={pprwk.list}
				bordered
				pagination={pagination}
				rowKey={record => record.id}
			/>
		</Header>
	);

}

PprwkPage.propTypes = {
	menu: PropTypes.object,
};

function mapStateToProps({ menu, pprwk }) {
	return { menu, pprwk };
}

export default connect(mapStateToProps)(PprwkPage);

