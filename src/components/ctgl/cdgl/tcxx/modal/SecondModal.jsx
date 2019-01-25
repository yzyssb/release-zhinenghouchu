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
const Modal = ({
                   visible, onOk, onCancel, currentItem, dispatch, tcxx,cpfl,
                   form: {
                       getFieldDecorator,
                       validateFields,
                       getFieldsValue,
                       resetFields,
                       setFieldsValue,
                       getFieldValue,
                   }
               }) => {

    const formItemLayout = {
        labelCol: {span: 3},
        wrapperCol: {span: 21},
    };

    var foodList = tcxx.foodList;
    foodList.map((i,j)=>{

      i.index = j +1;
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
                style={{border: "1px solid #e8e8e8",borderBottom: "0",backgroundColor: "#fafafa",textAlign: "center",lineHeight:"30px"}}> 
                {a.name} </li>
            )
        })
    }

  
 
    
      function managerHandle(record,index){

      
          var handlebtn=[];

          if(record.orderNo){

           handlebtn.push(<span key={index} ><a onClick={()=>{addOption(record,index)}}>加备选</a>
                 <span className="ant-divider" />
                 <a onClick={() =>{onDelete(index)}}>删除</a>
              </span>)
          }else{

            handlebtn.push(<span key={index} >
                 <a onClick={() =>{onDelete(index)}}>删除</a>
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

          tcxx.selectFoodList[index].count = e * 100;

          dispatch({type: 'tcxx/updatePayload',payload:{selectFoodList:tcxx.selectFoodList}});

      }    
      function managerCountHandle(record,index){
       
              var handlebtn=[];
             if(!record.count){

              record.count = 100;
             }

              handlebtn.push(
                <InputNumber className={styles.inputnumber} min={0} max={Infinity} step={0.01} formatter={onChangeValueFormatter} onChange = {(e)=>onCountInput(e,index)} value = {record.count/100}/>
              )
         
            return handlebtn;
      }

      function managerOrderNoHandle(record,index){
       
            var orderNo = '';

            if(record.orderNo)
            {
               orderNo = record.orderNo;
            }else{

              orderNo = '备选'
            }
              
         
            return orderNo;
       
      }

      function onPriceDiffInput(e,index){
           tcxx.selectFoodList[index].priceDiff = e*100;

          dispatch({type: 'tcxx/updatePayload',payload:{selectFoodList:tcxx.selectFoodList}});

      }

      function managerPriceDiffHandle(record,index){
            var handlebtn=[];
            
            if(record.orderNo){

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
             tcxx.selectFoodList.map((i,j)=>{

             if(!i.foodId){
                lastEmptyIndex=j;
             } 
             })


             if(lastEmptyIndex>index){

                //remove lastEmptyIndex
                tcxx.selectFoodList.splice(lastEmptyIndex, 1);

                tcxx.selectFoodList.splice(index+1, 0, {});
                

             }else if(lastEmptyIndex>0){

                  tcxx.selectFoodList.splice(index+1, 0, {});


                  //remove lastEmptyIndex
                  tcxx.selectFoodList.splice(lastEmptyIndex, 1);

             }else {

                  tcxx.selectFoodList.splice(index+1, 0, {});
             }


             dispatch({type: 'tcxx/updatePayload',payload:{selectFoodList:tcxx.selectFoodList,parentId:record.foodId,orderNo:record.orderNo}});
        }

        function onDelete(index){

         var selectedList = tcxx.selectFoodList;
      
              if(selectedList.length <= index){
      
                return;
      
              }
      
              //计算当前备选数量
              var backupCount=0;
      
         
              for( var i=index+1;i<selectedList.length;i++){
      
                if(selectedList[i].orderNo){
                  break;
                }
                backupCount++;
              }
              
      
              selectedList.splice(index, backupCount+1);
      
      
              //修正序号，并记录最大序号
                var orderNo=0;
               selectedList.map((i,j)=>{
      
                 if(i.orderNo){
                    i.orderNo=++orderNo;
                 } 
               })
                   
              dispatch({type: 'tcxx/updatePayload',payload:{selectFoodList:selectedList}});
      
            }

            function managerPriceAndSpecHandle(record,index){
                var handlebtn=[];
                
                    handlebtn.push(<span key={index} >
                       {record.price/100}/{record.specName}
                      </span>)
                
                  return handlebtn;


                }
          
           function managerPriceAndSpecHandleRight(record,index){
                var handlebtn=[];
                
                    handlebtn.push(<span key={index} >
                       {(record.foodPrice != null)?record.foodPrice/100:0}/{record.specName}
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
        
       selectedRowKeys:tcxx.selectedRowKeys,
       onChange: onSelectChange,
    };

     function onSelectChange(selectedRowKeys,selectedRows){
       dispatch({type: 'tcxx/updatePayload',payload:{selectedRowKeys:selectedRowKeys,selectedRows:selectedRows}});
    }

    function onAddClick(){

      var selectedList = tcxx.selectFoodList;

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

            

            tcxx.selectedRows.map((i,j)=>{
            var item = {};
            item.foodId= i.id;
            item.foodName = i.name;
            item.foodPrice = i.price;
            item.priceDiff = (i.priceDiff == null)?0:i.priceDiff*100;
            item.specId = i.specId;
            item.specName = i.specName;
            item.orderNo = tcxx.orderNo;
            item.parentId = tcxx.parentId;


             selectedList.splice(++insterIndex, 0, item);


          })

          //remove lastEmptyIndex
          selectedList.splice(lastEmptyIndex, 1);

       }else {


            //修正序号，并记录最大序号
            var orderNo=0;
           selectedList.map((i,j)=>{

           if(i.orderNo){
              i.orderNo=++orderNo;
           } 
           })



            //添加记录

            tcxx.selectedRows.map((i,j)=>{
            var item = {};
            item.orderNo= ++orderNo;
            item.foodId= i.id;
            item.foodName = i.name;
            item.foodPrice = i.price;
            item.priceDiff = (i.priceDiff == null)?0:i.priceDiff*100;
            item.parentId  = 0
            item.specId = i.specId;
            item.specName = i.specName;

            selectedList.push(item);


          })

       }

  
     

    
      dispatch({type: 'tcxx/updatePayload',payload:{selectFoodList:selectedList,selectedRowKeys:[]}});

    }

 
    function secondHandleNext(){

            
             dispatch({type: 'tcxx/updatePayload',payload:{currentSteps:2}});

        }

        function secondHandlePrevious(){
          
             dispatch({type: 'tcxx/updatePayload',payload:{currentSteps:0}});

        }

         function onLeftClick(a){

          dispatch({type: 'tcxx/queryFoodByCategory',payload:{id:a.id}});

        }

        function onSearchKeyWord(value){
        

           dispatch({type: 'tcxx/queryFoodByName',payload:{name:value,  categoryId: 0}});
            

        }
    

  

    return (
        <div style={{display: tcxx.currentSteps == 1 ? "block" : "none"}}>
            <div className={styles.headerblock}>
                <div style={{display:tcxx.currentSteps==1?"block":"none",overflow: 'hidden'}}>
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
                        pagination={false}
                        bordered/>
              
                     </div>
                     
                     
                 </div>
                <Button style={{width:'8%', float:'left', margin: '30% 0 0 1%',padding:'0'}} onClick = {onAddClick}>添加</Button>
                 <div style={{width:'50%', float:'right',height:'80%'}}>
                    <div style={{marginTop:'50px',marginBottom: '10px'}}>套餐添加顺序会与收银小票、后厨小票顺序一致</div>
                    <Table

                        columns={columnsRight}
                        dataSource={tcxx.selectFoodList}
                        rowKey={record => record.id}
                        pagination={false}
                        bordered/>
               
                 </div>
             </div>

             
                      

            </div>
            
          </div>
                    
            </div>
            <div style={{overflow:"hidden",padding: "0 30%",marginTop: "20px"}}>
              <Button
                  type="primary"
                  style={{margin: '0 auto',width: "30%",float: "left"}}
                  onClick={secondHandlePrevious}>
                  上一步
              </Button>
              <Button
                  type="primary"
                  style={{margin: '0 auto',width: "30%",float: "right"}}
                  onClick={secondHandleNext}>
                  下一步
              </Button>
            </div>
        </div>

    );
};

Modal.propTypes = {
    visible: PropTypes.any,
    item: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
};

export default Form.create()(Modal);
