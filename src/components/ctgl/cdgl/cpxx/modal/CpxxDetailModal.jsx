import React, {PropTypes} from 'react';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import styles from './../CpAddModal.less';
import Radio from 'antd/lib/radio';
import Button from 'antd/lib/button';
import Checkbox from 'antd/lib/checkbox';
import {Col, Row} from 'antd/lib';

import Table from 'antd/lib/table';
import InputNumber from 'antd/lib/input-number';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Search = Input.Search;

import Modal from 'antd/lib/modal';
import Message from 'antd/lib/message'

const TcxxDetailModal = ({
                   visible, onOk, onCancel, currentItem, dispatch, cpxx,cpfl,tcxx,

               }) => {

    const formItemLayout = {
        labelCol: {span: 3},
        wrapperCol: {span: 21},
    };

    var foodList = cpxx.foodList;
    foodList.map((i,j)=>{

      i.index = i.id + '_' + i.specId;
    })
    
    const Option = Select.Option;

      var children = []; 

      var cpflList = cpfl.list.slice(0);
      var objcet = {
        id:0,
        name:'全部分类'
      };

    if (cpflList.length >0) {

        if(cpflList[0].id !=0 ){

            cpflList.unshift(objcet);

        }

        cpflList.map((a, b) => {


            children.push(
                <li key = {a.id} style={{height:'30px',lineHeight:'30px'}}
                onClick = {() => {onLeftClick(a)}}
                style={{border: "1px solid #e8e8e8",borderBottom: "0",backgroundColor: a.id != cpxx.selectCategoryId?"#ffffff":'#e5f9ff',textAlign: "center",lineHeight:"30px"}}>
                {a.name} </li>
            )
        })
    }

  
 
    
      function managerHandle(record,index){

      
          var handlebtn=[];

            handlebtn.push(<span key={index} >
                 <a onClick={() =>{onDelete(index)}}>删除</a>
              </span>)

            return handlebtn;
      }
      //限制小数点后只能输入两位
      function onChangeValueFormatter(value){
          var regex = "^[0-9]*(\.[0-9]{0,2})?$";
          var patt = new RegExp(regex);
          let isPatt = patt.test(value);
          let valueNew = value;

          if(!isPatt && valueNew){

            valueNew = valueNew.substring(0,valueNew.length-1);
          }

          return valueNew;
      }

      function onMaxCountInput(e,index){

          cpxx.recommendFoods[index].maxCount = e;

          dispatch({type: 'cpxx/updatePayload',payload:{recommendFoods:cpxx.recommendFoods}});

      }    
      function managerMaxCountHandle(record,index){
       
              var handlebtn=[];
             if(!record.maxCount){

              record.maxCount = 1;
             }

              handlebtn.push(
                <InputNumber style = {{width:60}} min={0} max={2} step={1} formatter={onChangeValueFormatter} onChange = {(e)=>onMaxCountInput(e,index)} value = {record.maxCount}/>
              )
         
            return handlebtn;
      }

      function managerOrderNoHandle(record,index){

         
            return index+1;
       
      }

      function onOriginReduceInput(e,index){
           cpxx.recommendFoods[index].originReduce = e;

          dispatch({type: 'cpxx/updatePayload',payload:{recommendFoods:cpxx.recommendFoods}});

      }

      function managerOriginReduceHandle(record,index){
            var handlebtn=[];
            

            handlebtn.push(<span key={index} >
                 <InputNumber style = {{width:80}} min={0} max={Infinity} step={0.01} formatter={onChangeValueFormatter} onChange = {(e)=>onOriginReduceInput(e,index)} value = {(record.originReduce==null)?0:record.originReduce}/>
              </span>)

              return handlebtn;

      }

    function onVipReduceInput(e,index){
        cpxx.recommendFoods[index].vipReduce = e;

        dispatch({type: 'cpxx/updatePayload',payload:{recommendFoods:cpxx.recommendFoods}});

    }

    function managerVipReduceHandle(record,index){
        var handlebtn=[];

        handlebtn.push(<span key={index} >
                 <InputNumber style = {{width:80}} min={0} max={Infinity} step={0.01} formatter={onChangeValueFormatter} onChange = {(e)=>onVipReduceInput(e,index)} value = {(record.vipReduce==null)?0:record.vipReduce}/>
              </span>)

        return handlebtn;

    }

    function onStaffReduceInput(e,index){
        cpxx.recommendFoods[index].staffReduce = e;

        dispatch({type: 'cpxx/updatePayload',payload:{recommendFoods:cpxx.recommendFoods}});

    }

    function managerStaffReduceHandle(record,index){
        var handlebtn=[];

        handlebtn.push(<span key={index} >
                 <InputNumber style = {{width:80}} min={0} max={Infinity} step={0.01} formatter={onChangeValueFormatter} onChange = {(e)=>onStaffReduceInput(e,index)} value = {(record.staffReduce==null)?0:record.staffReduce}/>
              </span>)

        return handlebtn;

    }

        function onDelete(index){

         var selectedList = cpxx.recommendFoods;
      
              if(selectedList.length <= index){
      
                return;
      
              }
      
              selectedList.splice(index,1);

              dispatch({type: 'cpxx/updatePayload',payload:{recommendFoods:selectedList}});
      
            }

            function managerFoodNameAndSpecHandle(record,index){
                var handlebtn=[];

                handlebtn.push(<span key={index} >
                               {record.name}/{record.specName}
                              </span>)

                return handlebtn;


            }

            function managerPriceAndSpecHandle(record,index){
                var handlebtn=[];
                
                    handlebtn.push(<span key={index} >
                       <span style={{display:'block',whiteSpace:'nowrap'}}>&nbsp;&nbsp;&nbsp;&nbsp;原价：{(record.price != null)?record.price/100:0}元</span>
                        <span style={{display:'block',whiteSpace:'nowrap'}}>会员价：{(record.vipPrice != null)?record.vipPrice/100:0}元</span>
                        <span style={{display:'block',whiteSpace:'nowrap'}}>员工价：{(record.staffPrice != null)?record.staffPrice/100:0}元</span>
                      </span>)
                
                  return handlebtn;


                }
          
           function managerPriceAndSpecHandleRight(record,index){
                var handlebtn=[];
                
                    handlebtn.push(<span key={index} >
                       <span style={{display:'block',whiteSpace:'nowrap'}}>&nbsp;&nbsp;&nbsp;&nbsp;原价：{(record.originPrice != null)?record.originPrice:0}元</span>
                        <span style={{display:'block',whiteSpace:'nowrap'}}>会员价：{(record.vipPrice != null)?record.vipPrice:0}元</span>
                        <span style={{display:'block',whiteSpace:'nowrap'}}>员工价：{(record.staffPrice != null)?record.staffPrice:0}元</span>
                      </span>)
                
                  return handlebtn;


                }

            function managerFoodNameAndSpecHandleRight(record,index){
                var handlebtn=[];

                handlebtn.push(<span key={index} >
                               {record.recommendFoodName}/{record.specName}
                              </span>)

                return handlebtn;


            }

    const columns = [
            
            {
                title: '菜品/规格',
                dataIndex: 'name',
                key: 'name',
                render: (text, record,index) => (
                    managerFoodNameAndSpecHandle(record,index)
                ),
            },
            {
                title: '价格',
                dataIndex: 'specName',
                key: 'specName',
                render: (text, record,index) => (
                    managerPriceAndSpecHandle(record,index)
                ),
            }
            ];

        const columnsRight = [
            {
                title: '序号',
                dataIndex: 'orderNo',
                key: 'orderNo',
                render: (text, record,index) => (
                    managerOrderNoHandle(record,index)
                ),

            },
            {
                title: '菜品/规格',
                dataIndex: 'recommendFoodName',
                key: 'recommendFoodName',
                render: (text, record,index) => (
                    managerFoodNameAndSpecHandleRight(record,index)
                ),
            },
            {
                title: '价格',
                dataIndex: 'specName',
                key: 'specName', 
                render: (text, record,index) => ( 
                    managerPriceAndSpecHandleRight(record,index)
                ),       
            },
            {
                title: '操作',
                key: 'operation',
                dataIndex: 'operation',
                render: (text, record,index) => ( 
                    managerHandle(record,index)
                ),
            }
        ];

    
     const rowSelection = {
        
       selectedRowKeys:cpxx.selectedRowKeys,
       onChange: onSelectChange,
    };

     function onSelectChange(selectedRowKeys,selectedRows){
       dispatch({type: 'cpxx/updatePayload',payload:{selectedRowKeys:selectedRowKeys,selectedRows:selectedRows}});
    }

    function onAddClick(){

      var selectedList = cpxx.recommendFoods;

       if (!selectedList) {
          selectedList = []
       }


       let isRepeat = false;

       cpxx.selectedRows.map((a)=>{

           cpxx.recommendFoods.map((b)=>{

               if (a.index == b.index){

                   isRepeat = true;

               }
               
           })
       })

        if (isRepeat){

            Message.warning("添加的菜品重复，请重新选择");
            return;
        }

       if (selectedList.length >=5){

           Message.warning("最多添加5个推荐菜");
           return;
       }

           var orderNo=0;
           selectedList.map((i,j)=>{

               if(i.orderNo){
                  i.orderNo=++orderNo;
               }
           })


            //添加记录

            cpxx.selectedRows.map((i,j)=>{
            var item = {};
            item.index= i.id + '_' + i.specId;
            item.recommendFoodId= i.id;
            item.recommendFoodName = i.name;
            item.originPrice = i.price/100;
            item.originReduce = i.originReduce;
            item.staffPrice = i.staffPrice/100;
            item.staffReduce = i.staffReduce;
            item.vipPrice = i.vipPrice/100;
            item.vipReduce = i.vipReduce;
            item.specName = i.specName;
            item.specId = i.specId;
            item.maxCount = i.maxCount;

            selectedList.push(item);


          })

        let newSelectedList
        if (selectedList.length >= 5){
            newSelectedList = selectedList.splice(0,5);
        }else{
            newSelectedList = selectedList;
        }



      dispatch({type: 'cpxx/updatePayload',payload:{recommendFoods:newSelectedList,selectedRowKeys:[]}});

    }

 
    function secondHandleNext(){

            
             dispatch({type: 'cpxx/updatePayload',payload:{cpxxDetailVisible:false,selectedRowKeys:[]}});

        }

        function secondHandlePrevious(){
          
             dispatch({type: 'cpxx/updatePayload',payload:{cpxxDetailVisible:false}});

        }

         function onLeftClick(a){

             dispatch({type: 'cpxx/updatePayload',payload:{selectCategoryId:a.id}});
             dispatch({type: 'cpxx/queryFoodByCategory',payload:{selectCategoryId:a.id,id:cpxx.foodId}});

        }

        function onSearchKeyWord(value){

            dispatch({ type: 'cpxx/queryFoodByCategory', payload: {id: cpxx.foodId,selectCategoryId:0,name:value} });
            

        }

    function handleOk() {

        dispatch({type: 'cpxx/updatePayload',payload:{cpxxDetailVisible:false}});
    }

    function onCancelClick(){

        dispatch({type: 'cpxx/updatePayload',payload:{cpxxDetailVisible:false,selectedRowKeys:[]}});
    }

    const modalOpts = {
        title:'编辑推荐菜',
        visible:cpxx.cpxxDetailVisible,
        onOk:handleOk,
        onCancel:onCancelClick,
        currentItem,
        width: '90%',
        footer:null,

    };

    return (
        <Modal  {...modalOpts}>
            <div className={styles.headerblock}>

            <div className={ styles.headerblock } style={{overflow: 'hidden'}}>

             <div style={{overflow: 'hidden',height:'80%'}}>
                 <div style={{width:'40%', float:'left'}}>
                     
                     <Search
                      placeholder="请输入内容"
                      onSearch={onSearchKeyWord}
                      style={{marginBottom: '10px'}}
                      enterButton
                    />
                     <div style={{overflow: 'hidden'}}>
                     <ul style={{width:'19%', float:'left',overflow:'hidden',listStyle: "none",padding: "0",borderBottom: "1px solid #e8e8e8"}}>
                      {children}
                      </ul>

                      <Table className={styles.cpxxDetailTable} style={{width:'80%', float:'right',height:'380px',overflowY:'auto'}}
                        columns={columns}
                        dataSource={foodList}
                        rowKey={record => record.index}
                        rowSelection={rowSelection}
                        pagination={false}
                        bordered/>
              
                     </div>
                     
                     
                 </div>
                <Button type="primary" style={{width:'8%', float:'left',padding:'0',position: 'absolute',top: '50%',left: '41%'}} onClick = {onAddClick}>添加</Button>
                 <div style={{width:'50%', float:'right',height:'80%'}}>
                     <div style={{marginTop:'13px',marginBottom: '10px'}}>最多挑选五个菜品</div>
                    <Table className={styles.cpxxDetailTable} style={{height:'500px',overflowY:'auto',marginTop:10}}
                        columns={columnsRight}
                        dataSource={cpxx.recommendFoods}
                        rowKey={record => record.id}
                        pagination={false}
                        bordered/>
               
                 </div>
             </div>

             
                      

            
          </div>
                    
            </div>
            <div style={{overflow:"hidden",padding: "0 30%",marginTop: "20px"}}>
              {/*<Button*/}
                  {/*type="primary"*/}
                  {/*style={{margin: '0 auto',width: "30%",float: "left"}}*/}
                  {/*onClick={onCancelClick}>*/}
                  {/*取消*/}
              {/*</Button>*/}
              <Button
                  type="primary"
                  style={{margin: '0 auto',width: "40%",display:'block'}}
                  onClick={secondHandleNext}>
                  确定
              </Button>
            </div>
        </Modal>

    );
};

TcxxDetailModal.propTypes = {
    visible: PropTypes.any,
    item: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
};

export default Form.create()(TcxxDetailModal);
