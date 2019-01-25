import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import moment from 'moment';
import Header from '../../../components/Header';
import LeftMenu from '../../../components/LeftMenu';
import Tabs from 'antd/lib/tabs';
import Table from 'antd/lib/table';
import Pagination from 'antd/lib/pagination';
import DatePicker from 'antd/lib/date-picker';
import Button from 'antd/lib/button';
import styles from './Ctaigl_Child.less';
import Modal from 'antd/lib/modal';
import Ctaigl_Child from '../../../components/ctgl/ctaigl/Ctaigl_Child.jsx';
import Ctaigl_add from '../../../components/ctgl/ctaigl/Ctaigl_add.jsx';
import Ctaigl_groupadd from '../../../components/ctgl/ctaigl/Ctaigl_groupadd.jsx';
import Region_add from '../../../components/ctgl/ctaigl/Region_add.jsx';
import Region_edit from '../../../components/ctgl/ctaigl/Region_edit.jsx';
import CtaiImportModal from '../../../components/ctgl/ctaigl/CtaiImportModal.jsx';
import Spin from 'antd/lib/spin';
import {Popconfirm} from 'antd/lib';
import {getRestaurantId,getCompanyId,getWxToken,getWxState} from '../../../services/CommonService';
import message from "antd/lib/message/index";
const {MonthPicker, RangePicker} = DatePicker;
const dateFormat = 'YYYY/MM/DD';

const TabPane = Tabs.TabPane;

