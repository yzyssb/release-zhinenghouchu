import Table from 'antd/lib/table';
import Pagination from 'antd/lib/pagination';
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import  DatePicker from 'antd/lib/date-picker';
import moment from 'moment';
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
import Tabs from 'antd/lib/tabs';
import Button from 'antd/lib/button';
import styles from './DeskCodeForm.less';
import message from "antd/lib/message";


const TabPane = Tabs.TabPane;

const DeskCodeForm = ({
                        pageNo,
                        total,
                        current,
                        dispatch,
                        deskQrCode,
                          qrCodeList,

                    }) => {

    function goeditgoods(record){


        if (deskQrCode.wxState == 1){

            dispatch({
                type: 'deskQrCode/updateShow',
                payload:{num:record.no,imgid:record.tableCode,tableId:record.id}
            });
            dispatch({
                type: 'deskQrCode/getQrImg',
                payload:{}
            });

        } else{
            message.warning('公众号未授权')
        }


    }

    function managerHandle(record,index){

        var handlebtn=[];

        handlebtn.push(<span key={index} ><a onClick={()=>{goeditgoods(record)}}>查看二维码</a>

          </span>)

        return handlebtn;
    }

    function managerCommentType(record,index){

        var commentText = '';
        yybz.commentTypes.map((i,j)=>{

            if(record.commentType == i.value){

                commentText = i.key;
            }

        })

        return commentText;

    }

    const columns = [
        {
            title: '编号',
            dataIndex: 'tableCode',
            key: 'tableCode',
        },{
            title: '餐台名称',
            dataIndex: 'tableName',
            key: 'tableName',
        },{
            title: '所属区域',
            dataIndex: 'regionName',
            key: 'regionName',
        },{
            title: '操作',
            key: 'operation',
            dataIndex: 'operation',
            render: (text, record,index) => (
                managerHandle(record,index)
            ),
        }
    ];


    const pagination = {
        total: total,
        current:current,
        pageSize: deskQrCode.size,        
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger:true,
        onShowSizeChange:SizeChange,
    };



    function SizeChange(current, pageSize){
        
        dispatch({type: 'deskQrCode/updateParm',payload:{size:pageSize,current:1,offset:0}});
        dispatch({type: 'deskQrCode/getBase',payload:{}});
    }

    function onPageChange(pageNo){
        
        var offset = pageNo*deskQrCode.size-deskQrCode.size;
        dispatch({type: 'deskQrCode/updateParm',payload:{offset:offset,current:pageNo}});
        dispatch({type: 'deskQrCode/getBase',payload:{}});

    }


    return (
        <div>
            <Table className={styles.table}
                   columns={columns}
                   dataSource={qrCodeList}
                   rowKey={record => record.tableCode}
                   pagination={pagination}
                   bordered/>
        </div>
    );

};

export default DeskCodeForm;