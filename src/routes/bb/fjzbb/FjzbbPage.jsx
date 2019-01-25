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
import Ostyles from './FjzbbPage.less';
import styles from '../../stat/bill.less';
import Spin from 'antd/lib/spin';
import moment from 'moment';
import DatePicker from 'antd/lib/date-picker';
const RangePicker = DatePicker.RangePicker;
import Button from 'antd/lib/button';
import Table from 'antd/lib/table';
import Select from 'antd/lib/select';
const Option=Select.Option
import Modal from 'antd/lib/modal';
import Breadcrumb from 'antd/lib/breadcrumb';
import common from '../common.less';
import Tree from 'antd/lib/tree';
import TreeSelect from 'antd/lib/tree-select';
const TreeNode = Tree.TreeNode;


function FjzbbPage ({menu,dispatch,fjzbb}) {
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
                <span>{(fjzbb.current-1)*fjzbb.size+record.key}</span>
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
            title:'反结原因',
            dataIndex:'recashReason',
            key:'recashReason',
            className:common.left,
        },
        {
            title:'反结时间',
            dataIndex:'recashTime',
            key:'recashTime',
            className:common.left,
        },
        {
            title:'操作人',
            dataIndex:'opName',
            key:'opName',
            className:common.left,
        },
        {
            title:'桌台',
            dataIndex:'table',
            key:'table',
            className:common.left,
        },
        {
            title:'反结详情',
            dataIndex:'action',
            key:'action',
            className:common.left,
            render:(text,record,index)=>(
                <a onClick={()=>goDetail(record)}>查看</a>
            )
        }
    ]

    function getInfo(record){
        console.log(record)
        dispatch({
            type:'fjzbb/info',
            payload:{
                id:+record.id
            }
        })
        dispatch({
            type: 'fjzbb/updatePayload',
            payload: {
                record: record,
                modal_visible: true
            }
        });
    }

    function goDetail(record){
        console.log(record)
        dispatch({
            type:'fjzbb/recashInfo',
            payload:{
                id:+record.id,
                restaurantId:+record.restaurantId,
                billNo:record.billNo,
                gmtFinish:record.gmtFinish
            }
        })
    }

    const pagination = {
        total: fjzbb.total,
        current:fjzbb.current,
        pageSize: fjzbb.size,        
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger:true,
        onShowSizeChange:SizeChange,
    };

    function SizeChange(current, pageSize){
        dispatch({type: 'fjzbb/updatePayload',payload:{size:pageSize,current:1,start:0}});
        dispatch({
            type:'fjzbb/getListRes',
            payload:{}
        })
    }

    function onPageChange(pageNo){
        var offset = pageNo*fjzbb.size-fjzbb.size;
        dispatch({type: 'fjzbb/updatePayload',payload:{start:offset,current:pageNo}});
        dispatch({
            type:'fjzbb/getListRes',
            payload:{}
        })
    }

    /*const sub_pagination = {
        total: fjzbb.total,
        current:fjzbb.current,
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger:true,
        onShowSizeChange:SizeChange,
    };

    function SizeChange(current, pageSize){
        dispatch({type: 'fjzbb/updatePayload',payload:{size:pageSize,current:1,start:0}});
        dispatch({
            type:'fjzbb/getListRes',
            payload:{}
        })
    }

    function onPageChange(pageNo){
        var offset = pageNo*fjzbb.size-fjzbb.size;
        dispatch({type: 'fjzbb/updatePayload',payload:{start:offset,current:pageNo}});
        dispatch({
            type:'fjzbb/getListRes',
            payload:{}
        })
    }*/





    function onChange(item,key){
        console.log(key)
        dispatch({
            type:'fjzbb/updatePayload',
           payload:{startTime:key[0],endTime:key[1],static_days:'0'}
        })
    }


    function selectChange(key){
        dispatch({
            type:'fjzbb/updatePayload',
            payload:{choosedIndex:key}
        })
    }

    function checkboxChange(key){
    	console.log(key)
    }

    var children=[<Option key="-1">全部</Option>]
    fjzbb.list1.forEach(function(value,index){
        children.push(<Option key={index}>{value.name}</Option>)
    })


    function onSearch(){
        dispatch({type: 'fjzbb/updatePayload',payload:{current:1,start:0}});
        dispatch({
            type:'fjzbb/getListRes',
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
        fjzbb.restaurantList.forEach((value,index)=>{
            key.forEach((val,idx)=>{
                if(val==value.id){
                    resIdOrgNameMap[value.id]=value.name
                    restaurantIds.push(String(value.id))
                }
            })
        })
        dispatch({
            type:'fjzbb/updatePayload',
            payload:{restaurantIds:restaurantIds,resIdOrgNameMap:resIdOrgNameMap}
        })
    }

    const subColumns=[
        {
            title:'序号',
            dataIndex:'num',
            key:'num',
            className:common.left,
        },
        {
            title:'账单类型',
            dataIndex:'orderType',
            key:'orderType',
            className:common.left,
        },
        {
            title:'结账时间',
            dataIndex:'finishTime',
            key:'finishTime',
            className:common.left,
        },
        {
            title:'应收',
            dataIndex:'needMoney',
            key:'needMoney',
            className:common.right,
        },
        {
            title:'实收',
            dataIndex:'recieveMoney',
            key:'recieveMoney',
            className:common.right,
        }
    ]

    function ModalHidden(){
        dispatch({
            type:'fjzbb/updatePayload',
            payload:{visible:false}
        })
    }

    const gutter = 12;
    const modal_columns = [
        {title: '品名', dataIndex: 'foodName', key: 'foodName',className:common.left,},
        {title: '单价', dataIndex: 'singlePrice', key: 'singlePrice',className:common.right,},
        {title: '会员价', dataIndex: 'vipPrice', key: 'vipPrice',className:common.right,},
        {title: '数量', dataIndex: 'num', key: 'num',className:common.right,},
        {title: '总额', dataIndex: 'totalPrice', key: 'totalPrice',className:common.right,},
    ];

    function modalOk(){
        dispatch({
            type:'fjzbb/updatePayload',
            payload:{modal_visible:false}
        })
    }

    function chooseDuration(t){
        var startTime,endTime=moment().endOf("day")
        if(t==1){
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
            type:'fjzbb/updatePayload',
            payload:{startTime:startTime,endTime:endTime,static_days:t}
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
			type:'fjzbb/updatePayload',
			payload:{
				value:value,
				restaurantIds:arr,
				resIdOrgNameMap:obj
			}
		})
	}
	
	function treeExpand(value){
		dispatch({
			type:'fjzbb/updatePayload',
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
      treeData:[fjzbb.obj1],
      value: fjzbb.value,
      onChange: treeChange,
      treeCheckable: true,
      //showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: '请选择',
      style: {
        width: 350,
      },
	  maxTagCount:3,
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
                <Breadcrumb.Item>反结账报表</Breadcrumb.Item>
            </Breadcrumb>
        </div>
        <Spin spinning={fjzbb.loading} style={{position:'absolute',width:'calc(100% - 50px)',height:'calc(100% - 70px)',paddingTop:'300px',zIndex:'99'}} size="large" />
        <div style={{marginTop:20}}>
            <Form>
              <Form.Item
                label="选择时间：" 
                {...formItemLayout}
              >
                <RangePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  value={[moment(fjzbb.startTime), moment(fjzbb.endTime)]}
                  allowClear={false}
                  onChange={onChange}
                />
                <span>
                    {fjzbb.static_days=='1'?(
                        <a style={{marginLeft:20,color:'red'}} onClick={()=>chooseDuration(1)}>今天</a>
                    ):(
                        <a style={{marginLeft:20}} onClick={()=>chooseDuration(1)}>今天</a>
                    )}
                    {fjzbb.static_days=='2'?(
                        <a style={{marginLeft:20,color:'red'}} onClick={()=>chooseDuration(2)}>昨天</a>
                    ):(
                        <a style={{marginLeft:20}} onClick={()=>chooseDuration(2)}>昨天</a>
                    )}
                    {fjzbb.static_days=='7'?(
                        <a style={{marginLeft:20,color:'red'}} onClick={()=>chooseDuration(7)}>近7天</a>
                    ):(
                        <a style={{marginLeft:20}} onClick={()=>chooseDuration(7)}>近7天</a>
                    )}
                    {fjzbb.static_days=='15'?(
                        <a style={{marginLeft:20,color:'red'}} onClick={()=>chooseDuration(15)}>近15天</a>
                    ):(
                        <a style={{marginLeft:20}} onClick={()=>chooseDuration(15)}>近15天</a>
                    )}
                    {fjzbb.static_days=='30'?(
                        <a style={{marginLeft:20,color:'red'}} onClick={()=>chooseDuration(30)}>近30天</a>
                    ):(
                        <a style={{marginLeft:20}} onClick={()=>chooseDuration(30)}>近30天</a>
                    )}
                </span>
              </Form.Item>
              <Form.Item
                label="选择门店：" 
                {...formItemLayout1}
                style={{position:'relative'}}
              >
			    {/*无限级树*/}
				{/*<div style={{position:'absolute',left:'0px',zIndex:100,background:'#fff',display:'inline-block',maxHeight:200,width:350,overflowY:'scroll',border:'1px solid #ddd'}}>
					{fjzbb.obj1&&Object.keys(fjzbb.obj1).length>0&&
						<Tree
							checkable
							checkedKeys={fjzbb.value}
							onCheck={treeChange}
							autoExpandParent={fjzbb.autoExpand}
							expandedKeys={fjzbb.value1}
							onExpand={treeExpand}
						>
							{renderTreeNodes([fjzbb.obj1])}
						</Tree>
					}
				</div>*/}
				
				{/*无限级treeSelect*/}
				<TreeSelect {...tProps} />
                <Button size="default" type="primary" style={{position:'absolute',left:'370px',marginTop:5}} onClick={onSearch}>搜索</Button>
                <Button size="default" style={{position:'absolute',left:'450px',marginTop:5}} onClick={getOutForm}>导出</Button>
              </Form.Item>
            </Form>

            <Table
                className={common.yzy}
                bordered
                columns={columns}
                dataSource={fjzbb.Detail}
                pagination={pagination}
                scroll={{x:1000}}
                size="small"
             />
            
            <Modal
              width="800px"
              visible={fjzbb.visible}
              title="反结账报表-详情"
              onCancel={ModalHidden}
              footer={[
                  <Button key="submit" type="primary" onClick={ModalHidden}>确认</Button>,
              ]}
          >
            <Table
              className={common.yzy}
              bordered
              dataSource={fjzbb.subList} 
              columns={fjzbb.subColumns}
              pagination={false}
              size="small"
            />
          </Modal>
        </div>

        <Modal width='800px' visible={fjzbb.modal_visible} title="结账单" onCancel={modalOk} 
            footer={[<Button key="ok" type="primary" onClick={modalOk}>确认</Button>]}
        >
            <Form>
                <Row gutter={gutter} className={styles.infoRow}>
                    <Col span={4}>账单号</Col>
                    <Col span={8}>{fjzbb.record.billNo}</Col>
                </Row>
                <Row gutter={gutter} className={styles.infoRow}>
                    <Col span={4}>桌号</Col>
                    <Col span={8}>{fjzbb.record.table}</Col>
                    <Col span={4}>人数</Col>
                    <Col span={8}>{fjzbb.record.people}</Col>
                </Row>
                <Row gutter={gutter} className={styles.infoRow}>
                    <Col span={4}>服务员</Col>
                    <Col span={8}>{fjzbb.record.waiterName}</Col>
                    <Col span={4}>收银员</Col>
                    <Col span={8}>{fjzbb.record.cashierName}</Col>
                </Row>
                <Row gutter={gutter} className={styles.infoRow}>
                    <Col span={4}>开台时间</Col>
                    <Col span={8}>{fjzbb.record.beginTime}</Col>
                    <Col span={4}>结账时间</Col>
                    <Col span={8}>{fjzbb.record.finishTime}</Col>
                </Row>
                <Table
                    className={common.yzy}
                    size="small"
                    columns={modal_columns}
                    dataSource={fjzbb.info.foodInfos}
                    pagination={false}
                    bordered/>

                <Row gutter={gutter} className={styles.infoRow} style={{display: fjzbb.record.boxMoney > 0 ? "block" : "none"}}>
                    <Col span={12}>餐盒费</Col>
                    <Col span={12} style={{textAlign: "right"}}>{fjzbb.record.boxMoney}</Col>
                </Row>
                <Row gutter={gutter} className={styles.infoRow} style={{display: fjzbb.record.serviceMoney > 0 ? "block" : "none"}}>
                    <Col span={12}>服务费</Col>
                    <Col span={12} style={{textAlign: "right"}}>{fjzbb.record.serviceMoney}</Col>
                </Row>
                <Row gutter={gutter} className={styles.infoRow} style={{display: fjzbb.foodSumPrice < fjzbb.record.needMoney ? "block" : "none"}}>
                    <Col span={12}>菜品原价合计</Col>
                    <Col span={12} style={{textAlign: "right"}}>{fjzbb.foodSumPrice/100}</Col>
                </Row>
                <Row gutter={gutter} className={styles.infoRow}>
                    {/* 应收合计 = 餐盒费 + 服务费 + 菜品原价合计 */}
                    <Col span={12}>应收合计</Col>
                    <Col span={12} style={{textAlign: "right"}}>{fjzbb.record.needMoney}</Col>
                </Row>
               
                {/* 抵扣金额 */}
                <Row gutter={gutter} className={styles.infoRow}>
                    {
                        fjzbb.info.discountInfos && fjzbb.info.discountInfos.map((item,index) => {
                            return <Row gutter={gutter} key={index}>
                                <Col span={12}>{item.discountName}</Col>
                                <Col span={12} style={{textAlign: "right"}}>{item.discountMoney}</Col>
                            </Row>
                        })
                    }
                </Row>
                <Row gutter={gutter} style={{fontSize: 20}} className={styles.infoRow}>
                    <Col span={12}>优惠合计</Col>
                    <Col span={12} style={{textAlign: "right"}  }>{fjzbb.record.giftMoney}</Col>
                </Row>
                 {/* 现金支付 */}
                <Row gutter={gutter} className={styles.infoRow}>
                    {
                        fjzbb.info.payInfos && fjzbb.info.payInfos.map((item,index) => {
                            return <Row gutter={gutter} key={index}>
                                <Col span={12}>{item.payName}</Col>
                                <Col span={12} style={{textAlign: "right"}}>{item.payMoney}</Col>
                            </Row>
                        })
                    }
                </Row>
                <Row gutter={gutter} style={{fontSize: 20}} className={styles.infoRow}>
                    <Col span={12}>实收金额</Col>
                    <Col span={12} style={{textAlign: "right"}  }>{fjzbb.record.receiveMoney}</Col>
                </Row>
            </Form>
        </Modal>

        <form action={fjzbb.linkOrigin+'report-api/report/export/recash'} method="post"  id='formOrderExport'>

            <input type="hidden" name="restaurantIds" value = {JSON.stringify(fjzbb.restaurantIds)} id='pay_way'/>
            <input type="hidden" name="startTime" value = {new Date(fjzbb.startTime).getTime()}/>
            <input type="hidden" name="endTime" value = {new Date(fjzbb.endTime).getTime()}/>
            <input type="hidden" name="resIdOrgNameMap" value = {JSON.stringify(fjzbb.resIdOrgNameMap)}/>            

        </form>

      </Header>
    );

}

FjzbbPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,fjzbb}) {
    return { menu,fjzbb };
}

export default connect(mapStateToProps)(FjzbbPage);

