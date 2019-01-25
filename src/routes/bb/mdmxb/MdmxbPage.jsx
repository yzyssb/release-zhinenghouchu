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
import Ostyles from './MdmxbPage.less';
import styles from '../../stat/bill.less';
import Spin from 'antd/lib/spin';
import moment from 'moment';
import DatePicker from 'antd/lib/date-picker';
const RangePicker = DatePicker.RangePicker;
import Button from 'antd/lib/button';
import Table from 'antd/lib/table';
import Select from 'antd/lib/select';
const Option=Select.Option
import Modal from 'antd/lib/modal'
import common from '../common.less';
import Breadcrumb from 'antd/lib/breadcrumb';
import Tree from 'antd/lib/tree';
import TreeSelect from 'antd/lib/tree-select';
const TreeNode = Tree.TreeNode;

function MdmxbPage ({menu,dispatch,mdmxb}) {
    const HeaderProps = {
        menu,
        dispatch,
    };

    const formItemLayout = {
        labelCol: {
            span: 4,
        },
        wrapperCol: {
            span: 20,
        },
    };
    const formItemLayout1 = {
        labelCol: {
            span: 4,
        },
        wrapperCol: {
            span: 20,
        },
    };

    const columns=[
        {
            title:'序号',
            dataIndex:'key',
            key:'key',
            className:common.right,
            render:(text,record,index)=>(
                <span>{mdmxb.size*(mdmxb.current-1)+(index+1)}</span>
            )
        },
        {
            title:'门店名称',
            dataIndex:'orgName',
            key:'orgName',
            className:common.left,
        },
        {
            title:'账单号',
            dataIndex:'billNo',
            key:'billNo',
            className:common.left,
            render:(text,record,index)=>(<a onClick={()=>getInfo(record)}>{record.billNo||'无'}</a>)
        },
        {
            title:'免单原因',
            dataIndex:'freeReason',
            key:'freeReason',
            className:common.left,
        },
        {
            title:'免单金额',
            dataIndex:'freeMoney',
            key:'freeMoney',
            className:common.right,
        },
        {
            title:'区域',
            dataIndex:'regionName',
            key:'regionName',
            className:common.left,
        },
        {
            title:'桌台',
            dataIndex:'table',
            key:'table',
            className:common.left,
        },
        {
            title:'人数',
            dataIndex:'people',
            key:'people',
            className:common.right,
        },
        {
            title:'操作员',
            dataIndex:'opName',
            key:'opName',
            className:common.left,
        },
        {
            title:'操作时间',
            dataIndex:'opTime',
            key:'opTime',
            className:common.left,
        }
    ]

    function getInfo(record){
        console.log(record)
        dispatch({
            type:'mdmxb/info',
            payload:{
                id:record.orderId
            }
        })
        dispatch({
            type: 'mdmxb/updatePayload',
            payload: {
                record: record,
                modal_visible: true
            }
        });
    }

    const pagination = {
        total: mdmxb.total,
        current:mdmxb.current,
        pageSize: mdmxb.size,      
        
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger:true,
        onShowSizeChange:SizeChange,
    };

    function SizeChange(current, pageSize){
        dispatch({type: 'mdmxb/updatePayload',payload:{size:pageSize,current:1,start:0}});
        dispatch({
            type:'mdmxb/getListRes',
            payload:{}
        })
    }

    function onPageChange(pageNo){
        var offset = pageNo*mdmxb.size-mdmxb.size;
        dispatch({type: 'mdmxb/updatePayload',payload:{start:offset,current:pageNo}});
        dispatch({
            type:'mdmxb/getListRes',
            payload:{}
        })
    }


    function onChange(item,key){
        console.log(key)
        dispatch({
            type:'mdmxb/updatePayload',
           payload:{startTime:key[0],endTime:key[1],static_days:'0'}
        })
    }


    function selectChange(key){
        dispatch({
            type:'mdmxb/updatePayload',
            payload:{choosedIndex:key}
        })
    }

    function checkboxChange(key){
    	console.log(key)
    }

    var children=[<Option key="-1">全部</Option>]
    mdmxb.list1.forEach(function(value,index){
        children.push(<Option key={index}>{value.name}</Option>)
    })


    function onSearch(){
        dispatch({type: 'mdmxb/updatePayload',payload:{current:1,start:0}});
        dispatch({
            type:'mdmxb/getListRes',
            payload:{}
        })
    }


    function getOutForm() {
        document.getElementById("formOrderExport").submit();
    }
    function getUserToken() {
        const userStatus = myApp._store.getState().account.token;
        return userStatus;
    }

    function multipleChange(key){
        let resIdOrgNameMap={},restaurantIds=[]
        mdmxb.restaurantList.forEach((value,index)=>{
            key.forEach((val,idx)=>{
                if(val==value.id){
                    resIdOrgNameMap[value.id]=value.name
                    restaurantIds.push(String(value.id))
                }
            })
        })
        dispatch({
            type:'mdmxb/updatePayload',
            payload:{restaurantIds:restaurantIds,resIdOrgNameMap:resIdOrgNameMap}
        })
    }

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
            type:'mdmxb/updatePayload',
            payload:{startTime:startTime,endTime:endTime,static_days:t}
        })
    }

    const gutter = 12;
    const modal_columns = [
        {title: '品名', dataIndex: 'foodName', key: 'foodName',className:common.left},
        {title: '单价', dataIndex: 'singlePrice', key: 'singlePrice',className:common.right},
        {title: '会员价', dataIndex: 'vipPrice', key: 'vipPrice',className:common.right},
        {title: '数量', dataIndex: 'num', key: 'num',className:common.right},
        {title: '总额', dataIndex: 'totalPrice', key: 'totalPrice',className:common.right},
    ];

    function modalOk(){
        dispatch({
            type:'mdmxb/updatePayload',
            payload:{modal_visible:false}
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
			type:'mdmxb/updatePayload',
			payload:{
				value:value,
				restaurantIds:arr,
				resIdOrgNameMap:obj
			}
		})
	}
	
	function treeExpand(value){
		dispatch({
			type:'mdmxb/updatePayload',
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
      treeData:[mdmxb.obj1],
      value: mdmxb.value,
      onChange: treeChange,
      treeCheckable: true,
      //showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: '请选择门店',
      style: {
        width:'auto',
        minWidth:334,
        marginTop:20
      },
	  maxTagCount:1,
	  dropdownStyle:{
		maxHeight:300,
		overflowY:'scroll'
	  }
    };

    return(
      <Header {...HeaderProps}>
        <div style={{background:'#eee',padding:'10px 20px'}}>
            <Breadcrumb separator=">">
                <Breadcrumb.Item onClick={back} style={{cursor:'pointer'}}>营业报表</Breadcrumb.Item>
                <Breadcrumb.Item>免单明细表</Breadcrumb.Item>
            </Breadcrumb>
        </div>
        <Spin spinning={mdmxb.loading} style={{position:'absolute',width:'calc(100% - 50px)',height:'calc(100% - 70px)',paddingTop:'300px',zIndex:'99'}} size="large" />
        <div>
            <div className={common.yzy_search}>
                <div>
                    <div className={common.searchBlock}>
                        <span className={common.yzy_txt}>选择时间：</span>
                        <RangePicker
                          showTime
                          format="YYYY-MM-DD HH:mm:ss"
                          value={[moment(mdmxb.startTime), moment(mdmxb.endTime)]}
                          allowClear={false}
                          onChange={onChange}
                          className={common.yzy_datePicker}
                        />
                        <Select value={String(mdmxb.static_days)} className={common.periods_1} onChange={chooseDuration}>
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
                        <Button size="default" type="primary" className={common.btn_1} onClick={onSearch}>搜索</Button>
                        <Button size="default" className={common.btn_2} onClick={getOutForm}>导出</Button>
                    </div>
                </div>
            </div>
            

            <Table
                className={common.yzy}
                bordered
                columns={columns}
                dataSource={mdmxb.Detail}
                pagination={pagination}
                size="small"
                scroll={{x:1000}}
             />
            
        </div>

        <Modal width='800px' visible={mdmxb.modal_visible} title="结账单" onCancel={modalOk} 
            footer={[<Button key="ok" type="primary" onClick={modalOk}>确认</Button>]}
        >
            <Form>
                <Row gutter={gutter} className={styles.infoRow}>
                    <Col span={4}>账单号</Col>
                    <Col span={8}>{mdmxb.record.billNo}</Col>
                </Row>
                <Row gutter={gutter} className={styles.infoRow}>
                    <Col span={4}>桌号</Col>
                    <Col span={8}>{mdmxb.record.table}</Col>
                    <Col span={4}>人数</Col>
                    <Col span={8}>{mdmxb.record.people}</Col>
                </Row>
                <Row gutter={gutter} className={styles.infoRow}>
                    <Col span={4}>服务员</Col>
                    <Col span={8}>{mdmxb.record.waiterName}</Col>
                    <Col span={4}>收银员</Col>
                    <Col span={8}>{mdmxb.record.cashierName}</Col>
                </Row>
                <Row gutter={gutter} className={styles.infoRow}>
                    <Col span={4}>开台时间</Col>
                    <Col span={8}>{mdmxb.record.beginTime}</Col>
                    <Col span={4}>结账时间</Col>
                    <Col span={8}>{mdmxb.record.finishTime}</Col>
                </Row>
                <Table
                    className={common.yzy}
                    size="small"
                    columns={modal_columns}
                    dataSource={mdmxb.info.foodInfos}
                    pagination={false}
                    bordered/>

                <Row gutter={gutter} className={styles.infoRow} style={{display: mdmxb.record.boxMoney > 0 ? "block" : "none"}}>
                    <Col span={12}>餐盒费</Col>
                    <Col span={12} style={{textAlign: "right"}}>{mdmxb.record.boxMoney}</Col>
                </Row>
                <Row gutter={gutter} className={styles.infoRow} style={{display: mdmxb.record.serviceMoney > 0 ? "block" : "none"}}>
                    <Col span={12}>服务费</Col>
                    <Col span={12} style={{textAlign: "right"}}>{mdmxb.record.serviceMoney}</Col>
                </Row>
                <Row gutter={gutter} className={styles.infoRow} style={{display: mdmxb.foodSumPrice < mdmxb.record.needMoney ? "block" : "none"}}>
                    <Col span={12}>菜品原价合计</Col>
                    <Col span={12} style={{textAlign: "right"}}>{mdmxb.foodSumPrice/100}</Col>
                </Row>
                <Row gutter={gutter} className={styles.infoRow}>
                    {/* 应收合计 = 餐盒费 + 服务费 + 菜品原价合计 */}
                    <Col span={12}>应收合计</Col>
                    <Col span={12} style={{textAlign: "right"}}>{mdmxb.record.needMoney}</Col>
                </Row>
               
                {/* 抵扣金额 */}
                <Row gutter={gutter} className={styles.infoRow}>
                    {
                        mdmxb.info.discountInfos && mdmxb.info.discountInfos.map((item,index) => {
                            return <Row gutter={gutter} key={index}>
                                <Col span={12}>{item.discountName}</Col>
                                <Col span={12} style={{textAlign: "right"}}>{item.discountMoney}</Col>
                            </Row>
                        })
                    }
                </Row>
                <Row gutter={gutter} style={{fontSize: 20}} className={styles.infoRow}>
                    <Col span={12}>优惠合计</Col>
                    <Col span={12} style={{textAlign: "right"}  }>{mdmxb.record.giftMoney}</Col>
                </Row>
                 {/* 现金支付 */}
                <Row gutter={gutter} className={styles.infoRow}>
                    {
                        mdmxb.info.payInfos && mdmxb.info.payInfos.map((item,index) => {
                            return <Row gutter={gutter} key={index}>
                                <Col span={12}>{item.payName}</Col>
                                <Col span={12} style={{textAlign: "right"}}>{item.payMoney}</Col>
                            </Row>
                        })
                    }
                </Row>
                <Row gutter={gutter} style={{fontSize: 20}} className={styles.infoRow}>
                    <Col span={12}>实收金额</Col>
                    <Col span={12} style={{textAlign: "right"}  }>{mdmxb.record.receiveMoney}</Col>
                </Row>
            </Form>
        </Modal>

        <form action={mdmxb.linkOrigin+'report-api/report/export/free'} method="post"  id='formOrderExport'>

            <input type="hidden" name="restaurantIds" value = {JSON.stringify(mdmxb.restaurantIds)} id='pay_way'/>
            <input type="hidden" name="startTime" value = {new Date(mdmxb.startTime).getTime()}/>
            <input type="hidden" name="endTime" value = {new Date(mdmxb.endTime).getTime()}/>
            <input type="hidden" name="resIdOrgNameMap" value = {JSON.stringify(mdmxb.resIdOrgNameMap)}/>            

        </form>

      </Header>
    );

}

MdmxbPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,mdmxb}) {
    return { menu,mdmxb };
}

export default connect(mapStateToProps)(MdmxbPage);

