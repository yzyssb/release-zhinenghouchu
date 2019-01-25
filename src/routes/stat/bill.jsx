import React, {PropTypes} from 'react';
import Header from '../../components/Header';
import {connect} from 'dva';
import Button from 'antd/lib/button';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Table from 'antd/lib/table';
import Modal from 'antd/lib/modal';
import Form from "antd/lib/form/index";
import Select from "antd/lib/select";
import {RangePicker} from 'antd/lib/date-picker';
import moment from 'moment';
import Checkbox  from 'antd/lib/checkbox';
import styles from './bill.less';
import Spin from 'antd/lib/spin';
import Input from 'antd/lib/input';
import common from './common.less';
import Breadcrumb from 'antd/lib/breadcrumb';
import Tree from 'antd/lib/tree';
import TreeSelect from 'antd/lib/tree-select';
const TreeNode = Tree.TreeNode;
import { Popover } from 'antd';

const _Form = ({visible, record, dispatch, bill, form: {getFieldDecorator, validateFields, getFieldsValue, resetFields}}) => {

    const handCancel = () => {
        dispatch({
            type: 'bill/updatePayload',
            payload: {modalVisible: false}
        })
    };

    const gutter = 12;
    const columns = [
        {title: '品名', dataIndex: 'foodName', key: 'foodName',className:common.left},
        {title: '单价', dataIndex: 'singlePrice', key: 'singlePrice',className:common.right},
        {title: '会员价', dataIndex: 'vipPrice', key: 'vipPrice',className:common.right},
        {title: '数量', dataIndex: 'num', key: 'num',className:common.right},
        {title: '总额', dataIndex: 'totalPrice', key: 'totalPrice',className:common.right},
    ];

    return (
        <Modal width='800px' visible={visible} title="结账单" onCancel={handCancel} afterClose={() => {
            resetFields()
        }}
               footer={[
                   <Button key="submit" type="primary" onClick={handCancel}>确认</Button>
               ]}
        >
            <Form>
                <Row gutter={gutter} className={styles.infoRow}>
                    <Col span={4}>账单号</Col>
                    <Col span={8}>{record.orderNo}</Col>
                    <Col span={4}>就餐方式</Col>
                    <Col span={8}>{record.eatType}</Col>
                </Row>
                <Row gutter={gutter} className={styles.infoRow}>
                    <Col span={4}>桌号</Col>
                    <Col span={8}>{record.tableCode}</Col>
                    <Col span={4}>人数</Col>
                    <Col span={8}>{record.peopleCount}</Col>
                </Row>
                <Row gutter={gutter} className={styles.infoRow}>
                    <Col span={4}>服务员</Col>
                    <Col span={8}>{record.waiterName}</Col>
                    <Col span={4}>收银员</Col>
                    <Col span={8}>{record.cashierName}</Col>
                </Row>
                <Row gutter={gutter} className={styles.infoRow}>
                    <Col span={4}>下单时间</Col>
                    <Col span={8}>{record.beginTime}</Col>
                    <Col span={4}>结账时间</Col>
                    <Col span={8}>{record.finishTime}</Col>
                </Row>
                <Row gutter={gutter} className={styles.infoRow}>
                    <Col span={4}>用户手机号</Col>
                    <Col span={8}>{record.phone}</Col>
                    <Col span={4}>所属企业</Col>
                    <Col span={8}>{record.zycompanyName}</Col>
                </Row>
                <Row gutter={gutter} className={styles.infoRow}>
                    <Col span={4}>配送地址</Col>
                    <Col span={8}>{record.address}</Col>
                </Row>
                <Table
                    className={common.yzy}
                    size="small"
                    columns={columns}
                    dataSource={bill.info.foodInfos}
                    pagination={false}
                    bordered/>

                <Row gutter={gutter} className={styles.infoRow} style={{display: record.boxMoney > 0 ? "block" : "none"}}>
                    <Col span={12}>餐盒费</Col>
                    <Col span={12} style={{textAlign: "right"}}>{record.boxMoney}</Col>
                </Row>
                <Row gutter={gutter} className={styles.infoRow} style={{display: record.serviceMoney > 0 ? "block" : "none"}}>
                    <Col span={12}>服务费</Col>
                    <Col span={12} style={{textAlign: "right"}}>{record.serviceMoney}</Col>
                </Row>
                <Row gutter={gutter} className={styles.infoRow} style={{display: bill.foodSumPrice < record.needMoney ? "block" : "none"}}>
                    <Col span={12}>菜品原价合计</Col>
                    <Col span={12} style={{textAlign: "right"}}>{bill.foodSumPrice/100}</Col>
                </Row>
                <Row gutter={gutter} className={styles.infoRow}>
                    {/* 应收合计 = 餐盒费 + 服务费 + 菜品原价合计 */}
                    <Col span={12}>应收合计</Col>
                    <Col span={12} style={{textAlign: "right"}}>{record.needMoney}</Col>
                </Row>
               
                {/* 抵扣金额 */}
                <Row gutter={gutter} className={styles.infoRow}>
                    {
                        bill.info.discountInfos && bill.info.discountInfos.map((item,index) => {
                            return <Row gutter={gutter} key={index}>
                                <Col span={12}>{item.discountName}</Col>
                                <Col span={12} style={{textAlign: "right"}}>{item.discountMoney}</Col>
                            </Row>
                        })
                    }
                </Row>
                <Row gutter={gutter} style={{fontSize: 20}} className={styles.infoRow}>
                    <Col span={12}>优惠合计</Col>
                    <Col span={12} style={{textAlign: "right"}  }>{record.giftMoney}</Col>
                </Row>
                 {/* 现金支付 */}
                <Row gutter={gutter} className={styles.infoRow}>
                    {
                        bill.info.payInfos && bill.info.payInfos.map((item,index) => {
                            return <Row gutter={gutter} key={index}>
                                <Col span={12}>{item.payName}</Col>
                                <Col span={12} style={{textAlign: "right"}}>{item.payMoney}</Col>
                            </Row>
                        })
                    }
                </Row>
                <Row gutter={gutter} style={{fontSize: 20}} className={styles.infoRow}>
                    <Col span={12}>实收金额</Col>
                    <Col span={12} style={{textAlign: "right"}  }>{record.receiveMoney}</Col>
                </Row>
            </Form>
        </Modal>
    );

};
const ViewForm = Form.create()(_Form);

