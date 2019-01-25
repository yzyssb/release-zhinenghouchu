import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Header from '../../components/Header';
import Table from 'antd/lib/table';
import Button from 'antd/lib/button';
import styles from './privateLess.less';
import Spin from 'antd/lib/spin';
import Form from "antd/lib/form/index";
const FormItem = Form.Item;
import { Popconfirm } from 'antd/lib';
function DishesIntegration({ menu, yhqlb, dispatch, }) {

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
            render: (text, record, index) => {
                return index + 1
            }
        }, {
            title: '红包标题',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '红包备注',
            dataIndex: 'remark',
            key: 'remark',
        }, {
            title: '最小比例',
            dataIndex: 'minProportion',
            key: 'minProportion',
            // render: (text, record,index) => (
            //     managerRegion(record,index)
            // ),
        }, {
            title: '最大比例',
            dataIndex: 'maxProportion',
            key: 'maxProportion',
        }, {
            title: '是否会员',
            dataIndex: 'type',
            key: 'type',
            render: (text, record, index) => (
                managerType(record, index)
            ),
        }, {
            title: '是否启用',
            dataIndex: 'state',
            key: 'state',
            render: (text, record, index) => (
                managerState(record, index)
            ),
        }, {
            title: '操作',
            key: 'operation',
            dataIndex: 'operation',
            render: (text, record, index) => (
                managerHandle(record, index)
            ),
        }
    ];
    function managerType(record, index) {
        return record.type == 1 ? "是" : "否";
    }
    function managerState(record, index) {
        return record.state == 1 ? "启用" : "不启用";
    }

    // 新增红包
    function gotoAddCoupon() {
        dispatch({ type: 'yhqlb/updatePayload', payload: { bEditItem: false, dishesIntergrationUpdate: {} } });
        dispatch(routerRedux.push({
            pathname: '/plfhbAddDishesIntegration',
            query: {},
        }));
    }

    // 修改列表数据
    function editItem(record) {
        dispatch({ type: 'yhqlb/updatePayload', payload: { dishesIntergrationUpdate: record, bEditItem: true } });
        dispatch(routerRedux.push({
            pathname: '/plfhbAddDishesIntegration',
            query: {},
        }));
    }
    function deleteItem(record) {
        dispatch({ type: 'yhqlb/updatePayload', payload: { evalutionDeleteId: record.id } });
        dispatch({ type: 'yhqlb/delEvaluation', payload: {} });
    }
    function managerHandle(record, index) {
        var handlebtn = [];

        handlebtn.push(<span key={index} ><a onClick={() => { editItem(record) }}>修改</a>
            <span className="ant-divider" />
            <Popconfirm okText="确定" cancelText="取消" title="确定要删除吗？" onConfirm={() => deleteItem(record)}>
                <a>删除</a>
            </Popconfirm>
        </span>)


        return handlebtn;
    }



    return (
        <Header {...HeaderProps}>
            <div>
                <Spin spinning={loading} className={styles.load} size="large" />
                {
                    yhqlb.ealuationList.length < 2 &&
                    <Button type="primary" style={{ marginLeft: 20, marginTop: 20 }} onClick={gotoAddCoupon} >新增红包</Button>
                }

                <div>
                    <Table className={styles.table}
                        columns={columns}
                        dataSource={yhqlb.ealuationList}
                        rowKey={record => record.id}
                        bordered />
                </div>

            </div>
        </Header>
    );

}

DishesIntegration.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({ menu, yhqlb }) {
    return { menu, yhqlb };
}

export default connect(mapStateToProps)(DishesIntegration);

