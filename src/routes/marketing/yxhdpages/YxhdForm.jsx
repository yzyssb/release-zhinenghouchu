import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Button from 'antd/lib/button';
import Radio from 'antd/lib/radio';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import YxhdFormModal from './YxhdFormModal'
import TreeSelect from "antd/lib/tree-select"

import Select from 'antd/lib/select';
import DatePicker from 'antd/lib/date-picker';
import Transfer from 'antd/lib/transfer';
import Checkbox from 'antd/lib/checkbox';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Modal from 'antd/lib/modal';

import moment from 'moment';
import message from 'antd/lib/message';


const RangePicker = DatePicker.RangePicker;
const confirm = Modal.confirm; //确认对话框
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;
const { Option, OptGroup } = Select;


// form表单   
const YxhdFormDetail = ({
    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
    }, dispatch, yxhdConfig, reset
}) => {



    const formItemLayout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 8 },
    };


    // 点击取消回到列表页面
    function quxiao() {
        dispatch(routerRedux.push({
            pathname: "/yxhdlist",
            query: {}
        }));
    }



    //弹框
    const YxhdFormModalProps = {
        visible: yxhdConfig.modalVisible,
        dispatch,
        yxhdConfig,
    }

    // 切换radio,清空之前选择的数据，发送请求接口
    function changeRadio(e) {
        dispatch({
            type: 'yxhdConfig/updatePayload',
            payload: {
                activityType: e.target.value,
                couponListData: [],
                selectedRowKeys: [],
                selectedRows: [],
                selectedRowKeysBackups: [], //selectedRowKeys的备份
                selectedRowsBackups: [], //selectedRows的备份
            }
        })


    }

    // 根据活动类型选择优惠券调取优惠券列表，不分页，展示modal
    function changeCoupon() {
        dispatch({
            type: 'yxhdConfig/updatePayload',
            payload: { modalVisible: true }
        })

        // 调取优惠券列表,默认选择全部符合条件的
        dispatch({
            type: 'yxhdConfig/yhqhdList',
            payload: {
                name: "", //优惠券名称
                platformType: "", //初始搜所有优惠券类型
                couponType: "",//初始搜所有的优惠券类型
            },
        });

    }

    function onChangeisPush(e) {
        console.log(e)
        dispatch({
            type: 'yxhdConfig/updatePayload',
            payload: { isPush: e }
        })
    }


    // 品牌餐厅相关逻辑================================================================
    const tPropsRestaurantData = {
        treeData: yxhdConfig.restaurantDataMenDian,
        onChange: changeRestaurantValue,
        treeCheckable: true,
        searchPlaceholder: '请选择品牌',
        dropdownStyle: {
            height: "300px",
            overflowY: "scroll"
        }
    };

    // 改变选中的餐厅数据
    function changeRestaurantValue(value) {
        dispatch({
            type: "yxhdConfig/updatePayload",
            payload: {
                restaurantValue: value
            }
        })
    }


    // 点击保存提交表单
    function saveInfo() {
        validateFields((errors) => {
            if (!!errors) {
                return false;
            }
            let payload = {}
            payload.activityCouponVOList = []; //装优惠券

            // 检测是否有适用优惠券
            if (yxhdConfig.selectedRows.length == 0) {
                message.error("请选择优惠券！");
                return
            } else if (yxhdConfig.selectedRows.length > 0) {
                let result = yxhdConfig.selectedRows.filter(function (item, index) {
                    return item.grantCount && item.grantCount > 0
                })
                if (result.length == 0) {
                    message.error("选中的优惠券必须填写发放数量");
                    return
                } else {
                    result.map(function (item, index) {
                        payload.activityCouponVOList.push({
                            couponId: item.id.split("-")[1],  //优惠券id 
                            couponType: item.platformType, // 1餐软 2电商
                            grantCount: item.grantCount  //发放数量
                        })
                    })
                }
            }

            payload.activityDesc = getFieldsValue()["activityDesc"];  //活动说明
            payload.activityRestaurantVOList = []; //门店列表集合

            //  两个数据对比拿到门店id和品牌id
            yxhdConfig.restaurantDataMenDian.map(function (item, index) {
                yxhdConfig.restaurantValue.map(function (ele, key) {
                    if (item.value == ele) {
                        // 有相等的就去循环item.children数组项，把他的二级门店id也拿到
                        if (item.children.length > 0) {
                            for (var i = 0; i < item.children.length; i++) {
                                for (var k in item.children[i]) {
                                    if (k == "value") {
                                        payload.activityRestaurantVOList.push({ brandId: item.value, restaurantId: item.children[i]["value"].split("-")[1] })
                                    }
                                }
                            }
                        }
                    }
                })
            })

            payload.activityType = getFieldsValue()["activityType"]   //活动类型

            payload.gmtStart = getFieldsValue().gmtStart[0].valueOf(); ////开始时间 ,
            payload.gmtFinish = getFieldsValue().gmtStart[1].valueOf() ////结束时间 ,

            payload.activityTemplate = 1; //  活动模板
            payload.useScene = 1; //  是否微信推送
            payload.name = getFieldsValue()["name"]; // 活动名称

            dispatch({
                type: 'yxhdConfig/saveHuiYuanYouLiHuoDong',
                payload
            })
        })
    }

    // 点击删除选中的优惠券
    function delSelectRow(data) {
        let couponListData = yxhdConfig.couponListData; //会员有礼form页面优惠券列表
        if (couponListData.length > 0) {  //将table 中对应的列发放数量置为0
            for (var i = 0; i < couponListData.length; i++) {
                if (couponListData[i].id == data.id) {
                    couponListData[i].grantCount = 0;
                }
            }
        }
        let selectedRows = yxhdConfig.selectedRows.filter(function (item, index) {
            return item.id != data.id
        })
        let selectedRowKeys = yxhdConfig.selectedRowKeys.filter(function (item, index) {
            return item != data.id
        })

        //找到需要删除的那一项
        dispatch({
            type: "yxhdConfig/updatePayload",
            payload: {
                couponListData,
                selectedRows,
                selectedRowKeys,
                selectedRowKeysBackups: selectedRowKeys, //更新备份数据
                selectedRowsBackups: selectedRows, //更新备份的数据
            }
        })

    }


    return (
        <div>
            <YxhdFormModal  {...YxhdFormModalProps} />

            <Form style={{ padding: "20px" }} id="cjzhForm">
                <div style={{
                    width: "100%",
                    background: "#eee",
                    lineHeight: "40px",
                    fontWeight: "700",
                    textIndent: "10px",
                    marginBottom: "40px"
                }}>基本信息
                </div>

                <Form.Item  {...formItemLayout} label="活动名称">
                    {getFieldDecorator('name', {
                        initialValue: '',
                        rules: [
                            { required: true, message: '请填写活动名称' },
                            { pattern: /^([\u4e00-\u9fa5]|[^%&',;=?$\x22]){0,20}$/, message: "限制输入20个字！" }
                        ],
                    })(
                        <Input style={{ height: "32px", width: "100%" }} />
                    )}
                </Form.Item>

                <Form.Item  {...formItemLayout} label="活动日期">
                    {getFieldDecorator('gmtStart', {
                        initialValue: "",
                        rules: [{
                            type: 'array', required: true, message: '请选择活动时间',
                        }],
                    })(
                        <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                    )}
                </Form.Item>

                <Form.Item  {...formItemLayout} label="活动类型">
                    {getFieldDecorator('activityType', {
                        initialValue: "3",
                        rules: [{ required: true, message: '请选择活动类型' }],
                    })(
                        <RadioGroup onChange={changeRadio}>
                            <Radio value="3">注册送券</Radio>
                            <Radio value="4">付费开卡送券</Radio>
                        </RadioGroup>
                    )}
                </Form.Item>
                <div style={{ margin: "30px 0" }}>
                    <Row>
                        <Col span="8" style={{ textAlign: "right" }}> <span style={{ marginRight: "9px" }} className="ant-form-item-required">适用优惠券:</span> </Col>
                        <Col> <a href="javascript:;" onClick={changeCoupon}>选择优惠券</a></Col>
                    </Row>
                    <Row>
                        <Col span="8" offset="8" style={{ marginTop: "10px" }}>
                            <div>
                                {yxhdConfig.selectedRows.length > 0 &&
                                    yxhdConfig.selectedRows.map(function (item, index) {
                                        if (item.grantCount > 0) {
                                            return <div span="6" style={{ padding: "5px 20px 5px 10px", background: '#fafafa', position: "relative", textAlign: "center", border: "1px solid #e8e8e8", display: "inline-block", borderRadius: "5px", margin: "5px" }}>
                                                <div >{item.name}* {item.grantCount}张</div>
                                                <div onClick={() => delSelectRow(item)} style={{ position: "absolute", height: "100%", top: "-5px", right: 0, padding: "5px", cursor: "pointer", color: "#bebcbc", fontSize: "12px" }}>X</div>
                                            </div>
                                        }
                                    })
                                }
                            </div>

                        </Col>
                    </Row>
                </div>

                <Form.Item  {...formItemLayout} label="选择品牌"  >
                    {getFieldDecorator('Restaurant', {
                        initialValue: yxhdConfig.restaurantValue,
                        rules: [{
                            required: true, message: '请选择品牌',
                        }]
                    })(
                        <TreeSelect style={{ width: "100%" }} {...tPropsRestaurantData} />
                    )}
                </Form.Item>



                {/*下半部分======================================*/}
                <div style={{
                    width: "100%",
                    background: "#eee",
                    lineHeight: "40px",
                    fontWeight: "700",
                    textIndent: "10px",
                    marginBottom: "40px"
                }}>活动设置
                </div>

                <Form.Item  {...formItemLayout} label="使用渠道">
                    {getFieldDecorator('useScene', {
                        initialValue: ["1"],
                        rules: [
                            { required: true, message: '请选择使用渠道' },
                        ],
                    })(
                        <Checkbox.Group onChange={onChangeisPush}>
                            <Checkbox value="1">微信端</Checkbox>
                        </Checkbox.Group>
                    )}
                </Form.Item>

                <Form.Item  {...formItemLayout} label="活动说明">
                    {getFieldDecorator('activityDesc', {
                        initialValue: "",
                        rules: [
                            { required: true, message: '请输入活动说明' },
                        ],
                    })(
                        <TextArea maxLength={200} rows={4} style={{ width: "100%" }} />
                    )}
                    <p style={{ color: ' #ccc' }}>活动描述限制输入200个字</p>
                </Form.Item>
                <hr style={{ margin: "20px 0" }} />
                <Row>
                    <Col span="3" offset="10">
                        <FormItem>
                            <Button type="primary" onClick={saveInfo}>保存</Button>
                        </FormItem>
                    </Col>
                    <Col span="3">
                        <FormItem>
                            <Button type="default" onClick={quxiao}>取消</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>


        </div>


    );

}

YxhdFormDetail.propTypes = {
    form: PropTypes.object.isRequired,
    onSearch: PropTypes.func,
    onAdd: PropTypes.func,
    field: PropTypes.string,
    keyword: PropTypes.string,
};


const YxhdForm = Form.create()(YxhdFormDetail);


// ========================================================以上是表单部分==========================================================

function YxhdFormPage({ menu, dispatch, yxhdConfig }) {
    const HeaderProps = {
        menu,
        dispatch,
    };

    return (
        <Header {...HeaderProps}>
            <YxhdForm dispatch={dispatch} yxhdConfig={yxhdConfig} />
        </Header>
    );
}

YxhdFormPage.propTypes = {
    menu: PropTypes.object,
};


function mapStateToProps({ menu, yxhdConfig }) {
    return { menu, yxhdConfig };
}

export default connect(mapStateToProps)(YxhdFormPage);

