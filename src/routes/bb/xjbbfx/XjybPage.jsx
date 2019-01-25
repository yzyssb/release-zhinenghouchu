import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import Form from 'antd/lib/form';
const FormItem = Form.Item;
import Checkbox from 'antd/lib/checkbox';
import Input from 'antd/lib/input';
import Row from 'antd/lib/row';
import Col  from 'antd/lib/col';
import Spin from 'antd/lib/spin';
import moment from 'moment';
import DatePicker from 'antd/lib/date-picker';
const { MonthPicker } = DatePicker;
const RangePicker = DatePicker.RangePicker;
import Button from 'antd/lib/button';
import Table from 'antd/lib/table';
import Select from 'antd/lib/select';
const Option=Select.Option
import Tabs from 'antd/lib/tabs';
const TabPane = Tabs.TabPane;
import Tree from 'antd/lib/tree';
const TreeNode = Tree.TreeNode;
const { TextArea } = Input;
import common from '../common.less';


const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 10 },
    }

const Registration = ({
    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
        setFieldsValue
    },
    xjyb,
    dispatch
}) => {
    function resetFormTimeout(resetFields,dispatch){
        if(resetFields){
            resetFields();
        }
        if(dispatch){
            dispatch({
            type: 'xjyb/updatePayload',
            payload: {
                baseInfoFormRest:0,
            },
          });
        }
    }

    if(xjyb.baseInfoFormRest){
        setTimeout(function(){resetFormTimeout(resetFields,dispatch)},20);
    }

    function confirmAction(){
        let value=getFieldsValue()
        console.log(value)
        validateFields((errors) => {
            if (!!errors) {
                return false;
            }
            xjyb.restaurantList.map((v,i)=>{
                if(v.id==value.restaurantId){
                    value.restaurantName=v.name
                }
            })

            value.targetTime=moment(new Date(value.targetTime)).format('YYYY-MM-01 00:00:00')

            if(xjyb.id){
                dispatch({
                    type:'xjyb/financeMonthIn',
                    payload:{
                        id:xjyb.id,
                        restaurantId:+value.restaurantId,
                        restaurantName:value.restaurantName,
                        endStock:!value.endStock?0:parseInt(value.endStock*100),
                        fixed:!value.fixed?0:parseInt(value.fixed*100),
                        mark:!value.mark?'':value.mark,
                        realProfit:!value.realProfit?0:parseInt(value.realProfit*100),
                        risk:!value.risk?0:parseInt(value.risk*100),
                        startStock:!value.startStock?0:parseInt(value.startStock*100),
                        targetTime:new Date(value.targetTime).getTime()
                    }
                })
            }else{
                dispatch({
                    type:'xjyb/financeMonthIn',
                    payload:{
                        restaurantId:+value.restaurantId,
                        restaurantName:value.restaurantName,
                        endStock:!value.endStock?0:parseInt(value.endStock*100),
                        fixed:!value.fixed?0:parseInt(value.fixed*100),
                        mark:!value.mark?'':value.mark,
                        realProfit:!value.realProfit?0:parseInt(value.realProfit*100),
                        risk:!value.risk?0:parseInt(value.risk*100),
                        startStock:!value.startStock?0:parseInt(value.startStock*100),
                        targetTime:new Date(value.targetTime).getTime()
                    }
                })
            }
            
        }); 
    }

    function cancelAction(){
        dispatch(routerRedux.push({
            pathname: '/xjbbInfo',
            query: {tab:2}
        }));
    }

    return(
        <Form>
            <Spin spinning={xjyb.loading} style={{position:'absolute',width:'calc(1200px - 50px)',height:'calc(100% - 70px)',paddingTop:'300px',zIndex:'99'}} size="large" />
            <div style={{padding:10,backgroundColor:'#eee',marginBottom:10}}>录入月报</div>
            <div style={{margin:"20px 0 20px 20px"}}>
                <FormItem {...formItemLayout} label="餐厅">
                    {getFieldDecorator('restaurantId', {
                        initialValue: xjyb.get_restaurantId?String(xjyb.get_restaurantId):xjyb.restaurantList.length==1?String(xjyb.restaurantList[0].id):'-1',
                        rules: [
                            {required: true, message: '请选择餐厅'},
                            {pattern:/^[0-9]+$/, message: '请选择餐厅'}
                        ],
                    })(
                        <Select style={{width:400}} disabled={xjyb.get_restaurantId?true:false}>
                            <Option key="-1">请选择餐厅</Option>
                            {xjyb.restaurantList.length>0&&xjyb.restaurantList.map((v,i)=>(
                                <Option key={String(v.id)}>{v.name}</Option>
                            ))}
                        </Select>
                        
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="年月">
                    {getFieldDecorator('targetTime', {
                        initialValue: xjyb.get_targetTime?moment(new Date(+xjyb.get_targetTime), 'YYYY-MM'):moment(new Date(+xjyb.targetTime), 'YYYY-MM'),
                        rules: [
                            {required: true, message: '请输入年月'},
                        ],
                    })(
                        <MonthPicker allowClear={false} disabled={xjyb.get_targetTime?true:false} format="YYYY-MM" style={{width:400}} />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="净利润（权责发生制）">
                    {getFieldDecorator('realProfit', {
                        initialValue: !xjyb.id?'':!xjyb.realProfit?0:xjyb.realProfit
                    })(
                        <Input style={{width:400}} addonAfter="万元" />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="不可动用资金（待支付款项）">
                    {getFieldDecorator('fixed', {
                        initialValue: !xjyb.id?'':!xjyb.fixed?0:xjyb.fixed
                    })(
                        <Input style={{width:400}} addonAfter="万元" />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="保底风险金">
                    {getFieldDecorator('risk', {
                        initialValue: !xjyb.id?'':!xjyb.risk?0:xjyb.risk
                    })(
                        <Input style={{width:400}} addonAfter="万元" />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="期初库存">
                    {getFieldDecorator('startStock', {
                        initialValue: !xjyb.id?'':!xjyb.startStock?0:xjyb.startStock
                    })(
                        <Input style={{width:400}} addonAfter="万元" />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="期末库存">
                    {getFieldDecorator('endStock', {
                        initialValue: !xjyb.id?'':!xjyb.endStock?0:xjyb.endStock
                    })(
                        <Input style={{width:400}} addonAfter="万元" />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="备注">
                    {getFieldDecorator('mark', {
                        initialValue: !xjyb.id?'':!xjyb.mark?'':xjyb.mark
                    })(
                        <TextArea rows={4} style={{width:400}} maxLength={200} />
                    )}
                    <div style={{color:'#999'}}>备注字数不可超过200个</div>
                </FormItem>
            </div>
            <div style={{padding:'50px 0'}}>
                <Button type="primary" style={{marginLeft:'30%'}} onClick={confirmAction}>确定</Button>
                <Button style={{marginLeft:100}} onClick={cancelAction}>取消</Button>
            </div>
        </Form>
    )
    
}
Registration.propTypes = {
    form: PropTypes.object.isRequired
};

const RegistrationForm = Form.create()(Registration);

function XjybPage ({menu,dispatch,xjyb}) {
    const HeaderProps = {
        menu,
        dispatch,
    };

    function jump(href){
        dispatch(routerRedux.push({
            pathname: href,
            query: {}
        }));
    }

    const BaseInfoProps = {
        xjyb,
        dispatch
    };
    
    return(
      <Header {...HeaderProps}>
        <RegistrationForm {...BaseInfoProps} />
      </Header>
    );

}

XjybPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,xjyb}) {
    return { menu,xjyb };
}

export default connect(mapStateToProps)(XjybPage);

