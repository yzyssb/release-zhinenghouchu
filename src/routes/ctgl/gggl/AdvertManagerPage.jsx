import React, { PropTypes } from 'react';
import { connect } from 'dva';
import Header from '../../../components/Header';
import styles from './AdvertManagerPage.less';
import Table from 'antd/lib/table';
import Button from 'antd/lib/button';
import Form from "antd/lib/form/index";
import ShowAddAvert from '../../../components/ctgl/gggl/ShowAddAvert';

function AdvertManagerPage({ menu, advertManagerPage, dispatch }) {

    const {
        list, total, page, record
    } = advertManagerPage;

    const HeaderProps = {
        menu,
        dispatch,
    };

    const onSearchDateChange = (dates, dateStrings) => {

    };

    const search = () => {

    };


    const ShowAddAvertProps = {
        advertManagerPage,
        dispatch,
        record,
        onCancel() {
            var recordLs = advertManagerPage.record;
            recordLs.photoUrl= advertManagerPage.imageUrl;
            dispatch({
                type: 'advertManagerPage/updateShow',
                payload: { isShow: false ,record:recordLs}});
        },
    };

    // 修改广告
    function changeAvert(record, index) {
        var imageUrl = record.photoUrl;
        dispatch({
            type: 'advertManagerPage/updatePayload',
            payload: {
                record: record,imageUrl:imageUrl,
                isUpdate: true, way: "edit", isResetForm: true
            },
        });
        dispatch({
            type: 'advertManagerPage/updateShow',
            payload: { isShow: true }
        });
    }

    // 删除列表数据
    function deleteAvert(record, index) {
        dispatch({
            type: 'advertManagerPage/updatePayload',
            payload: { record: record }
        });

        dispatch({
            type: 'advertManagerPage/deleteAvert',
            payload: {}
        });
    }

    const columns = [
        {
            title: '广告名称',
            dataIndex: 'adDetails',
            key: 'adDetails',
        },

        {
            title: '位置',
            render: function (text, record, index) {
                return (
                    <span>
                        {record.adType == 1 && "确认订单"}
                        {record.adType == 2 && "人数选择"}
                        {record.adType == 3 && "支付成功"}
                        {record.adType == 4 && "注册框"}
                    </span>
                )
            }
        },
        {
            title: '操作',
            dataIndex: 'wipeMoney',
            key: 'wipeMoney',
            render: (text, record, index) => {
                return (
                    <span key={index}>
                        <a onClick={() => { changeAvert(record, index) }}>修改</a>
                        <span className="ant-divider" />
                        <a onClick={() => { deleteAvert(record, index) }}>删除</a>
                    </span>
                )

            }
        }

    ];

    const pagination = { //分页
        total: total,
        current: page,
        pageSize: advertManagerPage.size,      
        
        onChange: (pageNo) => {
            dispatch({ type: 'advertManagerPage/updatePayload', payload: { page: pageNo, start: pageNo - 1 } });
            dispatch({ type: 'advertManagerPage/getlist', payload: {} });
        },
    };

    // 新增广告
    function addAvert() {
        dispatch({
            type: 'advertManagerPage/updatePayload',
            payload: { way: "add", isResetForm: true }
        });

        dispatch({
            type: 'advertManagerPage/updateShow',
            record: {},
            payload: { isShow: true }
        });
    }

    return (
        <Header {...HeaderProps}>
            <div>

                <Button style={{ margin: "20px 0 10px 0" }} type="primary" onClick={addAvert}>新增广告</Button>

                <Form inline style={{ marginBottom: 20 }}>


                </Form>
                <Table
                    columns={columns}
                    dataSource={list}
                    pagination={pagination}
                    bordered />
                <ShowAddAvert {...ShowAddAvertProps}></ShowAddAvert>
            </div>

        </Header>
    );

}

AdvertManagerPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({ menu, advertManagerPage }) {
    return { menu, advertManagerPage };
}


export default connect(mapStateToProps)(AdvertManagerPage);