function CtaiglPage({menu, ctaigl, dispatch,deskQrCode}) {

    const {
        modalVisible,loading
    } = ctaigl
    const HeaderProps = {
        menu,
        dispatch,
    };
    const ctaiglchildProps = {
        dispatch,
    }

    function getUserToken() {

        const userStatus = myApp._store.getState().account.token;

        return userStatus;

    }

    function getCompanyId() {

        const userStatus = myApp._store.getState().account.companyId;

        return userStatus;

    }


    function getRestaurantId() {

        const userStatus = myApp._store.getState().menu.currentRestaurantId;

        return userStatus;

    }

    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
        }, {
            title: '餐台编号',
            dataIndex: 'tableCode',
            key: 'tableCode',
        }, {
            title: '餐台名称',
            dataIndex: 'tableName',
            key: 'tableName',
        }, {
            title: '所属区域',
            dataIndex: 'regionId',
            key: 'regionId',
            render: (text, record, index) => (
                managerRegion(record, index)
            ),
        }, {
            title: '座位数',
            dataIndex: 'seatNum',
            key: 'seatNum',
        }, {
            title: '服务员',
            dataIndex: 'waiterId',
            key: 'waiterId',
            render: (text, record, index) => (
                managerWaiter(record, index)
            ),
        }, {
            title: '是否堂食',
            dataIndex: 'isEatInRestaurant',
            key: 'isEatInRestaurant',
            render: (text, record, index) => (
                managerB(record, index)
            ),
        }, {
            title: '是否提成',
            dataIndex: 'state',
            key: 'state',
        }, {
            title: '操作',
            key: 'operation',
            dataIndex: 'operation',
            render: (text, record, index) => (
                managerHandle(record, index)
            ),
        }
    ];

    function managerB(record) {
        return record.isEatInRestaurant ? "是" : "否";
    }

    function managerWaiter(record, index) {
        var reValue;
        if (ctaigl.waiters) {
            ctaigl.waiters.map((j) => {
                if (j.id == record.waiterId) {
                    reValue = j.name;
                }
            })
        }
        return reValue;
    }

    const columnsArea = [
        {
            title: '区域名称',
            dataIndex: 'regionName',
            key: 'regionName',
        }, {
            title: '座位数',
            dataIndex: 'defaultSeatNum',
            key: 'defaultSeatNum',
        }, {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
        }, {
            title: '操作',
            key: 'operation',
            dataIndex: 'operation',
            render: (text, record, index) => (
                managerHandleRegion(record, index)
            ),
        }
    ];

    // const pagination = {
    //     total: total,
    //     current:current,
    //     onChange: (pageNo) => {
    //         onPageChange(pageNo)
    //     },
    // };

    function callback(key) {
        console.log(key);
    }

    function editItem(record) {

        var item = {};
        item.tableCode = record.tableCode;
        item.tableName = record.tableName;
        item.regionId = record.regionId;
        item.seatNum = record.seatNum;
        item.waiterId = record.waiterId;
        item.id = record.id;
        item.regionNameString = managerRegion(record);
        item.waiterString = managerWaiter(record);
        item.isEatInRestaurant = record.isEatInRestaurant;

        dispatch({
            type: 'ctaigl/updatePayload',
            payload: {
                modalVisible: true, item: item, currentEditSelectValue: managerRegion(record)
            }
        });
    }

    function editRegionItem(record) {

        var item = {};
        item.id = record.id;
        item.companyId = record.companyId;
        item.restaurantId = record.restaurantId;
        item.regionName = record.regionName;
        item.defaultSeatNum = record.defaultSeatNum;
        item.remark = record.remark;

        dispatch({
            type: 'ctaigl/updatePayload',
            payload: {
                modalRegionEditVisible: true, editRegionItem: item, currentEditSelectValue: managerRegion(record)
            }
        });
    }

    function managerRegion(e) {

        var reValue;
        if (ctaigl.regionList) {
            ctaigl.regionList.map((j) => {
                if (j.id == e.regionId) {
                    reValue = j.regionName;
                }
            })
        }
        return reValue;
    }

    function managerHandle(record, index) {
        var handlebtn = [];

        handlebtn.push(<span key={index}><a onClick={() => {
            editItem(record)
        }}>编辑</a>
        <span className="ant-divider"/>
         <Popconfirm okText="确定" cancelText="取消" title="确定要删除吗？" onConfirm={() => showTableDeleteConfirm(record)}>
                <a>删除</a>
            </Popconfirm>
         <span className="ant-divider"/>
            <a onClick={()=>{

                var prefixUrl;

                const host = window.location.protocol + '//' + window.location.host;

                if (host == 'http://localhost:8989') {

                    prefixUrl = "http://dev.saas.27aichi.cn/";

                } else {

                    prefixUrl = window.location.protocol + '//' + window.location.host + '/';

                }

                if (getWxState() == 1){

                    window.location = prefixUrl + 'open/weixin/qrcode.jpg/' + record.id + `?companyId=${getCompanyId()}&restaurantId=${getRestaurantId()}&t=${getWxToken()}`;

                } else{
                    message.warning('公众号未授权')
                }


            }
            }>下载二维码</a>
        </span>)

        return handlebtn;
    }

    function managerHandleRegion(record, index) {
        var handlebtn = [];

        handlebtn.push(<span key={index}><a onClick={() => {
            editRegionItem(record)
        }}>编辑</a>
        <span className="ant-divider"/>
         <Popconfirm okText="确定" cancelText="取消" title="确定要删除吗？" onConfirm={() => showRegionDeleteConfirm(record)}>
            <a>删除</a>
        </Popconfirm>
        </span>)

        return handlebtn;
    }

    const confirm = Modal.confirm;

    function showTableDeleteConfirm(record) {
        dispatch({
            type: 'ctaigl/updatePayload',
            payload: {tableDeleteId: record.id}
        });
        dispatch({
            type: 'ctaigl/deleteTable',
            payload: {}
        });
    }

    function showRegionDeleteConfirm(record) {
        dispatch({
            type: 'ctaigl/updatePayload',
            payload: {regionDeleteId: record.id}
        });
        dispatch({
            type: 'ctaigl/deleteRegion',
            payload: {}
        });
    }


    function managerRegion(record, index) {

        var reValue;
        if (ctaigl.regionList) {
            ctaigl.regionList.map((j) => {
                if (j.id == record.regionId) {
                    reValue = j.regionName;
                }
            })
        }
        return reValue;
    }

    function addTableClick() {
        dispatch({type: 'ctaigl/updatePayload', payload: {modaladdVisible: true,isResetForm: true}});
    }
    function addReasonClick() {

        var prefixUrl;

        const host = window.location.protocol + '//' + window.location.host;

        if (host == 'http://localhost:8989') {

            prefixUrl = "http://dev.saas.27aichi.cn/";

        } else {

            prefixUrl = window.location.protocol + '//' + window.location.host + '/';

        }

        if (deskQrCode.wxState == 1){

            window.location = prefixUrl + 'open/weixin/qrcodes.zip' + `?companyId=${getCompanyId()}&restaurantId=${getRestaurantId()}&t=${deskQrCode.wxToken}`;

        } else{
            message.warning('公众号未授权')
        }
    }

    function addGroupAddClick() {
        dispatch({type: 'ctaigl/updatePayload', payload: {modalGroupAddVisiable: true,isResetForm: true}});
    }

    function addRegionClick() {
        dispatch({type: 'ctaigl/updatePayload', payload: {modalRegionAddVisible: true,isResetForm: true}});
    }

    function editRegionClick() {
        dispatch({type: 'ctaigl/updatePayload', payload: {modalRegionEditVisible: true}});
    }


    const modalOpts = {
        ctaigl, dispatch
    };
    const pagination = {
        total: ctaigl.cttotal,
        current: ctaigl.current,
        pageSize: ctaigl.size,      
        
        locale:"zh_CN",
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger: true,
        onShowSizeChange: SizeChange,
    };
    const regionPagination = {
        total: ctaigl.regiontotal,
        current: ctaigl.regioncurrent,
        onChange: (pageNo) => {
            onRegionPageChange(pageNo)
        },
        showSizeChanger: true,
        onShowSizeChange: regionSizeChange,
    };

    function SizeChange(current, pageSize) {

        console.log(current, pageSize);
        dispatch({type: 'ctaigl/updatePayload', payload: {size: pageSize, current: 1, offset: 0}});
        dispatch({type: 'ctaigl/query', payload: {}});


    }
    function regionSizeChange(current, pageSize) {

        console.log(current, pageSize);
        dispatch({type: 'ctaigl/updatePayload', payload: {regionsize: pageSize, regioncurrent: 1, regionoffset: 0}});
        dispatch({type: 'ctaigl/queryRegion', payload: {}});


    }
    function onPageChange(pageNo) {
        console.log(pageNo);
        var offset = pageNo * ctaigl.size - ctaigl.size;
        dispatch({type: 'ctaigl/updatePayload', payload: {offset: offset, current: pageNo}});
        dispatch({type: 'ctaigl/query', payload: {}});


    }
    function onRegionPageChange(pageNo) {
        console.log(pageNo);
        var offset = pageNo * ctaigl.regionsize - ctaigl.regionsize;
        dispatch({type: 'ctaigl/updatePayload', payload: {regionoffset: offset, regioncurrent: pageNo}});
        dispatch({type: 'ctaigl/queryRegion', payload: {}});


    }
    return (
        <Header {...HeaderProps}>
            <div>
                <Spin spinning={loading} className={styles.load} size="large" />
                <Tabs onChange={callback}>
                    <TabPane tab="餐台管理" key="1">
                        <div>
                            <Ctaigl_Child {...modalOpts} >
                            </Ctaigl_Child>
                            <Ctaigl_add {...modalOpts} >
                            </Ctaigl_add>
                            <Ctaigl_groupadd {...modalOpts} >
                            </Ctaigl_groupadd>
                            <Region_add {...modalOpts} >
                            </Region_add>
                            <Region_edit {...modalOpts} >
                            </Region_edit>
                            <CtaiImportModal {...modalOpts} >
                            </CtaiImportModal>

                            <Button style={{marginLeft: 20}} onClick={addTableClick}>添加餐台</Button>
                            <Button style={{marginLeft: 20}} onClick={addGroupAddClick}>批量添加</Button>
                            {/*<Button style={{marginLeft: 20}} onClick={addReasonClick}>批量导入</Button>*/}
                            <Button style={{marginLeft: 20}} onClick={addReasonClick}>批量导出</Button>
                            <Table className={styles.table}
                                   columns={columns}
                                   dataSource={ctaigl.list}
                                   rowKey={record => record.id}
                                   pagination={pagination}
                                   bordered/>
                        </div>
                    </TabPane>
                    <TabPane tab="区域管理" key="2">
                        <div>
                            <Button style={{marginLeft: 20}} onClick={addRegionClick}>添加区域</Button>
                            <Table className={styles.table}
                                   columns={columnsArea}
                                   dataSource={ctaigl.regionList}
                                   rowKey={record => record.id}
                                   pagination={regionPagination}
                                   bordered/>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        </Header>
    );

}

CtaiglPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu, ctaigl,deskQrCode}) {
    return {menu, ctaigl,deskQrCode};
}

export default connect(mapStateToProps)(CtaiglPage);

