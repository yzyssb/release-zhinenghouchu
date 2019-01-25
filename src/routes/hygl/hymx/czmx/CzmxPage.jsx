import React, {PropTypes} from 'react';
import {connect} from 'dva';
import Button from 'antd/lib/button';

import Table from 'antd/lib/table';
import styles from "./CzmxPage.less";
import Tabs from "antd/lib/tabs/index";
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import DatePicker from 'antd/lib/date-picker';

const TabPane = Tabs.TabPane;
const Option=Select.Option
import RegistrationForm from './CzmxFormModel'; //引入ZcglFormModel
function JfglPage({menu, dispatch,}) {
    const FormItem = Form.Item;
    const MonthPicker = DatePicker.MonthPicker;
    const RangePicker = DatePicker.RangePicker;
    const HeaderProps = {
        menu,
        dispatch,
    };

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
            dataIndex: 'cardCode',
            key: 'cardCode',

        }, {
            title: '客户昵称',
            dataIndex: 'nickName',
            key: 'nickName',
        }, {
            title: '手机号',
            dataIndex: 'mobile',
            key: 'mobile',
        },
        {
            title: '储值日期',
            dataIndex: 'createTime',
            key: 'createTime',
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
            title: '储值余额',
            dataIndex: 'balanceAccount',
            key: 'balanceAccount',
        }
        ,
    ];

    const formItemLayoutDataPicker = {
        labelCol: {span: 1},
        wrapperCol: {span: 22},
    };
    const dataSource = [{
        cardCode: '22222222',
        nickName: '小红花',
        mobile: '18348870364',
        orderNum: '20180324567',
        accounts: '30.00',
        towards: '0.30',
        cashs: '3.00',
        scores: '27',
        total: '30',
        balanceAccount: '27',
        balanceScore: '100',
        storeName: '悠唐店',
        createTime: '2018-04-14',
    },];

    return (

        <div>
            <Form horizontal>
                <FormItem
                >
                    <RangePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
                    <span className={styles.textMarin}>
                        储值类型:  <Input style = {{marginLeft:20, width:220}} />
                    </span>
                </FormItem>

            </Form>
            <Form horizontal>
                <FormItem
                    {...formItemLayoutDataPicker}
                    label="支付方式："
                >
                    <Input style = {{marginLeft:20, width:220}} />
                    <span className={styles.textMarin}>
                        会员昵称:  <Input style = {{marginLeft:20, width:220}} />
                    </span>
                    <span className={styles.textMarin}>
                        会员手机号:  <Input style = {{marginLeft:20, width:220}} />
                    </span>
                </FormItem>
                <FormItem>
                    <span className={styles.textMarin}>
                        会员卡号:  <Input style = {{marginLeft:20, width:220}} /></span>
                </FormItem>
                <FormItem
                >
                    <Button type="primary" className={styles.textMarin}onClick={add}>搜索</Button>
                    <Button type="primary" className={styles.textMarin}onClick={add}>导出</Button>
                </FormItem>
            </Form>
            <Table
                columns={columns}
                dataSource={dataSource}
                bordered/>
        </div>

    );

}

JfglPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu}) {
    return {menu};
}

export default connect(mapStateToProps)(JfglPage);

