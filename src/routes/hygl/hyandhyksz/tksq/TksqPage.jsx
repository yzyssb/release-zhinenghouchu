import React, {PropTypes} from 'react';
import {connect} from 'dva';
import Button from 'antd/lib/button';

import Table from 'antd/lib/table';
import Input from 'antd/lib/input';
import styles from "./TksqPage.less";
import Tabs from "antd/lib/tabs/index";
const TabPane = Tabs.TabPane;
import XfjlAddModal from "../../../../components/hygl/XfjlAddModal";
import SqtkAddModal from "../../../../components/hygl/SqtkAddModal";
function tksqPage({menu, dispatch,xfjl,sqtk,jfgz}) {

    const HeaderProps = {
        menu,
        dispatch,
    };

    const {
        xfjlVisible,tksqData,sqtkVisible

    } = jfgz
    // 点击消费记录展示modal弹框
    function getConsumList(e) {
        dispatch({
            type: 'jfgz/updatePayload',
            payload: { xfjlVisible: true }
        });
        dispatch({
            type: 'jfgz/consumeList',
            payload: {mobile: e}

        });
    }
    function applyBackCard(e) {
        dispatch({
            type: 'jfgz/updatePayload',
            payload: { sqtkVisible: true }
        });
    }
    function confirm() {
        dispatch({
            type: 'jfgz/memberInfo',
            payload: {mobile:jfgz.mobile},

        });
    }
    function getInputContent(e) {
        console.log(e.target.value)
        dispatch({
            type: 'jfgz/updatePayload',
            payload: {mobile: e.target.value}

        });

    }
    const columns = [
        {
            title: '会员昵称',
            dataIndex: 'nickname',
            key: 'nickname',

        }, {
            title: '会员卡号',
            dataIndex: 'cardcode',
            key: 'cardcode',
        }, {
            title: ' 会员电话',
            dataIndex: 'mobile',
            key: 'mobile',
        }
        ,
        {
            title: '储值余额',
            dataIndex: 'balance',
            key: 'balance',
        }
        ,
        {
            title: '储值本金',
            dataIndex: 'account',
            key: 'account',
        }
        , {
            title: '储值赠送余额',
            dataIndex: 'towards',
            key: 'towards',
        },
        {
            title: '总使用余额',
            dataIndex: 'consumeBalance',
            key: 'consumeBalance',
        },
        {
            title: '可用积分',
            dataIndex: 'scores',
            key: 'scores',
        },
        {
            title: '总消费积分',
            dataIndex: 'consumeScore',
            key: 'consumeScore',
        },
        {
            title: '会员等级',
            dataIndex: 'level_name',
            key: 'level_name',
        },
      //   {
      //       title: '消费记录',
      //       dataIndex: 'records',
      //       key: 'records',
      //       render: function () {
      //
      //           return (<span>
      // <a href="javascript:;"><Button type="primary" className={styles.textMarin} onClick={add(record.rule_id)}>消费记录</Button></a>
      // </span>
      //           )
      //       }
      //   },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
      //       render: function () {
      //
      //           return (<span>
      // <a href="javascript:;"><Button type="primary" className={styles.textMarin} onClick={add2(record.rule_id)}>申请退卡</Button></a>
      // </span>
      //           )
      //       }
            render: (text, record,index) => {

                var inputHtml = "";

                inputHtml =(<span>
      <a onClick={()=>{getConsumList(record.mobile)}} href="javascript:;">消费记录</a>

       <span className="ant-divider"/>
      <a onClick={()=>{applyBackCard(record.mobile)}} href="javascript:;">申请退卡</a>
      </span>)
                const obj = {
                    children: inputHtml,
                    props: {},
                }

                return obj;
            },
        }


    ];
    const ReasonAddModalProps = {
        xfjlVisible,
        dispatch,
        onOk() {

        },
        onCancel() {
            dispatch({
                type: 'xfjl/updatePayload',
                payload:{xfjlVisible:false}
            });
        },
        jfgz,
    };
    const ReasonAddModalProps2 = {
        sqtkVisible,
        dispatch,
        onOk() {
        },
        onCancel() {
            dispatch({
                type: 'sqtk/updatePayload',
                payload:{sqtkVisible:false}
            });
        },
        jfgz,
    };

    return (

        <div className={styles.search}>

            <div style = {{marginLeft:20}} > <span>请输入用户手机号</span><Input style = {{marginLeft:20, width:220} } onChange={getInputContent} />
                <Button type="primary" style = {{marginLeft:40}} onClick={confirm}>查询</Button>
            </div>
            <Table
                columns={columns}
                dataSource={tksqData}
                bordered/>
            <XfjlAddModal  {...ReasonAddModalProps} />
            <SqtkAddModal  {...ReasonAddModalProps2} />
        </div>

    );

}

tksqPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu ,dispatch,xfjl,sqtk,jfgz}) {
    return {menu ,dispatch,xfjl,sqtk,jfgz};
}

export default connect(mapStateToProps)(tksqPage);

