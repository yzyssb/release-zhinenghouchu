import React, {PropTypes} from 'react';
import {connect} from 'dva';
import Button from 'antd/lib/button';

import Table from 'antd/lib/table';
import styles from "./GkmxPage.less";
import Tabs from "antd/lib/tabs/index";
import Form from 'antd/lib/form';
import Select from 'antd/lib/select';
import Input from 'antd/lib/input';
import DatePicker from 'antd/lib/date-picker';
import moment from "moment/moment";

const TabPane = Tabs.TabPane;
const Option = Select.Option

function JfglPage({menu, dispatch, hymx}) {
    const FormItem = Form.Item;
    const MonthPicker = DatePicker.MonthPicker;
    const RangePicker = DatePicker.RangePicker;
    const HeaderProps = {
        menu,
        dispatch,
    };

    // 搜索
    function search() {
        dispatch({
            type: 'hymx/VipCardList',
            payload: {searchWhere: hymx.searchWhere}
        });
    }
    //导出
function IsExport() {
    dispatch({
        type: 'hymx/VipCardList',
        payload: {searchWhere: hymx.searchWhere,IsExport:hymx.IsExport}
    });
}
    const {
        data
    } = hymx
    function selectRegTime(times) {
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
        hymx.searchWhere.regStartTime =gmtStart,
            hymx.searchWhere.regEndTime =gmtFinish,
            dispatch({
                type: 'hymx/updatePayload',
                payload: { searchWhere:  hymx.searchWhere,}

            });
    }
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
        var gmtStart = moment(times[0]).format();
        gmtStart = new Date(gmtStart).format('yyyy-MM-dd')
        var gmtFinish = moment(times[1]).format();
        gmtFinish = new Date(gmtFinish).format('yyyy-MM-dd');
        hymx.searchWhere.vipStartTime =gmtStart,
            hymx.searchWhere.vipEndTime =gmtFinish,
            dispatch({
                type: 'hymx/updatePayload',
                payload: { searchWhere:  hymx.searchWhere,}

            });
    }
    function handleChange(value) {
        console.log(value)
        hymx.searchWhere.isBackCard=value,
            dispatch({
                type: 'hymx/updatePayload',
                payload: { searchWhere:  hymx.searchWhere,}

            });
    }
    function getNickName(e) {
        hymx.searchWhere.nickname=e.target.value,
            dispatch({
                type: 'hymx/updatePayload',
                payload: { searchWhere:  hymx.searchWhere,}

            });
    }
    function getVipMobile(e) {
        hymx.searchWhere.mobile=e.target.value,
            dispatch({
                type: 'hymx/updatePayload',
                payload: { searchWhere:  hymx.searchWhere,}

            });
    }
    function getVipcardCode(e) {
        hymx.searchWhere.cardCode=e.target.value,
            dispatch({
                type: 'hymx/updatePayload',
                payload: { searchWhere:  hymx.searchWhere,}

            });
    }
    const columns = [
        {
            title: '会员卡号',
            dataIndex: 'cardCode',
            key: 'cardCode',

        }, {
            title: '会员昵称',
            dataIndex: 'nickname',
            key: 'nickname',
        }, {
            title: '手机号码',
            dataIndex: 'mobile',
            key: 'mobile'},
        // }, {
        //     title: '审核材料',
        //     dataIndex: 'audit_material',
        //     key: 'audit_material',
        // }, {
        //     title: '分布地区',
        //     dataIndex: 'bonus',
        //     key: 'bonus',
        // },
        // {
        //     title: '生日',
        //     dataIndex: 'total_amount',
        //     key: 'total_amount',
        // },
        {
            title: '成为会员日期',
            dataIndex: 'vipTime',
            key: 'vipTime',
        },
        {
            title: '注册日期',
            dataIndex: 'regTime',
            key: 'regTime',
        },
        {
            title: '会员等级',
            dataIndex: 'vipLevel',
            key: 'vipLevel',
        },
        {
            title: '是否退卡',
            dataIndex: 'isBackCard',
            key: 'isBackCard',
        },
        {
            title: '支付金额',
            dataIndex: 'vipPay',
            key: 'vipPay',
        },
        {
            title: '积分余额',
            dataIndex: 'scores',
            key: 'scores',
        },
        {
            title: '累计积分',
            dataIndex: 'totalScores',
            key: 'totalScores',
        },
        {
            title: '一级推荐人',
            dataIndex: 'recomName',
            key: 'recomName',
        },
        {
            title: '一级推荐人电话',
            dataIndex: 'recomMobile',
            key: 'recomMobile',
        },
    ];
    const pagination = {
        total: hymx.total1,
        current:hymx.current1,        
        pageSize: hymx.size1,
        
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger:true,
        onShowSizeChange:SizeChange,
    };

    function onPageChange(pageNo){
        console.log(pageNo);
        var offset1 = pageNo*hymx.size1-hymx.size1;
        dispatch({type: 'hymx/updatePayload',payload:{offset1:offset1,current1:pageNo}});
        dispatch({type: 'hymx/VipCardList',payload:{}});


    }
    function SizeChange(current, pageSize){

        console.log(current, pageSize);
        dispatch({type: 'hymx/updatePayload',payload:{size1:pageSize,current1:1,offset1:0}});
        dispatch({type: 'hymx/VipCardList',payload:{}});


    }


    return (

        <div>
            <Form horizontal>
                <FormItem
                >
                    <span> 注册起始时间：</span>
                    <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" onChange={selectRegTime}/>
                </FormItem>
                <FormItem
                >
                    <span> 会员起始时间：</span>
                    <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" onChange={selectVipTime}/>
                </FormItem>
                <FormItem
                >
                    <span style={{marginRight: 20, marginLeft: 20}}>是否退卡:</span>
                    <Select defaultValue="0" style={{width: 120}} onChange={handleChange}>
                        <Option value="1">是</Option>
                        <Option value="0">否</Option>
                    </Select>
                </FormItem>
                    <FormItem
                    >
                        <span> 会员昵称：</span>
                        <Input style={{marginLeft: 20, width: 220}}onChange={getNickName}/>
                        <span>
                            会员电话 <Input style={{marginLeft: 20, width: 220}}onChange={getVipMobile}/>
                        </span>
                        <span>
                            会员卡号 <Input style={{marginLeft: 20, width: 220}}onChange={getVipcardCode}/>
                        </span>
                    </FormItem>

                    <Button type="primary" className={styles.textMarin} onClick={search}>搜索</Button>
                    {/*<Button type="primary" className={styles.textMarin} onClick={IsExport}>导出</Button>*/}

            </Form>
            <Table
                columns={columns}
                dataSource={hymx.data}
                pagination={pagination}
                bordered/>
        </div>

    );

}

JfglPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu, hymx}) {
    return {menu, hymx};
}

export default connect(mapStateToProps)(JfglPage);

