import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import moment from 'moment';
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

import Input from 'antd/lib/input';
import Form from 'antd/lib/form';
import Radio from 'antd/lib/radio';
import Select from 'antd/lib/select';
import Checkbox from 'antd/lib/checkbox';
import RouterRedux from 'dva/router';
import message from "antd/lib/message/index";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const {MonthPicker, RangePicker} = DatePicker;
const dateFormat = 'YYYY/MM/DD';

const TabPane = Tabs.TabPane;

function CouponDetail({
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

    var cuisineOptionHtml = [];

    if (yhqlb.storeList.shopList) {
        yhqlb.storeList.shopList.map((j) => {
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
        }
        return (

            <Form  onSubmit={handleSubmit} style={{textAlign: "center"}}>
                <FormItem {...formItemLayout}
                          label="优惠卷名称"
                          disabled
                          >
                    <Input value={yhqlb.item.name} disabled/>

                </FormItem>
                <FormItem {...formItemLayout}
                          label="优惠卷面值"
                          >
                    <Input value={yhqlb.item.faceValue}  disabled/>
                </FormItem>
                <FormItem {...formItemLayout}
                          label="满多少可用"
                          >
                        <Input value={yhqlb.item.arriveamount} disabled addonAfter="元"/>

                </FormItem>
                <FormItem {...formItemLayout}
                          label="有效天数"
                          >
                        <Input value={yhqlb.item.effectiveate}  disabled/>
                </FormItem>
                <FormItem {...formItemLayout}
                          label="使用时段"
                          >
                        <Input value={yhqlb.item.dayBeginTime}  disabled style={{width: "50%"}} />
                    <span width="10%">--</span>
                        <Input  value={yhqlb.item.dayEndTime}  disabled style={{width: "48%" }} />
                </FormItem>
                <FormItem {...formItemLayout}
                          label="优惠券总量"
                          >
                        <Input  value={yhqlb.item.totalAmount} disabled/>
                </FormItem>
                <FormItem {...formItemLayout}
                          
                          style={{textAlign:"left"}}
                          label="门店范围">

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
                    initialValue: yhqlb.item.categoryLimit,

                    })(
                        <RadioGroup disabled style={{marginLeft: 20}} >
                            <Radio key="a" value={"1"} checked={true}>外带</Radio>
                            <Radio key="b" value={"5"}>堂食</Radio>
                        </RadioGroup>
                    )}


                </FormItem>
                <FormItem {...formItemLayout}
                          label="会员类型"
                          style={{textAlign:"left"}}
                          >
                    {getFieldDecorator('couponLevel', {
                    initialValue: yhqlb.item.couponLevel,
                    })(

                        <RadioGroup disabled style={{marginLeft: 20}} >
                            <Radio key="a" value={"1"}>会员</Radio>
                            <Radio key="b" value={"2"}>非会员</Radio>
                        </RadioGroup>
                    )}

                </FormItem>
                <FormItem {...formItemLayout}
                          label="发放类型"
                          style={{textAlign:"left"}}
                          >

                        <Tabs defaultActiveKey="1" style={{marginLeft: 20}}>
                            <TabPane tab="系统发放" key="1">

                                <RadioGroup value={8} disabled >
                                    <Radio key="f" value={8} >用户领取</Radio>
                                </RadioGroup>
                            </TabPane>
                            <TabPane tab="活动发放" key="2">
                                {getFieldDecorator('giveType', {
                                    initialValue: yhqlb.item.giveType,
                                })(
                                <RadioGroup disabled>
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
                    <Button type="primary" onClick={backToHome}>返回</Button>
                </FormItem>
            </Form>

        );

    }

    function backToHome() {
        window.history.back();
    }
    const RegistrationForm = Form.create()(Registration);


    return (
        <Header {...HeaderProps}>
            <div>
                <div className={styles.header} style={{textAlign: 'left'}}>优惠券详情</div>
                <div style={{marginTop: '40px'}}>
                    <RegistrationForm  {...RegistrationFormProps}>
                    </RegistrationForm>

                </div>

            </div>
        </Header>
    );

}

CouponDetail.propTypes = {
    menu: PropTypes.object,
    form: PropTypes.object,
    item: PropTypes.object,
};

function mapStateToProps({menu, yhqlb}) {
    return {menu, yhqlb};
}

export default connect(mapStateToProps)(CouponDetail);

