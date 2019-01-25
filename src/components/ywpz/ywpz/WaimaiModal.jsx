import React, { PropTypes } from 'react';

import Modal from 'antd/lib/modal';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import InputNumber from 'antd/lib/input-number';
import Select from 'antd/lib/select';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import DatePicker from 'antd/lib/date-picker';
import styles from './WaimaiModal.less';
const FormItem = Form.Item;

const RangePicker = DatePicker.RangePicker;
import moment from 'moment';
import Table from 'antd/lib/table';
import Popconfirm from 'antd/lib/popconfirm';
import TimePicker from 'antd/lib/time-picker';
import message from "antd/lib/message";
const WaimaiModal = ({
                         ywpz, dispatch,

}) => {

  function handleOk() {

      if (ywpz.time == 0 ){

          message.warning('配置时间必须大于0');

          return

      }
      var isFalse = false;

      ywpz.newDistributionAreas.map((i)=>{

          if (!i.areaName){

              isFalse = true;

          }

      })

      if (isFalse){
          message.warning('配送地址不能为空');
          return;

      }

      var isRepeat = false;

      var newArray = [];

      ywpz.newDistributionAreas.map((i)=>{

          newArray.push(i.areaName);
      })

      newArray.sort();
      for (var i=0;i<newArray.length;i++) {

          if (newArray[i] == newArray[i + 1]) {

              isRepeat = true;
          }

      }

      if (isRepeat){
          message.warning('配送地址不能重复');
          return;

      }


      if (ywpz.id==0){
          dispatch({
              type: 'ywpz/zyTakeoutAddConfig',
              payload:{

              }
          });
      }else {
          dispatch({
              type: 'ywpz/zyTakeoutUpdateConfig',
              payload:{

              }
          });
      }

  
  }

  function cancel(){
      dispatch({
          type: 'ywpz/updatePayload',
          payload:{
              modalVisible:false
          }
      });

  }
  
  const modalOpts = {
    title:"自营外送配置",
    visible:ywpz.modalVisible,
    onOk:handleOk,
    onCancel:cancel,
    okText:"确定",
    cancelText:"取消",
    destroyOnClose:true,
    width:'50%',
  };

    function onAdd(){

        var item = {startTime:'00:00',endTime:'00:00'};

        var newTimePeiods = ywpz.timePeiods?ywpz.timePeiods:[];

        if (newTimePeiods.length < 3){
            newTimePeiods.push(item);
            dispatch({
                type: "ywpz/updatePayload",
                payload: {
                    timePeiods: newTimePeiods,
                }
            })
        }else{
            message.warning('最多添加3个时段');
        }



    }


    const format = 'HH:mm';
    var timeChildren = [];
    ywpz.timePeiods&&ywpz.timePeiods.length >0 &&ywpz.timePeiods.map((i,j)=>{

        timeChildren.push(

            <div style={{marginBottom:10}} key = {j}>
                <TimePicker value={moment(i.startTime, format)} onChange = {(time, timeString)=>{

                    let newTimePeiods = ywpz.timePeiods;
                    newTimePeiods[j].startTime = timeString;

                    var newTime = [];

                    newTimePeiods.map((i,j)=>{

                        let time = i.startTime + '-' + i.endTime;

                        newTime.push(time);
                    })
                    dispatch({
                        type: "ywpz/updatePayload",
                        payload: {
                            timePeiods: newTimePeiods,
                            cpfjf_time:newTime.join(',')
                        }
                    })

                }} format={format} />
                <span>&nbsp;&nbsp;到&nbsp;&nbsp;</span>
                <TimePicker value={moment(i.endTime, format)} format={format} onChange = {(time, timeString)=>{

                    let newTimePeiods = ywpz.timePeiods;
                    newTimePeiods[j].endTime = timeString;

                    var newTime = [];

                    newTimePeiods.map((i,j)=>{

                        let time = i.startTime + '-' + i.endTime;

                        newTime.push(time);
                    })

                    dispatch({
                        type: "ywpz/updatePayload",
                        payload: {
                            timePeiods: newTimePeiods,
                            cpfjf_time:newTime.join(',')
                        }
                    })
                }} />

                <a style={{marginLeft:15,marginRight:15}} onClick={onAdd}>增加</a>

                <a  style = {{display:j == 0?'none':'inline-block' }} onClick = {()=>{

                    let newTimePeiods = ywpz.timePeiods;

                    newTimePeiods.splice(j,1);

                    var newTime = [];

                    newTimePeiods.map((i,j)=>{

                        let time = i.startTime + '-' + i.endTime;

                        newTime.push(time);
                    })

                    dispatch({
                        type: "ywpz/updatePayload",
                        payload: {
                            timePeiods: newTimePeiods,
                            cpfjf_time:newTime.join(',')
                        }
                    })


                }}>删除</a>
            </div>
        );
    })

    function isInteger(obj) {
        return obj%1 === 0
    }


    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
            render: (text, record,index) => {

                return '区域' + (index + 1);
            }
        },{
            title: '区域名称',
            dataIndex: 'areaName',
            key: 'areaName',
            render: (text, record,index) => {

                return <Input maxLength={30} value = {record.areaName} onChange = {(e)=>{

                    let newDistributionAreas = ywpz.newDistributionAreas;

                    newDistributionAreas[index].areaName = e.target.value;

                    dispatch({
                        type: 'ywpz/updatePayload',
                        payload:{
                            newDistributionAreas:newDistributionAreas,
                        }
                    });

                    }
                }/>
            }
        },{
            title: '配送费',
            dataIndex: 'takeMoney',
            key: 'takeMoney',
            render: (text, record,index) => {
                return <InputNumber style = {{width:'80px',marginLeft:10}} min={0} max={Infinity} step={1} value = {record.takeMoney/100} onChange = {(e)=>{


                    if (isInteger(e)){

                        let newDistributionAreas = ywpz.newDistributionAreas;

                        newDistributionAreas[index].takeMoney = Number(e)*100;

                        dispatch({
                            type: 'ywpz/updatePayload',
                            payload:{
                                newDistributionAreas:newDistributionAreas,
                            }
                        });
                    }


                }}>
                </InputNumber>
            }
        },{
            title: '免配送费金额',
            dataIndex: 'targetMoney',
            key: 'targetMoney',
            render: (text, record,index) => {
                return <InputNumber style = {{width:'80px',marginLeft:10}} min={0} max={Infinity} step={1} value = {record.targetMoney/100} onChange = {(e)=>{


                    if (isInteger(e)){

                        let newDistributionAreas = ywpz.newDistributionAreas;

                        newDistributionAreas[index].targetMoney = Number(e)*100;

                        dispatch({
                            type: 'ywpz/updatePayload',
                            payload:{
                                newDistributionAreas:newDistributionAreas,
                            }
                        });
                    }


                }}>
                </InputNumber>
            }
        },{
            title: '操作',
            key: 'operation',
            dataIndex: 'operation',
            render: (text, record,index) => {
                var handlebtn=[];

                handlebtn.push(<span key={index} ><a onClick={()=>{

                    let newDistributionAreas = ywpz.newDistributionAreas;

                    newDistributionAreas.push({
                        "areaName": "",
                        "takeMoney": 0,
                        "targetMoney": 0,
                        "type":1,
                    });

                    dispatch({
                        type: 'ywpz/updatePayload',
                        payload:{
                            newDistributionAreas:newDistributionAreas,
                        }
                    });


                }}>增加</a>
                <span className="ant-divider" />
                <Popconfirm okText="确定" cancelText="取消" title="确定要删除吗？" onConfirm={() =>{
                    let newDistributionAreas = ywpz.newDistributionAreas;

                     newDistributionAreas.splice(index,1);

                    dispatch({
                        type: 'ywpz/updatePayload',
                        payload:{
                            newDistributionAreas:newDistributionAreas,
                        }
                    });

                }}>
                    <a style = {{display:index == 0?'none':'inline-block' }} >删除</a>
                </Popconfirm>

                </span>)

                return handlebtn;
            }
        }
    ];

  return (
    <Modal {...modalOpts} >

        <div>
            <span>基本配置</span>
            <div style={{width:'100%',height:'1px',margin:'10px auto',padding:'0px',backgroundColor:'#D5D5D5',overflow:'hidden'}}></div>
            <div>
                <div style={{marginTop:30,marginLeft:50}}>
                    <span>自营外送时段</span>

                    <div style={{marginLeft:65,marginTop:10}}>

                        {timeChildren}
                    </div>

                    <div style={{marginTop:30}}>
                        <span>起送金额</span>
                        <InputNumber style = {{width:'200px',marginLeft:10}} min={0} max={Infinity} step={1} value = {ywpz.startMoney/100} onChange = {(e)=>{


                            if (isInteger(e)){

                                dispatch({
                                    type: 'ywpz/updatePayload',
                                    payload:{
                                        startMoney:Number(e) *100,
                                    }
                                });
                            }


                        }}>
                        </InputNumber>&nbsp;&nbsp;元

                    </div>
                    <div style={{marginTop:30}}>
                        <span>配送时间</span>
                        <InputNumber style = {{width:'200px',marginLeft:10}} min={0} max={Infinity} step={1} value = {ywpz.time} onChange = {(e)=>{


                            if (isInteger(e)){

                                dispatch({
                                    type: 'ywpz/updatePayload',
                                    payload:{
                                        time:Number(e),
                                    }
                                });
                            }


                        }}>
                        </InputNumber>&nbsp;&nbsp;分钟
                    </div>
                </div>

                <div style={{marginTop:30}}>
                    <span >配送区域</span>
                    <div style={{width:'100%',height:'1px',margin:'10px auto',padding:'0px',backgroundColor:'#D5D5D5',overflow:'hidden'}}></div>
                    <Table style = {{marginTop:30}}
                           columns={columns}
                           dataSource={ywpz.newDistributionAreas}
                           pagination={false}
                           bordered/>
                </div>
            </div>


        </div>

    </Modal>
  );
};

WaimaiModal.propTypes = {
  visible: PropTypes.any,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Form.create()(WaimaiModal);
