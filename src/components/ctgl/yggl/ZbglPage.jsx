import React, {PropTypes} from 'react';
import Header from '../../../components/Header';
import Form from 'antd/lib/form';
import Button from 'antd/lib/button';
import DatePicker from 'antd/lib/date-picker';
import styles from './ZbglPage.less';
import Table from 'antd/lib/table';
import ZbglEditModel from './ZbglEditModel';
import {connect} from "dva/index";
import Popconfirm from 'antd/lib/popconfirm';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

const formItemLayout = {
    labelCol: {
        span: 5,
    },
    wrapperCol: {
        span: 12,
    },
};

const ZbglPage = ({menu, dispatch, zbgl}) => {

    const HeaderProps = {
        menu,
        dispatch,
    };

    const {list, total, page, modalVisible, record} = zbgl;

    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '职级',
            dataIndex: 'groupName',
            key: 'groupName',
        }, {
            title: '折扣上限(%)',
            dataIndex: 'discountLimit',
            key: 'discountLimit',
        }, {
            title: '抹零上限(元)',
            dataIndex: 'eraseLimit',
            key: 'eraseLimit',
            render: (text, record, index) => {
                return record.eraseLimit/100

                
            }
        }, {
            title: '操作',
            key: 'operation',
            dataIndex: 'operation',
            render: (text, record, index) => {
                return (
                    <span>
                        <a onClick={() => { add(record) }}>修改</a>
                        <span className="ant-divider"/>
                        <Popconfirm okText="确定" cancelText="取消" title="确定要删除吗？" onConfirm={() =>deleteRecord(record)}>
                            <a>删除</a>
                        </Popconfirm>
                    </span>

                )
            }
        }
    ];

    const pagination = {
        total: total,
        current: page,
        pageSize:zbgl.size,
        onChange: (pageNo) => {
            dispatch({type: 'zbgl/updatePayload', payload: {page: pageNo}});
            dispatch({type: 'zbgl/queryGroup', payload: {}});
        },
    };

    const ZbglEditModelProps = { //弹框
        visible: zbgl.modalVisible,
        dispatch,
        zbgl,
    };

    // add or edit
    function add(record = {}) {
        if(record.id) {
            // edit
            dispatch({
                type: 'zbgl/getGroup',
                payload: {
                    id: record.id,
                }
            });
        }
        dispatch({
            type: 'zbgl/updatePayload',
            payload: {
                modalVisible: true,
                record: {}
            }
        });
    }

    function deleteRecord(record) {
        

        dispatch({
            type: 'zbgl/updatePayload',
            payload: {
                deleteId: record.id,
            }
        });
        dispatch({
            type: 'zbgl/deleteGroup',
            payload: {

            }
        });
    }


    return (
        <Header {...HeaderProps}>
            < div className={styles.search}>
                <Button type="primary" style={{marginLeft: 20}} onClick={add}> 新增 </Button>
                <Table className={styles.table}
                       columns={columns}
                       dataSource={list}
                       rowKey={record => record.id}
                       pagination={pagination}
                       bordered/>

                <ZbglEditModel {...ZbglEditModelProps}/>

            </div>
        </Header>
    );
};


ZbglPage.propTypes = {
    visible: PropTypes.any,
    form: PropTypes.object,
    item: PropTypes.object,
};


function mapStateToProps({menu, dispatch, zbgl}) {
    return {menu, dispatch, zbgl};
}

export default connect(mapStateToProps)(ZbglPage);
