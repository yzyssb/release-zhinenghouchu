import Table from 'antd/lib/table';
import Pagination from 'antd/lib/pagination';
import Modal from 'antd/lib/modal';
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import  DatePicker from 'antd/lib/date-picker';
import moment from 'moment';
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
import Tabs from 'antd/lib/tabs';
import Button from 'antd/lib/button';
import styles from './Video_Child.less';
import Input from 'antd/lib/input';

const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
import Radio from 'antd/lib/radio';
import message from "antd/lib/message";
import Form from "antd/lib/form/index";
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
import Checkbox from 'antd/lib/checkbox'
const CheckboxGroup = Checkbox.Group;
import Switch from 'antd/lib/switch'
import TimePicker from 'antd/lib/time-picker';
const Video_Child = ({
    pageNo,
    total,
    current,
    dispatch,
    video,
     form: {
         getFieldDecorator,
         validateFields,
         getFieldsValue,
         resetFields,
         setFieldsValue,
     },
  
}) => {


    const formItemLayout = {
        labelCol: {
            span: 5,
        },
        wrapperCol: {
            span: 16,
        },
    };

    const Options=[];


    video.touchScreenList.map((i)=>{

        Options.push({
            label:i.touchscreenName,
            value:i.id
        })


    })

    function handleSubmit(e) {

        validateFields((errors) => {
                if (!!errors) {
                    return false;
                }

                dispatch({ type: 'video/updatePayload', payload: getFieldsValue() });

                dispatch({ type: 'video/videoSet', payload: {}});

            }
        )}

    function onAdd(){

        var item = {startTime:'00:00',endTime:'00:00'};

        var newPlayTimes = video.playTimes?video.playTimes:[];

        if (newPlayTimes.length < 3){
            newPlayTimes.push(item);
            dispatch({
                type: "video/updatePayload",
                payload: {
                    playTimes: newPlayTimes,
                }
            })
        }else{
            message.warning('最多添加3个时段');
        }



    }


    const format = 'HH:mm';
    var timeChildren = [];
    video.playTimes&&video.playTimes.length >0 &&video.playTimes.map((i,j)=>{

        timeChildren.push(

            <div style={{marginBottom:10}} key = {j}>
                <TimePicker value={moment(i.startTime, format)} onChange = {(time, timeString)=>{

                    let newPlayTimes = video.playTimes;
                    newPlayTimes[j].startTime = timeString;

                    var newTime = [];

                    newPlayTimes.map((i,j)=>{

                        let time = i.startTime + '-' + i.endTime;

                        newTime.push(time);
                    })
                    dispatch({
                        type: "video/updatePayload",
                        payload: {
                            playTimes: newPlayTimes,
                            cpfjf_time:newTime.join(',')
                        }
                    })

                }} format={format} />
                <span>&nbsp;&nbsp;到&nbsp;&nbsp;</span>
                <TimePicker value={moment(i.endTime, format)} format={format} onChange = {(time, timeString)=>{

                    let newPlayTimes = video.playTimes;
                    newPlayTimes[j].endTime = timeString;

                    var newTime = [];

                    newPlayTimes.map((i,j)=>{

                        let time = i.startTime + '-' + i.endTime;

                        newTime.push(time);
                    })

                    dispatch({
                        type: "video/updatePayload",
                        payload: {
                            playTimes: newPlayTimes,
                        }
                    })
                }} />

                <a style={{marginLeft:15,marginRight:15}} onClick={onAdd}>增加</a>

                <a  style = {{display:j == 0?'none':'inline-block' }} onClick = {()=>{

                    let newPlayTimes = video.playTimes;

                    newPlayTimes.splice(j,1);

                    var newTime = [];

                    newPlayTimes.map((i,j)=>{

                        let time = i.startTime + '-' + i.endTime;

                        newTime.push(time);
                    })

                    dispatch({
                        type: "video/updatePayload",
                        payload: {
                            playTimes: newPlayTimes,
                        }
                    })


                }}>删除</a>
            </div>
        );
    })

    return ( 
        <div>


            <div>企业文化视频</div>

            <Form>
                <FormItem
                    {...formItemLayout}
                    label="视频 "

                >

                    <div>视频上传及修改操作请前往连锁运营中的视频管理中</div>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="播放起止时间"

                >
                    {timeChildren}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="播放设备"

                >
                    {getFieldDecorator('playDevice', {
                        initialValue: video.playDevice,
                        rules: [{
                            required: true, message: '请选择适用场景',
                        }]
                    })(
                        <CheckboxGroup options={Options} />
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="循环播放"

                >
                    <Switch checkedChildren="启用" unCheckedChildren="停用" checked = {video.isLoop == 1} onChange = {(e)=>{

                        if (e){
                            dispatch({ type: 'video/updatePayload', payload: {isLoop:1}});
                        } else{
                            dispatch({ type: 'video/updatePayload', payload: {isLoop:0}});
                        }


                    }}/>
                </FormItem>
                <Button type = 'primary' style = {{marginLeft:'25%',marginTop:50}} onClick = {handleSubmit} >保存</Button>
            </Form>


        </div>
    );

};

export default Form.create()(Video_Child);