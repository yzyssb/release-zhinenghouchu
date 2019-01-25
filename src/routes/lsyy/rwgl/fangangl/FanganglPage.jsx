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
const RangePicker = DatePicker.RangePicker;
import Button from 'antd/lib/button';
import Table from 'antd/lib/table';
import Select from 'antd/lib/select';
import Input from 'antd/lib/input';
const Option = Select.Option


function FanganglPage({ menu, dispatch, fangangl }) {
	const HeaderProps = {
		menu,
		dispatch,
	};

	const pagination = {
		total: fangangl.total,
		current: fangangl.current,
		pageSize: fangangl.size,
		onChange: (pageNo) => {
			onPageChange(pageNo)
		},
		showSizeChanger: true,
		onShowSizeChange: SizeChange
	};

	function SizeChange(current, pageSize) {
		dispatch({ type: 'fangangl/updatePayload', payload: { size: pageSize, current: 1, offset: 0 } });
		dispatch({
			type: 'fangangl/chainprogrammeList',
			payload: {}
		})
	}

	function onPageChange(pageNo) {
		var offset = (pageNo - 1) * fangangl.size;
		dispatch({ type: 'fangangl/updatePayload', payload: { offset: offset, current: pageNo } });
		dispatch({
			type: 'fangangl/chainprogrammeList',
			payload: {}
		})
	}


	function del(record) {
		dispatch({
			type: 'fangangl/chainprogrammeDetele',
			payload: {
				id: +record.id
			}
		})
	}

	function copy(record) {
		dispatch(
			routerRedux.push({
				pathname: '/newFangan',
				query: {
					id: +record.id,
					brandId: +fangangl.brandId,
					copy: true
				}
			})
		)
	}

	function edit(record) {
		dispatch(
			routerRedux.push({
				pathname: '/newFangan',
				query: {
					id: +record.id,
					brandId: +fangangl.brandId
				}
			})
		)
	}

	function look(record) {
		dispatch(
			routerRedux.push({
				pathname: '/newFangan',
				query: {
					id: +record.id,
					brandId: +fangangl.brandId,
					disabled: true
				}
			})
		)
	}

	const columns = [
		{
			title: '方案名称/描述', dataIndex: 'programmeName', key: 'programmeName', render: (text, record, index) => (
				<span >
					<p style={{ margin: 0, width: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{record.programmeName + (!record.programmeDescribe ? '' : (' / ' + record.programmeDescribe))}</p>
					<p style={{ margin: 0 }}>{record.userName + (!record.gmtCreate ? '' : (' 创建于' + fangangl.DateParse(record.gmtCreate)))}</p>
				</span>
			)
		},
		{
			title: '使用状态', dataIndex: 'programmeState', key: 'programmeState', render: (text, record, index) => (
				<span>
					<p style={{ margin: 0 }}>{record.programmeState == 1 ? '未执行' : record.programmeState == 2 ? '已执行' : ''}</p>
					<p style={{ margin: 0 }}>{!record.programmeStartTime ? '' : record.programmeState == 1 ? (fangangl.DateParse1(record.programmeStartTime) + '执行') : ('于' + fangangl.DateParse1(record.programmeStartTime) + '执行完毕')}</p>
				</span>
			)
		},
		{
			title: '操作', dataIndex: 'action', key: 'action', render: (text, record, index) => (
				<span>
					{record.programmeState == 1 && (
						<span>
							<a onClick={() => copy(record)}>复制</a>
							<span className="ant-divider"></span>
							<a onClick={() => edit(record)}>编辑</a>
							<span className="ant-divider"></span>
							<a onClick={() => del(record)}>删除</a>
						</span>
					)}
					{record.programmeState == 2 && (
						<span>
							<a onClick={() => copy(record)}>复制</a>
							<span className="ant-divider"></span>
							<a onClick={() => look(record)}>查看</a>
						</span>
					)}
				</span>
			)
		},
	]


	function goNewFangan() {
		dispatch(
			routerRedux.push({
				pathname: '/newFangan',
				query: {
					brandId: fangangl.brandId
				}
			})
		)
	}

	function brandChange(e) {
		dispatch({
			type: 'fangangl/updatePayload',
			payload: {
				brandId: +e
			}
		})
		sessionStorage.setItem('brandId_yzy', +e)
		//searchAction()
		dispatch({
			type:'fangangl/chooseBrandUrl',
			payload:{}
		})
	}

	function programmeNameChange(e) {
		dispatch({
			type: 'fangangl/updatePayload',
			payload: {
				programmeName: e.target.value
			}
		})
	}

	function programmeStateChange(e) {
		dispatch({
			type: 'fangangl/updatePayload',
			payload: {
				programmeState: +e
			}
		})
	}

	function searchAction() {
		dispatch({
			type: 'fangangl/updatePayload',
			payload: {
				offset: 0,
				current: 1
			}
		})
		dispatch({
			type: 'fangangl/chainprogrammeList',
			payload: {}
		})
	}

	function goDprwPage() {
		dispatch(
			routerRedux.push({
				pathname: '/dprw',
				query: {}
			})
		)
	}

	return (
		<Header {...HeaderProps}>
			<Spin spinning={fangangl.loading} style={{ position: 'absolute', width: 'calc(100% - 50px)', height: 'calc(100% - 70px)', paddingTop: '300px', zIndex: '99' }} size="large" />
			<div style={{ marginBottom: 15 }}>
				请选择品牌：
      		<Select value={String(fangangl.brandId)} style={{ width: 200 }} onChange={brandChange}>
					{fangangl.brandList.length > 0 && fangangl.brandList.map((v, i) => (
						<Select.Option key={v.key}>{v.value}</Select.Option>
					))}
				</Select>
			</div>
			<div style={{ marginBottom: 15, padding: '20px 10px', background: '#eee' }}>
				<span>方案名称</span>
				<Input style={{ width: 350, marginLeft: 10 }} onChange={programmeNameChange} />
				<span style={{ marginLeft: 20 }}>使用状态</span>
				<Select defaultValue="0" style={{ marginLeft: 10, width: 100 }} onChange={programmeStateChange}>
					<Option key="0">全部</Option>
					<Option key="1">未执行</Option>
					<Option key="2">已执行</Option>
				</Select>
				<Button type="primary" style={{ marginLeft: 20 }} onClick={searchAction}>开始查询</Button>
			</div>
			<div style={{ textAlign: 'right', marginBottom: 10 }}>
				<Button type="primary" style={{ float: 'left' }} onClick={goDprwPage}>按店铺查看任务</Button>
				<Button type="primary" onClick={goNewFangan}>+新建方案</Button>
			</div>

			<Table
				columns={columns}
				dataSource={fangangl.list}
				pagination={pagination}
				rowKey={record => record.id}
			/>
		</Header>
	);

}

FanganglPage.propTypes = {
	menu: PropTypes.object,
};

function mapStateToProps({ menu, fangangl }) {
	return { menu, fangangl };
}

export default connect(mapStateToProps)(FanganglPage);

