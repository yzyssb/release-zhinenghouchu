import React, {PropTypes} from 'react';

import Modal from 'antd/lib/modal';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import Checkbox from 'antd/lib/checkbox';
import Radio from 'antd/lib/radio';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import DatePicker from 'antd/lib/date-picker';
import styles from './JfgzAddModal.less';

const FormItem = Form.Item;

const RangePicker = DatePicker.RangePicker;
import moment from 'moment';
import message from "antd/lib/message/index";

const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const JfgzAddModal = ({
                          extraRule,
                          jfgzVisible,
                          onOk,
                          onCancel,
                          currentItem,
                          dispatch,
                          form: {
                              getFieldDecorator,
                              validateFields,
                              getFieldsValue,
                              resetFields,
                              setFieldsValue,
                          },
                          jfgz,
                      }) => {


    const formItemLayout = {
        labelCol: {
            span: 5,
        },
        wrapperCol: {
            span: 16,
        },
    };

    const Option = Select.Option;
    const {
        hydjData, storeList

    } = jfgz

    function handleOk() {
        validateFields((errors) => {
            if (!!errors) {
                return false;
            }
            let value = getFieldsValue();
            if(jfgz.scoreRule.consume_score<0){
                message.error('积分比例不能为负数')
                return;
            }
            if(jfgz.scoreRule.birth_score!=null&&jfgz.scoreRule.birth_score!=''&&jfgz.scoreRule.birth_score<0){
                message.error('生日比例不能为负数')
                return;
            }
            if(jfgz.scoreRule.first_score!=null&&jfgz.scoreRule.first_score!=''&&jfgz.scoreRule.first_score<0){
                message.error('一级粉丝比例不能为负数')
                return;
            }
            if(jfgz.scoreRule.second_score!=null&&jfgz.scoreRule.second_score!=''&&jfgz.scoreRule.second_score<0){
                message.error('二级粉丝比例不能为负数')
                return;
            }
            if(jfgz.scoreRule.share_score!=null&&jfgz.scoreRule.share_score!=''&&jfgz.scoreRule.share_score<0){
                message.error('分享比例不能为负数')
                return;
            }
            jfgz.scoreRule.consume_score = value.scoreRatio;
            jfgz.rule_name = value.rule_name;
            if (jfgz.jfgzAdd) {
                dispatch({
                    type: 'jfgz/addScoreRule',
                    payload: {
                        rule_name: value.rule_name,
                        client: jfgz.client,
                        level_id: value.level_id,
                        store_id: jfgz.store_id,
                        scoreRule: jfgz.scoreRule,
                        extraRule: jfgz.extraRule
                    }
                });

            } else {
                dispatch({
                    type: 'jfgz/modifyScoreRule',
                    payload: {
                        ruleId: jfgz.ruleId,
                        rule_name: value.rule_name,
                        client: jfgz.client,
                        level_id: value.level_id,
                        store_id: jfgz.store_id,
                        scoreRule: jfgz.scoreRule,
                        extraRule: jfgz.extraRule
                    }
                });

            }
            jfgz.scoreRule = {
                consume_score: '',
                birth_score: '',
                first_score: '',
                second_score: '',
                share_score: '',
            },
                jfgz.extraRule = {
                    sendPay: 0,
                    scorePay: 0,
                    couponPay: 0,
                    scoreLifeVal: '',
                    scoreLifeType: 1,
                }
            dispatch({
                type: 'jfgz/updatePayload',
                payload: {
                    jfgzVisible: false, scoreRule: jfgz.scoreRule, extraRule: jfgz.extraRule, store_id: '', ruleId: '',
                    rule_name: '',
                    level_id: '',
                }
            });
        });
    }

    const modalOpts = {
        title: jfgz.jfgzAdd ? "添加积分规则" : "修改积分规则",
        visible: jfgzVisible,
        onOk: handleOk,
        onCancel,
        currentItem,
        okText:"确定",
        cancelText:"取消"

    };

    function onSelectChange(e) {

        dispatch({
            type: 'jfgz/updatePayload',
            payload: {
                commentType: e,
            }
        });

    }


    function handCancel() {
        jfgz.scoreRule = {
            consume_score: '',
            birth_score: '',
            first_score: '',
            second_score: '',
            share_score: '',
        },
            jfgz.extraRule = {
                sendPay: 0,
                scorePay: 0,
                couponPay: 0,
                scoreLifeVal: '',
                scoreLifeType: 1,
            }
        dispatch({
            type: 'jfgz/updatePayload',
            payload: {
                jfgzVisible: false, scoreRule: jfgz.scoreRule, extraRule: jfgz.extraRule, store_id: '', ruleId: '',
                rule_name: '',
                level_id: '',
            }
        });

    }

    function onCheckedChanged(checkedList) {
        var storeIdOri = '';
        for (var i = 0; i < checkedList.length; i++) {
            storeIdOri += checkedList[i] + ','
        }
        var storeId = storeIdOri.substring(0, storeIdOri.length - 1);
        dispatch({
            type: 'jfgz/updatePayload',
            payload: {store_id: storeId}

        });
        console.log(checkedList)
    }


    function getScoreRatio(e) {
        jfgz.scoreRule.consume_score = e.target.value;
        dispatch({
            type: 'jfgz/updatePayload',
            payload: {scoreRule: jfgz.scoreRule}

        });

    }

    function getBrithRatio(e) {
        jfgz.scoreRule.birth_score = e.target.value;
        dispatch({
            type: 'jfgz/updatePayload',
            payload: {scoreRule: jfgz.scoreRule}

        });

    }

    function getFirstScore(e) {
        jfgz.scoreRule.first_score = e.target.value;
        dispatch({
            type: 'jfgz/updatePayload',
            payload: {scoreRule: jfgz.scoreRule}

        });

    }

    function getSecondScore(e) {
        jfgz.scoreRule.second_score = e.target.value;
        dispatch({
            type: 'jfgz/updatePayload',
            payload: {scoreRule: jfgz.scoreRule}

        });

    }

    function getShareScore(e) {
        jfgz.scoreRule.share_score = e.target.value;
        dispatch({
            type: 'jfgz/updatePayload',
            payload: {scoreRule: jfgz.scoreRule}

        });

    }

    function radioChangeFun(e) {
        extraRule.scoreLifeType = e.target.value
        dispatch({
            type: 'jfgz/updatePayload',
            payload: {extraRule: jfgz.extraRule}

        });
    }

    //更改state时间
    function selectTime(times) {
        Date.prototype.format = function (format) {
            var o = {
                "M+": this.getMonth() + 1, //month
                "d+": this.getDate(),    //day
                "h+": this.getHours(),   //hour
                "m+": this.getMinutes(), //minute
                "s+": this.getSeconds(), //second
                "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
                "S": this.getMilliseconds() //millisecond
            }
            if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
                (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o) if (new RegExp("(" + k + ")").test(format))
                format = format.replace(RegExp.$1,
                    RegExp.$1.length == 1 ? o[k] :
                        ("00" + o[k]).substr(("" + o[k]).length));
            return format;
        }
        var gmtStart = moment(times).format();
        gmtStart = new Date(gmtStart).format('yyyy-MM-dd')
        jfgz.extraRule.scoreLifeVal = gmtStart;
        dispatch({
            type: 'jfgz/updatePayload',
            payload: {extraRule: jfgz.extraRule,}

        });

    }

    function handleChange(value) {
        dispatch({
            type: 'jfgz/updatePayload',
            payload: {client: value,}

        });
    }

    function getLevelId(value) {
        jfgz.level_id = value,
            dispatch({
                type: 'jfgz/updatePayload',
                payload: {level_id: value,}

            });
    }

    function onChangeOne(e) {
        if (e.target.checked) {
            jfgz.extraRule.sendPay = 1;
            dispatch({
                type: 'jfgz/updatePayload',
                payload: {extraRule: jfgz.extraRule}

            });
        } else {
            jfgz.extraRule.sendPay = 0;
            dispatch({
                type: 'jfgz/updatePayload',
                payload: {extraRule: jfgz.extraRule}

            });
        }
    }

    function onChangeTwo(e) {
        if (e.target.checked) {
            jfgz.extraRule.scorePay = 1;
            dispatch({
                type: 'jfgz/updatePayload',
                payload: {extraRule: jfgz.extraRule}

            });
        } else {
            jfgz.extraRule.scorePay = 0;
            dispatch({
                type: 'jfgz/updatePayload',
                payload: {extraRule: jfgz.extraRule}

            });
        }
    }

    function onChangeThree(e) {
        if (e.target.checked) {
            jfgz.extraRule.couponPay = 1;
            dispatch({
                type: 'jfgz/updatePayload',
                payload: {extraRule: jfgz.extraRule}

            });
        } else {
            jfgz.extraRule.couponPay = 0;
            dispatch({
                type: 'jfgz/updatePayload',
                payload: {extraRule: jfgz.extraRule}

            });
        }
    }
    return (
        <Modal {...modalOpts} visible={jfgzVisible} onCancel={handCancel} afterClose={() => {
            resetFields()
        }}
               footer={[
                   <Button key="back" onClick={handCancel}>取消</Button>,
                   <Button key="submit" type="primary" onClick={handleOk}>确认</Button>
               ]} width='700px'>
            <div className={styles.pay}>
                <Form horizontal>
                    <FormItem{...formItemLayout} label="积分规则名称" >
                        {getFieldDecorator('rule_name', {
                            initialValue: jfgz.rule_name,
                            rules: [
                                {
                                    required: true,
                                    message: '请填写积分规则名称'
                                }
                            ]
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem{...formItemLayout} label="适用客户端" >
                        {getFieldDecorator('client', {
                            initialValue: jfgz.client == 1 ? "微信" : "app",
                            rules: [
                                {
                                    required: true,
                                    message: '请选择适用客户端'
                                }
                            ]
                        })(
                            <Select style={{width: 120}} onChange={handleChange}>
                                <Option value="1">微信</Option>
                                <Option value="2">app</Option>
                            </Select>
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label="会员等级" >
                        {getFieldDecorator('level_id', {
                            initialValue: jfgz.hydjData.length!=0?jfgz.hydjData[0].level_id:0,
                            rules: [
                                {
                                    required: true,
                                    message: '请选择会员等级'
                                }
                            ]
                        })(
                            <Select style={{width: 120}} onChange={getLevelId}>
                                {hydjData.map(function (val, i) {
                                    return <Option value={val.level_id} key={i}>{val.level_name}</Option>

                                })}
                            </Select>
                        )}

                    </FormItem>

                    <FormItem{...formItemLayout} label="选择适用店铺" >
                        {getFieldDecorator('stores', {
                            initialValue: jfgz.jfgzAdd ? [] : jfgz.checkedStoreList,
                            rules: [
                                {
                                    required: true,
                                    message: '请选择适用店铺'
                                }
                            ]
                        })(

                            <CheckboxGroup options={storeList} onChange={onCheckedChanged}/>
                        )}

                        {/*<CheckboxGroup defaultValue={jfgz.checkedStoreList}*/}
                                       {/*options={storeList} onChange={onCheckedChanged}/>*/}
                    </FormItem>
                    <FormItem{...formItemLayout} label="选择奖励方式" >
                        <span style={{marginRight: 5, marginLeft: 10}}>1:积分比例</span>
                        {
                            getFieldDecorator('scoreRatio', {
                                initialValue: jfgz.scoreRule.consume_score,
                                rules: [
                                    {
                                        pattern: /^[0-9]\d*(\.\d+)?$/,
                                        required: true,
                                        message: '积分比例不能为负数'
                                    }
                                ]
                            })(
                                <Input type='number' style={{marginLeft: 10, width: 100}} onChange={getScoreRatio}/>
                            )
                        }
                        <span style={{marginRight: 5, marginLeft: 20}}>%[奖励积分=金额*比例]</span>
                    </FormItem>
                    <p>
                        <span style={{marginRight: 5, marginLeft: 40}}>2: 会员生日月份</span>
                        <Input type='number' value={jfgz.scoreRule.birth_score}
                               style={{marginLeft: 10, width: 100}} onChange={getBrithRatio}/>
                        <span style={{marginRight: 5, marginLeft: 5}}>会员生日当月是原来的几倍积分</span>
                    </p>
                    <p>
                        <span style={{marginRight: 5, marginLeft: 40}}>3: 一级粉丝消费送</span>
                        <Input type='number' value={jfgz.scoreRule.first_score}
                               style={{marginLeft: 10, width: 100}} onChange={getFirstScore}/>
                        <span style={{marginRight: 5, marginLeft: 5}}>%[消费金额*比例]</span>
                    </p>

                    <p>
                        <span style={{marginRight: 5, marginLeft: 40}}>4: 二级粉丝消费送</span>
                        <Input type='number' value={jfgz.scoreRule.second_score}
                               style={{marginLeft: 10, width: 100}} onChange={getSecondScore}/>
                        <span style={{marginRight: 5, marginLeft: 5}}>%[消费金额*比例]</span>
                    </p>
                    <p>
                        <span style={{marginRight: 5, marginLeft: 40}}>5: 分享送积分</span>
                        <Input type='number' value={jfgz.scoreRule.share_score}
                               style={{marginLeft: 10, width: 100}} onChange={getShareScore}/>
                        <span style={{marginRight: 5, marginLeft: 5}}></span>
                    </p>
                    <FormItem>
                        <p style={{marginRight: 5, marginLeft: 40}}>额外规则:</p>
                        <Checkbox style={{marginRight: 5, marginLeft: 40}} checked={jfgz.extraRule.sendPay == '0'? false : true} onChange={onChangeOne}>
                        </Checkbox>
                        <span>赠送金额消费是否产生积分</span>
                        <Checkbox checked={jfgz.extraRule.scorePay == '0'?false : true} onChange={onChangeTwo}>
                        </Checkbox>
                        <span>积分消费是否产生积分</span>
                        <Checkbox checked={jfgz.extraRule.couponPay == '0'?false : true} onChange={onChangeThree}>
                        </Checkbox>
                        <span>优惠券消费是否产生积分</span>
                    </FormItem>
                    <FormItem{...formItemLayout} label="积分有效期" >
                        <RadioGroup onChange={radioChangeFun} defaultValue={jfgz.jfgzAdd?1:extraRule.scoreLifeType}>
                            <Radio value={1}>永久</Radio>
                            <Radio value={2}>自定义</Radio>
                        </RadioGroup>
                    </FormItem>
                    {extraRule.scoreLifeType == 2 && (
                        <FormItem
                            {...formItemLayout} >
                            {getFieldDecorator('scoreLifeVal', {
                                initialValue: jfgz.jfgzAdd?moment():moment(extraRule.scoreLifeVal),
                                rules: [
                                    {
                                        type: 'object',
                                        required: true,
                                        message: '请输入会员有效期'
                                    }
                                ]
                            })(
                                <DatePicker onChange={selectTime}/>
                            )}

                        </FormItem>
                    )}
                </Form>
            </div>
        </Modal>
    )
        ;
};
JfgzAddModal.propTypes = {
    visible: PropTypes.any,
    item: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
};

export default Form.create()(JfgzAddModal);
