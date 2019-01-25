import React, {PropTypes} from 'react';
import {connect} from 'dva';
import Button from 'antd/lib/button';

import Table from 'antd/lib/table';
import styles from "./JfqsPage.less";
import Tabs from "antd/lib/tabs/index";
import Form from 'antd/lib/form';
import Select from 'antd/lib/select';
import Input from 'antd/lib/input';
import DatePicker from 'antd/lib/date-picker';

const TabPane = Tabs.TabPane;
const Option = Select.Option
import RegistrationForm from './JfqsFormModel';
import moment from "moment/moment"; //引入ZcglFormModel
function JfglPage({menu, dispatch, hymx}) {
    const FormItem = Form.Item;
    const MonthPicker = DatePicker.MonthPicker;
    const RangePicker = DatePicker.RangePicker;
    const HeaderProps = {
        menu,
        dispatch,
    };
    const {
        jfqsData
    } = hymx

    // 搜索
    function search() {
        dispatch({
            type: 'hymx/scoreList',
            payload: {searchWhere:hymx.searchWhere}
        });
    }

    function jfqsExport() {
        dispatch({
            type: 'hymx/scoreList',
            payload: {searchWhere:hymx.searchWhere,IsExport:1}
        });
    }

    //更改state时间
    function selectTime(times) {
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
        hymx.searchWhere.startDate =gmtStart,
        hymx.searchWhere.endDate =gmtFinish,
            dispatch({
            type: 'hymx/updatePayload',
            payload: { searchWhere:  hymx.searchWhere,}

        });
    }

    function getInputContent(e) {
        hymx.searchWhere.storeName = e.target.value;
        dispatch({
            type: 'hymx/updatePayload',
            payload: {
                searchWhere:  hymx.searchWhere,
            }

        });
    }

    const columns = [
        {
            title: '门店',
            dataIndex: 'storeName',
            key: 'storeName',

        }, {
            title: '赠送积分',
            dataIndex: 'sendScore',
            key: 'sendScore',
        }, {
            title: '消费积分',
            dataIndex: 'useScores',
            key: 'useScores',
        }, {
            title: '结算积分',
            dataIndex: 'balance',
            key: 'balance',
        },
    ];

    const formItemLayoutDataPicker = {
        labelCol: {span: 1},
        wrapperCol: {span: 22},
    };

    return (

        <div>
            <Form horizontal>
                <FormItem
                >
                    <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" onChange={selectTime}/>
                    <span>请输入店铺名称</span><Input style={{marginLeft: 20, width: 120}} onChange={getInputContent}/>
                    <Button type="primary" className={styles.textMarin} onClick={search}>搜索</Button>
                    {/*<Button type="primary" className={styles.textMarin} onClick={jfqsExport}>导出</Button>*/}
                </FormItem>

            </Form>
            <Table
                columns={columns}
                dataSource={jfqsData}
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

