import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Header from '../../components/Header';
import Table from 'antd/lib/table';
import Button from 'antd/lib/button';
import styles from './privateLess.less';

import Input from 'antd/lib/input';
import Form from 'antd/lib/form';
import Spin from 'antd/lib/spin';
import moment from 'moment';
const FormItem = Form.Item;

function Integration({ menu, yhqlb, dispatch, }) {

    const HeaderProps = {
        menu,
        dispatch,
    };
    const {
        loading
    } = yhqlb
    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
        }, {
            title: '活动名称',
            dataIndex: 'activityName',
            key: 'activityName',
        }, {
            title: '活动开始',
            dataIndex: 'activityStarttime',
            key: 'activityStarttime',
            render: function (text, record, index) {
                if (record.activityStarttime) {
                    return record.activityStarttime.slice(0,-2)
                }else{
                    return "---"
                }
            }
        }, {
            title: '活动结束',
            dataIndex: 'activityEndtime',
            key: 'activityEndtime',
            render: function (text, record, index) {
                if (record.activityEndtime) {
                    return record.activityEndtime.slice(0, -2)
                } else {
                    return "---"
                }
            }
            // render: (text, record,index) => (
            //     managerRegion(record,index)
            // ),
        }, {
            title: '会员返还比例',
            dataIndex: 'memCount',
            key: 'memCount',
        }, {
            title: '非会员返还比例',
            dataIndex: 'disCount',
            key: 'disCount',
        }, {
            title: '操作',
            key: 'operation',
            dataIndex: 'operation',
            render: (text, record, index) => (
                managerHandle(record, index)
            ),
        }
    ];

    function stopUseItem(record) {
        dispatch({ type: 'yhqlb/updatePayload', payload: { item: record } });
        dispatch({ type: 'yhqlb/updateActivity', payload: {} });
    }

    // 点击详情
    function couponDetail(record) {
        dispatch({ type: 'yhqlb/updatePayload', payload: { intergrationUpdate: record } });
        dispatch(routerRedux.push({
            pathname: '/cpfjfdetailform',
            query: { id: record.id },
        }));
    }

    // 点击编辑跳转页面
    function couponEdit(record) {
        dispatch(routerRedux.push({
            pathname: '/cpfjfeditform',
            query: { id: record.id },
        }));
    }
    function managerHandle(record, index) {
        var handlebtn = [];

        handlebtn.push(<span key={index} ><a onClick={() => { stopUseItem(record) }}>{record.state == 1 ? "停用" : "启用"}</a>
            <span className="ant-divider" />
            <a onClick={() => couponDetail(record)}>详情</a>
            <span className="ant-divider" />
            <a onClick={() => couponEdit(record)}>编辑</a>
        </span>)

        return handlebtn;
    }
    const pagination = {
        total: yhqlb.activeTotal,
        currentActive: yhqlb.currentActive,
        pageSize: yhqlb.size,
        
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger: true,
        onShowSizeChange: SizeChange,
    };

    function onPageChange(pageNo) {
        console.log(pageNo);
        var offset = pageNo * yhqlb.size - yhqlb.size;
        dispatch({ type: 'yhqlb/updatePayload', payload: { offset: offset, currentActive: pageNo } });
        dispatch({ type: 'yhqlb/getActivityList', payload: {} });


    }
    function SizeChange(currentActive, pageSize) {

        console.log(currentActive, pageSize);
        dispatch({ type: 'yhqlb/updatePayload', payload: { size: pageSize, currentActive: 1, offset: 0 } });
        dispatch({ type: 'yhqlb/getActivityList', payload: {} });


    }
    function goSearch() {
        // console.log(result);
        dispatch({ type: 'yhqlb/updatePayload', payload: { offset: 0 } });
        dispatch({ type: 'yhqlb/getActivityList', payload: {} });
    }

    // 点击新增积分，清空选中的产品和门店，初始化时间段
    function gotoAddCoupon() {
        let todaystart = moment().startOf("day");
        let todayend = moment().endOf("day");
        dispatch({ type: 'yhqlb/updatePayload', payload: { intergrationUpdate: {}, rowSelectionData: [], rowSelectionDataPro: [], startTime: todaystart, endTime: todayend, isResetForm: true } });
        dispatch(routerRedux.push({
            pathname: '/cpfjfAddIntegration',
            query: {},
        }));
    }
    function onKeywordChange(e) {
        dispatch({ type: 'yhqlb/updatePayload', payload: { activityName: e.target.value } });
    }

    return (
        <Header {...HeaderProps}>
            <div>
                <Spin spinning={loading} className={styles.load} size="large" />
                <Form className={styles.formwidth}   >
                    <FormItem>

                        <span style={{ marginLeft: 20 }}>活动名称</span><Input style={{ marginLeft: 20, width: 220 }} onChange={onKeywordChange} />
                        <Button type="primary" style={{ marginLeft: 40 }} onClick={goSearch}>查询</Button>

                    </FormItem></Form>
                <Button type="primary" style={{ marginLeft: 20, marginTop: 20 }} onClick={gotoAddCoupon} >新增积分</Button>
                <div>
                    <Table className={styles.table}
                        columns={columns}
                        dataSource={yhqlb.list}
                        rowKey={record => record.id}
                        pagination={pagination}
                        bordered />
                </div>

            </div>
        </Header>
    );

}

Integration.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({ menu, yhqlb }) {
    return { menu, yhqlb };
}

export default connect(mapStateToProps)(Integration);

