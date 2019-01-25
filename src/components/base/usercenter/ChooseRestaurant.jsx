import React, {PropTypes} from 'react';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import Radio from 'antd/lib/radio';
import Button from 'antd/lib/button';
import Checkbox from 'antd/lib/checkbox';
import {Col, Row} from 'antd/lib';
import styles from './ChooseRestaurant.less';
import Table from 'antd/lib/table';
import InputNumber from 'antd/lib/input-number';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Search = Input.Search;
import Message from 'antd/lib/message';
import Modal from 'antd/lib/modal';

const TcxxDetailModal = ({
                             dispatch, menu,tcxx,cpfl

                         }) => {

    const formItemLayout = {
        labelCol: {span: 3},
        wrapperCol: {span: 21},
    };

    var foodList = [];
    var brandList = menu.brandList;
    if (brandList.length >0 ){

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

    };

    return (
        <Modal  {...modalOpts}>
            <div >

                <div  style={{overflow: 'hidden'}}>

                    <div style={{overflow: 'hidden',height:'80%'}}>
                        <div >

                            <Search
                                placeholder="请输入内容"
                                onSearch={onSearchKeyWord}
                                style={{marginBottom: '10px'}}
                                enterButton
                            />
                            <div style={{overflow: 'hidden'}}>

                                <Table className={styles.table} style={{width:'35%', float:'left',height:'380px',overflowY:'auto'}}
                                       columns={leftColumns}
                                       dataSource={children}
                                       rowKey={record => record.brandId}
                                       pagination={false}
                                       bordered/>

                                <Table className={styles.table} style={{width:'64%', float:'right',height:'380px',overflowY:'auto'}}
                                       columns={columns}
                                       dataSource={menu.restaurantList}
                                       rowKey={record => record.restaurantId}
                                       pagination={false}
                                       bordered/>

                            </div>


                        </div>

                    </div>





                </div>

            </div>

        </Modal>

    );
};


export default Form.create()(TcxxDetailModal);
