import React, {PropTypes} from 'react';
import Header from '../../../components/Header';
import {connect} from 'dva';
import Table from 'antd/lib/table';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import Form from 'antd/lib/form';
import YgglEditModel from './YgglEditModel';
import styles from './YgglPage.less'

const FormItem = Form.Item;


function YgglPage({menu, yggl, zbgl, dispatch}) {

    const {modalVisible,} = yggl;

    const HeaderProps = {
        menu,
        dispatch,
    };
    const ZbglPageProps = {
        yggl,
        zbgl,
        dispatch,
    };

    const pagination = { //分页
        total: yggl.total,
        current: yggl.page,
        pageSize: yggl.size,      
        
        onChange: (pageNo) => {
            dispatch({type: 'yggl/updatePayload', payload: {page: pageNo}});
            dispatch({type: 'yggl/queryWatiers', payload: {}});
        },
    };

    const YgglEditModelProps = { //弹框
        visible: modalVisible,
        dispatch,
        onOk() {
        },
        onCancel() {
        },
        yggl,
    };


    const columns = [
        {
            title: '员工姓名',
            dataIndex: 'realName',
            key: 'realName',
        }, {
            title: '用户名',
            dataIndex: 'userName',
            key: 'userName',
        },
        {
            title: '职别',

            dataIndex: 'groupId',
            key: 'groupId',
            render: (text, record, index) => (
                yggl.groupList.map((val, i) => {
                    if (val.code == record.groupId) {
                        return val.name
                    }

                })
            )
        },
        {
            title: '身份证号',
            dataIndex: 'idCardNo',
            key: 'idCardNo',
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
        }, {
            title: '操作',
            key: 'action',
            render: (text, record, index) => (
                <span key={index}><a onClick={() => {
                    goeditStaff(record)
                }}>编辑</a>
          </span>
            ),
        }
    ];

    function goeditStaff(record) {
        dispatch({
            type: 'yggl/getWatiers',
            payload: {
                id: record.id
            }
        });
    }

    function deleteWatier(record) {


        dispatch({
            type: 'yggl/updatePayload',
            payload: {
                deleteId: record.id
            }
        });
        dispatch({
            type: 'yggl/deleteWatiers',
            payload: {

            }
        });
    }

    // 新增员工
    function addStaffClick() {
        dispatch({
            type: 'yggl/updatePayload',
            payload: {
                modalVisible: true,
                record: {}
            }
        });
    }

    return (
        <Header {...HeaderProps}>
            <div>
                <Form layout="inline" className={styles.inputW} style={{marginBottom: 20,marginLeft:20}}>
                    <FormItem>
                        <Input style={{width: 180}} onChange={(e) => {
                            dispatch({
                                type: 'yggl/updatePayload',
                                payload: {
                                    condition: e.target.value
                                }
                            });
                        }}/>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" onClick={() => {
                            dispatch({
                                type: 'yggl/updatePayload',
                                payload: {
                                    page: 1
                                }
                            });
                            dispatch({type: 'yggl/queryWatiers', payload: {}});
                        }}>搜索</Button>
                    </FormItem>
                </Form>
                <Button type="primary" style={{marginLeft: 20}} onClick={addStaffClick}>新增员工</Button>
                <Table className={styles.table}
                       columns={columns}
                       dataSource={yggl.list}
                       rowKey={record => record.id}
                       pagination={pagination}
                       bordered/>
                <YgglEditModel {...YgglEditModelProps}/>
            </div>
        </Header>
    );

}

YgglPage.propTypes = {

    menu: PropTypes.object,

};

function mapStateToProps({menu, yggl, zbgl}) {
    return {
        menu,
        yggl,
        zbgl
    };
}

export default connect(mapStateToProps)(YgglPage);