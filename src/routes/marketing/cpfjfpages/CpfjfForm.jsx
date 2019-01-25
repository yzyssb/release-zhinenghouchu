import React, {PropTypes} from 'react';
import Header from '../../../components/Header';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import Button from 'antd/lib/button';
import Radio from 'antd/lib/radio';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';

import Select from 'antd/lib/select';
import DatePicker from 'antd/lib/date-picker';
import Transfer from 'antd/lib/transfer';
import Checkbox from 'antd/lib/checkbox';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Modal from 'antd/lib/modal';

import message from 'antd/lib/message';

import InputNumber from 'antd/lib/input-number';
const RangePicker = DatePicker.RangePicker;
const confirm = Modal.confirm; //确认对话框
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const {TextArea} = Input;
const {Option, OptGroup} = Select;
import TreeSelect from 'antd/lib/tree-select';
import TimePicker from 'antd/lib/time-picker';
import moment from 'moment';
import Table from 'antd/lib/table';

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
        labelCol: {span: 8},
        wrapperCol: {span: 12},
    };


    // 点击取消回到列表页面
    function quxiao() {
        dispatch(routerRedux.push({
            pathname: "/yxhdlist",
            query: {}
        }));
    }

    // 点击保存提交表单
    function saveInfo() {


        if (!yxhdConfig.cpfjf_name){

            message.warning("请填写活动名称")
            return;
        }


        if (yxhdConfig.cpfjf_restaurantInfos.length == 0){

            message.warning("请选择活动餐厅")
            return;
        }

        if (yxhdConfig.cpfjf_foodInfos.length == 0){

            message.warning("请选择活动菜品")
            return;
        }

        if (yxhdConfig.cpfjf_vipPercent == 0 && yxhdConfig.cpfjf_disVipPercent == 0 && yxhdConfig.cpfjf_companyPercent == 0 ){

            message.warning("请填写返还比例")
            return;
        }

        if (yxhdConfig.cpfjf_useScene == 0){

            message.warning("请选择适用渠道")
            return;
        }

        if (!yxhdConfig.cpfjf_activityDesc){

            message.warning("请填写活动说明")
            return;
        }


        dispatch({
            type: 'yxhdConfig/activityCpfjfCreate',
            payload:{

            }
        })


    }

