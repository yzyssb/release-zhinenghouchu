import React, {PropTypes} from 'react';
import {connect} from 'dva';
import Header from '../../components/Header';
import Tabs from 'antd/lib/tabs';
import Button from 'antd/lib/button';
import styles from './privateLess.less';
import CouponAddChoosePlace from '../../components/marketing/CouponAddChoosePlace.jsx';

import Input from 'antd/lib/input';
import Form from 'antd/lib/form';
import Radio from 'antd/lib/radio';
import {RangePicker} from 'antd/lib/date-picker';
import moment from 'moment';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;

function CouponAdded({
                         menu, yhqlb, dispatch

                     }) {

    const HeaderProps = {
        menu,
        dispatch,
    };

    const RegistrationFormProps = {
        yhqlb,
        dispatch,
    };



    function couponDetail(record) {
        //TODO 查看详情
    }



    function gotoDispatch(data) {
        dispatch({type: 'yhqlb/updatePayload', payload: {couponUpdate: data}});
    }
    var cuisineOptionHtml = [];

    if (yhqlb.rowSelectionData) {
        yhqlb.rowSelectionData.map((j) => {
            cuisineOptionHtml.push(<span key={j.id}>{j.name}</span>)
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
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };
        function handleSubmit(e) {
            if(e){
                e.preventDefault();
            }
            validateFields((errors) => {
                if (!!errors) {
                    return;
                }
            });

            var data={...getFieldsValue()};
            dispatch({type: 'yhqlb/updatePayload', payload: {couponUpdate: data}});
            dispatch({type: 'yhqlb/addCoupon', payload: {}});
        }
        function disabledDate(current) {
            // Can not select days before today and today
            return current && current < moment().endOf('day');
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
        const onSearchDateChange = (dates, dateStrings) => {
            var data={...getFieldsValue()};
            dispatch({type: 'yhqlb/updatePayload', payload: {couponUpdate: data}});
            dispatch({
                type: 'yhqlb/updatePayload',
                payload: {
                    startTime: dates[0],
                    endTime: dates[1],
                    postStartTime:dates[0].format('YYYY-MM-DD HH:mm:ss') ,
                    postEndTime:dates[1].format('YYYY-MM-DD HH:mm:ss'),
                }
            });
        };
        function choosePlace() {
            //TODO 弹出选择门店dialog，选择门店后显示到 右侧
            var data={...getFieldsValue()};
            dispatch({type: 'yhqlb/updatePayload', payload: {modalVisible: true,couponUpdate: data}});

        }
        return (

            <Form onSubmit={handleSubmit} style={{textAlign: "center"}}>
                <FormItem {...formItemLayout}
                          label="优惠卷名称"
                          >
                    {getFieldDecorator('name', {
                        initialValue: yhqlb.couponUpdate.name,
                        rules: [{
                            required: true, message: '请设置优惠面值',
                        }],
                    })(
                        <Input />
                    )}


                </FormItem>
                <FormItem {...formItemLayout}
                          label="优惠卷面值"
                          >
                    {getFieldDecorator('faceValue', {
                        initialValue: yhqlb.couponUpdate.faceValue,
                        rules: [{
                            required: true, message: '请设置优惠面值',
                        }],
                    })(
                        <Input />
                    )}


                </FormItem>
                <FormItem {...formItemLayout}
                          label="满多少可用"
                          >
                    {getFieldDecorator('arriveamount', {
                        initialValue: yhqlb.couponUpdate.arriveamount,
                        rules: [{
                            required: true, message: '请设置优惠面值',
                        }],
                    })(
                        <Input addonAfter="元"/>
                    )}


                </FormItem>
                <FormItem {...formItemLayout}
                          label="有效天数"
                          >
                    {getFieldDecorator('effectiveate', {
                        initialValue: yhqlb.couponUpdate.effectiveate,
                        rules: [{
                            required: true, message: '请设置优惠面值',
                        }],
                    })(
                        <Input/>
                    )}


                </FormItem>
                <FormItem {...formItemLayout}
                          label="使用时段"
                          >

                    <RangePicker
                        disabledDate={disabledDate}
                        disabledTime={disabledRangeTime}
                        onChange={onSearchDateChange}
                        defaultValue={[yhqlb.startTime, yhqlb.endTime]}
                        format="YYYY-MM-DD HH:mm:ss"
                    />

                </FormItem>
                <FormItem {...formItemLayout}
                          label="优惠券总量"
                          >
                    {getFieldDecorator('totalAmount', {
                        initialValue: yhqlb.couponUpdate.totalAmount,
                    })(
                        <Input />
                    )}

                </FormItem>
                <FormItem {...formItemLayout}
                          
                          style={{textAlign:"left"}}
                          label="门店范围">
                    <Button type="primary" onClick={choosePlace}>选择合适的门店</Button>

                    {getFieldDecorator('place', {
                        initialValue: '',
                    })(
                        <span >{cuisineOptionHtml}</span>
                    )}


                </FormItem>
                <FormItem {...formItemLayout}
                          label="使用限制"
                          style={{textAlign:"left"}}
                          >
                    {getFieldDecorator('categoryLimit', {
                    initialValue: yhqlb.couponUpdate.categoryLimit,

                    })(
                        <RadioGroup style={{marginLeft: 20}} >
                            <Radio key="a" value={1} checked={true}>外带</Radio>
                            <Radio key="b" value={5}>堂食</Radio>
                        </RadioGroup>
                    )}


                </FormItem>
                <FormItem {...formItemLayout}
                          label="会员类型"
                          style={{textAlign:"left"}}
                          >
                    {getFieldDecorator('couponLevel', {
                    initialValue: yhqlb.couponUpdate.couponLevel,
                    })(

                        <RadioGroup style={{marginLeft: 20}} >
                            <Radio key="a" value={1}>会员</Radio>
                            <Radio key="b" value={0}>非会员</Radio>
                        </RadioGroup>
                    )}

                </FormItem>
                <FormItem {...formItemLayout}
                          label="发放类型"
                          style={{textAlign:"left"}}
                          >

                        <Tabs defaultActiveKey="1" style={{marginLeft: 20}}>
                            <TabPane tab="系统发放" key="1">
                                {getFieldDecorator('sendMember1', {
                                    initialValue: 8,
                                })(
                                <RadioGroup >
                                    <Radio key="f" checked value={8} >用户领取</Radio>
                                </RadioGroup>
                                )}
                            </TabPane>
                            <TabPane tab="活动发放" key="2">
                                {getFieldDecorator('giveType', {
                                    initialValue: yhqlb.couponUpdate.giveType,
                                })(
                                <RadioGroup>
                                    <Radio key="a" value={1}>生日活动</Radio>
                                    <Radio key="b" value={2}>节假日促销</Radio>
                                    <Radio key="c" value={3}>分享</Radio>
                                    <Radio key="d" value={4}>新用户赠送</Radio>
                                    <Radio key="e" value={5}>邀请赠送</Radio>
                                </RadioGroup>
                                )}
                            </TabPane>
                        </Tabs>



                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit">提交</Button>
                    <Button>取消</Button>
                </FormItem>
            </Form>

        );

    }


    const RegistrationForm = Form.create()(Registration);
    function goSearch() {
        //TODO 完成优惠券查询接口
        dispatch({type: 'yhqlb/updatePayload'});
    }

    const modalOpts = {
        yhqlb, dispatch
    };


    return (
        <Header {...HeaderProps}>
            <div>
                <CouponAddChoosePlace {...modalOpts}>
                </CouponAddChoosePlace>
                <div className={styles.header} style={{textAlign: 'left'}}>添加优惠券</div>
                <div style={{marginTop: '40px'}}>
                    <RegistrationForm  {...RegistrationFormProps}>
                    </RegistrationForm>

                </div>

            </div>
        </Header>
    );

}

CouponAdded.propTypes = {
    menu: PropTypes.object,
    form: PropTypes.object,
    item: PropTypes.object,
};

function mapStateToProps({menu, yhqlb}) {
    return {menu, yhqlb};
}

export default connect(mapStateToProps)(CouponAdded);

