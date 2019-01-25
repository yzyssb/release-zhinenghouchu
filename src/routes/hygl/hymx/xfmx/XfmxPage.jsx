import React, {PropTypes} from 'react';
import {connect} from 'dva';
import Button from 'antd/lib/button';

import Table from 'antd/lib/table';
import styles from "./XfmxPage.less";
import Tabs from "antd/lib/tabs/index";
import Form from 'antd/lib/form';
import Select from 'antd/lib/select';
import Input from 'antd/lib/input';
import DatePicker from 'antd/lib/date-picker';

const TabPane = Tabs.TabPane;
const Option = Select.Option
import RegistrationForm from './XfmxFormModel';
import moment from "moment/moment"; //引入ZcglFormModel
function XfmxPage({menu, dispatch, hymx}) {
    const FormItem = Form.Item;
    const MonthPicker = DatePicker.MonthPicker;
    const RangePicker = DatePicker.RangePicker;
    const HeaderProps = {
        menu,
        dispatch,
    };
    const {
        xfjlData
    } = hymx

    // 点击新增展示modal弹框
    function add() {
        dispatch({
            type: 'zcglPageConfig/updatePayload',
            payload: {visible: true}
        });
    }

    const columns = [

        {
            title: '客户编号',
            dataIndex: 'cardcode',
            key: 'cardcode',

        }, {
            title: '客户昵称',
            dataIndex: 'nickname',
            key: 'nickname',
        }, {
            title: '手机号',
            dataIndex: 'mobile',
            key: 'mobile',
        }, {
            title: '订单号',
            dataIndex: 'orderNum',
            key: 'orderNum',
        },
        {
            title: '消费本金',
            dataIndex: 'accounts',
            key: 'accounts',
        },
        {
            title: '消费赠送',
            dataIndex: 'towards',
            key: 'towards',
        },
        {
            title: '消费现金',
            dataIndex: 'cashs',
            key: 'cashs',
        }
        ,
        {
            title: '消费积分',
            dataIndex: 'scores',
            key: 'scores',
        }
        ,
        {
            title: '消费合计',
            dataIndex: 'total',
            key: 'total',
        }
        ,
        {
            title: '储值余额',
            dataIndex: 'balanceAccount',
            key: 'balanceAccount',
        }
        ,
        {
            title: '积分余额',
            dataIndex: 'balanceScore',
            key: 'balanceScore',
        }
        ,
        {
            title: '消费门店',
            dataIndex: 'storeName',
            key: 'storeName',
        }
        ,
        {
            title: '消费时间',
            dataIndex: 'createtime',
            key: 'createtime',
        }
    ];

    const formItemLayoutDataPicker = {
        labelCol: {span: 1},
        wrapperCol: {span: 22},
    };

    function getMobile(e) {
        e.target.value
        hymx.searchWhere.mobile=e.target.value,
            dispatch({
                type: 'hymx/updatePayload',
                payload: { searchWhere:  hymx.searchWhere,}

            });

    }
    //消费时间
    function getConsumeTime(times) {
        Date.prototype.format = function(format)
        {
            var o = {
                "M+" : this.getMonth()+1, //month
                "d+" : this.getDate(),    //day
                "h+" : this.getHours(),   //hour
                "m+" : this.getMinutes(), //minute
                "s+" : this.getSeconds(), //second
                "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
                "S" : this.getMilliseconds() //millisecond
            }
            if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
                (this.getFullYear()+"").substr(4 - RegExp.$1.length));
            for(var k in o)if(new RegExp("("+ k +")").test(format))
                format = format.replace(RegExp.$1,
                    RegExp.$1.length==1 ? o[k] :
                        ("00"+ o[k]).substr((""+ o[k]).length));
            return format;
        }
        var gmtStart = moment(times[0]).format();
        gmtStart = new Date(gmtStart).format('yyyy-MM-dd')
        var gmtFinish = moment(times[1]).format();
        gmtFinish = new Date(gmtFinish).format('yyyy-MM-dd');
        hymx.searchWhere.startTime =gmtStart,
            hymx.searchWhere.endTime =gmtFinish,
            dispatch({
                type: 'hymx/updatePayload',
                payload: { searchWhere:  hymx.searchWhere,}

            });

    }
    function getCardCode(e) {
        e.target.value
        hymx.searchWhere.cardCode=e.target.value,
            dispatch({
                type: 'hymx/updatePayload',
                payload: { searchWhere:  hymx.searchWhere,}

            });
    }
    function getStoreName(e) {
        e.target.value
        hymx.searchWhere.storeName=e.target.value,
            dispatch({
                type: 'hymx/updatePayload',
                payload: { searchWhere:  hymx.searchWhere,}

            });
    }
    function search() {
            dispatch({
                type: 'hymx/listConsume',
                payload: { searchWhere:  hymx.searchWhere,}

            });
    }
    function xfmxexport() {
        dispatch({
            type: 'hymx/listConsume',
            payload: { searchWhere:  hymx.searchWhere,IsExport:hymx.IsExport}

        });
    }
    const pagination = {
        total: hymx.total,
        current:hymx.current,
        pageSize: hymx.size,
        
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger:true,
        onShowSizeChange:SizeChange,
    };

    function onPageChange(pageNo){
        console.log(pageNo);
        var offset = pageNo*hymx.size-hymx.size;
        dispatch({type: 'hymx/updatePayload',payload:{offset:offset,current:pageNo}});
        dispatch({type: 'hymx/listConsume',payload:{}});


    }
    function SizeChange(current, pageSize){

        console.log(current, pageSize);
        dispatch({type: 'hymx/updatePayload',payload:{size:pageSize,current:1,offset:0}});
        dispatch({type: 'hymx/listConsume',payload:{}});


    }

    return (

        <div>
            <Form horizontal>
                <FormItem
                >
                    <span>消费时间：</span>
                    <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" onChange={getConsumeTime}/>
                </FormItem>

            </Form>
            <Form horizontal>
                <FormItem
                >
                    <span className={styles.textMarin}>
                        会员手机号:  <Input style={{marginLeft: 20, width: 220}} onChange={getMobile}/>
                    </span>
                    <span className={styles.textMarin}>
                        会员卡号:  <Input style={{marginLeft: 20, width: 220}} onChange={getCardCode}/>
                    </span>
                    <span className={styles.textMarin}>
                        店铺名称:  <Input style={{marginLeft: 20, width: 220}} onChange={getStoreName}/>
                    </span>
                </FormItem>
                <Button type="primary" className={styles.textMarin} onClick={search}>搜索</Button>
                {/*<Button type="primary" className={styles.textMarin} onClick={xfmxexport}>导出</Button>*/}
            </Form>
            <Table
                columns={columns}
                dataSource={xfjlData}
                pagination={pagination}
                bordered/>
        </div>

    );

}

XfmxPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu, hymx}) {
    return {menu, hymx};
}

export default connect(mapStateToProps)(XfmxPage);

