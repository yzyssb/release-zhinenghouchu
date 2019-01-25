import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import Header from '../../components/Header';
import LeftMenu from '../../components/LeftMenu';
import Tabs from 'antd/lib/tabs';
import Table from 'antd/lib/table';
import message from 'antd/lib/message';
import Pagination from 'antd/lib/pagination';
import DatePicker from 'antd/lib/date-picker';
import Button from 'antd/lib/button';
import styles from './privateLess.less';
import Modal from 'antd/lib/modal';
import Ctaigl_Child from '../../components/ctgl/ctaigl/Ctaigl_Child.jsx';
import Ctaigl_add from '../../components/ctgl/ctaigl/Ctaigl_add.jsx';
import Ctaigl_groupadd from '../../components/ctgl/ctaigl/Ctaigl_groupadd.jsx';
import Region_add from '../../components/ctgl/ctaigl/Region_add.jsx';
import Region_edit from '../../components/ctgl/ctaigl/Region_edit.jsx';
import CouponAddChoosePlace from '../../components/marketing/CouponAddChoosePlace.jsx';


import Input from 'antd/lib/input';
import Form from 'antd/lib/form';
import Radio from 'antd/lib/radio';
import Select from 'antd/lib/select';
import Checkbox from 'antd/lib/checkbox';
import RouterRedux from 'dva/router';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

const TabPane = Tabs.TabPane;

