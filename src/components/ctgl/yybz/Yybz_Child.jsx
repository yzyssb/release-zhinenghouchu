import Table from 'antd/lib/table';
import Pagination from 'antd/lib/pagination';
import Modal from 'antd/lib/modal';
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import DatePicker from 'antd/lib/date-picker';
import moment from 'moment';
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
import Tabs from 'antd/lib/tabs';
import Button from 'antd/lib/button';
import styles from './Yybz_Child.less';
import Yybz_Search from './Yybz_Search';
import Popconfirm from 'antd/lib/popconfirm';


const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
const Yybz_Child = ({
    pageNo,
    total,
    current,
    dispatch,
    yybz,

}) => {

    function goeditgoods(record) {


        var item;
        yybz.list.map((i, j) => {

            if (record.id == i.id) {
                item = i;
            }

        })
        dispatch({
            type: 'yybz/updatePayload',
            payload: {
                id: item.id,
                comment: item.content,
                commentType: item.commentType,
                modalVisible: true,
                isAdd: false,
            }
        });

    }

    function managerHandle(record, index) {

        var handlebtn = [];

        // handlebtn.push(<span key={index} ><a onClick={()=>{goeditgoods(record)}}>编辑</a>
        //     <span className="ant-divider" />
        //     <Popconfirm okText="确定" cancelText="取消" title="确定要删除吗？" onConfirm={() =>onOperate(record,index)}>
        //         <a>删除</a>
        //     </Popconfirm>

        //     </span>)

        handlebtn.push(
            <span key={index}>
                <span style={{ color: '#ccc' }}>编辑</span>
                <span className="ant-divider" />
                <span style={{ color: '#ccc' }}>删除</span>
            </span>
        )

        return handlebtn;
    }


    function onOperate(record, index) {
        var resultIndex = index + 1;
        dispatch({
            type: 'yybz/deleteAction',
            payload: { id: yybz.list[index].id }
        })
    }

    function managerCommentType(record, index) {

        var commentText = '';
        yybz.commentTypes.map((i, j) => {

            if (record.commentType == i.value) {

                commentText = i.key;
            }

        })

        return commentText;

    }

    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
        }, {
            title: '备注名称',
            dataIndex: 'content',
            key: 'content',
        }, {
            title: '备注分类',
            dataIndex: 'commentType',
            key: 'commentType',
            render: (text, record, index) => (
                managerCommentType(record, index)
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

    const pagination = {
        total: yybz.total,
        current: yybz.current,
        pageSize: yybz.size,
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger: true,
        onShowSizeChange: SizeChange,
    };

    function SizeChange(current, pageSize) {


        dispatch({ type: 'yybz/updatePayload', payload: { size: pageSize, current: 1, offset: 0 } });
        dispatch({ type: 'yybz/query', payload: {} });


    }

    function onPageChange(pageNo) {

        var offset = pageNo * yybz.size - yybz.size;
        dispatch({ type: 'yybz/updatePayload', payload: { offset: offset, current: pageNo } });
        dispatch({ type: 'yybz/query', payload: {} });


    }


    function addReasonClick() {

        dispatch({ type: 'yybz/updatePayload', payload: { modalVisible: true, isAdd: true, comment: '', commentType: yybz.commentTypes[0].value } });

    }


    const OrderSearchProps = {
        dispatch,
        yybz
    };

    return (
        <div>
            <Yybz_Search {...OrderSearchProps} />
            <Button type="primary" style={{ marginLeft: 20 }} disabled onClick={addReasonClick}>新增备注</Button>
            <Table className={styles.table}
                columns={columns}
                dataSource={yybz.list}
                rowKey={record => record.id}
                pagination={pagination}
                bordered />
        </div>
    );

};

export default Yybz_Child;  