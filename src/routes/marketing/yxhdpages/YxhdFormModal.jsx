/**
 *
 * @authors ${author} (${email})
 * @date    2018-04-04
 * @version $Id$
 */

import React, { PropTypes } from 'react';

import Modal from 'antd/lib/modal';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import InputNumber from 'antd/lib/input-number';
import Select from 'antd/lib/select';
import Button from 'antd/lib/button';
import Table from 'antd/lib/table';
import Radio from 'antd/lib/radio';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const YxhdFormModal = ({ visible, onOk, onCancel, currentItem, dispatch, yxhdConfig, form: { getFieldDecorator, validateFields, getFieldsValue, resetFields, setFieldsValue }, }) => {

    const columns = [
        {
            title: '序号',
            dataIndex: 'xuhao',
            key: 'xuhao',
            width: 50,
            render: function (text, record, index) {
                return index + 1
            }
        },
        {
            title: '优惠券名称',
            dataIndex: 'name',
            key: 'name',
            width: 150,
        },
        {
            title: '平台类型',
            dataIndex: 'platformType',
            key: 'platformType',
            width: 100,
            render: function (text, record, index) {
                if (record.platformType == 1) {
                    return "餐软"
                } else if (record.platformType == 2) {
                    return "电商"
                }
            }
        },
        {
            title: '优惠券类型',
            dataIndex: 'couponType ',
            key: 'couponType ',
            width: 100,
            render: function (text, record, index) {
                if (record.platformType == 1) { //餐软的情况
                    if (record.couponType == 1) {
                        return "代金券"
                    } else if (record.couponType == 2) {
                        return "菜品券"
                    }
                } else if (record.platformType == 2) { //电商的情况
                    if (record.coupon_type_id == 1) {
                        return "满减券"
                    } else if (record.coupon_type_id == 2) {
                        return "会员券"
                    } else if (record.coupon_type_id == 3) {
                        return "单品券"
                    } else if (record.coupon_type_id == 4) {
                        return "品类券"
                    }

                }


            }
        },
        {
            title: '优惠券说明',
            dataIndex: 'couponDesc',
            key: 'couponDesc',
            width: 150,
            render: function (text, record, index) {
                if (record.couponDesc && record.couponDesc.length <= 15) {
                    return record.couponDesc
                } else if (record.couponDesc && record.couponDesc.length > 15) {
                    return <div title={record.couponDesc} >record.couponDesc.substr(0,15)+"..."</div>
                }
            }
        },
        {
            title: '优惠券面值￥',
            dataIndex: 'value',
            key: 'value',
            width: 100,
            render: function (text, record, index) {
                return record.value / 100
            }
        },
        {
            title: '券有效期',   //未完
            dataIndex: 'quanyouxiaoqi',
            key: 'quanyouxiaoqi',
            width: 200,
            render: function (text, record, index) {
                // 根据有效期类型展示固定日期还是相对有效期时间
                // 固定有效期
                if (record.periodValidityType == 1) {
                    let startTime = yxhdConfig.formatDate(record.periodValidityStart); // 参数是一个时间戳
                    let endTime = yxhdConfig.formatDate(record.periodValidityFinish); // 参数是一个时间戳
                    return startTime + " 至 " + endTime
                } else if (record.periodValidityType == 2) {
                    // 相对有效期
                    return "发券日起第" + record.periodValidityDays + "天"
                }
            }
        },
        {
            title: '发放数量(张)',
            dataIndex: 'grantCount',
            key: 'grantCount ',
            width: 150,
            render(text, record, index) {
                if (yxhdConfig.selectedRows.length == 0) {
                    return <InputNumber value={0} step={1} onChange={(e) => { changeGiveCount(e, record, index) }} disabled={true} />
                } else {
                    {/* 当前数据必须是选中的才能允许编辑 */ }
                    let index = yxhdConfig.selectedRows.findIndex(function (item, index) {
                        return item.id == record.id;
                    })
                    return <InputNumber value={record.grantCount ? record.grantCount : 0} step={1} onChange={(e) => { changeGiveCount(e, record, index) }} disabled={index != -1 ? false : true} />
                }
            }
        }];

    // 修改发放数量
    function changeGiveCount(e, record, index) {
        // 验证不通过则return ,必须是正整数
        let reg = /^[1-9]\d*$/;
        if (!(reg.test(e))) {
            return
        }

        console.log(yxhdConfig.selectedRowKeysBackups)
        console.log(yxhdConfig.selectedRowsBackups)

        let selectedRows = yxhdConfig.selectedRows;
        selectedRows.map(function (item, ind) {
            if (record.id == item.id) {
                item.grantCount = e;
            }
        })

        let couponListData = yxhdConfig.couponListData;
        couponListData.map(function (item, ind) {
            if (record.id == item.id) {
                item.grantCount = e;
            }
        })

        dispatch({
            type: "yxhdConfig/updatePayload",
            payload: {
                selectedRows,
                couponListData: couponListData,
            }
        })
    }


    const modalOpts = {//弹框的显示与隐藏
        title: "优惠券选择",
        currentItem,
        visible,
        width: 1150,
        footer: null,
        destroyOnClose: true,
        onCancel: () => {

            let selectedRows = [];

            for (var i = 0; i < yxhdConfig.selectedRowsBackups.length; i++) {
                selectedRows[i] = {};
                for (var key in yxhdConfig.selectedRowsBackups[i]) {
                    selectedRows[i][key] = yxhdConfig.selectedRowsBackups[i][key]
                }
            }

            dispatch({
                type: 'yxhdConfig/updatePayload',
                payload: {
                    modalVisible: false,
                    selectedRowKeys: yxhdConfig.selectedRowKeysBackups,
                    selectedRows
                }
            });
        }
    };



    // 点击前端执行搜索
    function searchBtn() {
        // 清空之前的数据
        dispatch({
            type: 'yxhdConfig/updatePayload',
            payload: {
                selectedRowKeys: [], //优惠券列表用户选中哪些数据的id
                selectedRows: [], //优惠券列表用户选中哪些数据
                selectedRowKeysBackups: [], //selectedRowKeys的备份
                selectedRowsBackups: [], //selectedRows的备份
            }
        });

        let payload = {};
        payload.name = getFieldsValue().name;
        payload.platformType = getFieldsValue().platformType;
        payload.couponType = getFieldsValue().couponType;
        // 调取优惠券列表
        dispatch({
            type: 'yxhdConfig/yhqhdList',
            payload
        });

    }



    // 优惠券列表 选项配置
    const rowSelection = {
        selectedRowKeys: yxhdConfig.selectedRowKeys, //
        selectedRows: yxhdConfig.selectedRows,
        onChange: (selectedRowKeys, selectedRows) => {

            // 再更新
            dispatch({
                type: "yxhdConfig/updatePayload",
                payload: { selectedRowKeys, selectedRows }
            })
        },
    };

    // modal点击确定存储现在选中的券
    function onClickOk() {

        let selectedRowsBackups = [];
        for (var i = 0; i < yxhdConfig.selectedRows.length; i++) {

            selectedRowsBackups[i] = {};
            for (var key in yxhdConfig.selectedRows[i]) {
                selectedRowsBackups[i][key] = yxhdConfig.selectedRows[i][key]
            }
        }

        dispatch({
            type: 'yxhdConfig/updatePayload',
            payload: {
                selectedRowKeysBackups: yxhdConfig.selectedRowKeys, //selectedRowKeys的备份
                selectedRowsBackups, //selectedRows的备份
                modalVisible: false,
            }
        });
    }

    return (
        <Modal {...modalOpts}>
            <div>
                <div style={{ marginBottom: '20px', }}>
                    <Form layout="inline">
                        <FormItem
                            label='优惠券名称'>
                            {getFieldDecorator('name', {})(
                                <Input />
                            )}
                        </FormItem>

                        <FormItem
                            label='平台类型'>
                            {getFieldDecorator('platformType', {
                                initialValue: '',
                            })(
                                <Select
                                    style={{ width: 200 }}
                                >
                                    <Select.Option value="">全部</Select.Option>
                                    <Select.Option value="1">餐软</Select.Option>
                                    <Select.Option value="2">电商</Select.Option>
                                </Select>
                            )}
                        </FormItem>

                        <FormItem
                            label='优惠券类型'>
                            {getFieldDecorator('couponType', {
                                initialValue: '',
                            })(
                                <Select
                                    style={{ width: 200 }}
                                >
                                    <Select.Option value="">全部</Select.Option>
                                    <Select.Option value="1">代金券</Select.Option>
                                    <Select.Option value="2">菜品</Select.Option>
                                    <Select.Option value="5">满减券</Select.Option>
                                    <Select.Option value="6">会员券</Select.Option>
                                    <Select.Option value="7">单品券</Select.Option>
                                    <Select.Option value="8">品类券</Select.Option>
                                </Select>
                            )}
                        </FormItem>

                        <FormItem>
                            <Button
                                type="primary"
                                onClick={searchBtn}>
                                搜索
                            </Button>
                        </FormItem>

                    </Form>
                </div>
                <div>
                    <Table
                        rowSelection={rowSelection}
                        width={1100}
                        pagination={false}
                        columns={columns}
                        dataSource={yxhdConfig.couponListData}
                        loading={yxhdConfig.isLoading}
                        rowKey={record => record.id}
                        scroll={{ x: 1000, y: 300 }}
                        bordered />
                </div>
            </div>

            <div style={{ textAlign: "right", marginTop: "15px" }}>
                <Button type="primary" onClick={onClickOk}>确定</Button>
            </div>
        </Modal>
    );
};

YxhdFormModal.propTypes = {
    visible: PropTypes.any,
    item: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
};

export default Form.create()(YxhdFormModal);
