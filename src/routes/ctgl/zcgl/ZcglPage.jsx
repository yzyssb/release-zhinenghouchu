import React, { PropTypes } from 'react';

import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import RegistrationForm from './ZcglFormModel'; //引入ZcglFormModel
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import Table from 'antd/lib/table';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import Icon from 'antd/lib/icon';
import Switch from 'antd/lib/switch';
import Tree from 'antd/lib/tree';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Form from 'antd/lib/form';
import Collapse from 'antd/lib/collapse';
import DatePicker from 'antd/lib/date-picker';
import Pagination from 'antd/lib/pagination';
import moment from 'moment';
import styles from "./ZcglPage.less";
import { Popconfirm } from 'antd/lib';

const FormItem = Form.Item;
const Option = Select.Option;
const MonthPicker = DatePicker.MonthPicker;
const RangePicker = DatePicker.RangePicker;
const confirm = Modal.confirm;


function ZcglPage({ menu, dispatch, zcglPageConfig }) {
    const HeaderProps = {
        menu,
        dispatch,
    };

    // 列表展示内容匹配
    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
            render: function (text, record, index) {
                return <span>{index + 1}</span>
            }
        }, {
            title: '折扣类型',
            dataIndex: 'type',
            key: 'type',
            render: function (text, record, index) {
                return record.type == 1 ? "全单折扣" : "方案折扣"
            }
        }, {
            title: '折扣名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '折扣率配置',
            dataIndex: 'wholeRate',
            key: 'wholeRate',
            render: function (text, record, index) {
                return record.type == 1 ? record.wholeRate + "%" : "---"
            }
        },
        {
            title: '开始时间',
            dataIndex: 'gmtStart',
            key: 'gmtStart',
            render: function (text, record, index) {
                return zcglPageConfig.formatDateTime(record.gmtStart)
            }
        },
        {
            title: '结束时间',
            dataIndex: 'gmtFinish',
            key: 'gmtFinish',
            render: function (text, record, index) {
                return zcglPageConfig.formatDateTime(record.gmtFinish)
            }
        },

        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            // render: function (text, record, index) {
            //     return (<span key={index}>
            //         <a href="javascript:;" onClick={() => { editTab(text, record, index) }}>修改</a>
            //         <span className="ant-divider" />
            //         <a href="javascript:;" onClick={() => { showDeleteConfirm(text, record, index) }}>删除</a>
            //     </span>
            //     )
            // }
            render: (text, record, index) => (
                managerHandle(record, index)
            ),
        }
    ];


    //点击修改显示弹框
    // function editTab(text, record, index) {
    //     // 每次点击修改先清除原来的数据
    //     let defaultActionData = zcglPageConfig.defaultActionData();
    //     dispatch({
    //         type: 'zcglPageConfig/updatePayload',
    //         payload: { visible: true, way: "edit", checkName: 0 }
    //     });
    //     dispatch({
    //         type: 'zcglPageConfig/discountGetData',
    //         payload: { id: record.id }
    //     });
    // }

    // 确认用户选择的是编辑还是删除
    function managerHandle(record, index) {
        let handlebtn = [];
        handlebtn.push(
            <span key={index}>
                <a onClick={() => {
                    edit(record)
                }}>编辑</a>
                <span className="ant-divider" />
                <Popconfirm okText="确定" cancelText="取消"title="确定要删除吗？" onConfirm={() => onOperate(record)}>
                    <a>删除</a>
                </Popconfirm>
            </span>);

        return handlebtn;
    }


    // 执行删除
    function onOperate(record) {
        // 删除指定的数据，然后更新
        dispatch({
            type: 'zcglPageConfig/delDiscountData',
            payload: { id: record.id }
        });
        dispatch({
            type: 'zcglPageConfig/query',
            payload: {}
        });
    }

    

    // 执行编辑
    const edit = (record) => {
        // 每次点击修改先清除原来的数据
        let defaultActionData = zcglPageConfig.defaultActionData();
        dispatch({
            type: 'zcglPageConfig/updatePayload',
            payload: { visible: true, way: "edit", checkName: 0 }
        });
        dispatch({
            type: 'zcglPageConfig/discountGetData',
            payload: { id: record.id }
        });
    };





    // 点击删除按钮删除对应的列表数据
    // function showDeleteConfirm(text, record, index) {
    //     var resultIndex = index + 1;
    //     confirm({
    //         title: '确定删除第' + resultIndex + '条数据吗?',
    //         content: '',
    //         okText: 'Yes',
    //         okType: 'danger',
    //         cancelText: 'No',
    //         onOk() {
    //             // 删除指定的数据，然后更新
    //             dispatch({
    //                 type: 'zcglPageConfig/delDiscountData',
    //                 payload: { id: record.id }
    //             });
    //             dispatch({
    //                 type: 'zcglPageConfig/query',
    //                 payload: {}
    //             });
    //         },
    //         onCancel() {
    //             // 点击了取消
    //             // console.log('Cancel');
    //         },
    //     });
    // }

    //点击取消隐藏弹框
    function ModalHidden() {
        dispatch({
            type: 'zcglPageConfig/updatePayload',
            payload: { visible: false }
        });
    }

    // 点击分页时请求数据pageNumber代表点击的数字
    function onChangeShowPage(pageNumber) {
        let pageForm = zcglPageConfig.pageForm;
        pageForm.offset = (pageNumber - 1) * 10;

        dispatch({
            type: 'zcglPageConfig/updatePayload',
            payload: { pageForm, current: pageNumber }
        });

        dispatch({
            type: 'zcglPageConfig/query',
            payload: {}
        });
    }


    // 点击新增展示modal弹框
    function add() {
        // 点击新增展示弹框，请求数据
        // 清空之前用户输入的所有数据,isResetForm重置表单标识
        let defaultActionData = zcglPageConfig.defaultActionData();

        dispatch({
            type: 'zcglPageConfig/updatePayload',
            payload: { visible: true, way: "add", actionData: defaultActionData, isResetForm: true, checkName: 0 }
        });

        dispatch({
            type: 'zcglPageConfig/discountGetData',
            payload: { id: 0 }  //新增固定传0
        });
    }

    return (
        <Header {...HeaderProps}>
            <div>
                <Button type="primary" className={styles.buttonMargin} onClick={add}>新增</Button>
                <Table
                    columns={columns}
                    pagination={false}
                    dataSource={zcglPageConfig.dataSource}
                    rowKey={record => record.id}
                    bordered />

                <Pagination current={zcglPageConfig.current} style={{ float: "right", paddingTop: "20px" }} showQuickJumper defaultCurrent={1} total={zcglPageConfig.totalCount} onChange={onChangeShowPage} />,
                <RegistrationForm dispatch={dispatch} zcglPageConfig={zcglPageConfig} >
                </RegistrationForm>
            </div>
        </Header>
    );
}

ZcglPage.propTypes = {
    menu: PropTypes.object,
};


function mapStateToProps({ menu, zcglPageConfig }) {
    return { menu, zcglPageConfig };
}

export default connect(mapStateToProps)(ZcglPage);

