import React, {PropTypes} from 'react';
import {connect} from 'dva';
import Button from 'antd/lib/button';
import Table from 'antd/lib/table';
import styles from "./JfgzPage.less";
import Tabs from "antd/lib/tabs/index";
import DatePicker from 'antd/lib/date-picker';
import Input from 'antd/lib/input';
import Spin from 'antd/lib/spin';

const TabPane = Tabs.TabPane;
import Form from "antd/lib/form/index";
import JfgzAddModal from "../../../../components/hygl/JfgzAddModal";
import moment from "moment/moment";

function JfgzPage({menu, dispatch, jfgz}) {
    const RangePicker = DatePicker.RangePicker;
    const FormItem = Form.Item;
    const HeaderProps = {
        menu,
        dispatch,
    };
    const {
        jfgzVisible, data, loading, extraRule

    } = jfgz

    // 搜索规则
    function search() {
        dispatch({
            type: 'jfgz/listScoreRule',
            payload: {startDate: jfgz.startDate, endDate: jfgz.endDate, ruleName: jfgz.ruleName}

        });

    }

    // 修改规则
    function updateRule(e) {
        dispatch({
            type: 'jfgz/updatePayload',
            payload: {ruleId:e,jfgzVisible: true,jfgzAdd:false}

        });
        dispatch({
            type: 'jfgz/scoreRule',
            payload: {ruleId:e},

        });
        // dispatch({
        //     type: 'jfgz/listVipLevel',
        //     payload: {}
        //
        // });
        // dispatch({
        //     type: 'jfgz/queryStoreList',
        //     payload: {}
        //
        // });
    }

    // 删除规则
    function deleteRule(e) {
        dispatch({
            type: 'jfgz/deleteScoreRule',
            payload: {ruleId: e}

        });
    }

    // 添加规则框
    function add() {
        dispatch({
            type: 'jfgz/updatePayload',
            payload: {jfgzVisible: true,jfgzAdd:true}

        });
        // dispatch({
        //     type: 'jfgz/listVipLevel',
        //     payload: {}
        //
        // });
        // dispatch({
        //     type: 'jfgz/queryStoreList',
        //     payload: {}
        //
        // });
    }

    const columns = [
        {
            title: '序号',
            dataIndex: 'rule_id',
            key: 'rule_id',

        }, {
            title: '规则名称',
            dataIndex: 'rule_name',
            key: 'rule_name',
        }, {
            title: '适用客户端',
            dataIndex: 'client',
            key: 'client',
        }, {
            title: '会员等级',
            dataIndex: 'level_name',
            key: 'level_name',
        }, {
            title: '使用门店',
            dataIndex: 'store_name',
            key: 'store_name',
            width: 300
        },
        {
            title: '创建时间',
            dataIndex: 'add_time',
            key: 'add_time',
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text, record, index) => {

                var inputHtml = "";

                inputHtml = (<span>
      <a onClick={() => {
          updateRule(record.rule_id)
      }} href="javascript:;">修改</a>

       <span className="ant-divider"/>
      <a onClick={() => {
          deleteRule(record.rule_id)
      }} href="javascript:;">删除</a>
      </span>)
                const obj = {
                    children: inputHtml,
                    props: {},
                }

                return obj;
            },
        }


    ];

    const JfgzAddModalProps = {
        jfgzVisible: jfgzVisible,
        extraRule,
        dispatch,
        onOk() {
        },
        onCancel() {
            dispatch({
                type: 'jfgz/updatePayload',
                payload: {jfgzVisible: false}
            });
        },
        jfgz,
    };
    const formItemLayoutDataPicker = {
        labelCol: {span: 1},
        wrapperCol: {span: 22},
    };

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
        dispatch({
            type: 'jfgz/updatePayload',
            payload: {startDate: gmtStart, endDate: gmtFinish}

        });
        // dispatch({
        //     type: 'jfgz/listScoreRule',
        //     payload: {startDate: gmtStart, endDate: gmtFinish}
        //
        // });
    }

    function getInputContent(e) {
        dispatch({
            type: 'jfgz/updatePayload',
            payload: {ruleName: e.target.value}

        });
    }

    return (

        <div>
            <Spin spinning={loading} className={styles.load} size="large"/>
            <Button type="primary" className={styles.buttonMargin} onClick={add}>添加</Button>
            <Form horizontal>
                <FormItem
                    {...formItemLayoutDataPicker}
                >
                    <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" onChange={selectTime}/>
                    <span className={styles.textMargin}>
                        积分名称:  <Input style={{marginLeft: 20, width: 220}} onChange={getInputContent}/>
                            <Button type="primary" className={styles.textMargin} onClick={search}>搜索</Button>
                    </span>
                </FormItem>

            </Form>
            <Table
                columns={columns}
                dataSource={data}
                bordered/>
            <JfgzAddModal  {...JfgzAddModalProps} />
        </div>

    );

}

JfgzPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu, dispatch, jfgz}) {
    return {menu, dispatch, jfgz};
}

export default connect(mapStateToProps)(JfgzPage);