//弹框
    const YxhdFormModalProps = {
        visible: yxhdConfig.modalVisible,
        dispatch,
        yxhdConfig,
    }

    function changeCoupon() {

        resetFields(['couponName'])
        dispatch({
            type: 'yxhdConfig/yhqhdList',
            payload: {}
        })
        dispatch({
            type: 'yxhdConfig/updatePayload',
            payload: {modalVisible: true}
        })


    }
    function onChangeisPush(e){

          dispatch({
            type: 'yxhdConfig/updatePayload',
            payload: {cpfjf_isPush: e.length >0?'1':'0'}
        })
    }

    function onChangeUseScene(e){
        dispatch({
            type: 'yxhdConfig/updatePayload',
            payload: {cpfjf_useScene: e.length >0?'1':'0'}
        })
    }

    function range(start, end) {
      const result = [];
      for (let i = start; i < end; i++) {
        result.push(i);
      }
      return result;
    }
        function disabledDate(current) {
      // Can not select days before today and today
      return current && current.valueOf() < Date.now();
    }

    function disabledDateTime() {
      return {
        disabledHours: () => range(0, 24).splice(4, 20),
        disabledMinutes: () => range(30, 60),
        disabledSeconds: () => [55, 56],
      };
    }


    // //餐厅相关逻辑================================================================
    // const tPropsRestaurantData = {
    //     treeData: yxhdConfig._restaurantData,
    //     onChange: changeRestaurantValue,
    //     treeCheckable: true,
    //     searchPlaceholder: '请选择餐厅',
    //     dropdownStyle: {
    //         height: "300px",
    //         overflowY: "scroll"
    //     }
    // };
    //
    // // 改变选中的餐厅数据
    // function changeRestaurantValue(value) {
    //     let applicableRestaurants = [];
    //
    //     value.map(function (item, index) {
    //         let newItem = item.split("-");
    //
    //         applicableRestaurants.push({
    //             brandId: Number(newItem[0]), //品牌Id
    //             restaurantId: Number(newItem[1]) //门店Id
    //         });
    //     })
    //
    //     dispatch({
    //         type: "yxhdConfig/updatePayload",
    //         payload: {
    //             restaurantValue: value,
    //             cpfjf_restaurantInfos:applicableRestaurants,
    //         }
    //     })
    // }

    // storeModal开始==============================================================================================================================
    const storeColumns = [
        {
            title: '序号',
            dataIndex: 'tableName',
            key: 'tableName',
            render: function (text, record, index) {
                return index + 1
            }
        }, {
            title: '店名',
            dataIndex: 'name',
            key: 'name',
        }
    ];

    // 展示门店列表modal
    function showStoreListModal() {

        dispatch({
            type: "yxhdConfig/updatePayload",
            payload: {
                storeModalVisible: true
            }
        })
    }

    // 门店modal点击ok,把临时选中的项给sureStoreSelectedRowKeys,并且关闭modal
    function storeHandleOk(data) {
        let storeids = "";
        let applicableRestaurants = [];
        // 循环所有的storeList和选中的id,如果相等就存储起来名字并展示在页面上
        if (yxhdConfig.storeList.length > 0 && yxhdConfig.storeSelectedRowKeys.length > 0) {
            yxhdConfig.storeList.map(function (item, index) {
                for (var i = 0; i < yxhdConfig.storeSelectedRowKeys.length; i++) {
                    if (item.id == yxhdConfig.storeSelectedRowKeys[i]) {
                        storeids += item.name + ","
                        applicableRestaurants.push({restaurantId:item.id,restaurantName:item.name})
                    }
                }
            })
        } else {
            storeids = ""
        }
        dispatch({
            type: "yxhdConfig/updatePayload",
            payload: {
                storeModalVisible: false,
                storeInitSelectedRowKeys: yxhdConfig.storeSelectedRowKeys,
                storeids: storeids,
                cpfjf_restaurantInfos:applicableRestaurants,
                // isResetForm:false
            }
        })

        // 重置门店input
        resetFields("storeids")
    }


    // 门店modal点击cancle取消,需要把storeInitSelectedRowKeys回到storeInitSelectedRowKeys的状态
    function storeHandleCancel() {
        dispatch({
            type: "yxhdConfig/updatePayload",
            payload: {
                storeModalVisible: false,
                storeSelectedRowKeys: yxhdConfig.storeInitSelectedRowKeys  //点击取消让选中的值回到初始的状态点击取消清空选中的
            }
        })
    }

    // 初始化和改变选项
    const storeRowSelection = {
        selectedRowKeys: yxhdConfig.storeSelectedRowKeys,  //指定选中项的项,这个对应的不是数组的index,而是数据的id
        // 改变时把选中的值赋给
        onChange: function (selectedRowKeys, selectedRows) {
            // console.log(selectedRowKeys)   //选中的key
            // console.log(selectedRows)  //选中的数据是哪一条
            dispatch({
                type: "yxhdConfig/updatePayload",
                payload: { storeSelectedRowKeys: selectedRowKeys }
            });
        },
        hideDefaultSelections: true, //去掉『全选』『反选』两个默认选项
    }


    // 产品列表modal开始==========================================================================================================================
    const goodColumns = [
        {
            title: '序号',
            dataIndex: 'tableName',
            key: 'tableName',

            render: function (text, record, index) {
                return index + 1
            }
        }, {
            title: '产品',
            dataIndex: 'name',
            key: 'name',

        }
    ];

    // 展示食品列表modal
    function showGoodListModal() {

        dispatch({
            type: "yxhdConfig/updatePayload",
            payload: {
                goodModalVisible: true
            }
        })
    }

    // 门店modal点击ok,把临时选中的项给suregoodSelectedRowKeys,并且关闭modal
    function goodHandleOk(data) {
        let goodids = "";
        let unapplicableFoods = [];
        // 循环所有的goodList和选中的id,如果相等就存储起来名字并展示在页面上
        if (yxhdConfig.goodList.length > 0 && yxhdConfig.goodSelectedRowKeys.length > 0) {
            yxhdConfig.goodList.map(function (item, index) {
                for (var i = 0; i < yxhdConfig.goodSelectedRowKeys.length; i++) {
                    if (item.id == yxhdConfig.goodSelectedRowKeys[i]) {
                        goodids += item.name + ","
                        unapplicableFoods.push({foodId:item.id,foodName:item.name})
                    }
                }
            })
        } else {
            goodids = ""
        }


        dispatch({
            type: "yxhdConfig/updatePayload",
            payload: {
                goodModalVisible: false,
                goodInitSelectedRowKeys: yxhdConfig.goodSelectedRowKeys,
                goodids: goodids,
                cpfjf_foodInfos: unapplicableFoods,
                // isResetForm: true
            }
        })

        // 重置产品input
        resetFields("goodids")
    }


    // 门店modal点击cancle取消,需要把goodInitSelectedRowKeys回到goodInitSelectedRowKeys的状态
    function goodHandleCancel() {
        dispatch({
            type: "yxhdConfig/updatePayload",
            payload: {
                goodModalVisible: false,
                goodSelectedRowKeys: yxhdConfig.goodInitSelectedRowKeys  //点击取消让选中的值回到初始的状态点击取消清空选中的
            }
        })
    }

    // 初始化和改变选项
    const goodRowSelection = {
        selectedRowKeys: yxhdConfig.goodSelectedRowKeys,  //指定选中项的项,这个对应的不是数组的index,而是数据的id
        // 改变时把选中的值赋给
        onChange: function (selectedRowKeys, selectedRows) {
            // console.log(selectedRowKeys)   //选中的key
            // console.log(selectedRows)  //选中的数据是哪一条
            dispatch({
                type: "yxhdConfig/updatePayload",
                payload: { goodSelectedRowKeys: selectedRowKeys }
            });
        },
        hideDefaultSelections: true, //去掉『全选』『反选』两个默认选项
    }

    // // 多选不适用菜品数据============================================================================
    // const tPropsFoodData = {
    //     filterTreeNode: false,
    //     treeData: yxhdConfig.foodData,
    //     onChange: changeFoodValue,
    //     treeCheckable: true,  //支持多选
    //     searchPlaceholder: '请选择适用菜品',
    //     dropdownStyle: {
    //         height: "300px",
    //         overflowY: "scroll"
    //     }
    // };
    //
    // // 多选不适用菜品改变选中的餐厅数据
    // function changeFoodValue(value) {
    //
    //     let unapplicableFoods = [];
    //
    //     value.map(function (item, index) {
    //         let newItem = item.split("-");
    //
    //         unapplicableFoods.push({
    //             brandId: Number(newItem[0]),
    //             foodCategoryId: Number(newItem[1]),
    //             foodId: Number(newItem[2]),
    //             foodType: Number(newItem[3])
    //         })
    //     })
    //
    //     dispatch({
    //         type: "yxhdConfig/updatePayload",
    //         payload: {
    //             foodValue: value,
    //             cpfjf_foodInfos: unapplicableFoods,
    //         }
    //     })
    // }

    function onRadioChange(e){
        dispatch({
            type: "yxhdConfig/updatePayload",
            payload: {
                cpfjf_pointsType: e.target.value
            }
        })

    }

    function onAdd(){

        var item = {startTime:'00:00',endTime:'00:00'};

        var newTimeArray = yxhdConfig.timeArray?yxhdConfig.timeArray:[];

        if (newTimeArray.length < 4){
            newTimeArray.push(item);
            dispatch({
                type: "yxhdConfig/updatePayload",
                payload: {
                    timeArray: newTimeArray,
                }
            })
        }else{
            message.warning('最多添加4个时段');
        }



    }

    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
    };

    var dayHtml = [];

    for (var i = 1; i <= 31; i++) {

        dayHtml.push ( <Option key={i}>{i}</Option>)
    }


    const format = 'HH:mm';

    var timeChildren = [];
    yxhdConfig.timeArray&&yxhdConfig.timeArray.length >0 &&yxhdConfig.timeArray.map((i,j)=>{

        timeChildren.push(

                <div key = {j}>
                    <TimePicker value={moment(i.startTime, format)} onChange = {(time, timeString)=>{

                        let newTimeArray = yxhdConfig.timeArray;
                        newTimeArray[j].startTime = timeString;

                        var newTime = [];

                        newTimeArray.map((i,j)=>{

                            let time = i.startTime + '-' + i.endTime;

                            newTime.push(time);
                        })
                        dispatch({
                            type: "yxhdConfig/updatePayload",
                            payload: {
                                timeArray: newTimeArray,
                                cpfjf_time:newTime.join(',')
                            }
                        })

                    }} format={format} />
                    <span>&nbsp;&nbsp;至&nbsp;&nbsp;</span>
                    <TimePicker value={moment(i.endTime, format)} format={format} onChange = {(time, timeString)=>{

                        let newTimeArray = yxhdConfig.timeArray;
                        newTimeArray[j].endTime = timeString;

                        var newTime = [];

                        newTimeArray.map((i,j)=>{

                            let time = i.startTime + '-' + i.endTime;

                            newTime.push(time);
                        })

                        dispatch({
                            type: "yxhdConfig/updatePayload",
                            payload: {
                                timeArray: newTimeArray,
                                cpfjf_time:newTime.join(',')
                            }
                        })
                    }} />

                    <Button type = 'primary' style = {{marginLeft:10}} onClick = {()=>{

                        let newTimeArray = yxhdConfig.timeArray;

                        newTimeArray.splice(j,1);

                        var newTime = [];

                        newTimeArray.map((i,j)=>{

                            let time = i.startTime + '-' + i.endTime;

                            newTime.push(time);
                        })

                        dispatch({
                            type: "yxhdConfig/updatePayload",
                            payload: {
                                timeArray: newTimeArray,
                                cpfjf_time:newTime.join(',')
                            }
                        })


                    }}>删除</Button>
                </div>
        );
    })

    const options = [

        { label: '周一', value: '1' },
        { label: '周二', value: '2' },
        { label: '周三', value: '3' },
        { label: '周四', value: '4' },
        { label: '周五', value: '5' },
        { label: '周六', value: '6' },
        { label: '周日', value: '7' },

    ];

    const onSearchDateChange = (dates, dateStrings) => {
        dispatch({
            type: 'yxhdConfig/updatePayload',
            payload: {
                cpfjf_startTime: dates[0],
                cpfjf_endTime: dates[1],
                postStartTime: new Date(dates[0].format('YYYY-MM-DD HH:mm:ss')).valueOf(),
                postEndTime: new Date(dates[1].format('YYYY-MM-DD HH:mm:ss')).valueOf(),

            }
        });
    };

    return (
        <div>

            <Form style={{padding: "20px"}} id="cjzhForm">
                <div style={{
                    width: "100%",
                    background: "#eee",
                    lineHeight: "40px",
                    fontWeight: "700",
                    textIndent: "10px",
                    marginBottom: "40px"
                }}>基本信息
                </div>

                <Form.Item  {...formItemLayout} label="活动名称" extra="如：会员日双倍积分；">
                    {getFieldDecorator('name', {
                        initialValue: '',
                        rules: [{required: true, message: '请选择活动时间'},{pattern: /^([\u4e00-\u9fa5]|[^%&',;=?$\x22]){0,20}$/, message: "限制输入20个字！"},],
                    })(
                        <div>
                            <Input style={{height: "32px", width: "350px"}} value = {yxhdConfig.cpfjf_name}  onChange = {(e)=>{
                                dispatch({
                                    type: "yxhdConfig/updatePayload",
                                    payload: {
                                        cpfjf_name: e.target.value,
                                    }
                                })

                            }}/>
                        </div>
                    )}
                </Form.Item>

                <Form.Item  {...formItemLayout} label="活动日期">
                    {getFieldDecorator('gmtStart', {
                        rules: [{
                            type: 'array', required: true, message: '请选择活动时间',
                        }],
                    })(
                        <div>
                            <RangePicker
                                showTime
                                format="YYYY-MM-DD HH:mm:ss"
                                value={[moment(yxhdConfig.cpfjf_startTime), moment(yxhdConfig.cpfjf_endTime)]}
                                allowClear={false}
                                onChange={onSearchDateChange}
                            />
                        </div>
                    )}
                </Form.Item>

                <Form.Item  {...formItemLayout} label="活动类型">
                    {getFieldDecorator('activityType', {
                        rules: [{required: true, message: '请选择活动类型'}],
                    })(
                        <div>
                            <RadioGroup onChange = {onRadioChange} defaultValue = {["3"]} value = {""+yxhdConfig.cpfjf_pointsType}>
                                <Radio value="3">固定日期</Radio>
                                <Radio value="2">固定星期几</Radio>
                                <Radio value="1">时段临时活动</Radio>
                            </RadioGroup>

                            <div style = {{display:yxhdConfig.cpfjf_pointsType==3?'block':'none'}}>

                                <span>每月</span>

                                <Select style = {{width:80}} defaultValue = {17} value = {yxhdConfig.cpfjf_day} onChange = {(value)=>{

                                    dispatch({
                                        type: "yxhdConfig/updatePayload",
                                        payload: {
                                            cpfjf_day: value,
                                        }
                                    })

                                }}>{dayHtml}</Select>

                                <span>日</span>
                            </div>

                            <div style = {{display:yxhdConfig.cpfjf_pointsType==2?'block':'none'}}>

                                <CheckboxGroup style={{ textAlign: "left" }} value = {yxhdConfig.cpfjf_week&&yxhdConfig.cpfjf_week.length>0&&yxhdConfig.cpfjf_week.split(',')} onChange = {(checkedValues)=>{

                                    if (checkedValues.length>0){
                                        dispatch({
                                            type: "yxhdConfig/updatePayload",
                                            payload: {
                                                cpfjf_week: checkedValues.join(','),
                                            }
                                        })
                                    }
                                }} options={options} />

                            </div>

                            <div>
                                <Button type={"primary"} onClick={onAdd}>新增时段</Button>
                                {timeChildren}
                            </div>
                        </div>

                    )}
                </Form.Item>


                {/*下半部分*/}
                <div style={{
                    width: "100%",
                    background: "#eee",
                    lineHeight: "40px",
                    fontWeight: "700",
                    textIndent: "10px",
                    marginBottom: "40px"
                }}>活动设置
                </div>

                <Form.Item  {...formItemLayout} label="积分返还规则">
                    {getFieldDecorator('rule', {
                        initialValue: '',
                        rules: [{required: true, message: '请填写积分返还比例'},{pattern: /^([\u4e00-\u9fa5]|[^%&',;=?$\x22]){0,20}$/, message: "限制输入20个字！"},],
                    })
                    (
                        <div>
                            <div>
                                <span>注册会员&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;返还比例：</span>
                                <InputNumber style = {{width:150}} min={0} max={Infinity} step={0.1} precision={1} value = {yxhdConfig.cpfjf_disVipPercent} onChange = {(e)=>{
                                    dispatch({
                                        type: "yxhdConfig/updatePayload",
                                        payload: {
                                            cpfjf_disVipPercent: e,
                                        }
                                    })


                                }}/>&nbsp;&nbsp;%

                            </div>
                            <div>
                                <span>付费会员&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;返还比例：</span>
                                <InputNumber style = {{width:150}} min={0} max={Infinity} step={0.1}  precision={1}  value = {yxhdConfig.cpfjf_vipPercent} onChange = {(e)=>{
                                    dispatch({
                                        type: "yxhdConfig/updatePayload",
                                        payload: {
                                            cpfjf_vipPercent: e,
                                        }
                                    })

                                  }}/>&nbsp;&nbsp;%
                            </div>
                            <div>
                                <span>企业员工&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;返还比例：</span>
                                <InputNumber style = {{width:150}} min={0} max={Infinity} step={0.1}  precision={1}  value = {yxhdConfig.cpfjf_companyPercent} onChange = {(e)=>{
                                    dispatch({
                                        type: "yxhdConfig/updatePayload",
                                        payload: {
                                            cpfjf_companyPercent: e,
                                        }
                                    })

                                }}/>&nbsp;&nbsp;%
                            </div>
                        </div>
                    )}
                </Form.Item>

                <FormItem {...formItemLayout}
                          label="适用门店"
                          style={{ textAlign: 'left' }}
                >
                    <Button type="primary" onClick={showStoreListModal}>选择合适的门店</Button>
                    {getFieldDecorator('storeids', {
                        initialValue: yxhdConfig.storeids,
                        rules: [{ required: true, message: '请选择适用门店!' }]

                    })(
                        <TextArea style={{ resize: "none", lineHeight: "26px", background: "#fff", color: "#333" }} placeholder="请选择适用门店!" autosize={{ minRows: 1 }} disabled={true} />
                    )}
                </FormItem>

                <FormItem {...formItemLayout}
                          label="适用产品"
                          style={{ textAlign: 'left' }}
                >
                    <Button style={{ textAlign: 'left' }} type="primary" onClick={showGoodListModal}>选择合适的产品</Button>
                    {getFieldDecorator('goodids', {
                        initialValue: yxhdConfig.goodids,
                        rules: [{ required: true, message: '请选择适用产品!' }]
                    })(
                        // <textarea style={{ width: "100%", minHeight: "32px" }} disabled={true} />
                        <TextArea style={{ resize: "none", lineHeight: "26px", background: "#fff", color: "#333" }} placeholder="请选择适用产品!" autosize={{ minRows: 1 }} disabled={true} />

                    )}

                </FormItem>

                <Form.Item  {...formItemLayout} label="适用渠道">
                    {getFieldDecorator('useScene', {
                        initialValue: yxhdConfig.goodids,
                        rules: [{ required: true}]
                    })(
                        <div>
                            <Checkbox.Group onChange={onChangeUseScene } defaultValue = {["1"]}>
                                <Checkbox value="1">微信端</Checkbox>
                            </Checkbox.Group>
                        </div>
                    )}

                </Form.Item>

                 {/*<Form.Item  {...formItemLayout} label="活动推送">*/}

                     {/*<div>*/}
                        {/*<Checkbox.Group onChange={onChangeisPush} defaultValue = {["1"]}>*/}
                            {/*<Checkbox value="1">微信</Checkbox>*/}
                        {/*</Checkbox.Group>  */}

                        {/*<div style = {{display:yxhdConfig.cpfjf_isPush == 1?'block':'none'}}>*/}
                         {/*<p style={{marginBottom: '0px'}}>推送时间：参与活动后实时推送</p>*/}
                         {/*<p style={{marginBottom: '0px'}}>推送内容预览：</p>*/}
                         {/*<p style={{marginBottom: '0px'}}>*/}
                            {/*亲爱的【会员姓名】，您的积分账户有新的变动*/}
                         {/*</p>*/}
                        {/*</div>*/}

                     {/*</div>*/}
                    {/**/}


                {/*</Form.Item>*/}
               
                <Form.Item  {...formItemLayout} label="活动说明" extra = "活动描述限制输入200个字">
                    {getFieldDecorator('activityDesc', {  
                        initialValue: "",
                        rules: [
                            {required: true, message: '请输入活动说明'},
                             // {pattern: /^.[\s\S]*{0,200}$/, message: "限制输入200个字！"},                            
                            ],
                    })(
                        <div>
                            <TextArea rows={4} style={{ width: "100%"}} value = {yxhdConfig.cpfjf_activityDesc} onChange = {(e)=>{

                                dispatch({
                                    type: "yxhdConfig/updatePayload",
                                    payload: {
                                        cpfjf_activityDesc: e.target.value,
                                    }
                                })
                            }}/>
                        </div>
                    )}

                </Form.Item>
                <hr style={{margin: "20px 0"}}/>
                <Row>
                    <Col span="3" offset="10">
                        <FormItem>
                            <Button type="primary" onClick={saveInfo} >保存</Button>
                        </FormItem>
                    </Col>
                    <Col span="3">
                        <FormItem>
                            <Button type="default" onClick={quxiao}>取消</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>

            {/*门店modal*/}
            <Modal
                title="选择门店"
                visible={yxhdConfig.storeModalVisible}
                onOk={storeHandleOk}
                onCancel={storeHandleCancel}
            >
                <Table rowKey={record => record.id} rowSelection={storeRowSelection} columns={storeColumns} dataSource={yxhdConfig.storeList} pagination={false} bordered/>
            </Modal>


            {/*产品modal*/}
            <Modal
                title="选择产品"
                visible={yxhdConfig.goodModalVisible}
                onOk={goodHandleOk}
                onCancel={goodHandleCancel}
            >
                <Table style={{height: "500px", overflowY: "scroll" }}   rowKey={record => record.id} rowSelection={goodRowSelection} columns={goodColumns} dataSource={yxhdConfig.goodList} pagination={false} bordered/>
            </Modal>
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

function YxhdFormPage({menu, dispatch, yxhdConfig}) {
    const HeaderProps = {
        menu,
        dispatch,
    };

    return (
        <Header {...HeaderProps}>
            <YxhdForm dispatch={dispatch} yxhdConfig={yxhdConfig}/>

        </Header>
    );
}

YxhdFormPage.propTypes = {
    menu: PropTypes.object,
};


function mapStateToProps({menu, yxhdConfig}) {
    return {menu, yxhdConfig};
}

export default connect(mapStateToProps)(YxhdFormPage);