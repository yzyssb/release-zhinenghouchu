import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import Table from 'antd/lib/table';
import Icon from 'antd/lib/icon';
import Tabs from 'antd/lib/tabs';
import Button from 'antd/lib/button';
const TabPane = Tabs.TabPane;

import Spin from 'antd/lib/spin';

import styles from './CpbjEditPage.less';

import DatePicker from 'antd/lib/date-picker';
import Form from 'antd/lib/form';
const FormItem=Form.Item
import Select from 'antd/lib/select';
import Input from 'antd/lib/input';
import Switch from 'antd/lib/switch';
const Option = Select.Option;
const MonthPicker = DatePicker.MonthPicker;
const RangePicker = DatePicker.RangePicker;


const Registration = ({
 
    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
    }, dispatch,
}) => {


    const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 6 },
    };


    const formItemLayoutDataPicker = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    };

    const rangeConfig = {
        rules: [{ type: 'array', required: true, message: '请选择起止时间!' }],
    };

    const SwitchLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    };

    const DescriptionLayout={
      labelCol: { span: 4 },
      wrapperCol: { span: 12 },
    }


    function changeActivityName(e){
        console.log(e.target.value)

        dispatch({
            type: 'cpbjPageConfig/updatePayload',
            payload: { activityName: e.target.value }
        });
    }

    function changeStatus(e){
      console.log(e)
      dispatch({
            type: 'cpbjPageConfig/updatePayload',
            payload: { isChecked: e }
        });
    }
    return (
        <Form horizontal>
            <Form.Item
                {...formItemLayout}
                label="活动名称"
                >
                {getFieldDecorator('activityName', {
                    initialValue: '',
                    rules: [ {
                        required: true, message: '请输入活动名称',
                    }],
                })(
                    <Input onChange={changeActivityName} />
                )}
            </Form.Item>
            <FormItem
                {...formItemLayoutDataPicker}
                label="活动日期"
            >
                {getFieldDecorator('range-time-picker', rangeConfig)(
                    <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                )}
            </FormItem>
            <FormItem
                {...SwitchLayout}
                label="活动状态"
            >
                <Switch defaultChecked onChange={changeStatus} />
            </FormItem>
            <FormItem
                {...DescriptionLayout}
                label="活动描述"
            >
                <Input type="textarea" placeholder="Autosize height based on content lines" autosize />
            </FormItem>

        </Form>
    );

}
Registration.propTypes = {
    form: PropTypes.object.isRequired,
    onSearch: PropTypes.func,
    onAdd: PropTypes.func,
    field: PropTypes.string,
    keyword: PropTypes.string,
};

const RegistrationForm = Form.create()(Registration);



function CpbjAddPage({ menu, cpbjPageConfig,cpbjSetting, dispatch }) {
  const {
       baseInfo,baseInfoFormRest,loading
    } = cpbjSetting;

  const HeaderProps = {
    menu,
    dispatch,
  };

  const BaseInfoProps = {
        baseInfo,
        dispatch,
        baseInfoFormRest
    };


  const dataSource = [
    {
      key: '1',
      editBtns: '',
      duration:'全周',
      start_tm: '00:00',
      end_tm:'24:00',
      name:'',
      price:'0.00',
      activity_price:'0.00',
      member_price:'0.00'
    }
  ];

  const columns = [
    {
      title: '',
      dataIndex: 'key',
      key: 'key'
    }, 
    {
      title: '',
      dataIndex: 'editBtns',
      key: 'editBtns',
      render: (text, record,index) => {
        if(dataSource.length==1){
          return (
            <span key={index}>
              <a onClick={()=>add(text, record,index)}><Icon type="plus" /></a>
            </span>
          )
        }else if(dataSource.length>1){
          return (
            <span key={index}>
              <a onClick={()=>add(text, record,index)}><Icon type="plus" /></a>
              <a onClick={()=>del(text, record,index)}><Icon type="minus" /></a>
            </span>
          )
        }
      }
    },
    {
      title: '活动周期',
      dataIndex: 'duration',
      key: 'duration'
    }, 
    {
      title: '活动开始时段',
      dataIndex: 'start_tm',
      key: 'start_time'
    },
    {
      title: '活动结束时段',
      dataIndex: 'end_tm',
      key: 'end_time'
    },
    {
      title: '菜品名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '原价',
      dataIndex: 'price',
      key: 'price'
    },
    {
      title: '活动价',
      dataIndex: 'activity_price',
      key: 'activity_price'
    },
    {
      title: '会员价',
      dataIndex: 'member_price',
      key: 'member_price'
    }
  ];

  function add(text, record,index){
  	dataSource.push(
    //{
  	//	key: '2',
    //		duration:'全周',
    //    start_tm: '00:00',
    //    end_tm:'24:00',
    //    name: '',
    //    price:0.00,
    //    activity_price:0.00,
    //    member_price:0.00
  	//}
    )

  }

  function del(text, record,index){

  }

  
  return(
    <Header {...HeaderProps}>
        <div>
          <h4 className={styles.box}>
            <strong className={styles.strong}>菜品时段价格</strong>
            <small className={styles.small}>根据不同时段设置菜品不同价格，带动菜品销售和会员消费频次</small>
          </h4>
          <h5 className={styles.title}>
            <strong>活动内容</strong>
          </h5>
          <div className={styles.box}>
            
            <RegistrationForm dispatch={dispatch} ></RegistrationForm>
          </div>
          <h5 className={styles.title}>
            <strong>活动规则配置</strong>
          </h5>
          <Table
            bordered
            dataSource={dataSource} 
            columns={columns} 
          />
          <div>
            <Button type="primary" size="large" style={{marginRight:20}}>保存</Button>
            <Button size="large">取消</Button>
          </div>
        </div>
      </Header>
  );

}

CpbjAddPage.propTypes = {
  menu: PropTypes.object,
};

function mapStateToProps({ menu,cpbjPageConfig,cpbjSetting }) {
  return { menu,cpbjPageConfig,cpbjSetting };
}

export default connect(mapStateToProps)(CpbjAddPage);