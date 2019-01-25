import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import Form from 'antd/lib/form';
const FormItem = Form.Item;
import Checkbox from 'antd/lib/checkbox';
import Row from 'antd/lib/row';
import Col  from 'antd/lib/col';
import Spin from 'antd/lib/spin';
import moment from 'moment';
import DatePicker from 'antd/lib/date-picker';
const { MonthPicker  } = DatePicker;
import TimePicker from 'antd/lib/time-picker';
const RangePicker = DatePicker.RangePicker;
import Button from 'antd/lib/button';
import Table from 'antd/lib/table';
import Select from 'antd/lib/select';
const Option=Select.Option
import Tabs from 'antd/lib/tabs';
const TabPane = Tabs.TabPane;
import Breadcrumb from 'antd/lib/breadcrumb';
import message from 'antd/lib/message';
import Radio from 'antd/lib/radio';
const RadioGroup = Radio.Group;
import common from '../common.less';
import Tree from 'antd/lib/tree';
import TreeSelect from 'antd/lib/tree-select';
const TreeNode = Tree.TreeNode;


function YmhzbPage ({menu,dispatch,ymhzb}) {
    const HeaderProps = {
        menu,
        dispatch,
    };

    function back(){
        window.history.go(-1)
    }

    const pagination = {
        total:ymhzb.total,
        current:ymhzb.current,
        pageSize: ymhzb.size,
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger:true,
        onShowSizeChange:SizeChange
    };

    function SizeChange(current, pageSize){
        dispatch({type: 'ymhzb/updatePayload',payload:{size:pageSize,current:1,start:0}});
        dispatch({
            type:'ymhzb/discountRestaurant',
            payload:{}
        })
    }

    function onPageChange(pageNo){
        var offset = pageNo*ymhzb.size-ymhzb.size;
        dispatch({type: 'ymhzb/updatePayload',payload:{start:offset,current:pageNo}});
        dispatch({
            type:'ymhzb/discountRestaurant',
            payload:{}
        })
    }


    function onChange(item,key){
        console.log(key)
        let startTime=moment(new Date(key[0])).format('YYYY-MM-DD 00:00:00'),
            endTime=moment(new Date(key[1])).format('YYYY-MM-DD 23:59:59')
        console.log(startTime,endTime)
        dispatch({
            type:'ymhzb/updatePayload',
            payload:{startTime:moment(key[0]).format('YYYY-MM-DD 00:00:00'),endTime:moment(key[1]).format('YYYY-MM-DD 23:59:59'),static_days:'0'}
        })
    }

    function chooseDuration(t){
        var startTime,endTime=moment().endOf('day')
        if(t==0){
            startTime=moment().startOf("day")
            endTime=moment().endOf("day")
        }else if(t==1){
            startTime=moment().subtract(1, 'days').format('YYYY-MM-DD 00:00:00')
            endTime=moment().subtract(1, 'days').format('YYYY-MM-DD 23:59:59')
        }else if(t==2){
            startTime=moment().startOf("day").format('YYYY-MM-DD 00:00:00')
        }else if(t==7){
            startTime=moment().subtract(6, 'days').format('YYYY-MM-DD 00:00:00')
        }else if(t==15){
            startTime=moment().subtract(14, 'days').format('YYYY-MM-DD 00:00:00')
        }else if(t==30){
            startTime=moment().subtract(29, 'days').format('YYYY-MM-DD 00:00:00')
        }
        dispatch({
            type:'ymhzb/updatePayload',
            payload:{startTime:startTime,endTime:endTime,static_days:t}
        })
    }

    function treeChange(value){
        let arr=[],obj={}
        if(value.length>0){
            value.map((v,i)=>{
                let id=v.split('-')[0],name=v.split('-')[1]
                arr.push(id)
                obj[String(id)]=name
            })
        }
        dispatch({
            type:'ymhzb/updatePayload',
            payload:{
                value:value,
                restaurantIds:arr,
                resIdOrgNameMap:obj
            }
        })
    }

    const tProps = {
      treeData:[ymhzb.obj1],
      value: ymhzb.value,
      onChange: treeChange,
      treeCheckable: true,
      searchPlaceholder: '请选择门店',
      style: {
        width: 'auto',
        minWidth:334,
        marginTop:20
      },
      maxTagCount:1,
      dropdownStyle:{
        maxHeight:300,
        overflowY:'scroll'
      }
    };

    function onSearch(){
        dispatch({
            type:'ymhzb/updatePayload',
            payload:{
               start:0,
               current:1,
            }
        })
        dispatch({
            type:'ymhzb/discountRestaurant',
            payload:{}
        })
    }

    function loadOut(){
        dispatch({
            type:'ymhzb/_export',
            payload:{}
        })
    }

    const columns=[
        {title:'序号',dataIndex:'key',key:'key',fixed:ymhzb.list.length==0?false:'left',width:60,className:common.right,render:(text,record,index)=>(
            <span>{ymhzb.size*(ymhzb.current-1)+index+1}</span>
        )},
        {title:'门店',dataIndex:'orgName',key:'orgName',fixed:ymhzb.list.length==0?false:'left',width:300},
        {title:'优惠合计',dataIndex:'discountSum',key:'discountSum',width:100,className:common.right},
        {title:'整单折扣',dataIndex:'key0',key:'key0',width:200,children:[
            {title:'优惠金额',dataIndex:'fullDiscountMoney',key:'fullDiscountMoney',width:100,className:common.right},
            {title:'单数',dataIndex:'fullDiscountCount',key:'fullDiscountCount',width:100,className:common.right},
        ]},
        {title:'方案折扣',dataIndex:'key1',key:'key1',width:200,children:[
            {title:'优惠金额',dataIndex:'partDiscountMoney',key:'partDiscountMoney',width:100,className:common.right},
            {title:'单数',dataIndex:'partDiscountCount',key:'partDiscountCount',width:100,className:common.right},
        ]},
        {title:'企业折扣',dataIndex:'key2',key:'key2',width:200,children:[
            {title:'优惠金额',dataIndex:'corporateDiscountMoney',key:'corporateDiscountMoney',width:100,className:common.right},
            {title:'单数',dataIndex:'corporateDiscountCount',key:'corporateDiscountCount',width:100,className:common.right},
        ]},
        {title:'抹零',dataIndex:'key3',key:'key3',width:200,children:[
            {title:'优惠金额',dataIndex:'wipeMoney',key:'wipeMoney',width:100,className:common.right},
            {title:'单数',dataIndex:'wipeCount',key:'wipeCount',width:100,className:common.right},
        ]},
        {title:'优惠券',dataIndex:'key4',key:'key4',width:200,children:[
            {title:'优惠金额',dataIndex:'couponMoney',key:'couponMoney',width:100,className:common.right},
            {title:'单数',dataIndex:'couponCount',key:'couponCount',width:100,className:common.right},
        ]},
        {title:'红包',dataIndex:'key5',key:'key5',width:200,children:[
            {title:'优惠金额',dataIndex:'redPacketMoney',key:'redPacketMoney',width:100,className:common.right},
            {title:'单数',dataIndex:'redPacketCount',key:'redPacketCount',width:100,className:common.right},
        ]},
        {title:'会员储值赠送',dataIndex:'key6',key:'key6',width:200,children:[
            {title:'优惠金额',dataIndex:'crmGiftConsumeMoney',key:'crmGiftConsumeMoney',width:100,className:common.right},
            {title:'单数',dataIndex:'crmGiftConsumeCount',key:'crmGiftConsumeCount',width:100,className:common.right},
        ]},
        {title:'免单',dataIndex:'key7',key:'key7',width:200,children:[
            {title:'优惠金额',dataIndex:'freeMoney',key:'freeMoney',width:100,className:common.right},
            {title:'单数',dataIndex:'freeCount',key:'freeCount',width:100,className:common.right},
        ]},
        {title:'赠菜',dataIndex:'key8',key:'key8',width:200,children:[
            {title:'优惠金额',dataIndex:'giftFoodMoney',key:'giftFoodMoney',width:100,className:common.right},
            {title:'单数',dataIndex:'giftFoodCount',key:'giftFoodCount',width:100,className:common.right},
        ]},
    ]

    //就餐方式修改
    function eatTypeChange(e){
        dispatch({
            type:'ymhzb/updatePayload',
            payload:{
                eatType:e
            }
        })
    }
    
    return(
      <Header {...HeaderProps}>
        <div style={{background:'#eee',padding:'10px 20px'}}>
            <Breadcrumb separator=">">
                <Breadcrumb.Item onClick={back} style={{cursor:'pointer'}}>营业报表</Breadcrumb.Item>
                <Breadcrumb.Item>优免汇总表</Breadcrumb.Item>
            </Breadcrumb>
        </div>
        <Spin spinning={ymhzb.loading} style={{position:'absolute',width:'calc(100% - 50px)',height:'calc(100% - 70px)',paddingTop:'300px',zIndex:'99'}} size="large" />
        <div>
            <div className={common.yzy_search}>
                <div>
                    <div className={common.searchBlock}>
                        <span className={common.yzy_txt}>选择时间：</span>
                        <RangePicker
                          showTime
                          format="YYYY-MM-DD HH:mm:ss"
                          value={[moment(ymhzb.startTime), moment(ymhzb.endTime)]}
                          allowClear={false}
                          onChange={onChange}
                          className={common.yzy_datePicker}
                        />
                        <Select value={String(ymhzb.static_days)} className={common.periods_1} onChange={chooseDuration}>
                            <Select.Option key="0">请选择时间跨度</Select.Option>
                            <Select.Option key="1">昨天</Select.Option>
                            <Select.Option key="2">今天</Select.Option>
                            <Select.Option key="7">近7天</Select.Option>
                            <Select.Option key="15">近15天</Select.Option>
                            <Select.Option key="30">近30天</Select.Option>
                        </Select>
                    </div>
                    <div className={common.searchBlock}>
                        <span className={common.yzy_txt}>选择门店：</span>
                        <TreeSelect {...tProps} />
                    </div>
                    <div className={common.searchBlock}>
                        <span className={common.yzy_txt}>选择就餐方式：</span>
                        <Select value={String(ymhzb.eatType)} onChange={eatTypeChange} className={common.yzy_margin} style={{width:120}}>
                            <Select.Option value="-1">全选</Select.Option>
                            <Select.Option value="0">堂食</Select.Option>
                            <Select.Option value="2">打包外带</Select.Option>
                            <Select.Option value="3">自营外卖</Select.Option>
                        </Select>
                    </div>
                    <div className={common.searchBlock}>
                        <Button size="default" type="primary" className={common.btn_1} onClick={onSearch}>搜索</Button>
                        <Button size="default" className={common.btn_2} onClick={loadOut}>导出</Button>
                    </div>
                </div>
            </div>

            <Table
                className={common.yzy}
                bordered
                columns={columns}
                dataSource={ymhzb.list}
                pagination={pagination}
                scroll={{x:ymhzb.list.length==0?false:2260,y:400}}
                size="small"
             />
        </div>
      </Header>
    );

}

YmhzbPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,ymhzb}) {
    return { menu,ymhzb };
}

export default connect(mapStateToProps)(YmhzbPage);