function DishesIntegrationAdded({
    menu, yhqlb, dispatch

}) {

    const HeaderProps = {
        menu,
        dispatch,
    };

    const columns = [
        {
            title: '序号',
            dataIndex: 'tableName',
            key: 'tableName',
        }, {
            title: '优惠券编号',
            dataIndex: 'tableCode',
            key: 'tableCode',
        }, {
            title: '优惠券',
            dataIndex: 'tableName1',
            key: 'tableName1',
        }, {
            title: '状态',
            dataIndex: 'regionId',
            key: 'regionId',
            // render: (text, record,index) => (
            //     managerRegion(record,index)
            // ),
        }, {
            title: '总量',
            dataIndex: 'seatNum',
            key: 'seatNum',
        }, {
            title: '已发送量',
            dataIndex: 'waiterId',
            key: 'waiterId',
            // render: (text, record,index) => (
            //     managerWaiter(record,index)
            // ),
        }, {
            title: '面额',
            dataIndex: 'isEatInRestaurant',
            key: 'isEatInRestaurant',
        }, {
            title: '有效期',
            dataIndex: 'state',
            key: 'state',
        }, {
            title: '满多少可用',
            key: 'operation1',
            dataIndex: 'operation1',
            // render: (text, record,index) => (
            //     managerHandle(record,index)
            // ),
        }
        , {
            title: '操作',
            key: 'operation',
            dataIndex: 'operation',
            render: (text, record, index) => (
                managerHandle(record, index)
            ),
        }
    ];

    function stopUseItem(record) {
        //TODO 停用
    }

    function couponDetail(record) {
        //TODO 查看详情
    }

    function showHistory(record) {
        //TODO 查看详情
    }

    function managerHandle(record, index) {
        var handlebtn = [];

        handlebtn.push(<span key={index}><a onClick={() => {
            stopUseItem(record)
        }}>停用</a>
            <span className="ant-divider" />
            <a onClick={() => couponDetail(record)}>详情</a>
            <span className="ant-divider" />
            <a onClick={() => showHistory(record)}>使用记录</a>
        </span>)


        return handlebtn;
    }

    function choosePlace() {
        //TODO 弹出选择门店dialog，选择门店后显示到 右侧
        dispatch({ type: 'yhqlb/updatePayload', payload: { modalVisible: true } });
    }

    var cuisineOptionHtml = [];

    if (yhqlb.rowSelectionData) {
        yhqlb.rowSelectionData.map((j) => {
            cuisineOptionHtml.push(<span key={j.id}>{j.tableName}</span>)
            cuisineOptionHtml.push(<span>、</span>)

        })
    }
    const Registration = ({

        form: {
            getFieldDecorator,
            validateFields,
            getFieldsValue,
            resetFields,
        }, dispatch, login,
    }) => {


        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };

        // 提交表单
        function handleSubmit(e) {
            if (e) {
                e.preventDefault();
            }
            validateFields((errors) => {
                if (!!errors) {
                    return;
                }
                // 比较最大返现比例和最小返现比例是否符合要求
                if (getFieldsValue()["minProportion"] - getFieldsValue()["maxProportion"] > 0) {
                    message.error('最小返现比例不得大于最大返现比例！');
                    return
                }
                var data = { ...getFieldsValue() };
                data.id = yhqlb.dishesIntergrationUpdate.id;
                dispatch({ type: 'yhqlb/updatePayload', payload: { dishesIntergrationUpdate: data } });
                yhqlb.bEditItem ? dispatch({ type: 'yhqlb/updateEvaluation', payload: {} }) : dispatch({ type: 'yhqlb/addEvaluation', payload: {} });
            });
        }



        return (
            <Form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
                <FormItem {...formItemLayout}
                    label="红包标题"
                >
                    {getFieldDecorator('name', {
                        initialValue: yhqlb.dishesIntergrationUpdate.name,
                        rules: [{
                            required: true, message: '请设置红包标题',
                        },
                        { pattern: /^[^ ]+$/, message: "请勿输入空格！" }],
                    })(
                        <Input />
                    )}


                </FormItem>
                <FormItem {...formItemLayout}
                    label="备注说明"
                >
                    {getFieldDecorator('remark', {
                        initialValue: yhqlb.dishesIntergrationUpdate.remark,
                        rules: [{
                            required: true, message: '请设置备注',
                        },
                        { pattern: /^[^ ]+$/, message: "请勿输入空格！" }],
                    })(
                        <Input type="textarea" />
                    )}

                </FormItem>
                <FormItem {...formItemLayout}
                    label="是否会员可用"
                    style={{ textAlign: "left" }}
                >
                    {getFieldDecorator('type', {
                        // initialValue:yhqlb.dishesIntergrationUpdate.type,
                        initialValue: yhqlb.bEditItem ? yhqlb.dishesIntergrationUpdate.type : function () {
                            // 如果列表没有数据，默认为1，如果列表有一条数据，且数据的type==1,就让他为2，否则就为1,不用考虑2条的情况，因为不可能存在有2条数据时还能展示新增窗口
                            if (!yhqlb.ealuationList.length || yhqlb.ealuationList.length == 0) {
                                return 1
                            }
                            if (yhqlb.ealuationList.length && yhqlb.ealuationList.length == 1) {
                                if (yhqlb.ealuationList[0].type == 1) {
                                    return 2
                                }
                                if (yhqlb.ealuationList[0].type == 2) {
                                    return 1
                                }
                            }
                        }(),
                        rules: [{
                            required: true, message: '必选项',
                        }],
                    })(
                        <RadioGroup style={{ marginLeft: 20 }} disabled={yhqlb.bEditItem || yhqlb.bEditItem == false && yhqlb.ealuationList.length == 1}>
                            <Radio key="a" value={1}>是</Radio>
                            <Radio key="b" value={2}>否</Radio>
                        </RadioGroup>
                    )}


                </FormItem>
                <FormItem {...formItemLayout}
                    label="红包是否启用"
                    style={{ textAlign: "left" }}
                >
                    {getFieldDecorator('state', {
                        initialValue: yhqlb.dishesIntergrationUpdate.state,
                        rules: [{
                            required: true, message: '必选项',
                        }],
                    })(
                        <RadioGroup style={{ marginLeft: 20 }}>
                            <Radio key="a" value={1}>是</Radio>
                            <Radio key="b" value={2}>否</Radio>
                        </RadioGroup>
                    )}


                </FormItem>


                <div className={styles.header} style={{ textAlign: 'left' }}>红包规则设置</div>
                <FormItem {...formItemLayout}
                    label="最大返现比例"
                >
                    {getFieldDecorator('maxProportion', {
                        initialValue: yhqlb.dishesIntergrationUpdate.maxProportion,
                        rules: [{
                            required: true, message: '请设置优惠面值',
                        }, { pattern: /^(0|[1-9]\d?|100)$/, message: "请输入0-100的整数！" }],
                    })(
                        <Input addonAfter="%" />
                    )}


                </FormItem>
                <FormItem {...formItemLayout}
                    label="最小返现比例"
                >
                    {getFieldDecorator('minProportion', {
                        initialValue: yhqlb.dishesIntergrationUpdate.minProportion,
                        rules: [{
                            required: true, message: '请设置返现比例',
                        }, { pattern: /^(0|[1-9]\d?|100)$/, message: "请输入0-100的整数！" }],
                    })(
                        <Input  addonAfter="%" />
                    )}


                </FormItem>

                <FormItem>
                    <Button type="primary" htmlType="submit" >确定</Button>
                    <Button onClick={backToHome}>取消</Button>
                </FormItem>
            </Form>

        );

    }
    function backToHome() {
        window.history.back();
    }

    if (yhqlb.readyGoBack) {
        window.history.back();
    }
    const RegistrationForm = Form.create()(Registration);


    const pagination = {
        total: yhqlb.cttotal,
        current: yhqlb.current,
        pageSize: yhqlb.size,
        
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger: true,
        onShowSizeChange: SizeChange,
    };

    function onPageChange(pageNo) {
        console.log(pageNo);
        var offset = pageNo * yhqlb.size - yhqlb.size;
        dispatch({ type: 'yhqlb/updatePayload', payload: { offset: offset, current: pageNo } });
        dispatch({ type: 'yhqlb/query', payload: {} });


    }

    function SizeChange(current, pageSize) {

        console.log(current, pageSize);
        dispatch({ type: 'yhqlb/updatePayload', payload: { size: pageSize, current: 1, offset: 0 } });
        dispatch({ type: 'yhqlb/query', payload: {} });


    }

    function onKeywordChange(e) {
        dispatch({ type: 'yhqlb/updatePayload', payload: { searchCouponId: e.target.value } });
    }

    function onKeywordChange1(e) {
        dispatch({ type: 'yhqlb/updatePayload', payload: { searchCouponName: e.target.value } });
    }

    function goSearch() {
        //TODO 完成优惠券查询接口
        dispatch({ type: 'yhqlb/updatePayload' });
    }

    const modalOpts = {
        yhqlb, dispatch
    };

    function gotoAddCoupon() {
        console.log(1111)
        dispatch(routerRedux.push({
            pathname: '/yhqlbAddCoupon',
            query: {},
        }));
    }

    const formItemLayout = {
        marginTop: 90,
        labelCol: {
            span: 5,
        },
        wrapperCol: {
            span: 16,
        },
    };
    return (
        <Header {...HeaderProps}>
            <div>
                <CouponAddChoosePlace {...modalOpts}>
                </CouponAddChoosePlace>
                <div className={styles.header} style={{ textAlign: 'left' }}>红包基本设置</div>
                <div style={{ marginTop: '40px' }}>
                    <RegistrationForm{...modalOpts}>
                    </RegistrationForm>

                </div>

            </div>
        </Header>
    );

}

DishesIntegrationAdded.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({ menu, yhqlb }) {
    return { menu, yhqlb };
}

export default connect(mapStateToProps)(DishesIntegrationAdded);

