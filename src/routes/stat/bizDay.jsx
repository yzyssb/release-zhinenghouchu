import React, {PropTypes} from 'react';
import Header from '../../components/Header';
import {connect} from 'dva';
import Button from 'antd/lib/button';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Table from 'antd/lib/table';
import Form from "antd/lib/form/index";
import Select from "antd/lib/select";
import {RangePicker} from 'antd/lib/date-picker';
import moment from 'moment';
import Spin from 'antd/lib/spin';
import styles from './bill.less';
import common from './common.less';
import Radio from 'antd/lib/radio';
import Checkbox  from 'antd/lib/checkbox';
const RadioGroup = Radio.Group;
import Breadcrumb from 'antd/lib/breadcrumb';
import Tree from 'antd/lib/tree';
import TreeSelect from 'antd/lib/tree-select';
const TreeNode = Tree.TreeNode;

function bizDayDayPage({menu, dispatch, bizDay, store}) {

    const HeaderProps = {
        menu,
        dispatch,
    };

    const {list, total, page} = bizDay;



    const pagination = { //分页
        total: total,
        current: page,
        pageSize: bizDay.size,
        
        onChange: (pageNo) => {
            dispatch({type: 'bizDay/updatePayload', payload: {page: pageNo}});
            dispatch({type: 'bizDay/list',payload:{}});
        },
        showSizeChanger:true,
        onShowSizeChange:SizeChange
    };

    function SizeChange(current, pageSize){
        dispatch({type: 'bizDay/updatePayload',payload:{size:pageSize,page:1,offset:0}});
        dispatch({type: 'bizDay/list',payload:{}});
    }

    const onSearchDateChange = (dates, dateStrings) => {
        dispatch({
            type: 'bizDay/updatePayload',
            payload: {
                startTime: dates[0],
                endTime: dates[1],
                static_days:'0'
            }
        });
    };

    const search = () => {
        dispatch({
            type: 'bizDay/updatePayload',
            payload: {
                page: 1
            }
        });
        dispatch({type: 'bizDay/list', payload: {}});
        dispatch({type: 'bizDay/stat', payload: {}});
    };
    const formItemLayout = {
        labelCol: {
            span: 4,
        },
        wrapperCol: {
            span: 20,
        },
    };

    function chooseDuration(t){
        var startTime,endTime=moment().endOf("day")
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
            type:'bizDay/updatePayload',
            payload:{startTime:startTime,endTime:endTime,static_days:t}
        })
    }

    function cateChange(e){
        console.log(e.target.value)
        dispatch({
            type:'bizDay/updatePayload',
            payload:{
                avgType:String(e.target.value)
            }
        })
    }

    function back(){
        window.history.go(-1)
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
			type:'bizDay/updatePayload',
			payload:{
				value:value,
				restaurantIds:arr,
				resIdOrgNameMap:obj
			}
		})
	}
	
	function treeExpand(value){
		dispatch({
			type:'bizDay/updatePayload',
			payload:{
				value1:value
			}
		})
	}
	
	//无限级树
	function renderTreeNodes(data) {
		return data.map(function (item) {
		  if (item.children) {
			return (
			  <TreeNode title={item.title} key={item.key} dataRef={item}>
				{renderTreeNodes(item.children)}
			  </TreeNode>
			);
		  }
		  return <TreeNode {...item} />;
		});
	}
	
	//无限级treeSelect
	const SHOW_PARENT = TreeSelect.SHOW_PARENT;
	
	const tProps = {
      treeData:[bizDay.obj1],
      value: bizDay.value,
      onChange: treeChange,
      treeCheckable: true,
      //showCheckedStrategy: SHOW_PARENT,
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

    return (
        <Header {...HeaderProps}>
            <div style={{background:'#eee',padding:'10px 20px'}}>
                <Breadcrumb separator=">">
                    <Breadcrumb.Item onClick={back} style={{cursor:'pointer'}}>营业报表</Breadcrumb.Item>
                    <Breadcrumb.Item>营业明细表</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <Spin spinning={bizDay.loading} style={{position:'absolute',width:'calc(100% - 50px)',height:'calc(100% - 70px)',paddingTop:'300px',zIndex:'99'}} size="large" />
            <div>
                <div className={common.yzy_search}>
                    <div>
                        <div className={common.searchBlock}>
                            <span className={common.yzy_txt}>选择时间：</span>
                            <RangePicker
                              format="YYYY-MM-DD HH:mm:ss"
                              value={[moment(bizDay.startTime), moment(bizDay.endTime)]}
                              allowClear={false}
                              onChange={onSearchDateChange}
                              className={common.yzy_datePicker}
                            />
                            <Select value={String(bizDay.static_days)} className={common.periods_1} onChange={chooseDuration}>
                                <Select.Option key="0">请选择时间跨度</Select.Option>
                                <Select.Option key="1">昨天</Select.Option>
                                <Select.Option key="2">今天</Select.Option>
                                <Select.Option key="7">近7天</Select.Option>
                                <Select.Option key="15">近15天</Select.Option>
                                <Select.Option key="30">近30天</Select.Option>
                            </Select>
                        </div>
                        <div className={common.searchBlock}>
                            <span className={common.yzy_txt}></span>
                            <Select value={bizDay.avgType} className={common.yzy_margin} onChange={cateChange}>
                                <Select.Option key="1">单均/人均按应收计算</Select.Option>
                                <Select.Option key="2">单均/人均按实收计算</Select.Option>
                            </Select>
                        </div>
                        <Checkbox disabled checked className={common.yzy_txt}>0账单计入账单合计</Checkbox>
                        <div className={common.searchBlock}>
                            <span className={common.yzy_txt}>选择门店：</span>
                            <TreeSelect {...tProps} />
                        </div>
                        <div className={common.searchBlock}>
                            <Button size="default" className={common.btn_1} type="primary" onClick={search}>搜索</Button>
                            <Button size="default" className={common.btn_2} onClick={
                                () => {
                                    dispatch({
                                        type: 'bizDay/_export',
                                        payload: {}
                                    })
                                }
                            }>导出</Button>
                        </div>
                    </div>
                </div>
                


                {/*<Row gutter={16} className={styles.statRow}>
                    <Col span={2} className={styles.statCol}>
                        <div>应收金额</div>
                        <div>{bizDay.stat.needMoney?bizDay.stat.needMoney:'0.00'}</div>
                    </Col>
                    <Col span={2} className={styles.statCol}>
                        <div>餐实收金额</div>
                        <div>{bizDay.stat.receiveMoney?bizDay.stat.receiveMoney:'0.00'}</div>
                    </Col>
                    <Col span={2} className={styles.statCol}>
                        <div>优免金额</div>
                        <div>{bizDay.stat.giftMoney?bizDay.stat.giftMoney:'0.00'}</div>
                    </Col>
                    <Col span={2} className={styles.statCol}>
                        <div>就餐总人数</div>
                        <div>{bizDay.stat.people?bizDay.stat.people:'0'}</div>
                    </Col>
                    <Col span={2} className={styles.statCol}>
                        <div>总单数</div>
                        <div>{bizDay.stat.order?bizDay.stat.order:'0'}</div>
                    </Col>
                    <Col span={2} className={styles.statCol}>
                        <div>人均消费</div>
                        <div>{bizDay.stat.avgPeopleMoney?bizDay.stat.avgPeopleMoney:'0.00'}</div>
                    </Col>
                    <Col span={2} className={styles.statCol}>
                        <div>单均消费</div>
                        <div>{bizDay.stat.avgOrderMoney?bizDay.stat.avgOrderMoney:'0.00'}</div>
                    </Col>
                    <Col span={2} className={styles.statCol}>
                        <div>免单合计</div>
                        <div>{bizDay.stat.freeMoney?bizDay.stat.freeMoney:'0.00'}</div>
                    </Col>
                    <Col span={2} className={styles.statCol}>
                        <div>退菜合计</div>
                        <div>{bizDay.stat.retreatFoodMoney?bizDay.stat.retreatFoodMoney:'0.00'}</div>
                    </Col>
                    <Col span={2} className={styles.statCol}>
                        <div>折扣合计</div>
                        <div>{bizDay.stat.discountMoney?bizDay.stat.discountMoney:'0.00'}</div>
                    </Col>
                    <Col span={2} className={styles.statCol}>
                        <div>赠菜合计</div>
                        <div>{bizDay.stat.giftFoodMoney?bizDay.stat.giftFoodMoney:'0.00'}</div>
                    </Col>
                    <Col span={2}>
                        <div>反结合计</div>
                        <div>{bizDay.stat.reverseMoney?bizDay.stat.reverseMoney:'0.00'}</div>
                    </Col>
                </Row>*/}

                <Table
                    className={common.yzy}
                    columns={bizDay.columns}
                    dataSource={list}
                    pagination={pagination}
                    scroll={{x:bizDay.scrollX,y:400}}
                    size="small"
                    bordered/>
            </div>
        </Header>
    );

}

bizDayDayPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu, bizDay, store}) {
    return {menu, bizDay, store};
}

export default connect(mapStateToProps)(bizDayDayPage);

