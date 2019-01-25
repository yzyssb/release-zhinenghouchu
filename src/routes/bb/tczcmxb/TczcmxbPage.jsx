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
import styles from './TczcmxbPage.less';
import common from '../common.less';
import Spin from 'antd/lib/spin';
import Input from 'antd/lib/input';
import moment from 'moment';
import DatePicker from 'antd/lib/date-picker';
const RangePicker = DatePicker.RangePicker;
import Button from 'antd/lib/button';
import Table from 'antd/lib/table';
import Select from 'antd/lib/select';
const Option=Select.Option
import Breadcrumb from 'antd/lib/breadcrumb';
import Tree from 'antd/lib/tree';
import TreeSelect from 'antd/lib/tree-select';
const TreeNode = Tree.TreeNode;
import message from 'antd/lib/message';


function TczcmxbPage ({menu,dispatch,tczcmxb}) {
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

    const pagination = {
        total: tczcmxb.total,
        current:tczcmxb.current,
        pageSize: tczcmxb.size,      
        
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger:true,
        onShowSizeChange:SizeChange
    };

    function SizeChange(current, pageSize){
        dispatch({type: 'tczcmxb/updatePayload',payload:{size:pageSize,current:1,start:0}});
        if(tczcmxb.cateType==1){
            /*dispatch({
                type:'tczcmxb/getTotalRes',
                payload:{}
            })*/
            dispatch({
                type:'tczcmxb/getListRes',
                payload:{}
            })
        }else{
            /*dispatch({
                type:'tczcmxb/getTotal',
                payload:{}
            })*/
            dispatch({
                type:'tczcmxb/getList',
                payload:{}
            })
        }
    }

    function onPageChange(pageNo){
        var offset = pageNo*tczcmxb.size-tczcmxb.size;
        dispatch({type: 'tczcmxb/updatePayload',payload:{start:offset,current:pageNo}});
        if(tczcmxb.cateType==1){
            /*dispatch({
                type:'tczcmxb/getTotalRes',
                payload:{}
            })*/
            dispatch({
                type:'tczcmxb/getListRes',
                payload:{}
            })
        }else{
            /*dispatch({
                type:'tczcmxb/getTotal',
                payload:{}
            })*/
            dispatch({
                type:'tczcmxb/getList',
                payload:{}
            })
        }
    }


    function onChange(item,key){
        dispatch({
            type:'tczcmxb/updatePayload',
           payload:{startTime:key[0],endTime:key[1],static_days:'0'}
        })
    }

    function onSearch(){
        dispatch({type: 'tczcmxb/updatePayload',payload:{current:1,start:0}});
        if(tczcmxb.cateType==1){
            /*dispatch({
                type:'tczcmxb/getTotalRes',
                payload:{}
            })*/
            dispatch({
                type:'tczcmxb/getListRes',
                payload:{}
            })
        }else{
            /*dispatch({
                type:'tczcmxb/getTotal',
                payload:{}
            })*/
            dispatch({
                type:'tczcmxb/getList',
                payload:{}
            })
        }
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
        tczcmxb.restaurantList.forEach((value,index)=>{
            key.forEach((val,idx)=>{
                if(val==value.id){
                    resIdOrgNameMap[value.id]=value.name
                    restaurantIds.push(String(value.id))
                }
            })
        })
        dispatch({
            type:'tczcmxb/updatePayload',
            payload:{restaurantIds:restaurantIds,resIdOrgNameMap:resIdOrgNameMap}
        })
    }

    function cateTypeChange(e){
        console.log(e)
        dispatch({
            type:'tczcmxb/updatePayload',
            payload:{
                cateType:e,
                current:1,
                start:0
            }
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
            type:'tczcmxb/updatePayload',
            payload:{startTime:startTime,endTime:endTime,static_days:t}
        })
    }

    function back(){
        window.history.go(-1)
    }
	
	
	/*function treeChange(value){
		let arr=[],obj={}
		if(value.length>0){
			value.map((v,i)=>{
				let id=v.split('-')[0],name=v.split('-')[1]
				arr.push(id)
				obj[String(id)]=name
			})
		}
		dispatch({
			type:'tczcmxb/updatePayload',
			payload:{
				value:value,
				restaurantIds:arr,
				resIdOrgNameMap:obj
			}
		})
	}*/

    function treeChange(value){
        
        let lastValue=tczcmxb.value,extraValue=[]
        console.log(lastValue,value)
        if(value.length>=lastValue.length){
            let exist=false
            if(value.length>0){
                value.map((v,i)=>{
                    exist=false
                    if(lastValue.length>0){
                        lastValue.map((vv,ii)=>{
                            if(v==vv){
                                console.log(1)
                                exist=true
                            }
                        })
                    }
                    console.log(exist)
                    if(!exist){
                        extraValue.push(v)
                    }
                })
            }
        }

        let valueParent=[],extraParent=[]
        if(value.length>=2&&extraValue.length>0){
            value.map((v,i)=>{
                tczcmxb.obj1.map((vv,ii)=>{
                    if(vv.children&&vv.children.length>0){
                        vv.children.map((vvv,iii)=>{
                            if(v.split('-')[0]==vvv.id&&valueParent.indexOf(vv.id)==-1){
                                valueParent.push(vv.id)
                            }
                        })
                    }
                })
            })
            extraValue.map((v,i)=>{
                tczcmxb.obj1.map((vv,ii)=>{
                    if(vv.children&&vv.children.length>0){
                        vv.children.map((vvv,iii)=>{
                            if(v.split('-')[0]==vvv.id&&extraParent.indexOf(vv.id)==-1){
                                extraParent.push(vv.id)
                            }
                        })
                    }
                })
            })
            console.log(valueParent,extraParent)

            let a=0
            if(valueParent.length==1){
                extraParent.map((v,i)=>{
                    valueParent.map((vv,ii)=>{
                        if(v==vv){
                            a++
                        }
                    })
                })
            }else{
                value=extraValue
            }
            if(a!=extraParent.length){
                value=extraValue
            }
        }

        console.log(value)
        let brandId=null,specials=[]
        if(value.length>0){
            tczcmxb.obj1.map((vv,ii)=>{
                if(vv.children&&vv.children.length>0){
                    vv.children.map((vvv,iii)=>{
                        if(vv.id=='-0'){
                            value.map((h)=>{
                                if(vvv.id==h.split('-')[0]&&specials.indexOf(vvv.id)==-1){
                                    specials.push(vvv.id)
                                }
                            })
                        }else{
                            if(vvv.id==value[0].split('-')[0]){
                                brandId=vvv.brandId
                            }
                        }
                    })
                }
            })
        }

        console.log(brandId,specials)

        let arr=[],obj={}
        if(value.length>0){
            value.map((v,i)=>{
                let id=v.split('-')[0],name=v.split('-')[1]
                arr.push(id)
                obj[String(id)]=name
            })
        }
        dispatch({
            type:'tczcmxb/updatePayload',
            payload:{
                value:value,
                restaurantIds:arr,
                resIdOrgNameMap:obj
            }
        })

        if(brandId&&specials.length==0){
            dispatch({
                type:'tczcmxb/foodList',
                payload:{
                    brandId:brandId
                }
            })
        }else if(!brandId&&specials.length>0){
            dispatch({
                type:'tczcmxb/foodList1',
                payload:{
                    restaurantIds:specials
                }
            })
        }else{
            dispatch({
                type:'tczcmxb/updatePayload',
                payload:{
                    cateList:[]
                }
            })
        }
    }
	
	function treeExpand(value){
		dispatch({
			type:'tczcmxb/updatePayload',
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
      //treeData:[tczcmxb.obj1],
      treeData:tczcmxb.obj1,
      value: tczcmxb.value,
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

    //会员手机号修改
    function phoneChange(e){
        dispatch({
            type:'tczcmxb/updatePayload',
            payload:{
                phone:e.target.value
            }
        })
    }

    //退菜原因修改
    function retreatReasonChange(e){
        dispatch({
            type:'tczcmxb/updatePayload',
            payload:{
                retreatReason:e.target.value
            }
        })
    }

    //赠菜原因修改
    function giftReasonChange(e){
        dispatch({
            type:'tczcmxb/updatePayload',
            payload:{
                giftReason:e.target.value
            }
        })
    }

    //操作员修改
    function optPersonNameChange(e){
        dispatch({
            type:'tczcmxb/updatePayload',
            payload:{
                optPersonName:e.target.value
            }
        })
    }

    //菜品修改
    function cateChange(e){
        console.log(e)
        dispatch({
            type:'tczcmxb/updatePayload',
            payload:{
                foodNames:e
            }
        })
    }


    function focus(){
        if(tczcmxb.cateList.length==0&&tczcmxb.value.length==0){
            message.error('请先选择门店')
        }
    }

    //就餐方式修改
    function eatTypeChange(e){
        dispatch({
            type:'tczcmxb/updatePayload',
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
                <Breadcrumb.Item>退菜赠菜明细表</Breadcrumb.Item>
            </Breadcrumb>
        </div>
        <Spin spinning={tczcmxb.loading}style={{position:'absolute',width:'calc(100% - 50px)',height:'calc(100% - 70px)',paddingTop:'300px',zIndex:'99'}} size="large" />
        <div>
            <div className={common.yzy_search}>
                <div>
                    <div className={common.searchBlock}>
                        <span className={common.yzy_txt}>选择时间：</span>
                        <RangePicker
                          showTime
                          format="YYYY-MM-DD HH:mm:ss"
                          value={[moment(tczcmxb.startTime), moment(tczcmxb.endTime)]}
                          allowClear={false}
                          onChange={onChange}
                          className={common.yzy_datePicker}
                        />
                        <Select value={String(tczcmxb.static_days)} className={common.periods_1} onChange={chooseDuration}>
                            <Select.Option key="0">请选择时间跨度</Select.Option>
                            <Select.Option key="1">昨天</Select.Option>
                            <Select.Option key="2">今天</Select.Option>
                            <Select.Option key="7">近7天</Select.Option>
                            <Select.Option key="15">近15天</Select.Option>
                            <Select.Option key="30">近30天</Select.Option>
                        </Select>
                    </div>
                    <div className={common.searchBlock}>
                        <span className={common.yzy_txt}>退菜/赠菜：</span>
                        <Select onChange={cateTypeChange} value={String(tczcmxb.cateType)}  className={common.yzy_margin}>
                            <Option key="1">退菜</Option>
                            <Option key="2">赠菜</Option>
                        </Select>
                    </div>
                    <div className={common.searchBlock}>
                        <span className={common.yzy_txt}>选择门店：</span>
                        <TreeSelect {...tProps} />
                    </div>
                    <div className={common.searchBlock}>
                        <span className={common.yzy_txt}>菜品：</span>
                        <Select placeholder="请选择菜品" mode="multiple" style={{minWidth:200}} maxTagCount={1} onChange={cateChange} onFocus={focus}>
                            {tczcmxb.cateList.length>0&&tczcmxb.cateList.map((v,i)=>(
                                <Option key={v}>{v}</Option>
                            ))}
                        </Select>
                    </div>
                    <div className={common.searchBlock}>
                        <span className={common.yzy_txt}>会员手机号：</span>
                        <Input className={common.input} value={tczcmxb.phone} onChange={phoneChange} />
                    </div>
                    {tczcmxb.cateType==1?
                        <span>
                            <div className={common.searchBlock}>
                                <span className={common.yzy_txt}>退菜原因：</span>
                                <Input className={common.input} value={tczcmxb.retreatReason} onChange={retreatReasonChange} />
                            </div>
                            <div className={common.searchBlock} style={{display:'none'}}>
                                <span className={common.yzy_txt}>赠菜原因：</span>
                                <Input className={common.input} value={tczcmxb.giftReason} onChange={giftReasonChange} />
                            </div>
                        </span>
                    :
                        <span>
                            <div className={common.searchBlock} style={{display:'none'}}>
                                <span className={common.yzy_txt}>退菜原因：</span>
                                <Input className={common.input} value={tczcmxb.retreatReason} onChange={retreatReasonChange} />
                            </div>
                            <div className={common.searchBlock}>
                                <span className={common.yzy_txt}>赠菜原因：</span>
                                <Input className={common.input} value={tczcmxb.giftReason} onChange={giftReasonChange} />
                            </div>
                        </span>
                    }
                    <div className={common.searchBlock}>
                        <span className={common.yzy_txt}>操作员：</span>
                        <Input className={common.input} value={tczcmxb.optPersonName} onChange={optPersonNameChange} />
                    </div>
                    {tczcmxb.cateType==1&&
                        <div className={common.searchBlock}>
                            <span className={common.yzy_txt}>选择就餐方式：</span>
                            <Select value={String(tczcmxb.eatType)} onChange={eatTypeChange} className={common.yzy_margin} style={{width: 120}}>
                                <Select.Option value="-1">全选</Select.Option>
                                <Select.Option value="0">堂食</Select.Option>
                                <Select.Option value="2">打包外带</Select.Option>
                                <Select.Option value="3">自营外卖</Select.Option>
                            </Select>
                        </div>
                    }
                    <div className={common.searchBlock}>
                        <Button size="default" type="primary" className={common.btn_1} onClick={onSearch}>搜索</Button>
                        <Button size="default" className={common.btn_2} onClick={getOutForm}>导出</Button>
                    </div>
                </div>
            </div>
            
            

            {/*<div className={styles.box}>
                <div className={styles.left}>
                    <span className={styles.txt}>数量</span>
                    <span className={styles.num}>{tczcmxb.Base.num||'0'}</span>
                </div>
                <div className={styles.right}>
                    <span className={styles.txt}>金额</span>
                    <span className={styles.num}>{tczcmxb.Base.money||'0.00'}</span>
                </div>
            </div>*/}

            {tczcmxb.Detail.length==0?
                <Table
                    className={common.yzy}
                    bordered
                    columns={tczcmxb.columns}
                    dataSource={tczcmxb.Detail}
                    pagination={pagination}
                    size="small"
                 />
            :
                <Table
                    className={common.yzy}
                    bordered
                    columns={tczcmxb.columns}
                    dataSource={tczcmxb.Detail}
                    pagination={pagination}
                    scroll={{x:tczcmxb.scrollX,y:400}}
                    size="small"
                 />
            }
            
            
        </div>
        

        {tczcmxb.cateType==1?(
            <form action={tczcmxb.linkOrigin+'report-api/report/export/retreat'} method="post"  id='formOrderExport'>
            

                <input type="hidden" name="restaurantIds" value = {JSON.stringify(tczcmxb.restaurantIds)}/>
                <input type="hidden" name="startTime" value = {new Date(tczcmxb.startTime).getTime()}/>
                <input type="hidden" name="endTime" value = {new Date(tczcmxb.endTime).getTime()}/>
                <input type="hidden" name="resIdOrgNameMap" value = {JSON.stringify(tczcmxb.resIdOrgNameMap)}/>

                <input type="hidden" name="foodNames" value = {JSON.stringify(tczcmxb.foodNames)}/>
                <input type="hidden" name="phone" value = {tczcmxb.phone}/>
                <input type="hidden" name="retreatReason" value = {tczcmxb.retreatReason}/>
                <input type="hidden" name="optPersonName" value = {tczcmxb.optPersonName}/>
                {tczcmxb.eatType!=-1&&<input type="hidden" name="eatType" value = {+tczcmxb.eatType}/>}  

                <input type="hidden" name="token" value = {JSON.stringify(getUserToken())}/>

            </form> 
        ):(
            <form action={tczcmxb.linkOrigin+'report-api/report/export/gift'} method="post"  id='formOrderExport'>
            

                <input type="hidden" name="restaurantIds" value = {JSON.stringify(tczcmxb.restaurantIds)}/>
                <input type="hidden" name="startTime" value = {new Date(tczcmxb.startTime).getTime()}/>
                <input type="hidden" name="endTime" value = {new Date(tczcmxb.endTime).getTime()}/>
                <input type="hidden" name="resIdOrgNameMap" value = {JSON.stringify(tczcmxb.resIdOrgNameMap)}/>

                <input type="hidden" name="foodNames" value = {JSON.stringify(tczcmxb.foodNames)}/>
                <input type="hidden" name="phone" value = {tczcmxb.phone}/>
                <input type="hidden" name="giftReason" value = {tczcmxb.giftReason}/>
                <input type="hidden" name="optPersonName" value = {tczcmxb.optPersonName}/>

                <input type="hidden" name="token" value = {JSON.stringify(getUserToken())}/>

            </form>
        )}

      </Header>
    );

}

TczcmxbPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,tczcmxb}) {
    return { menu,tczcmxb };
}

export default connect(mapStateToProps)(TczcmxbPage);

