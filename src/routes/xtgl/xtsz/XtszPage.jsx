import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import Tabs from 'antd/lib/tabs';
const TabPane = Tabs.TabPane;
import styles from './XtszPage.less';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
const FormItem=Form.Item;
import Spin from 'antd/lib/spin';
import Radio from 'antd/lib/radio';
const RadioGroup = Radio.Group;
import Select from 'antd/lib/select';
import Button from 'antd/lib/button';
const Option = Select.Option;


const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
    }

const Registration = ({
    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
    }, dispatch,
    xtszPageConfig
}) => {

  /**收银方式**/
  //系统抹零方式
  function wayChange(e){
    console.log(e)
  }
  //结账是否自动清台
  function cleanTable(e){
    dispatch({
      type:'xtszPageConfig/updatePayload',
      payload:{isAutoCleanTable:e.target.value}
    })
  }
  //连接收银端
  function linkCount(e){
    dispatch({
      type:'xtszPageConfig/updatePayload',
      payload:{isConnectCashier:e.target.value}
    })
  }
  

  //开台后自动进入页面
  function clientHomePage(e){
    dispatch({
      type:'xtszPageConfig/updatePayload',
      payload:{clientHomePageType:e.target.value}
    })
  }
  //临时菜
  function tempFoodChange(e){
    dispatch({
      type:'xtszPageConfig/updatePayload',
      payload:{isTempFoodEnable:e.target.value}
    })
  }
  //自动开台
  function autoOpenTable(e){
    dispatch({
      type:'xtszPageConfig/updatePayload',
      payload:{isAutoOpenTable:e.target.value}
    })
  }


  //开启用餐盒
  function boxChargeChange(e){
    dispatch({
      type:'xtszPageConfig/updatePayload',
      payload:{isUseBoxCharge:e.target.value}
    })
  }
  //餐盒价格
  function boxPriceInput(e){
    console.log(getFieldsValue())

  }
  //可售清单
  function saleListChange(e){
    dispatch({
      type:'xtszPageConfig/updatePayload',
      payload:{isUseSaleList:e.target.value}
    })
  }

    //POS收银
    function posChange(e){
        dispatch({
            type:'xtszPageConfig/updatePayload',
            payload:{isOpenPos:e.target.value}
        })
    }

  function saveAction(){
    const value=getFieldsValue()
    validateFields((errors) => {
      if (!!errors) {
        return false;
      }
      dispatch({
        type:'xtszPageConfig/saveAction',
        payload:{boxCharge:Number(getFieldsValue().boxCharge)}
      })
    });
  }

  function resetAction(){
    dispatch({
      type:'xtszPageConfig/updatePayload',
      payload:{isReset:true}
    })
    setTimeout(()=>{
      dispatch({
        type:'xtszPageConfig/updatePayload',
        payload:{isReset:false}
      })
    },20)
    dispatch({
      type:'xtszPageConfig/resetAction',
      payload:{}
    })
  }
  
  
  return(
      <Form>
        <Spin spinning={xtszPageConfig.loading} style={{position:'absolute',left:'50%',marginTop:'200px',zIndex:'99'}} size="large" />
        <div className={styles.header}>收银方式</div>
        <FormItem {...formItemLayout} label="系统抹零方式">
          <Select value={String(xtszPageConfig.wipeType)} style={{width:200}} onChange={wayChange}>
            <Option value="1">去零头到元</Option>
          </Select>
        </FormItem>
        <FormItem {...formItemLayout} label="结账是否自动清台">
          <RadioGroup onChange={cleanTable} value={String(xtszPageConfig.isAutoCleanTable)}>
            <Radio value="1">清台</Radio>
            <Radio value="2">不清台</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem {...formItemLayout} label="连接收银端">
          <RadioGroup onChange={linkCount} value={String(xtszPageConfig.isConnectCashier)}>
            <Radio value="1">连接</Radio>
            <Radio value="2">不连接</Radio>
          </RadioGroup>
        </FormItem>


        <div className={styles.header}>点餐设置</div>
        <FormItem {...formItemLayout} label="开台后自动进入页面">
          <RadioGroup onChange={clientHomePage} value={String(xtszPageConfig.clientHomePageType)}>
            <Radio value="1">开启</Radio>
            <Radio value="2">关闭</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem {...formItemLayout} label="临时菜">
          <RadioGroup onChange={tempFoodChange} value={String(xtszPageConfig.isTempFoodEnable)}>
            <Radio value="1">开启</Radio>
            <Radio value="2">关闭</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem {...formItemLayout} label="自动开台">
          <RadioGroup onChange={autoOpenTable} value={String(xtszPageConfig.isAutoOpenTable)}>
            <Radio value="1">开启</Radio>
            <Radio value="2">关闭</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem {...formItemLayout} label="开启用餐盒 ">
          <RadioGroup onChange={boxChargeChange} value={String(xtszPageConfig.isUseBoxCharge)}>
            <Radio value="1">开启</Radio>
            <Radio value="2">关闭</Radio>
          </RadioGroup>
        </FormItem>
        {(xtszPageConfig.isUseBoxCharge==1&&!xtszPageConfig.isReset||xtszPageConfig.isUseBoxCharge=='1'&&!xtszPageConfig.isReset)&&(
          <FormItem {...formItemLayout} label="餐盒价钱">
            {getFieldDecorator('boxCharge', {
              initialValue:xtszPageConfig.boxCharge,
              rules: [{
                required: true, message: '请输入餐盒价钱',
              },{pattern:/^[0-9]+([.]{1}[0-9]+){0,1}$/, message: '请输入正确格式'}],
            })(
                <Input style={{width:200}}  onChange={boxPriceInput} />
              )
            }
          </FormItem>
        )}


        <div className={styles.header}>其他设置</div>
        <FormItem {...formItemLayout} label="可售清单">
          <RadioGroup onChange={saleListChange} value={String(xtszPageConfig.isUseSaleList)}>
            <Radio value="1">开启</Radio>
            <Radio value="2">关闭</Radio>
          </RadioGroup>
        </FormItem>

          <FormItem {...formItemLayout} label="POS收银">
              <RadioGroup onChange={posChange} value={String(xtszPageConfig.isOpenPos)}>
                  <Radio value="1">开启</Radio>
                  <Radio value="2">关闭</Radio>
              </RadioGroup>
          </FormItem>


        <div style={{marginLeft:'10%',marginBottom:100,marginTop:50}}>
          <Button type="primary" size="large" style={{marginLeft:30}} onClick={saveAction}>保存</Button>
          <Button size="large" style={{marginLeft:30}} onClick={resetAction}>恢复初始化</Button>
        </div>
      </Form>
  )
  
}
Registration.propTypes = {
    form: PropTypes.object.isRequired
};

const RegistrationForm = Form.create()(Registration);


function XtszPage ({menu,dispatch,xtszPageConfig}) {
    const HeaderProps = {
        menu,
        dispatch,
    };

    const formProps={
      xtszPageConfig,
      dispatch
    }

    return(
      <Header {...HeaderProps}>
        <div>
          <div>
            <RegistrationForm {...formProps} />
          </div>
        </div>
      </Header>
    );

}

XtszPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,xtszPageConfig }) {
    return { menu,xtszPageConfig };
}

export default connect(mapStateToProps)(XtszPage);

