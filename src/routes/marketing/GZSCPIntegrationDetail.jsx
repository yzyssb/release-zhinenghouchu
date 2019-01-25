import React, {PropTypes} from 'react';
import {connect} from 'dva';
import Header from '../../components/Header';
import Tabs from 'antd/lib/tabs';
import Button from 'antd/lib/button';
import styles from './privateLess.less';
import CouponAddChoosePlace from '../../components/marketing/CouponAddChoosePlace.jsx';
import CouponAddChooseProduct from '../../components/marketing/CouponAddChooseProduct.jsx';

import Input from 'antd/lib/input';
import Form from 'antd/lib/form';
import Radio from 'antd/lib/radio';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
import {RangePicker} from 'antd/lib/date-picker';
import moment from 'moment';

const dateFormat = 'YYYY/MM/DD';
import Checkbox from 'antd/lib/checkbox';

const TabPane = Tabs.TabPane;
const CheckboxGroup = Checkbox.Group;

function IntegrationDetail({
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

    if(yhqlb.readyGoBack)
    {
        window.history.back()
    }
    const Registration = ({

                              yhqlb,
                              form: {
                                  getFieldDecorator,
                                  validateFields,
                                  getFieldsValue,
                                  resetFields,
                                  setFields,
                              }, dispatch, login,
                          }) => {


        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };


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
            var data = {...getFieldsValue()};
            dispatch({type: 'yhqlb/updatePayload', payload: {value: value, valueS: e,intergrationUpdate: data}});
        }


        function handleSubmit(e) {
            if (e) {
                e.preventDefault();
            }
            validateFields((errors) => {
                if (!!errors) {
                    return;
                }
            });

            var data = {...getFieldsValue()};
            dispatch({type: 'yhqlb/updatePayload', payload: {intergrationUpdate: data,weekStr:data.week?data.week.toString():""}});
            var postProId;
            if (yhqlb.rowSelectionDataPro) {
                yhqlb.rowSelectionDataPro.map((j) => {
                    if(!postProId)
                        postProId=""+j.id+",";
                    else
                        postProId=postProId+j.id+",";
                })
            }
            dispatch({type: 'yhqlb/updatePayload', payload: {postProId: postProId}});

            var postShopId;
            if (yhqlb.rowSelectionData) {
                yhqlb.rowSelectionData.map((j) => {
                    if(!postShopId)
                        postShopId=""+j.id+",";
                    else
                        postShopId=postShopId+j.id+",";
                })
            }
            dispatch({type: 'yhqlb/updatePayload', payload: {postShopId: postShopId}});

            dispatch({type: 'yhqlb/addIntegration', payload: {}});
        }
        return (

            <Form onSubmit={handleSubmit} style={{textAlign: "center"}}>
                <FormItem {...formItemLayout}
                          label="活动名称"
                          >



                    {getFieldDecorator('activityName', {
                        initialValue: yhqlb.intergrationUpdate.activityName,
                    })(

                        <Input  disabled/>
                    )}

                </FormItem>
                <FormItem {...formItemLayout}
                          label={yhqlb.value}
                          >
                    <Tabs activeKey={''+yhqlb.valueS} onChange={changeValue} style={{marginLeft: 20}}>
                        
                        <TabPane tab="时间段临时活动" key="1">

                            <RangePicker
                                disabled
                                disabledDate={disabledDate}
                                disabledTime={disabledRangeTime}
                                onChange={onSearchDateChange}
                                defaultValue={[moment(yhqlb.postStartTime,"YYYY-MM-DD HH:mm:ss"), moment(yhqlb.postEndTime,"YYYY-MM-DD HH:mm:ss")]}
                                format="YYYY-MM-DD HH:mm:ss"
                            />
                        </TabPane>
                    </Tabs>

                </FormItem>
                <FormItem {...formItemLayout}
                          label="适用门店"
                          style={{textAlign: 'left'}}
                          >

                        <span >{yhqlb.postShopId}</span>


                </FormItem>
                <FormItem {...formItemLayout}
                          label="适用产品"
                          style={{textAlign: 'left'}}
                          >
                        <span >{yhqlb.postProId}</span>


                </FormItem>

                <FormItem style={{textAlign: 'right'}}>
                    <Button onClick={backToHome}>返回</Button>
                </FormItem>
                
            </Form>

        );

        function disabledDate(current) {
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

        function onSearchDateChange(dates){
            console.log(11111)
            dispatch({
                type: 'yhqlb/updatePayload',
                payload: {
                    startTime: dates[0],
                    endTime: dates[1],
                    postStartTime: dates[0].format('YYYY-MM-DD HH:mm:ss'),
                    postEndTime: dates[1].format('YYYY-MM-DD HH:mm:ss'),
                }});
        };

    }

    function backToHome() {
        window.history.back();
    }

    const RegistrationForm = Form.create()(Registration);

    const modalOpts = {
        yhqlb, dispatch
    };

    return (
        <Header {...HeaderProps}>
            <div>
                <div className={styles.header} style={{textAlign: 'left'}}>红包基本设置</div>
                <div style={{marginTop: '40px'}}>
                    <RegistrationForm {...modalOpts}>
                    </RegistrationForm>

                </div>

            </div>
        </Header>
    );

}

IntegrationDetail.propTypes = {
    menu: PropTypes.object,
    form: PropTypes.object,
    item: PropTypes.object,
};

function mapStateToProps({menu, yhqlb}) {
    return {menu, yhqlb};
}

export default connect(mapStateToProps)(IntegrationDetail);

