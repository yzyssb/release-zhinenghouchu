import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Header from '../../components/Header';
import LeftMenu from '../../components/LeftMenu';
import Tabs from 'antd/lib/tabs';
import Table from 'antd/lib/table';
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
import CouponAddChooseProduct from '../../components/marketing/CouponAddChooseProduct.jsx';

import Input from 'antd/lib/input';
import Form from 'antd/lib/form';
import Radio from 'antd/lib/radio';
import Select from 'antd/lib/select';
import RouterRedux from 'dva/router';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
import { RangePicker } from 'antd/lib/date-picker';
import moment from 'moment';

const dateFormat = 'YYYY/MM/DD';
import Checkbox from 'antd/lib/checkbox';

const TabPane = Tabs.TabPane;
const CheckboxGroup = Checkbox.Group;

function IntegrationAdded({
    menu, yhqlb, dispatch

}) {

    const HeaderProps = {
        menu,
        dispatch,
    };
    const options = [
        { label: '星期一', value: '2' },
        { label: '星期二', value: '3' },
        { label: '星期三', value: '4' },
        { label: '星期四', value: '5' },
        { label: '星期五', value: '6' },
        { label: '星期六', value: '7' },
        { label: '星期七', value: '1' },
    ];
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


    var cuisineOptionHtml = [];

    if (yhqlb.rowSelectionData) {
        yhqlb.rowSelectionData.map((j) => {
            cuisineOptionHtml.push(<span key={j.id}>{j.name}</span>)
            cuisineOptionHtml.push(<span>、</span>)

        })
    }
    var cuisineOptionHtmlPro = [];

    if (yhqlb.rowSelectionDataPro) {
        yhqlb.rowSelectionDataPro.map((j) => {
            cuisineOptionHtmlPro.push(<span key={j.id}>{j.name}</span>)
            cuisineOptionHtmlPro.push(<span>、</span>)

        })
    }
    if (yhqlb.readyGoBack) {
        window.history.back()
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

        function choosePlace() {
            //TODO 弹出选择门店dialog，选择门店后显示到 右侧
            var data = { ...getFieldsValue() };
            dispatch({ type: 'yhqlb/updatePayload', payload: { modalVisible: true, intergrationUpdate: data } });
        }

        function choosePro() {
            //TODO 弹出选择产品dialog，选择产品后显示到 右侧
            var data = { ...getFieldsValue() };
            dispatch({ type: 'yhqlb/updatePayload', payload: { modaladdVisible: true, intergrationUpdate: data } });
            dispatch({ type: 'yhqlb/queryFoodList', payload: {} });
        }

        function changeValue(e) {
            var value = "";
            if (e == "1") {
                value = "添加固定信息";
            }
            else if (e == 2) {
                value = "选择活动星期几";
            }
            else if (e == 3) {
                value = "活动日期";
            }
            var data = { ...getFieldsValue() };
            dispatch({ type: 'yhqlb/updatePayload', payload: { value: value, valueS: e, intergrationUpdate: data } });
        }


        // 保存
        function handleSubmit(e) {
            if (e) {
                e.preventDefault();
            }
            validateFields((errors) => {
                if (!!errors) {
                    return;
                }
                var data = { ...getFieldsValue() };
                dispatch({ type: 'yhqlb/updatePayload', payload: { ruleType: 11, intergrationUpdate: data, weekStr: data.week ? data.week.toString() : "" } });
                var postProId;
                if (yhqlb.rowSelectionDataPro) {
                    yhqlb.rowSelectionDataPro.map((j) => {
                        if (!postProId)
                            postProId = "" + j.id + ",";
                        else
                            postProId = postProId + j.id + ",";
                    })
                }
                dispatch({ type: 'yhqlb/updatePayload', payload: { postProId: postProId } });

                var postShopId;
                if (yhqlb.rowSelectionData) {
                    yhqlb.rowSelectionData.map((j) => {
                        if (!postShopId)
                            postShopId = "" + j.id + ",";
                        else
                            postShopId = postShopId + j.id + ",";
                    })
                }
                dispatch({ type: 'yhqlb/updatePayload', payload: { postShopId: postShopId } });

                dispatch({ type: 'yhqlb/addGZSCPIntegration', payload: {} });




            });

       
        }
        return (

            <Form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
                <FormItem {...formItemLayout}
                    label="活动名称"
                >
                    {getFieldDecorator('activeName', {
                        initialValue: yhqlb.intergrationUpdate.activeName,
                        rules: [{
                            required: true, message: '请输入活动名称',
                        }, { pattern: /^[^ ]+$/, message: "请勿输入空格！" }],
                    })(
                        <Input />
                    )}


                </FormItem>
                <FormItem {...formItemLayout}
                    label={yhqlb.value}
                >
                    {/*{getFieldDecorator('ctaino', {*/}
                    {/*initialValue: yhqlb.valueS,*/}
                    {/*rules: [{*/}
                    {/*required: true, message: '请设置优惠面值',*/}
                    {/*}],*/}
                    {/*})(*/}

                    {/*)}*/}
                    <Tabs activeKey={"" + yhqlb.valueS} onChange={changeValue} style={{ marginLeft: 20 }} defaultActiveKey={"1"}>
                        {/*<TabPane tab="固定日期" key="1">
                            {getFieldDecorator('date', {
                                initialValue: yhqlb.intergrationUpdate.date,
                                rules: [{
                                    required: true, message: '请设置红包标题',
                                }],
                            })(
                                <Input/>
                            )}
                        </TabPane>
                        <TabPane tab="固定星期几" key="2">
                            {getFieldDecorator('week', {
                            initialValue:  yhqlb.intergrationUpdate.week,
                            rules: [{
                            required: true, message: '请设置红包标题',
                            }],
                            })(
                                <CheckboxGroup options={options}  />
                            )}

                        </TabPane>*/}
                        <TabPane tab="时间段临时活动" key={"1"}>

                            <RangePicker
                                disabledDate={disabledDate}
                                disabledTime={disabledRangeTime}
                                onChange={onSearchDateChange}
                                defaultValue={[yhqlb.startTime, yhqlb.endTime]}
                                format="YYYY-MM-DD HH:mm:ss"
                            />
                        </TabPane>
                    </Tabs>

                </FormItem>
                <FormItem {...formItemLayout}
                    label="适用门店"
                    style={{ textAlign: 'left' }}
                >
                    <Button type="primary" onClick={choosePlace}>选择合适的门店</Button>
                    {getFieldDecorator('place', {
                        initialValue: '',
                    })(
                        <span >{cuisineOptionHtml}</span>
                    )}


                </FormItem>
                <FormItem {...formItemLayout}
                    label="适用产品"
                    style={{ textAlign: 'left' }}
                >
                    <Button style={{ textAlign: 'left' }} type="primary" onClick={choosePro}>选择合适的产品</Button>
                    {getFieldDecorator('pro', {
                        initialValue: '',
                    })(
                        <span >{cuisineOptionHtmlPro}</span>
                    )}


                </FormItem>
                <FormItem style={{ textAlign: 'right' }}>
                    <Button type="primary" htmlType="submit">保存</Button>
                    <Button onClick={backToHome}>取消</Button>
                </FormItem>

            </Form>

        );

        function disabledDate(current) {
            // Can not select days before today and today
            return current < moment().startOf('day');
        }

        function range(start, end) {
            const result = [];
            for (let i = start; i < end; i++) {
                result.push(i);
            }
            return result;
        }

        function disabledRangeTime(_, type) {
            if (type === 'start') {
                return {
                    disabledHours: () => range(0, 60).splice(4, 20),
                    disabledMinutes: () => range(30, 60),
                    disabledSeconds: () => [55, 56],
                };
            }
            return {
                disabledHours: () => range(0, 60).splice(20, 4),
                disabledMinutes: () => range(0, 31),
                disabledSeconds: () => [55, 56],
            };
        }
        // 改变时间
        function onSearchDateChange(dates) {
            console.log(dates[0].format('YYYY-MM-DD HH:mm:ss'))
            console.log(dates[1].format('YYYY-MM-DD HH:mm:ss'))
            var data = { ...getFieldsValue() };
            dispatch({
                type: 'yhqlb/updatePayload',
                payload: {
                    startTime: dates[0],
                    endTime: dates[1],
                    postStartTime: dates[0].format('YYYY-MM-DD HH:mm:ss'),
                    postEndTime: dates[1].format('YYYY-MM-DD HH:mm:ss'),
                    intergrationUpdate: data
                }
            });
        };

    }

    function backToHome() {
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
                <CouponAddChooseProduct {...modalOpts}>
                </CouponAddChooseProduct>
                <div className={styles.header} style={{ textAlign: 'left' }}>红包基本设置</div>
                <div style={{ marginTop: '40px' }}>
                    <RegistrationForm {...modalOpts}>
                    </RegistrationForm>

                </div>

            </div>
        </Header>
    );

}

IntegrationAdded.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({ menu, yhqlb }) {
    return { menu, yhqlb };
}

export default connect(mapStateToProps)(IntegrationAdded);

