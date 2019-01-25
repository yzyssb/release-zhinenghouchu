import React, {PropTypes} from 'react';
import {connect} from 'dva';
import Button from 'antd/lib/button';

import Table from 'antd/lib/table';
import styles from "./CzgzPage.less";
import Tabs from "antd/lib/tabs/index";
const TabPane = Tabs.TabPane;
import RegistrationForm from './CzgzFormModel';
import CzgzAddModal from "../../../../components/hygl/CzgzAddModal"; //引入ZcglFormModel
function CzgzPage({menu, dispatch,czgz}) {

    const HeaderProps = {
        menu,
        dispatch,
    };
    const {
        modalVisible,

    } = czgz
    // 点击新增展示modal弹框
    function add() {
        dispatch({
            type: 'czgz/updatePayload',
            payload: { modalVisible: true }
        });
    }
    const columns = [
        {
            title: '序号',
            dataIndex: 'key',
            key: 'key',

        }, {
            title: '规则文本',
            dataIndex: 'standard',
            key: 'standard',
        }, {
            title: ' 充值金额',
            dataIndex: 'charge_amount',
            key: 'charge_amount',
        }, {
            title: '赠送金额',
            dataIndex: 'send_amount',
            key: 'send_amount',
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: function () {

                return (<span>
      <a href="javascript:;">删除</a>
      </span>
                )
            }
        }


    ];
    const ReasonAddModalProps = {
        visible: modalVisible,
        dispatch,
        onOk() {
        },
        onCancel() {
            dispatch({
                type: 'czgz/updatePayload',
                payload:{modalVisible:false}
            });
        },
        czgz,
    };

    const dataSource = [{
        key: '1',
        standard: '充50元送50元',
        charge_amount: '50.00',
        send_amount: '50.00',
        action: '操作',
    }, ];

    return (

            <div>
                <Button type="primary" className={styles.buttonMargin} onClick={add}>修改</Button>
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    bordered/>
                <CzgzAddModal  {...ReasonAddModalProps} />
            </div>

    );

}

CzgzPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,dispatch,czgz}) {
    return {menu,dispatch,czgz};
}

export default connect(mapStateToProps)(CzgzPage);

