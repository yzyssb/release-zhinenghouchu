import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Icon from 'antd/lib/icon';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Button from 'antd/lib/button';
import Spin from 'antd/lib/spin';

import { connect } from 'dva';
import styles from './Welcome.less';
import Header from '../../../../components/Header';
import LeftMenu from '../../../../components/LeftMenu';

import AddressSelect from '../../../../components/base/common/AddressSelect';
import message from 'antd/lib/message';

import ChooseRestaurant from '../../../../components/base/usercenter/ChooseRestaurant';
import Select from "antd/lib/select";
import Message from "antd/lib/message";
import Table from 'antd/lib/table';
import {routerRedux} from "dva/router";
const Search = Input.Search;

const oWelcome = ({dispatch,welcome,menu,addressselect}) =>{



    message.config({
        top: 70,
        duration: 2,
    });


    const HeaderProps = {
        menu,
        dispatch,
        welcome,
        addressselect
    };

    var brandList = menu.brandList;
    if (brandList.length > 0){
        brandList.map((i,j)=>{

            i.index = j +1;
        })

        const Option = Select.Option;

        var children = [];

        if (brandList.length >0) {

            brandList.map((a, b) => {


                children.push(
                    a
                )
            })
        }
    }

    function managerHandle(record,index){

        let handlebtn=[];

        handlebtn.push(
            <div key = {record.restaurantId}>
                <span className={styles.span} style={{background:menu.restaurantId == record.restaurantId?'#e5f9ff':''}} onClick ={() => {onItemClick(record)}} >{record.restaurantName}</span>

            </div>
        )

        return handlebtn;

    }

    function managerBrandHandle(record,index){

        let handlebtn=[];

        handlebtn.push(
            <div key = {record.brandId}>
                <span className={styles.span} style={{background:menu.brandId == record.brandId?'#e5f9ff':''}} onClick ={() => {onLeftClick(record)}} >{record.brandName}</span>

            </div>
        )

        return handlebtn;

    }

    function onItemClick(record){


        dispatch({type: 'menu/updatePayload',payload:{restaurantId:record.restaurantId,restaurantName:record.restaurantName}});

    }

    const columns = [

        {
            title: '门店名称',
            dataIndex: 'restaurantName',
            key: 'restaurantName',
            render: (text, record,index) => (
                managerHandle(record,index)
            ),
        },

    ];

    const leftColumns = [

        {
            title: '品牌分类',
            dataIndex: 'brandName',
            key: 'brandName',
            render: (text, record,index) => (
                managerBrandHandle(record,index)
            ),
        },

    ];

    function secondHandleNext(){

        if (menu.restaurantId == -1){

            Message.warning("请选择门店");
            return;
        }

        dispatch({type: 'menu/queryChooseRestaurant',payload:{}});

        // let path = 'cdgl';
        // menu.allMenu.map((i)=>{
        //
        //     if (i.children) {
        //         i.children.map((j)=>{
        //
        //             if (j.children) {
        //                 j.children.map((h)=>{
        //
        //                     if( localStorage.getItem('currentKey') == h.resourceroute ){
        //
        //                         path = h.resourceroute;
        //
        //                     }
        //                 })
        //             }
        //
        //             if( localStorage.getItem('currentKey') == j.resourceroute ){
        //
        //                 path = j.resourceroute;
        //
        //             }
        //         })
        //     }
        //
        // })
        // console.log(path)
        // dispatch(routerRedux.push({
        //     pathname: path,
        // }));

    }


    function onLeftClick(a){

        var newRestaurantList = [];

        menu.brandList.map((i,j)=>{

            if (i.brandId == a.brandId){
                newRestaurantList = i.restaurantList;
            }
        })

        dispatch({type: 'menu/updatePayload',payload:{restaurantList:newRestaurantList,brandId:a.brandId,restaurantId:-1}});

    }

    function onSearchKeyWord(value){

        let newList = [];
        menu.brandList.map((i)=>{

            if (i.restaurantList.map((j) => {

                if (j.restaurantName.indexOf(value)!=-1){

                    newList.push(j);
                }

            }));
        })

        dispatch({type: 'menu/updatePayload',payload:{restaurantList:newList}});


    }

    function handleOk() {

        dispatch({type: 'menu/updatePayload',payload:{tcxxDetailVisible:false}});
    }

    function onCancelClick(){

        dispatch({type: 'menu/updatePayload',payload:{modalVisible:false}});
    }

    const modalOpts = {
        title:'选择餐厅',
        visible:menu.modalVisible,
        onOk:secondHandleNext,
        onCancel:onCancelClick,
        width: '40%'

    };


    return(

        <div>

            <div >
                <Header {...HeaderProps}>
                    <div  className={styles.changeRestaurantModal}>

                        <div >
                            <div className={styles.changeRestaurantModalTitle}>请选择门店</div>
                            <div className={styles.changeRestaurantModalCont}>
                                <Search
                                    placeholder="请输入内容"
                                    onSearch={onSearchKeyWord}
                                    style={{marginBottom: '10px'}}
                                    enterButton
                                />
                                <div style={{overflow: 'hidden'}}>

                                    <Table className={styles.table} style={{width:'19%', float:'left',height:'380px',overflowY:'auto'}}
                                           columns={leftColumns}
                                           dataSource={children}
                                           rowKey={record => record.brandId}
                                           pagination={false}
                                           bordered/>

                                    <Table className={styles.table} style={{width:'80%', float:'right',height:'380px',overflowY:'auto'}}
                                           columns={columns}
                                           dataSource={menu.restaurantList}
                                           rowKey={record => record.restaurantId}
                                           pagination={false}
                                           bordered/>

                                </div>
                                <div style={{overflow:"hidden",padding: "0 30%",marginTop: "20px"}}>
                                    {/*<Button*/}
                                    {/*type="primary"*/}
                                    {/*style={{margin: '0 auto',width: "40%",float: "left"}}*/}
                                    {/*onClick={onCancelClick}>*/}
                                    {/*取消*/}
                                    {/*</Button>*/}
                                    <Button
                                        type="primary"
                                        style={{margin: '0 auto',width: "30%",display:'block'}}
                                        onClick={secondHandleNext}>
                                        确定
                                    </Button>
                                </div>
                            </div>


                        </div>





                    </div>

                </Header>
            </div>

        </div>

    )
}

function mapStateToProps({ welcome,menu,addressselect }) {
    return { welcome,menu,addressselect };
}
export default connect(mapStateToProps)(oWelcome);  




