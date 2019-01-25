import React, {PropTypes} from 'react';
import {connect} from 'dva';
import Button from 'antd/lib/button';

import Table from 'antd/lib/table';
import styles from "./TkshPage.less";
import Tabs from "antd/lib/tabs/index";
import Form from 'antd/lib/form';
import Select from 'antd/lib/select';
import Input from 'antd/lib/input';
import DatePicker from 'antd/lib/date-picker';

const TabPane = Tabs.TabPane;
const Option=Select.Option
import RegistrationForm from './TkshFormModel';
import moment from "moment/moment"; //引入ZcglFormModel
function JfglPage({menu, dispatch,jfgz}) {
    const FormItem = Form.Item;
    const MonthPicker = DatePicker.MonthPicker;
    const RangePicker = DatePicker.RangePicker;
    const HeaderProps = {
        menu,
        dispatch,
    };
const {
    tkshData
}=jfgz
    // 点击新增展示modal弹框
    function add() {
        dispatch({
            type: 'zcglPageConfig/updatePayload',
            payload: {visible: true}
        });
    }

    const columns = [
        {
            title: '手机号',
            dataIndex: 'mobile',
            key: 'mobile',

        },
        {
            title: '昵称',
            dataIndex: 'nickname',
            key: 'nickname',

        },
        {
            title: '卡号',
            dataIndex: 'cardcode',
            key: 'cardcode',

        }, {
            title: '购卡时间',
            dataIndex: 'vipTime',
            key: 'vipTime',
        }, {
            title: '购卡订单号',
            dataIndex: 'orderNum',
            key: 'orderNum',
        }, {
            title: '申请人名称',
            dataIndex: 'applyName',
            key: 'applyName',
        }, {
            title: '申请时间',
            dataIndex: 'applyTime',
            key: 'applyTime',
        },
        {
            title: '申请店铺',
            dataIndex: 'applyStore',
            key: 'applyStore',
        },
        {
            title: '审核状态',
            dataIndex: 'opStatus',
            key: 'opStatus',
        }
        ,
        {
            title: '审核人姓名',
            dataIndex: 'opName',
            key: 'opName',
        }
        ,
        {
            width:80,
            title: '审核备注',
            dataIndex: 'opRemark',
            key: 'opRemark',
        }
        ,
        {
            title: '审核时间',
            dataIndex: 'opTime',
            key: 'opTime',
        }

    ];

    const formItemLayoutDataPicker = {
        labelCol: {span: 1},
        wrapperCol: {span: 22},
    };
    //更改state时间
    function selectApplyTime(times) {
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
        jfgz.searchWhere.applyStartTime=gmtStart;
        jfgz.searchWhere.applyEndTime=gmtFinish;
        dispatch({
            type: 'jfgz/updatePayload',
            payload: { searchWhere:  jfgz.searchWhere,}

        });

    }
    //更改state时间
    function selectVipTime(times) {
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
        var gmtStart = moment(times).format();
        gmtStart = new Date(gmtStart).format('yyyy-MM-dd')
        jfgz.searchWhere.vipTime=gmtStart;
        dispatch({
            type: 'jfgz/updatePayload',
            payload: { searchWhere:  jfgz.searchWhere,}

        });

    }
    //更改state时间
    function selectOpTime(times) {
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
        var gmtStart = moment(times).format();
        gmtStart = new Date(gmtStart).format('yyyy-MM-dd')
        jfgz.searchWhere.opDate=gmtStart;
        dispatch({
            type: 'jfgz/updatePayload',
            payload: { searchWhere:  jfgz.searchWhere,}

        });

    }
    function handleChange(value) {
        console.log(value)
        jfgz.searchWhere.opType=value,
            dispatch({
                type: 'hymx/updatePayload',
                payload: { searchWhere:  jfgz.searchWhere,}

            });
    }
    function getMobile(e) {
        jfgz.searchWhere.mobile=e.target.value,
            dispatch({
                type: 'hymx/updatePayload',
                payload: { searchWhere:  jfgz.searchWhere,}

            });
    }
    function getApplyName(e) {
        jfgz.searchWhere.applyName=e.target.value,
            dispatch({
                type: 'hymx/updatePayload',
                payload: { searchWhere:  jfgz.searchWhere,}

            });
    }
    // 搜索
    function search() {
        dispatch({
            type: 'jfgz/listOpBackCard',
            payload: {searchWhere: jfgz.searchWhere}
        });
    }
    //导出
    function IsExport() {
        dispatch({
            type: 'jfgz/VipCardList',
            payload: {searchWhere: jfgz.searchWhere,IsExport:jfgz.IsExport}
        });
    }
    return (

        <div>
            <Form horizontal>
                <FormItem
                >
                    <span>申请时间：</span>
                    <RangePicker showTime format="YYYY-MM-DD HH:mm:ss"onChange={selectApplyTime}/>
                    <span className={styles.textMarin}>
                        办卡支付时间:  <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"onChange={selectVipTime}/>
                    </span>
                </FormItem>

            </Form>
            <Form horizontal>
                <FormItem
                >
                    <span>审核时间：</span>
                    <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"onChange={selectOpTime}/>
                    <span className={styles.textMarin}>
                        用户手机号:  <Input style = {{marginLeft:20, width:220}} onChange={getMobile}/>
                    </span>
                    <span className={styles.textMarin}>
                        申请人:  <Input style = {{marginLeft:20, width:220}} onChange={getApplyName}/>
                    </span>
                </FormItem>
                <FormItem
                >
                    <span style={{marginRight:20}}>审核状态</span>
                    <Select defaultValue="0" style={{ width: 120 }}onChange={handleChange}>
                        <Option value="0">审核中</Option>
                        <Option value="1">已拒绝</Option>
                        <Option value="2">已成功</Option>
                    </Select>
                    <Button type="primary" className={styles.textMarin} onClick={search}>搜索</Button>
                    {/*<Button type="primary" className={styles.textMarin} onClick={IsExport}>导出</Button>*/}
                </FormItem>
            </Form>
            <Table
                columns={columns}
                dataSource={tkshData}
                bordered/>
        </div>

    );

}

JfglPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,jfgz}) {
    return {menu,jfgz};
}

export default connect(mapStateToProps)(JfglPage);

