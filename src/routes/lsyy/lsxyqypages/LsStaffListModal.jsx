import React, { PropTypes } from 'react';
// import Header from '../../../components/Header';
import { connect } from 'dva';
// import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import Button from 'antd/lib/button';
import Table from 'antd/lib/table';
import Radio from 'antd/lib/radio';
import Pagination from 'antd/lib/pagination';
import Breadcrumb from 'antd/lib/breadcrumb';
import Form from 'antd/lib/form';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import Checkbox from 'antd/lib/checkbox';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import { Select, DatePicker, Modal } from 'antd';
import moment from "moment";


const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;


const RadioGroup = Radio.Group;
const FormItem = Form.Item;


// form表单
const StaffListModal
    = ({
        form: {
            getFieldDecorator,
            validateFields,
            getFieldsValue,
            resetFields,
        }, dispatch, lsxyqyConfig
    }) => {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };


        const pagination = {
            total: lsxyqyConfig.staffTotal,
            current: lsxyqyConfig.staffCurrent,
            pageSize: lsxyqyConfig.staffSize,
            onChange: (pageNo) => {
                onPageChange(pageNo)
            },
            showSizeChanger: true,
            onShowSizeChange: SizeChange,
        };


        function SizeChange(current, pageSize) {
            dispatch({
                type: 'lsxyqyConfig/updatePayload', payload: {
                    staffSize: pageSize,
                    staffCurrent: 1,
                    staffOffset: 0
                }
            });
            dispatch({ type: 'lsxyqyConfig/staffQuery', payload: {} });
        }

        function onPageChange(pageNo) {
            var offset = pageNo * lsxyqyConfig.staffSize - lsxyqyConfig.staffSize;
            dispatch({ type: 'lsxyqyConfig/updatePayload', payload: { staffOffset: offset, staffCurrent: pageNo } });
            dispatch({ type: 'lsxyqyConfig/staffQuery', payload: {} });
        }

        // 以上是分页数据=====================================


        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
                render: function (text, record, index) {
                    return index + 1
                }
            },
            {
                title: '头像',
                dataIndex: 'headUrl',
                key: 'headUrl',
                render: function (text, record, index) {
                    return <img style={{ width: "60px" }} src={record.headUrl} />
                }
            },
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '手机号',
                dataIndex: 'phone',
                key: 'phone',
            }]

        // 关闭
        function handleCancel() {
            dispatch({
                type: "lsxyqyConfig/updatePayload",
                payload: {
                    staffListVisible: false,
                    staffTotal: 10, //数据总条数,默认初始为10条
                    staffCurrent: 1, //当前页码   
                    staffOffset: 0, //第几行开始
                    staffSize: 10, //请求行数
                    staffDataSource: [],
                    currentZyCompanyId: "",
                    conditions: "", //
                }
            })
        }


        // 修改搜索值
        function changeValue(e) {
            console.log(e.target.value)
            // let value=e.target.value.trim()
            dispatch({
                type: "lsxyqyConfig/updatePayload",
                payload: {
                    conditions: e.target.value.trim()
                }
            })
        }

        // 点击搜索
        function sousuo() {

            dispatch({
                type: "lsxyqyConfig/updatePayload",
                payload: {
                    staffTotal: 0, //数据总条数,默认初始为10条
                    staffCurrent: 1, //当前页码   
                    staffOffset: 0, //第几行开始
                    staffSize: 10, //请求行数
                    staffDataSource: [],
                }
            })
            dispatch({
                type: "lsxyqyConfig/staffQuery",
                payload: {}
            })
        }


        return (

            <Modal
                title="员工列表"
                visible={lsxyqyConfig.staffListVisible}
                // footer={null}
                onCancel={handleCancel}
                footer={null}
                destroyOnClose={true}
            >


                <Row style={{ marginBottom: "20px" }}>
                    <Col span="12">
                        <Input style={{ height: "32px", width: "100%" }} onChange={(e) => changeValue(e)}
                            placeholder="请输入员工昵称/手机号" />
                    </Col>
                    <Col span="3" offset="1">
                        <Button type="primary" onClick={sousuo}>搜索</Button>
                    </Col>
                </Row>

                <Table
                    columns={columns}
                    pagination={pagination}
                    dataSource={lsxyqyConfig.staffDataSource}
                    rowKey={record => record.id}
                    bordered />
            </Modal>

        );

    }

StaffListModal
    .propTypes = {
        form: PropTypes.object.isRequired,
        onSearch: PropTypes.func,
        onAdd: PropTypes.func,
        field: PropTypes.string,
        keyword: PropTypes.string,
    };


export default Form.create()(StaffListModal
);
