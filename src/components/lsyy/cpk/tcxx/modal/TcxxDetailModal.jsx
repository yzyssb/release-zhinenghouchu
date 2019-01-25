import React, {PropTypes} from 'react';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import styles from './../TcAddModal.less';
import Radio from 'antd/lib/radio';
import Button from 'antd/lib/button';
import Checkbox from 'antd/lib/checkbox';
import {Col, Row} from 'antd/lib';

import Table from 'antd/lib/table';
import InputNumber from 'antd/lib/input-number';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Search = Input.Search;
import message from 'antd/lib/message';
import Modal from 'antd/lib/modal';

const TcxxDetailModal = ({
                   visible, onOk, onCancel, currentItem, dispatch, lstcxx,lscpfl,

               }) => {

    const formItemLayout = {
        labelCol: {span: 3},
        wrapperCol: {span: 21},
    };

    var foodList = lstcxx.foodList;
    foodList.map((i,j)=>{

      i.index = j +1;
    })
    
    const Option = Select.Option;

      var children = []; 

      var cpflList = lscpfl.list.slice(0);
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
                style={{border: "1px solid #e8e8e8",borderBottom: "0",backgroundColor: a.id != lstcxx.selectCategoryId?"#ffffff":'#e5f9ff',textAlign: "center",lineHeight:"30px"}}>
                {a.name} </li>
            )
        })
    }

  
 
    
      function managerHandle(record,index){

      
          var handlebtn=[];

          if(!record.parentId){

           handlebtn.push(<span key={index} ><a onClick={()=>{addOption(record,index)}}>加备选</a>
                 <span className="ant-divider" />
                 <a onClick={() =>{onDelete(index)}}>删除</a>
              </span>)
          }else{

            handlebtn.push(<span key={index} >
                 <a onClick={() =>{onDeleteBackUp(index)}}>删除</a>
              </span>)
          }
       
            
           
             
         
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

      function onCountInput(e,index){

          lstcxx.selectFoodList[index].count = e * 100;

          dispatch({type: 'lstcxx/updatePayload',payload:{selectFoodList:lstcxx.selectFoodList}});

      }    
      function managerCountHandle(record,index){
       
              var handlebtn=[];
             if(!record.count){

              record.count = 100;
             }

              handlebtn.push(
                <InputNumber className={styles.inputnumber} min={0} max={Infinity} step={1} formatter={onChangeValueFormatter} onChange = {(e)=>onCountInput(e,index)} value = {record.count/100}/>
              )
         
            return handlebtn;
      }

      function managerOrderNoHandle(record,index){
       
            var orderNo = '';

            if(!record.parentId)
            {
               orderNo = record.orderNo;
            }else{

              orderNo = '备选'
            }
              
         
            return orderNo;
       
      }

      function onPriceDiffInput(e,index){

          if (isNaN(e*100)){
              lstcxx.selectFoodList[index].priceDiff = 0;
          } else{
              lstcxx.selectFoodList[index].priceDiff = e*100;
          }

          dispatch({type: 'lstcxx/updatePayload',payload:{selectFoodList:lstcxx.selectFoodList}});

      }

      function managerPriceDiffHandle(record,index){
            var handlebtn=[];
            
            if(!record.parentId){

               handlebtn.push(<span key={index}> {(record.priceDiff==null)?0:record.priceDiff*100}</span>)
              }else{

                handlebtn.push(<span key={index} >
                     <InputNumber className={styles.inputnumber} min={0} max={Infinity} step={0.01} formatter={onChangeValueFormatter} onChange = {(e)=>onPriceDiffInput(e,index)} value = {(record.priceDiff==null)?0:record.priceDiff/100}/>
                  </span>)
              }

              return handlebtn;

      }
    
     function addOption(record,index){

            var lastEmptyIndex=0;
             lstcxx.selectFoodList.map((i,j)=>{

             if(!i.foodId){
                lastEmptyIndex=j;
             } 
             })


             if(lastEmptyIndex>index){

                //remove lastEmptyIndex
                lstcxx.selectFoodList.splice(lastEmptyIndex, 1);

                lstcxx.selectFoodList.splice(index+1, 0, {priceJson:'0,0,0,0,0',parentId:record.foodId});
                

             }else if(lastEmptyIndex>0){

                  lstcxx.selectFoodList.splice(index+1, 0, {priceJson:'0,0,0,0,0',parentId:record.foodId});


                  //remove lastEmptyIndex
                  lstcxx.selectFoodList.splice(lastEmptyIndex, 1);

             }else {

                  lstcxx.selectFoodList.splice(index+1, 0, {priceJson:'0,0,0,0,0',parentId:record.foodId});
             }


             dispatch({type: 'lstcxx/updatePayload',payload:{selectFoodList:lstcxx.selectFoodList,parentId:record.foodId,orderNo:record.orderNo}});
        }

        function onDelete(index){

         var selectedList = lstcxx.selectFoodList;
      
              if(selectedList.length <= index){
      
                return;
      
              }
      
              //计算当前备选数量
              var backupCount=0;
      
         
              for( var i=index+1;i<selectedList.length;i++){
      
                if(!selectedList[i].parentId){
                  break;
                }
                backupCount++;
              }
              
      
              selectedList.splice(index, backupCount+1);
      
      
              //修正序号，并记录最大序号
                var orderNo=0;
               selectedList.map((i,j)=>{

                 if(!i.parentId){
                    i.orderNo=++orderNo;
                 }else{
                    i.orderNo = orderNo;
                 }
               })

              dispatch({type: 'lstcxx/updatePayload',payload:{selectFoodList:selectedList}});
      
            }

            function onDeleteBackUp(index){

                var selectedList = lstcxx.selectFoodList;

                if(selectedList.length <= index){

                    return;

                }


                selectedList.splice(index,1);


                //修正序号，并记录最大序号
                var orderNo=0;
                selectedList.map((i,j)=>{

                    if(!i.parentId){
                        i.orderNo=++orderNo;
                    }
                })

                dispatch({type: 'lstcxx/updatePayload',payload:{selectFoodList:selectedList}});

            }
            function managerPriceAndSpecHandle(record,index) {

                var handlebtn = [];

                var newFoodPrice = record.priceJson.split(',')[0] / 100 + ',' + record.priceJson.split(',')[1] / 100 + ',' + record.priceJson.split(',')[2] / 100 + ',' + record.priceJson.split(',')[3] / 100 + ',' + record.priceJson.split(',')[4] / 100

                handlebtn.push(<span key={index}>
                        {newFoodPrice}/{record.specName}
                      </span>)

                return handlebtn;
            }
          
           function managerPriceAndSpecHandleRight(record,index){

                var handlebtn=[];

                var newFoodPrice = record.priceJson.split(',')[0]/100 + ',' + record.priceJson.split(',')[1]/100 + ',' + record.priceJson.split(',')[2]/100 + ',' + record.priceJson.split(',')[3]/100 + ',' + record.priceJson.split(',')[4]/100

                    handlebtn.push(<span key={index} >
                        {newFoodPrice}/{record.specName}
                      </span>)
                
                    return handlebtn;

                }


    const columns = [
            
            {
                title: '菜品',
                dataIndex: 'name',
                key: 'name',      
            },
            {
                title: '价格/规格',
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
                title: '菜品',
                dataIndex: 'foodName',
                key: 'foodName',      
            },
            {
                title: '价格/规格',
                dataIndex: 'specName',
                key: 'specName', 
                render: (text, record,index) => ( 
                    managerPriceAndSpecHandleRight(record,index)
                ),       
            },
            {
                title: '差价',
                dataIndex: 'priceDiff',
                key: 'priceDiff',   
                render: (text, record,index) => ( 
                    managerPriceDiffHandle(record,index)
                ),   
            },
            {
                title: '数量',
                dataIndex: 'count',
                key: 'count',    
                render: (text, record,index) => ( 
                    managerCountHandle(record,index)
                ),  
            },{
                title: '操作',
                key: 'operation',
                dataIndex: 'operation',
                render: (text, record,index) => ( 
                    managerHandle(record,index)
                ),
            }
        ];

    
     const rowSelection = {
        
       selectedRowKeys:lstcxx.selectedRowKeys,
       onChange: onSelectChange,
    };

     function onSelectChange(selectedRowKeys,selectedRows){
       dispatch({type: 'lstcxx/updatePayload',payload:{selectedRowKeys:selectedRowKeys,selectedRows:selectedRows}});
    }

    function onAddClick(){

      var selectedList = lstcxx.selectFoodList;

       if (!selectedList) {
        selectedList = []
       }

       var lastEmptyIndex=0;
       selectedList.map((i,j)=>{

       if(!i.foodId){
          lastEmptyIndex=j;
       } 
       })

       

      //检查是否为备选模式
       if(lastEmptyIndex>0){

           
            var insterIndex=lastEmptyIndex;

            

            lstcxx.selectedRows.map((i,j)=>{
            var item = {};
            item.foodId= i.id;
            item.foodName = i.name;
            item.priceJson = i.priceJson;
            item.priceDiff = (i.priceDiff == null)?0:i.priceDiff*100;
            item.specId = i.specId;
            item.specName = i.specName;
            item.orderNo = lstcxx.orderNo;
            item.parentId = lstcxx.parentId;


             selectedList.splice(++insterIndex, 0, item);


          })

          //remove lastEmptyIndex
          selectedList.splice(lastEmptyIndex, 1);

       }else {


            //修正序号，并记录最大序号
            var orderNo=0;
           selectedList.map((i,j)=>{

           if(!i.parentId){
              i.orderNo=++orderNo;
           } 
           })



            //添加记录

            lstcxx.selectedRows.map((i,j)=>{
            var item = {};
            item.orderNo= ++orderNo;
            item.foodId= i.id;
            item.foodName = i.name;
            item.priceJson = i.priceJson;
            item.priceDiff = (i.priceDiff == null)?0:i.priceDiff*100;
            item.parentId  = 0
            item.specId = i.specId;
            item.specName = i.specName;

            selectedList.push(item);


          })

       }

  
     

    
      dispatch({type: 'lstcxx/updatePayload',payload:{selectFoodList:selectedList,selectedRowKeys:[],selectedRows:[]}});

    }

 
    function secondHandleNext(){

             let isEmpty = false;
             lstcxx.selectFoodList&&lstcxx.selectFoodList.length>0&&lstcxx.selectFoodList.map((i,j)=>{

                 if (!i.orderNo){
                     isEmpty = true;
                 }

             })

            if (isEmpty){
                 message.warning('请选择菜品');
                 return;
            }
             dispatch({type: 'lstcxx/updatePayload',payload:{lstcxxDetailVisible:false,selectedRowKeys:[],selectedRows:[]}});

        }

        function secondHandlePrevious(){
          
             dispatch({type: 'lstcxx/updatePayload',payload:{lstcxxDetailVisible:false}});

        }

         function onLeftClick(a){

             dispatch({type: 'lstcxx/updatePayload',payload:{selectCategoryId:a.id}});
             dispatch({type: 'lstcxx/queryFoodByCategory',payload:{id:a.id,selectCategoryId:a.id}});

        }

        function onSearchKeyWord(value){
        

           dispatch({type: 'lstcxx/queryFoodByName',payload:{name:value,  categoryId: 0}});
            

        }

    function handleOk() {

        dispatch({type: 'lstcxx/updatePayload',payload:{lstcxxDetailVisible:false}});
    }

    function onCancelClick(){

        dispatch({type: 'lstcxx/updatePayload',payload:{lstcxxDetailVisible:false,selectedRowKeys:[]}});
    }

    const modalOpts = {
        title:lstcxx.isAdd?"新增套餐信息":"编辑套餐信息",
        visible:lstcxx.lstcxxDetailVisible,
        onOk:handleOk,
        onCancel:onCancelClick,
        currentItem,
        width: '80%',
        footer:null,

    };

    return (
        <Modal  {...modalOpts}>
            <div className={styles.headerblock}>

            <div className={ styles.headerblock } style={{overflow: 'hidden'}}>

             <div style={{overflow: 'hidden',height:'80%'}}>
                 <div style={{width:'40%', float:'left'}}>
                      <div style={{margin: '10px 0'}}>正在新增：价格元，会员价元</div>
                     
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

                      <Table style={{width:'80%', float:'right',height:'380px',overflowY:'auto'}}
                        columns={columns}
                        dataSource={foodList}
                        rowKey={record => record.index}
                        rowSelection={rowSelection}
                        size="small"
                        pagination={false}
                        bordered/>
              
                     </div>
                     
                     
                 </div>
                <Button type="primary" style={{width:'8%', float:'left',padding:'0',position: 'absolute',top: '50%',left: '41%'}} onClick = {onAddClick}>添加</Button>
                 <div style={{width:'50%', float:'right',height:'80%'}}>
                    <div style={{marginTop:'50px',marginBottom: '10px'}}>套餐添加顺序会与收银小票、后厨小票顺序一致</div>
                    <Table style={{height:'380px',overflowY:'auto'}}
                        columns={columnsRight}
                        dataSource={lstcxx.selectFoodList}
                        rowKey={record => record.id}
                        size="small"
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
                  style={{margin: '0 auto',width: "50%",display:'block'}}
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
