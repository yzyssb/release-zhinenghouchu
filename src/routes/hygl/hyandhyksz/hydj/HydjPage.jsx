import React, {PropTypes} from 'react';
import {connect} from 'dva';
import Button from 'antd/lib/button';

import Table from 'antd/lib/table';
import styles from "./HydjPage.less";
import Tabs from "antd/lib/tabs/index";
import Spin from 'antd/lib/spin';
import JcszAddModal from "../../../../components/hygl/JcszAddModal";
const TabPane = Tabs.TabPane;
function HydjPage({menu, dispatch,jfgz}) {

    const {
       loading, hydjVisible,data,hydjData,hydjAdd

    } = jfgz

    const ReasonAddModalProps = {
        hydjAdd,
        hydjVisible,
        dispatch,
        onOk() {
        },
        onCancel() {
            dispatch({
                type: 'jfgz/updatePayload',
                payload:{hydjVisible:false}
            });
        },
        jfgz,
    };
    // 点击新增展示modal弹框
    function add() {
        dispatch({
            type: 'jfgz/updatePayload',
            payload: { hydjVisible: true,hydjAdd:true}
        });
    }

    // 获取等级详细信息
    function updateLevel(e) {

        dispatch({
            type: 'jfgz/getVipLevel',
            payload: {levelId: e}

        });
        dispatch({
            type: 'jfgz/updatePayload',
            payload: { levelId: e,hydjVisible: true,hydjAdd:false}
        });

    }
    // 删除等级
    function deleteLevel(e) {
        console.log(e)
        dispatch({
            type: 'jfgz/deleteVipLevel',
            payload: {levelId: e}

        });
    }
    const columns = [
        {
            title: '序号',
            dataIndex: 'level_id',
            key: 'level_id',

        }, {
            title: '会员等级名称',
            dataIndex: 'level_name',
            key: 'level_name',
        }, {
            title: '获取资格条件',
            dataIndex: 'level_pay',
            key: 'level_pay',
        }, {
            title: '会员使用权限',
            dataIndex: 'use_limit',
            key: 'use_limit',
        },
        {
            title: '会员有效期',
            dataIndex: 'valid_date',
            key: 'valid_date',
        },
        {
            title: '限制会员数量',
            dataIndex: 'limit_num',
            key: 'limit_num',

        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text, record,index) => {

                var inputHtml = "";

                inputHtml =(<span>
      <a onClick={()=>{updateLevel(record.level_id)}} href="javascript:;">修改</a>

       <span className="ant-divider"/>
      <a onClick={()=>{deleteLevel(record.level_id)}} href="javascript:;">删除</a>
      </span>)
                const obj = {
                    children: inputHtml,
                    props: {},
                }

                return obj;
            },
        }
    ];

    return (

            <div>
                <Spin spinning={loading} className={styles.load} size="large" />
                <Button type="primary" className={styles.buttonMargin}onClick={add}>新增</Button>
                <Table
                    columns={columns}
                    dataSource={hydjData}
                    bordered/>
                <JcszAddModal  {...ReasonAddModalProps} />
            </div>

    );

}

HydjPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,jfgz}) {
    return {menu,jfgz};
}

export default connect(mapStateToProps)(HydjPage);