function BillPage({menu, dispatch, bill, store}) {

    const HeaderProps = {
        menu,
        dispatch,
    };

    const {list, total, page, modalVisible, record} = bill;

    const columns = [
        {title: '序号', dataIndex: 'key', key: 'key',fixed:list.length==0?false:'left',width:60,className:common.right,render:(text,record,index)=>(<span>{(bill.page-1)*bill.size+(record.key+1)}</span>)},
        {title: '餐厅名称', dataIndex: 'orgName', key: 'orgName', fixed:list.length==0?false:'left',width:300,className: common.left,render:(text,record,index)=>(
            <Popover content={record.orgName}>
                <span className={common.yzy_line1}>{record.orgName}</span>
            </Popover>
        )},
        {title: '账单号', dataIndex: 'orderNo', key: 'orderNo',width:300, className: common.left},
        {title: '账单来源', dataIndex: 'source', key: 'source',width:100, className: common.left},
        {title: '就餐方式', dataIndex: 'eatType', key: 'eatType',width:100, className: common.left},
        {
            title: '开台时间',
            dataIndex: 'beginTime',
            key: 'beginTime',
            width:200,
            className: common.left
        },
        {
            title: '结账时间',
            dataIndex: 'finishTime',
            key: 'finishTime',
            width:200,
            className: common.left
        },
        {
            title: '区域名称',
            dataIndex: 'regionName',
            key: 'regionName',
            width:150,
            className: common.left
        },
        {
            title: '桌台名称',
            dataIndex: 'tableName',
            key: 'tableName',
            width:150,
            className: common.left
        },
        {
            title: '应收',
            dataIndex: 'needMoney',
            key: 'needMoney',
            width:100,
            className: common.right
        },
        {
            title: '实收',
            dataIndex: 'receiveMoney',
            key: 'receiveMoney',
            width:100,
            className: common.right
        },
        {
            title: '支付方式',
            dataIndex: 'payType',
            key: 'payType',
            width:100,
            className: common.left,
            render:(text,record,index)=>(
                <Popover content={record.payType}>
                    <span className={common.yzy_line2}>{record.payType}</span>
                </Popover>
            )
        },
        {
            title: '优免金额',
            dataIndex: 'giftMoney',
            key: 'giftMoney',
            width:100,
            className: common.right
        },
        {
            title: '收银员',
            dataIndex: 'cashierName',
            key: 'cashierName',
            width:130,
            className: common.left
        },
        {
            title: '服务员',
            dataIndex: 'waiterName',
            key: 'waiterName',
            width:130,
            className: common.left
        },
        {
            title: '会员手机号',
            dataIndex: 'phone',
            key: 'phone',
            width:150,
            className: common.right
        },
        // {
        //     title: '挂账人姓名',
        //     dataIndex: 'gmtCreate',
        //     key: 'gmtCreate',
        // },
        //{
        //    title: '服务费',
        //    dataIndex: 'serviceMoney',
        //    key: 'serviceMoney',
        //},
        {
            title: '操作', dataIndex: 'action', key: 'action',width:100,
            render: function (text, record, index) {
                return (<span>
                  <a onClick={() => {
                      view(text, record, index)
                  }}>查看</a>
                   {/*<span className="ant-divider"/>*/}
                </span>
                )
            }
        }
    ];

    const pagination = { //分页
        total: total,
        current: page,
        pageSize:bill.size,
        onChange: (pageNo) => {
            dispatch({type: 'bill/updatePayload', payload: {page: pageNo}});
            dispatch({type: 'bill/list',payload:{}});
        },
        showSizeChanger:true,
        onShowSizeChange:SizeChange
    };


    function SizeChange(current, pageSize){
        dispatch({type: 'bill/updatePayload',payload:{size:pageSize,page:1,offset:0}});
        dispatch({type: 'bill/list',payload:{}});
    }



    const modelProps = {  //弹框
        visible: modalVisible,
        record,
        bill,
        dispatch,
    };

    function view(text, record = {}, index) {
        dispatch({
            type: 'bill/info',
            payload: {
                id: record.id,
            }
        });
        dispatch({
            type: 'bill/updatePayload',
            payload: {
                record: record,
                modalVisible: true
            }
        });
    }

    const onSearchDateChange = (dates, dateStrings) => {
        dispatch({
            type: 'bill/updatePayload',
            payload: {
                startTime: dates[0],
                endTime: dates[1],
                static_days:'0'
            }
        });
    };

    const search = () => {
        dispatch({
            type: 'bill/updatePayload',
            payload: {
                page: 1
            }
        });
        dispatch({type: 'bill/list', payload: {}});
        dispatch({type: 'bill/stat', payload: {}});
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
            type:'bill/updatePayload',
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
			type:'bill/updatePayload',
			payload:{
				value:value,
				restaurantIds:arr,
				resIdOrgNameMap:obj
			}
		})
	}
	
	function treeExpand(value){
		dispatch({
			type:'bill/updatePayload',
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
      treeData:[bill.obj1],
      value: bill.value,
      onChange: treeChange,
      treeCheckable: true,
      //showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: '请选择',
      style: {
        width: 334,
        marginTop:20
      },
	  maxTagCount:1,
	  dropdownStyle:{
		maxHeight:300,
		overflowY:'scroll'
	  }
    };

    //账单号修改
    function noChange(e){
        console.log(e.target.value)
        dispatch({
            type:'bill/updatePayload',
            payload:{
                orderNo:e.target.value
            }
        })
    }

    //会员手机号修改
    function phoneChange(e){
        console.log(e.target.value)
        dispatch({
            type:'bill/updatePayload',
            payload:{
                phone:e.target.value
            }
        })
    }

    //区域名称修改
    function regionNameChange(e){
        console.log(e.target.value)
        dispatch({
            type:'bill/updatePayload',
            payload:{
                regionName:e.target.value
            }
        })
    }

    //桌台名称修改
    function tableNameChange(e){
        console.log(e.target.value)
        dispatch({
            type:'bill/updatePayload',
            payload:{
                tableName:e.target.value
            }
        })
    }

    //就餐方式修改
    function eatTypeChange(e){
        dispatch({
            type:'bill/updatePayload',
            payload:{
                eatType:e
            }
        })
    }

    return (
        <Header {...HeaderProps}>
            <div style={{background:'#eee',padding:'10px 20px'}}>
                <Breadcrumb separator=">">
                    <Breadcrumb.Item onClick={back} style={{cursor:'pointer'}}>营业报表</Breadcrumb.Item>
                    <Breadcrumb.Item>账单明细表</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <Spin spinning={bill.loading} style={{position:'absolute',width:'calc(100% - 50px)',height:'calc(100% - 70px)',paddingTop:'300px',zIndex:'99'}} size="large" />
            <div>
                <div className={common.yzy_search}>
                    <div>
                        <div className={common.searchBlock}>
                            <span className={common.yzy_txt}>选择时间：</span>
                            <RangePicker
                              showTime
                              format="YYYY-MM-DD HH:mm:ss"
                              value={[moment(bill.startTime), moment(bill.endTime)]}
                              allowClear={false}
                              onChange={onSearchDateChange}
                              className={common.yzy_datePicker}
                            />
                            <Select value={String(bill.static_days)} className={common.periods_1} onChange={chooseDuration}>
                                <Select.Option key="0">请选择时间跨度</Select.Option>
                                <Select.Option key="1">昨天</Select.Option>
                                <Select.Option key="2">今天</Select.Option>
                                <Select.Option key="7">近7天</Select.Option>
                                <Select.Option key="15">近15天</Select.Option>
                                <Select.Option key="30">近30天</Select.Option>
                            </Select>
                        </div>
                        <div className={common.searchBlock}>
                            <span className={common.yzy_txt}>选择就餐方式：</span>
                            <Select value={String(bill.eatType)} onChange={eatTypeChange} className={common.yzy_margin} style={{width: 120}}>
                                <Select.Option value="-1">全选</Select.Option>
                                <Select.Option value="0">堂食</Select.Option>
                                <Select.Option value="2">打包外带</Select.Option>
                                <Select.Option value="3">自营外卖</Select.Option>
                            </Select>
                        </div>
                        <div className={common.searchBlock}>
                            <span className={common.yzy_txt}>账单来源：</span>
                            <Select defaultValue={bill.sourceType} className={common.yzy_margin} onSelect={(value) => {
                                dispatch({
                                    type: 'bill/updatePayload',
                                    payload: {
                                        sourceType: value
                                    }
                                });
                            }} style={{width: 120}}>
                                <Select.Option value={""}>全部</Select.Option>
                                <Select.Option value={1}>pos收银端</Select.Option>
                                <Select.Option value={2}>h5扫码点餐</Select.Option>
                            </Select>
                        </div>
                        <Checkbox disabled checked className={common.yzy_txt}>0账单计入账单合计</Checkbox>
                        <div className={common.searchBlock}>
                            <span className={common.yzy_txt}>选择门店：</span>
                            <TreeSelect {...tProps} />
                        </div>
                        <div className={common.searchBlock}>
                            <span className={common.yzy_txt}>账单号：</span>
                            <Input className={common.input} value={bill.orderNo} onChange={noChange} />
                        </div>
                        <div className={common.searchBlock}>
                            <span className={common.yzy_txt}>会员手机号：</span>
                            <Input className={common.input} value={bill.phone} onChange={phoneChange} />
                        </div>
                        <div className={common.searchBlock}>
                            <span className={common.yzy_txt}>区域名称：</span>
                            <Input className={common.input} value={bill.regionName} onChange={regionNameChange} />
                        </div>
                        <div className={common.searchBlock}>
                            <span className={common.yzy_txt}>桌台名称：</span>
                            <Input className={common.input} value={bill.tableName} onChange={tableNameChange} />
                        </div>
                        <div className={common.searchBlock}>
                            <Button size="default" type="primary" className={common.btn_1} onClick={search}>搜索</Button>
                            <Button size="default" className={common.btn_2} onClick={
                                () => {
                                    dispatch({
                                        type: 'bill/_export',
                                        payload: {}
                                    })
                                }
                            }>导出</Button>
                        </div>
                    </div>
                </div>

                <Row gutter={16} className={styles.statRow}>
                    <Col span={8} className={styles.statCol}>
                        <div>账单数（单）</div>
                        <div>{bill.stat.orderCount?bill.stat.orderCount:'0'}</div>
                    </Col>
                    <Col span={8} className={styles.statCol}>
                        <div>应收合计（元）</div>
                        <div>{bill.stat.needMoney?bill.stat.needMoney:'0.00'}</div>
                    </Col>
                    <Col span={8}>
                        <div>实收合计（元）</div>
                        <div>{bill.stat.receiveMoney?bill.stat.receiveMoney:'0.00'}</div>
                    </Col>
                </Row>

                {list.length==0?
                    <Table
                        className={common.yzy}
                        columns={columns}
                        dataSource={list}
                        pagination={pagination}
                        size="small"
                        bordered
                    />
                :
                    <Table
                        className={common.yzy}
                        columns={columns}
                        dataSource={list}
                        pagination={pagination}
                        scroll={{x:2470,y:400}}
                        size="small"
                        bordered
                    />
                }
                
            </div>
            <ViewForm {...modelProps}/>
        </Header>
    );

}

BillPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu, bill, store}) {
    return {menu, bill, store};
}

export default connect(mapStateToProps)(BillPage);

