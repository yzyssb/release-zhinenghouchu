import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import Select from 'antd/lib/select';
const Option=Select.Option
import Button from 'antd/lib/button';
import Table from 'antd/lib/table';
import Modal from 'antd/lib/modal';
import Form from 'antd/lib/form';
const FormItem=Form.Item
import Checkbox from 'antd/lib/checkbox';
const CheckboxGroup=Checkbox.Group
import Input from 'antd/lib/input';
const {TextArea} = Input
import message from 'antd/lib/message';
import pagination from 'antd/lib/pagination';
import Popover from 'antd/lib/popover';
import Tree from "antd/lib/tree";
import TreeSelect from "antd/lib/tree-select";
const SHOW_PARENT = TreeSelect.SHOW_CHILD;
const Search = Input.Search;
import styles from './TzzxPage.less';
const AddNoticeComponent=({
    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
        setFieldsValue,
    }, 
    dispatch,
    tzzx
})=>{
    function resetFormTimeout(resetFields,dispatch){
        if(resetFields){
            resetFields();
        }
        if(dispatch){
            dispatch({
            type: 'tzzx/updatePayload',
            payload: {
                baseInfoFormRest:0,
            },
          });
        }
    }

    if(tzzx.baseInfoFormRest){
        setTimeout(function(){resetFormTimeout(resetFields,dispatch)},20);
    }

    const formItemLayout={
        labelCol:{span:8},
        wrapperCol:{span:12}
    }

    const Options=[
        {label:'短信通知',value:'1'}
    ]

    function phoneChange(e){
        console.log(e.target.value)
    }

    function saveAction(){
        setFieldsValue({phoneList:tzzx.inputArr})
        const value=getFieldsValue()
        value.messageMethods=value.messageMethods[0]

        if(value.id){
            value.id=+value.id
        }

        console.log(value)

        if (tzzx.messageType == 1){
            if (value.phoneList.length == 0){
                message.warning('请填写手机号');
                return;
            }
            let a=true
            value.phoneList.map((v,i)=>{
                if(!v){
                    message.error('请先填写完手机号')
                    a=false
                    return
                }
                if(!/^1[3-9][0-9]{9}$/.test(v)){
                    message.error('手机号格式不正确')
                    a=false
                    return
                }
            })

            if(a){

                value.brandId=+tzzx.brandId

                dispatch({
                    type:'tzzx/sendManageAddUpdate',
                    payload:value
                })
                dispatch({
                    type:'tzzx/updatePayload',
                    payload:{
                        addNoticeVisible:false,
                        editFroms:{},
                        inputArr:[null]
                    }
                })

            }
        } else {
            if (tzzx.checkedKeys.length == 0){
                message.warning('请选择门店');
                return;
            }

            if (tzzx.roleSelectedRowKeys.length == 0){
                message.warning('请选择通知人');
                return;
            }

            value.brandId=+tzzx.brandId

            dispatch({
                type:'tzzx/sendManageAddUpdate',
                payload:value
            })
            dispatch({
                type:'tzzx/updatePayload',
                payload:{
                    addNoticeVisible:false,
                    editFroms:{},
                    inputArr:[null]
                }
            })
        }



    }

    function onChange(value) {
        dispatch({
            type: "tzzx/updatePayload",
            payload: { checkedKeys: value }
        })
    }

    return(
        <Modal
            width="800px"
            title='添加通知'
            visible={tzzx.addNoticeVisible}
            onCancel={()=>{
                dispatch({
                    type:'tzzx/updatePayload',
                    payload:{
                        addNoticeVisible:false,
                        editFroms:{},
                    }
                })
                resetFields()
            }}
            footer={null}
            destroyOnClose={true}
        >
            <Form style={{maxHeight:500,overflowY:'scroll'}}>
                {Object.keys(tzzx.editFroms).length>0&&(
                    <FormItem {...formItemLayout} label="id" style={{display:'none'}}>
                        {getFieldDecorator('id', {
                            initialValue: tzzx.editFroms.id,
                            rules: [{required: true, message: 'id'}]
                        })(
                            <Input />
                        )}
                    </FormItem>
                )}
                <FormItem {...formItemLayout} label="通知类型">
                    {getFieldDecorator('messageType', {
                        initialValue: tzzx.messageType,
                    })(
                        <Select disabled = {!tzzx.isAdd} onChange = {(e)=>{
                            dispatch({
                                type:'tzzx/updatePayload',
                                payload:{messageType:e}
                            })

                        }}>
                            <Option value="1">估清通知</Option>
                            <Option value="2">预制任务通知</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="通知方式">
                    {getFieldDecorator('messageMethods', {
                        initialValue: ['1'],
                    })(
                        <CheckboxGroup options={Options} />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="通知模板（暂不支持修改）">
                    {getFieldDecorator('messageTemplate', {
                        initialValue: tzzx.messageType == 1?'【小巴扎】售罄通知：xx店 售卖的「 xx 」在 xx时间 设置为售罄，如有问题请及时处理。':'【小巴扎】预制通知：xx店需要预制的「xx、xx、xx」未按照预警时间完成任务，如有问题请及时处理' ,
                    })(
                        <TextArea rows={4} disabled />
                    )}
                </FormItem>
                {tzzx.messageType == 1 && <FormItem {...formItemLayout} label="通知手机号">
                    {getFieldDecorator('phoneList', {
                        initialValue: [],
                    })(
                        <span>
                            {tzzx.inputArr && tzzx.inputArr.length > 0 && tzzx.inputArr.map((v, i) => (
                                <p key={i}>
                                    <Input placeholder="请输入手机号" onChange={e => {
                                        let inputArr = tzzx.inputArr
                                        inputArr[i] = e.target.value
                                        dispatch({
                                            type: 'tzzx/updatePayload',
                                            payload: {
                                                inputArr
                                            }
                                        })
                                    }} value={tzzx.inputArr[i]} style={{width: 280}}/>
                                    &nbsp;&nbsp;&nbsp;<a onClick={() => {
                                    let inputArr = tzzx.inputArr
                                    inputArr.splice(i + 1, 0, null)
                                    dispatch({
                                        type: 'tzzx/updatePayload',
                                        payload: {
                                            inputArr
                                        }
                                    })
                                }}>增加</a>
                                    {tzzx.inputArr.length > 1 && (<span>&nbsp;&nbsp;&nbsp;<a onClick={() => {
                                        let inputArr = tzzx.inputArr
                                        inputArr.splice(i, 1)
                                        dispatch({
                                            type: 'tzzx/updatePayload',
                                            payload: {
                                                inputArr
                                            }
                                        })
                                    }}>移除</a></span>)}
                                </p>
                            ))}
                        </span>
                    )}
                </FormItem>
                }

                {tzzx.messageType==2&&
                    <FormItem {...formItemLayout} label="通知人">
                        {getFieldDecorator('store', {
                            initialValue: [],
                        })(
                            <div>
                                <div>
                                    <Button type='primary' onClick={()=>{
                                        dispatch({
                                            type:'tzzx/updatePayload',
                                            payload:{
                                                modalVisible:true
                                            }
                                        })

                                        dispatch({
                                            type: "tzzx/roleTabData",
                                            payload: { name: "" }
                                        })

                                    }}>选择通知人</Button>
                                </div>
                                <div className={styles.editabletaggroup}>
                                    {tzzx.selectData.length > 0 &&
                                        tzzx.selectData.map(function (item, index) {
                                                return <div key={index} span="6" style={{ padding: "0px 20px 0px 10px", background: '#fafafa', position: "relative", textAlign: "center", border: "1px solid #e8e8e8", display: "inline-block", borderRadius: "5px", margin: "2px 5px",lineHeight:"20px",float:"left" }}>
                                                    <span>{item.name}</span>
                                                    <div onClick={() => {

                                                        let selectData = tzzx.selectData;
                                                        if (selectData.length > 0) {
                                                            selectData.map((i,j)=>{

                                                                if(i.sendPhoneId == item.sendPhoneId){
                                                                    selectData.splice(j,1)
                                                                }
                                                            })
                                                        }

                                                        let selectedRowKeys = tzzx.roleSelectedRowKeys.filter(function (data, index) {
                                                            return data != item.sendPhoneId
                                                        })

                                                        //找到需要删除的那一项
                                                        dispatch({
                                                            type: "tzzx/updatePayload",
                                                            payload: {
                                                                roleSelectedRowKeys:selectedRowKeys,
                                                                selectData:selectData,
                                                            }
                                                        })

                                                    }} style={{ position: "absolute", height: "100%", top: "-5px", right: 0, padding: "5px", cursor: "pointer", color: "#bebcbc", fontSize: "16px" }}>×</div>
                                                </div>
                                        })
                                    }
                                </div>
                            </div>
                        )}
                    </FormItem>
                }
                {tzzx.messageType==2&&
                    <FormItem {...formItemLayout} label="选择门店">
                            <TreeSelect
                                treeData={tzzx.treeData}
                                value={tzzx.checkedKeys}
                                onChange={onChange}
                                treeCheckable={true}
                                showCheckedStrategy={SHOW_PARENT}
                                searchPlaceholder=""
                                style={{ maxHeight: "300px", overflowY: "scroll" }}
                            />
                    </FormItem>
                }
            </Form>

            <div style={{marginTop:20,textAlign:'center'}}>
                <Button style={{marginRight:50}} onClick={()=>{
                    dispatch({
                        type:'tzzx/updatePayload',
                        payload:{
                            addNoticeVisible:false,                            
                            editFroms:{}
                        }
                    })
                    resetFields()
                }}>取消</Button>
                <Button type="primary" onClick={saveAction}>保存</Button>
            </div>
        </Modal>
    )
}

AddNoticeComponent.propTypes = {
    form: PropTypes.object.isRequired
};

const AddNotice = Form.create()(AddNoticeComponent);



function TzzxPage ({menu,dispatch,tzzx}) {

    const HeaderProps = {
        menu,
        dispatch,
    };

    const pagination = {
        total:tzzx.total,
        current:tzzx.current,
        pageSize: tzzx.size,
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger:true,
        onShowSizeChange:SizeChange
    };

    function SizeChange(current, pageSize){
        dispatch({type: 'tzzx/updatePayload',payload:{size:pageSize,current:1,offset:0}});
        dispatch({type: 'tzzx/sendManageQueryByBrandId',payload:{}});

    }

    function onPageChange(pageNo){

        var offset = pageNo * tzzx.size - tzzx.size;
        dispatch({type: 'tzzx/updatePayload', payload: {offset: offset, current: pageNo}});
        dispatch({type: 'tzzx/sendManageQueryByBrandId',payload:{}});
    }

    function editRecord(record){
        let obj1={}
        for(var key in record){
            obj1[key]=record[key]
            if(key=='phoneList'){
                obj1[key]=[]
                if(record[key] && record[key].length>0){
                    record[key].map(v=>{
                        obj1[key].push(v)
                    })
                }
            }
        }

        let newCheckedKeys = [];
        record.sendRestaurants && record.sendRestaurants.map((i)=>{
            newCheckedKeys.push(i.restaurantId);
        })

        let newRoleSelectedRowKeys = [];
        let newSelectData = [];
        record.presetTasks && record.presetTasks.map((i)=>{
            newRoleSelectedRowKeys.push(i.sendPhoneId);
            newSelectData.push({sendPhoneId:i.sendPhoneId,phone:i.phone,brandName:i.brandName,name:i.name,post:i.post,restaurantName:i.nodeName})
        })

        dispatch({
            type:'tzzx/updatePayload',
            payload:{
                isAdd:false,
                messageType:record.messageType+'',
                editFroms:obj1,
                inputArr:obj1.phoneList,
                addNoticeVisible:true,
                checkedKeys:newCheckedKeys,
                roleSelectedRowKeys:newRoleSelectedRowKeys,
                selectData:newSelectData
            }
        })
    }

    const columns=[
        {title:'通知类型',dataIndex:'messageType',key:'messageType',render:(text,record,index)=>(
            <span>{record.messageType==1?'估清通知':'预制任务通知'}</span>
        )},
        {title:'通知人',dataIndex:'phoneList',key:'phoneList',render:(text,record,index)=>{

                let html = [];

                if (record.messageType==1) {
                        html.push(<span key={1}>
                        {record.phoneList?record.phoneList.length:0}人&nbsp;&nbsp;
                            {record.phoneList&&record.phoneList.length>0&&(
                                <a onClick={()=>{
                                    dispatch({
                                        type:'tzzx/updatePayload',
                                        payload:{
                                            phoneList:record.phoneList,
                                            lookNoticerVisible:true
                                        }
                                    })
                                }}>查看</a>
                            )}
                    </span>)
                }else {
                    let list = [];
                    record.presetTasks.map((i)=>{

                        list.push(i.name + '-' +i.phone)
                    })

                    html.push(<span key={2}>
                        {record.presetTasks?record.presetTasks.length:0}人&nbsp;&nbsp;
                        {record.presetTasks&&record.presetTasks.length>0&&(
                            <a onClick={()=>{
                                dispatch({
                                    type:'tzzx/updatePayload',
                                    payload:{
                                        phoneList:list,
                                        lookNoticerVisible:true
                                    }
                                })
                            }}>查看</a>
                        )}
                    </span>)
                }


                return html;
            }
        },
        {title:'通知模板',dataIndex:'messageTemplate',key:'messageTemplate',render:(text,record,index)=>(
            <span>
                {record.messageTemplate?(record.messageTemplate.length>90*window.innerWidth/1920?(<Popover content={record.messageTemplate}>{record.messageTemplate.slice(0,90*window.innerWidth/1920)+'...'}</Popover>):record.messageTemplate):''}
            </span>
        )},
        {title:'操作',dataIndex:'action',key:'action',render:(text,record,index)=>(
            <span>
                <a onClick={()=>editRecord(record)}>编辑</a>
                <span className="ant-divider"></span>
                <a onClick={()=>{
                    dispatch({
                        type:'tzzx/sendManageDeleteById',
                        payload:{
                            id:+record.id
                        }
                    })
                }}>删除</a>
            </span>
        )},
    ]


    function brandIdChange(e){ 
        console.log(e)
        let brandName = '';
        tzzx.brandList.map((i)=>{
            
            if (e == i.key){
                brandName = i.value;
            }
        }) 
        
        dispatch({
            type:'tzzx/updatePayload',
            payload:{
                brandId:+e,
                brandName:brandName,
            }
        })
        dispatch({
            type:'tzzx/sendManageQueryByBrandId',
            payload:{}
        })
    }

    //  角色selectedRowKeys指定选中项的 key 数组
    const roleRowSelection = {
        selectedRowKeys: tzzx.roleSelectedRowKeys, //默认选中项的key值
        onChange: (selectedRowKeys, selectedRows) => {

            let selectData = [];
            console.log(selectedRowKeys)
            selectedRowKeys.map((i)=>{
                console.log(i)
                tzzx.roleAllData.map((j)=>{
                    if (i==j.id){
                        console.log(j.id)
                        selectData.push({sendPhoneId:j.id,phone:j.phone,brandName:j.brandName,name:j.name,post:j.post,restaurantName:j.nodeName});
                    }
                })
            })

            dispatch({
                type: "tzzx/updatePayload",
                payload: { roleSelectedRowKeys: selectedRowKeys,selectData:selectData }
            })
        },

        // getCheckboxProps	选择框的默认属性配置
        getCheckboxProps: record => ({
            // 配置那一项是不能选择的
            // disabled: record.name === 'Disabled User', // Column configuration not to be checked
        }),
    };


    // 角色模块
    const roleColumns = [
        {
            title: '序号',
            dataIndex: 'id',
            key: "id",
            width: 80,

        },
        {
            title: '姓名',
            dataIndex: 'name',
            dataIndex: 'name',
            width: 100,

        },
        {
            title: '手机号',
            dataIndex: 'phone',
            dataIndex: 'phone',
            width: 100,

        },
        {
            title: '品牌名',
            dataIndex: 'brandName',
            dataIndex: 'brandName',
            width: 150,

        },
        {
            title: '门店名',
            dataIndex: 'nodeName',
            dataIndex: 'nodeName',
            width: 150,

        },
        {
            title: '岗位名',
            dataIndex: 'dutyName',
            dataIndex: 'dutyName',
            width: 150,

        }


    ];


    function onChange(value) {
        dispatch({
            type: "tzzx/updatePayload",
            payload: { checkedKeys: value }
        })
    }

    //  查找用户，清除之前选中的数据，重新调取用户列表
    function searchFn(value) {

        dispatch({
            type: "tzzx/roleTabData",
            payload: { name: value }
        })
    }

    return(
        <Header {...HeaderProps}>

            <div>
                请选择品牌：
                <Select style={{minWidth:150,maxWidth:300}} value={String(tzzx.brandId)} onChange={brandIdChange}>
                    {tzzx.brandList.length>0&&tzzx.brandList.map((v,i)=>(
                        <Option key={v.key}>{v.value}</Option>
                    ))}
                </Select>
            </div>
            <div style={{textAlign:'right',marginBottom:15}}>
                <Button type="primary" onClick={()=>{
                    dispatch({
                        type:'tzzx/updatePayload',
                        payload:{
                            isAdd:true,
                            inputArr:[null],
                            messageType:"1",
                            checkedKeys:[],
                            roleSelectedRowKeys:[],
                            addNoticeVisible:true,
                            selectData:[],
                        }
                    })
                }}>添加通知</Button>
            </div>

            <Table 
                columns={columns}
                dataSource={tzzx.list}
                bordered
                pagination={pagination}
                rowKey={record=>record.id}
            />


            <AddNotice dispatch={dispatch} tzzx={tzzx} />

            <Modal
                title='查看通知人'
                visible={tzzx.lookNoticerVisible}
                onCancel={()=>{
                    dispatch({
                        type:'tzzx/updatePayload',
                        payload:{
                            lookNoticerVisible:false,
                        }
                    })
                }}
                footer={null}
            >
                <div style={{height:400,overflowY:'scroll'}}>
                    {tzzx.phoneList.length>0&&tzzx.phoneList.map((v,i)=>(
                        <span key={i}>
                            {i<tzzx.phoneList.length-1?
                                <p key={i} style={{margin:0,borderBottom:'1px solid #ddd',lineHeight:'40px'}}>{v}</p>
                            :
                                <p key={i} style={{margin:0,lineHeight:'40px'}}>{v}</p>
                            }
                        </span>
                    ))}
                </div>
            </Modal>

            <Modal
                title='选择用户'
                visible={tzzx.modalVisible}
                footer={null}
                width={'80%'}
                destroyOnClose={true}
                closable={false}
            >
                <div>
                    <Search
                        style={{ marginBottom: "20px" }}
                        placeholder="请输入姓名进行查找"
                        enterButton="搜索"
                        size="large"
                        onSearch={value => searchFn(value)}
                    />

                    <Table size = 'small'
                           rowSelection={roleRowSelection}
                           columns={roleColumns}
                           rowKey={record => record.id}
                           dataSource={tzzx.roleTabData}
                           bordered />

                    <div style={{ textAlign: "right", marginTop: "15px" }}>
                        <Button type="primary" onClick={()=>{
                            dispatch({
                                type:'tzzx/updatePayload',
                                payload:{
                                    modalVisible:false,
                                }
                            })
                        }}>确定</Button>
                    </div>
                </div>
            </Modal>

        </Header>
    );

}

TzzxPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,tzzx}) {
    return { menu,tzzx };
}

export default connect(mapStateToProps)(TzzxPage);

