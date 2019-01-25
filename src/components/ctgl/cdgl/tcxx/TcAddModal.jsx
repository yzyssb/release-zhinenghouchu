import React, { PropTypes } from 'react';

import Modal from 'antd/lib/modal';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import DatePicker from 'antd/lib/date-picker';
import styles from './TcAddModal.less';
const FormItem = Form.Item;
import Steps from 'antd/lib/steps';
const Step = Steps.Step;
const RangePicker = DatePicker.RangePicker;
import moment from 'moment';
import Radio from 'antd/lib/radio';
const RadioGroup = Radio.Group;
import Table from 'antd/lib/table';
import UpLoadImage from '../../../../components/base/common/UpLoadPicture';
import Rate  from 'antd/lib/rate';
import Checkbox from 'antd/lib/checkbox';
import FirstModal from "./modal/FirstModal";
import SecondModal from "./modal/SecondModal";
import ThridModal from "./modal/ThirdModal";
import Row from 'antd/lib/row';


const CpAddModal = ({

  visible,
  onOk,
  onCancel,
  currentItem,
  dispatch,
  cdgl,
  tcxx,
  cpxx,
  cpfl,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  }
}) => {
  
 const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
    };
 
  function handleOk() {
      
    
    dispatch({type: 'tcxx/updatePayload',payload:{currentSteps:0}});
  
  }

  function onLeftClick(a){

    dispatch({type: 'tcxx/queryFoodByCategory',payload:{id:a.id}});

  }
  
  var children = []; 

  var cpflList = {...cpfl.list};
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
        < li key = {a.id} style={{height:'30px',lineHeight:'30px'}} onClick = {() => {onLeftClick(a)}}> 
          {a.name} 
        < /li>);
    })
  }

  const modalOpts = {
    title:tcxx.isAdd?"新增套餐信息":"编辑套餐信息",
    visible,
    onOk:handleOk,
    onCancel,
    currentItem,
    width: '80%',
    footer:null,
    afterClose:()=>resetFields()
        
   
  };

      const modalProps = {
        cpfl,
        tcxx,
        dispatch,
    };



        function firstHandleNext(){
          
             dispatch({type: 'tcxx/updatePayload',payload:{currentSteps:1}});

        }

        

        function secondHandleNext(){
          
             dispatch({type: 'tcxx/updatePayload',payload:{currentSteps:2}});

        }

        function secondHandlePrevious(){
          
             dispatch({type: 'tcxx/updatePayload',payload:{currentSteps:0}});

        }

        function thirdHandleNext(){
          
             dispatch({type: 'tcxx/updatePayload',payload:{currentSteps:3}});
             dispatch({type: 'tcxx/queryFoodComboAdd',payload:{}});

        }

        function thirdHandlePrevious(){
          
             dispatch({type: 'tcxx/updatePayload',payload:{currentSteps:1}});

        }

        

        function fourHandlePrevious(){
          
             dispatch({type: 'tcxx/updatePayload',payload:{modalVisible:false}});
             dispatch({type: 'tcxx/updatePayload',payload:{currentSteps:0}});

             resetFields();

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


             dispatch({type: 'tcxx/updatePayload',payload:{selectFoodList:tcxx.selectFoodList,parentId:record.id}});
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

      function managerCountHandle(record,index){
       
              var handlebtn=[];
           
              handlebtn.push(
                <Input />
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

      function managerPriceDiffHandle(record,index){
            var handlebtn=[];
            if(record.orderNo){

               handlebtn.push(<span key={index}> {record.priceDiff}</span>)
              }else{

                handlebtn.push(<span key={index} >
                     <Input/>
                  </span>)
              }

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
            item.priceDiff = i.priceDiff;
            item.specId = i.specId;
            item.specName = i.specName;

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
            item.priceDiff = i.priceDiff;
            item.parentId  = 0
            item.specId = i.specId;
            item.specName = i.specName;

            selectedList.push(item);


          })

       }

  
     

    
      dispatch({type: 'tcxx/updatePayload',payload:{selectFoodList:selectedList,selectedRowKeys:[]}});

    }

    //处理商品图片
  function onImgChange(e) {
       
      if(e.previewImage &&e.previewImage.length>0 && e.previewImage[0].response && e.previewImage[0].response.data){
          tcxx.food.imgUrl  = e.previewImage[0].response.data;
          dispatch({type: 'tcxx/updatePayload',payload:{food:tcxx.food}});
      }
        
  };

  function onImgRemove(e) {

        tcxx.food.imgUrl  = "";
        dispatch({type: 'tcxx/updatePayload',payload:{food:tcxx.food}});
  };

  return (
    <Modal style={{height:"600px",overflowY:"auto",paddingBottom:"0"}} {...modalOpts} key={tcxx.modalKey} afterClose={() => {
            // !!!!
            document.getElementById("firstForm").reset();
            document.getElementById("thirdForm").reset();
            dispatch({
                type: 'tcxx/updatePayload', payload: {
                    modalKey: Date.now(),
                    currentSteps: 0,
                    
                    food: {}
                }
            });
        }}>
      

    <div className={styles.pay}>
        <Steps current={tcxx.currentSteps} style={{padding:"0 10px",marginBottom:"30px"}}>
          <Step title="基本信息" description="" />
          <Step title="套餐明细" description="" />
          <Step title="其他配置" description="" />
          <Step title="添加成功" description="" />
        </Steps>

         <FirstModal {...modalProps}    />
         <SecondModal {...modalProps}    />
         <ThridModal {...modalProps}    />
        
         <div style={{display: tcxx.currentSteps == 3 ? "block" : "none", textAlign: "center",fontSize:"20px",marginTop:"40px"}}>
                    <div className={styles.headerblock}>
                        <Row>操作成功！</Row>
                    </div>
                    
                    <div style={{overflow:"hidden",padding: "0 30%",marginTop: "50px"}}>
                      <Button
                          type="primary"
                          style={{width: "30%",display:"block",margin: "0 auto"}}
                          onClick={() => {
                              dispatch({type: 'tcxx/updatePayload', payload: {modalVisible: false}});
                          }}>
                          确定
                      </Button>
                    </div>
                </div>

       
    </div>
    </Modal>
  );
};

CpAddModal.propTypes = {
  visible: PropTypes.any,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Form.create()(CpAddModal);
  