import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import Tabs from 'antd/lib/tabs';
import Table from 'antd/lib/table';
const TabPane = Tabs.TabPane;

function SbglPage ({menu,dispatch,sbgl}) {



    const HeaderProps = {
        menu,
        dispatch,
    };

    function goeditgoods(record){

    }
    function managerHandle(record,index){

        var handlebtn=[];

        handlebtn.push(<span key={index} ><a onClick={()=>{goeditgoods(record)}}>修改</a></span>)

        return handlebtn;
    }

    const columns = [
        {
            title: '类型',
            dataIndex: 'id',
            key: 'id',
        },{
            title: '设备名称',
            dataIndex: 'content',
            key: 'content',
        },{
            title: 'IP地址',
            dataIndex: 'commentType1',
            key: 'commentType1',

        },{
            title: 'Mac地址',
            dataIndex: 'commentType2',
            key: 'commentType2',

        },{
            title: '所属店铺',
            dataIndex: 'commentType3',
            key: 'commentType3',

        },{
            title: '连接状态',
            dataIndex: 'commentType4',
            key: 'commentType4',

        },{
            title: '操作',
            key: 'operation',
            dataIndex: 'operation',
            render: (text, record,index) => (
                managerHandle(record,index)
            ),
        }
    ];

    return(
        <Header {...HeaderProps}>

            <Table
                   columns={columns}
                   dataSource={sbgl.list}
                   rowKey={record => record.id}
                   pagination={false}
                   bordered/>
        </Header>
    );

}

SbglPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,sbgl}) {
    return { menu,sbgl};
}

export default connect(mapStateToProps)(SbglPage);

