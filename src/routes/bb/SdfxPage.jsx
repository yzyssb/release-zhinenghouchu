import React, { PropTypes } from 'react';
import Header from '../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../components/LeftMenu';
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
import styles from './SdfxPage.less';
import Radio from 'antd/lib/radio';
const RadioGroup = Radio.Group;
import common from './common.less';
import Tree from 'antd/lib/tree';
import TreeSelect from 'antd/lib/tree-select';
const TreeNode = Tree.TreeNode;


function SdfxPage ({menu,dispatch,sdfx}) {
    const HeaderProps = {
        menu,
        dispatch,
    };

    function callback(e){
        dispatch({
            type:'sdfx/updatePayload',
            payload:{
                activeKey:e,
                filteredInfo:null
            }
        })
        if(e==1){
            dispatch({
                type:'sdfx/analyseFoodStat',
                payload:{}
            })
        }else if(e==2){
            dispatch({
                type:'sdfx/analyseResStat',
                payload:{}
            })
        }
    }

    const timeList1=['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00']
    const timeList2=['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00','24:00']


    const pagination = {
        current:sdfx.current,
        pageSize: sdfx.size,
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger:true,
        onShowSizeChange:SizeChange
    };

    function SizeChange(current, pageSize){
        dispatch({type: 'sdfx/updatePayload',payload:{size:pageSize,current:1,offset:0}});
    }

    function onPageChange(pageNo){
        var offset = pageNo*sdfx.size-sdfx.size;
        dispatch({type: 'sdfx/updatePayload',payload:{offset:offset,current:pageNo}});
    }

    function rangeChange(a,keys){
        dispatch({
            type:'sdfx/updatePayload',
            payload:{
                startTime:moment(new Date(keys[0])).format('YYYY-MM-DD 00:00:00'),
                endTime:moment(new Date(keys[1])).format('YYYY-MM-DD 23:59:59')
            }
        })
    }

    function rangeChange1(a,keys){
        dispatch({
            type:'sdfx/updatePayload',
            payload:{
                startTime1:moment(new Date(keys[0])).format('YYYY-MM-DD 00:00:00'),
                endTime1:moment(new Date(keys[1])).format('YYYY-MM-DD 23:59:59')
            }
        })
    }

    function multiChange(key){
        let resIdOrgNameMap={},restaurantIds=[]
        sdfx.restaurantList.forEach((value,index)=>{
            key.forEach((val,idx)=>{
                if(val==value.id){
                    resIdOrgNameMap[value.id]=value.name
                    restaurantIds.push(String(value.id))
                }
            })
        })
        dispatch({
            type:'sdfx/updatePayload',
            payload:{restaurantIds:restaurantIds,resIdOrgNameMap:resIdOrgNameMap}
        })
    }

    function compareNum(a,b){
        let c=Number(a.split(':')[0]),d=Number(b.split(':')[0])
        return d-c
    }

    function numPlus(a){
        let b=Number(a.split(':')[0])+1
        return b<10?('0'+b+':00'):(b+':00')
    }

    function numMinus(a){
        let b=Number(a.split(':')[0])-1
        b=b>0?b:0
        return b<10?('0'+b+':00'):(b+':00')
    }

    function cc(a,b,type){//变量1的值，变量2的值，改变的是变量1还是变量2
        let arr=[]
        if(type==1){
            arr.push(a)
            if(compareNum(a,b)>0){
                arr.push(b)
            }else{
                arr.push(numPlus(a))
            }
        }else{
            if(compareNum(a,b)>0){
                arr.push(a)
            }else{
                arr.push(numMinus(b))
            }
            arr.push(b)
        }
        return arr
    }

    function panchong(){
        let arr1=[sdfx.time1,sdfx.time2],
            arr2=[sdfx.time3,sdfx.time4],
            arr3=[sdfx.time5,sdfx.time6],
            arr4=[sdfx.time7,sdfx.time8],
            arr5=[sdfx.time9,sdfx.time10],
            arr6=[sdfx.time11,sdfx.time12],
            arr=[arr1,arr2,arr3,arr4,arr5,arr6],
            aa=[],bb=[]
        arr.map((v,i)=>{
            let a=v.length
            v.map((vv,ii)=>{
                if(vv=='00:00'){
                    a--
                }
            })
            if(a>0){
                aa.push(v)
                bb.push(i)
            }
        })
        return [aa,bb]
    }

    function durationChange1(e){
        let arr=cc(e,sdfx.time2,1)
        dispatch({
            type:'sdfx/updatePayload',
            payload:{
                time1:arr[0],
                time2:arr[1]
            }
        })
    }
    function durationChange2(e){
        let arr=cc(sdfx.time1,e,2)
        dispatch({
            type:'sdfx/updatePayload',
            payload:{
                time1:arr[0],
                time2:arr[1]
            }
        })
    }

    function durationChange3(e){
        let arr=cc(e,sdfx.time4,1)
        dispatch({
            type:'sdfx/updatePayload',
            payload:{
                time3:arr[0],
                time4:arr[1]
            }
        })
    }

    function durationChange4(e){
        let arr=cc(sdfx.time3,e,2)
        dispatch({
            type:'sdfx/updatePayload',
            payload:{
                time3:arr[0],
                time4:arr[1]
            }
        })
    }

    function durationChange5(e){
        let arr=cc(e,sdfx.time6,1)
        dispatch({
            type:'sdfx/updatePayload',
            payload:{
                time5:arr[0],
                time6:arr[1]
            }
        })
    }

    function durationChange6(e){
        let arr=cc(sdfx.time5,e,2)
        dispatch({
            type:'sdfx/updatePayload',
            payload:{
                time5:arr[0],
                time6:arr[1]
            }
        })
    }

    function durationChange7(e){
        let arr=cc(e,sdfx.time8,1)
        dispatch({
            type:'sdfx/updatePayload',
            payload:{
                time7:arr[0],
                time8:arr[1]
            }
        })
    }

    function durationChange8(e){
        let arr=cc(sdfx.time7,e,2)
        dispatch({
            type:'sdfx/updatePayload',
            payload:{
                time7:arr[0],
                time8:arr[1]
            }
        })
    }

    function durationChange9(e){
        let arr=cc(e,sdfx.time10,1)
        dispatch({
            type:'sdfx/updatePayload',
            payload:{
                time9:arr[0],
                time10:arr[1]
            }
        })
    }

    function durationChange10(e){
        let arr=cc(sdfx.time9,e,2)
        dispatch({
            type:'sdfx/updatePayload',
            payload:{
                time9:arr[0],
                time10:arr[1]
            }
        })
    }

    function durationChange11(e){
        let arr=cc(e,sdfx.time12,1)
        dispatch({
            type:'sdfx/updatePayload',
            payload:{
                time11:arr[0],
                time12:arr[1]
            }
        })
    }

    function durationChange12(e){
        let arr=cc(sdfx.time11,e,2)
        dispatch({
            type:'sdfx/updatePayload',
            payload:{
                time11:arr[0],
                time12:arr[1]
            }
        })
    }

    function radioChange(e){
        dispatch({
            type:'sdfx/updatePayload',
            payload:{
                queryType:e
            }
        })
    }

    function searchAction(){
        let startTime=new Date(sdfx.startTime).getTime(),endTime=new Date(sdfx.endTime).getTime()
        if((endTime-startTime)>65*24*3600*1000){
            message.error('亲，日期跨度太大了，我们最多可查询65天的数据！')
            return
        }

        let res=panchong(),periods=[],arr=res[0],idxArr=res[1]
        console.log(arr)
        for(let i=0;i<arr.length;i++){
            periods.push({})
            periods[periods.length-1].startHour=+(arr[i][0].split(':')[0])
            periods[periods.length-1].endHour=+(arr[i][1].split(':')[0])
        }
        dispatch({
            type:'sdfx/updatePayload',
            payload:{
                periods:periods,
                current:1,
                idxArr:idxArr
            }
        })
        dispatch({
            type:'sdfx/analyseFoodStat',
            payload:{}
        })
    }

    function loadOut(){
        let startTime=new Date(sdfx.startTime).getTime(),endTime=new Date(sdfx.endTime).getTime()
        if((endTime-startTime)>65*24*3600*1000){
            message.error('亲，日期跨度太大了，我们最多可查询65天的数据！')
            return
        }
        let res=panchong(),periods=[],arr=res[0],idxArr=res[1]
        console.log(arr)
        for(let i=0;i<arr.length;i++){
            periods.push({})
            periods[periods.length-1].startHour=+(arr[i][0].split(':')[0])
            periods[periods.length-1].endHour=+(arr[i][1].split(':')[0])
        }
        dispatch({
            type:'sdfx/updatePayload',
            payload:{
                periods:periods,
                idxArr:idxArr
            }
        })
        document.getElementById("formOrderExport").submit();
    }

    function loadOut1(){
        let startTime=new Date(sdfx.startTime).getTime(),endTime=new Date(sdfx.endTime).getTime()
        if((endTime-startTime)>65*24*3600*1000){
            message.error('亲，日期跨度太大了，我们最多可查询65天的数据！')
            return
        }
        let res=panchong(),periods=[],arr=res[0],idxArr=res[1]
        console.log(arr)
        for(let i=0;i<arr.length;i++){
            periods.push({})
            periods[periods.length-1].startHour=+(arr[i][0].split(':')[0])
            periods[periods.length-1].endHour=+(arr[i][1].split(':')[0])
        }
        dispatch({
            type:'sdfx/updatePayload',
            payload:{
                periods:periods,
                idxArr:idxArr
            }
        })
        document.getElementById("formOrderExport1").submit();
    }

    function searchAction1(){
        let startTime=new Date(sdfx.startTime).getTime(),endTime=new Date(sdfx.endTime).getTime()
        if((endTime-startTime)>65*24*3600*1000){
            message.error('亲，日期跨度太大了，我们最多可查询65天的数据！')
            return
        }
        let res=panchong(),periods=[],arr=res[0],idxArr=res[1]
        console.log(arr)
        for(let i=0;i<arr.length;i++){
            periods.push({})
            periods[periods.length-1].startHour=+(arr[i][0].split(':')[0])
            periods[periods.length-1].endHour=+(arr[i][1].split(':')[0])
        }
        dispatch({
            type:'sdfx/updatePayload',
            payload:{
                periods:periods,
                current:1,
                idxArr:idxArr
            }
        })
        dispatch({
            type:'sdfx/analyseResStat',
            payload:{}
        })
    }

    function cpChange(keys){
        console.log(keys)
        dispatch({
            type:'sdfx/updatePayload',
            payload:{
                foodNames:keys
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
			type:'sdfx/updatePayload',
			payload:{
				value:value,
				restaurantIds:arr,
				resIdOrgNameMap:obj
			}
		})
	}

    function treeChange1(value){
        let arr=[],obj={}
        if(value.length>0){
            value.map((v,i)=>{
                let id=v.split('-')[0],name=v.split('-')[1]
                arr.push(id)
                obj[String(id)]=name
            })
        }
        dispatch({
            type:'sdfx/updatePayload',
            payload:{
                value1:value,
                restaurantIds1:arr,
                resIdOrgNameMap1:obj
            }
        })
    }
	
	function treeExpand(value){
		dispatch({
			type:'sdfx/updatePayload',
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
      treeData:[sdfx.obj1],
      value: sdfx.value,
      onChange: treeChange,
      treeCheckable: true,
      //showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: '请选择门店',
      style: {
        width: 'auto',
        minWidth:300,
        marginTop:20
      },
	  maxTagCount:1,
	  dropdownStyle:{
		maxHeight:300,
		overflowY:'scroll'
	  }
    };

    const tProps1 = {
      treeData:[sdfx.obj1],
      value: sdfx.value1,
      onChange: treeChange1,
      treeCheckable: true,
      //showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: '请选择门店',
      style: {
        width: 'auto',
        minWidth:300,
      },
      maxTagCount:1,
      dropdownStyle:{
        maxHeight:300,
        overflowY:'scroll'
      }
    };

    const handleChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        dispatch({
            type:'sdfx/updatePayload',
            payload:{
                filteredInfo: filters,
            }
        })
    }

    //就餐方式修改
    function eatTypeChange(e){
        dispatch({
            type:'sdfx/updatePayload',
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
                <Breadcrumb.Item>时段分析</Breadcrumb.Item>
            </Breadcrumb>
        </div>
        <Spin spinning={sdfx.loading} style={{position:'absolute',width:'calc(100% - 50px)',height:'calc(100% - 70px)',paddingTop:'300px',zIndex:'99'}} size="large" />

        <Tabs activeKey={String(sdfx.activeKey)} onChange={callback}>
            <TabPane tab="菜品分析" key="1">
                <div className={styles.line1}>
                    <div className={styles.line1_1}>
                        选择分析时段：
                    </div>
                    <div className={styles.line1_2}>
                        <div className={styles.line1_2_0}>
                            <div className={styles.subline}>
                                <span className={styles.line1_2_1}>时段一：</span>
                                <Select style={{width:90}} value={String(sdfx.time1)} onChange={durationChange1}>
                                    {timeList1.map((v,i)=>(<Option key={String(v)}>{v}</Option>))}
                                </Select>
                                <span className={styles.line1_2_2}> -- </span>
                                <Select style={{width:90}} value={String(sdfx.time2)} onChange={durationChange2}>
                                    {timeList2.map((v,i)=>(<Option key={String(v)}>{v}</Option>))}
                                </Select>
                            </div>
                            <div className={styles.subline}>
                                <span className={styles.line1_2_1}>时段二：</span>
                                <Select style={{width:90}} value={String(sdfx.time3)} onChange={durationChange3}>
                                    {timeList1.map((v,i)=>(<Option key={String(v)}>{v}</Option>))}
                                </Select>
                                <span className={styles.line1_2_2}> -- </span>
                                <Select style={{width:90}} value={String(sdfx.time4)} onChange={durationChange4}>
                                    {timeList2.map((v,i)=>(<Option key={String(v)}>{v}</Option>))}
                                </Select>
                            </div>
                            <div className={styles.subline}>
                                <span className={styles.line1_2_1}>时段三：</span>
                                <Select style={{width:90}} value={String(sdfx.time5)} onChange={durationChange5}>
                                    {timeList1.map((v,i)=>(<Option key={String(v)}>{v}</Option>))}
                                </Select>
                                <span className={styles.line1_2_2}> -- </span>
                                <Select style={{width:90}} value={String(sdfx.time6)} onChange={durationChange6}>
                                    {timeList2.map((v,i)=>(<Option key={String(v)}>{v}</Option>))}
                                </Select>
                            </div>
                        </div>
                        <div className={styles.line1_2_0}>
                            <div className={styles.subline}>
                                <span className={styles.line1_2_1}>时段四：</span>
                                <Select style={{width:90}} value={String(sdfx.time7)} onChange={durationChange7}>
                                    {timeList1.map((v,i)=>(<Option key={String(v)}>{v}</Option>))}
                                </Select>
                                <span className={styles.line1_2_2}> -- </span>
                                <Select style={{width:90}} value={String(sdfx.time8)} onChange={durationChange8}>
                                    {timeList2.map((v,i)=>(<Option key={String(v)}>{v}</Option>))}
                                </Select>
                            </div>
                            <div className={styles.subline}>
                                <span className={styles.line1_2_1}>时段五：</span>
                                <Select style={{width:90}} value={String(sdfx.time9)} onChange={durationChange9}>
                                    {timeList1.map((v,i)=>(<Option key={String(v)}>{v}</Option>))}
                                </Select>
                                <span className={styles.line1_2_2}> -- </span>
                                <Select style={{width:90}} value={String(sdfx.time10)} onChange={durationChange10}>
                                    {timeList2.map((v,i)=>(<Option key={String(v)}>{v}</Option>))}
                                </Select>
                            </div>
                            <div className={styles.subline}>
                                <span className={styles.line1_2_1}>时段六：</span>
                                <Select style={{width:90}} value={String(sdfx.time11)} onChange={durationChange11}>
                                    {timeList1.map((v,i)=>(<Option key={String(v)}>{v}</Option>))}
                                </Select>
                                <span className={styles.line1_2_2}> -- </span>
                                <Select style={{width:90}} value={String(sdfx.time12)} onChange={durationChange12}>
                                    {timeList2.map((v,i)=>(<Option key={String(v)}>{v}</Option>))}
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className={styles.line2}>
                    <div className={styles.line2_1}>
                        选择分析日期：
                    </div>
                    <RangePicker
                        format="YYYY-MM-DD"
                        allowClear={false}
                        style={{width:250}}
                        value={[moment(sdfx.startTime),moment(sdfx.endTime)]}
                        onChange={rangeChange}
                    />
                    <div className={styles.line2_1} style={{marginLeft:'20px'}}>
                        选择组织机构：
                    </div>
					<TreeSelect {...tProps} />
                    <div className={styles.line2_1} style={{position:'absolute',left:'820px',width:80}}>
                        分析维度：
                    </div>
                    <Select className={styles.line2_2} style={{position:'absolute',left:'900px',width:150}} value={+sdfx.queryType} onChange={radioChange}>
                        <Select.Option value={3}>菜品分类</Select.Option>
                        <Select.Option value={2}>单品+套餐</Select.Option>
                        <Select.Option value={1}>单品+套餐明细</Select.Option>
                    </Select>
                </div>
                <div className={styles.line2}>
                    <Button type="primary" style={{marginRight:'20px'}} onClick={searchAction}>查询</Button>
                    <Button onClick={loadOut}>导出</Button>
                </div> */}

                <div>
                    <div className={common.searchBlock} style={{marginRight:'20px'}}>
                        <span>选择分析日期：</span>
                        <RangePicker
                            format="YYYY-MM-DD"
                            allowClear={false}
                            style={{width:250}}
                            value={[moment(sdfx.startTime),moment(sdfx.endTime)]}
                            onChange={rangeChange}
                        />
                    </div>
                    <div className={common.searchBlock} style={{marginRight:'20px'}}>
                        <span>选择组织机构：</span>
                        <TreeSelect {...tProps} />
                    </div>
                    <div className={common.searchBlock} style={{marginRight:'20px'}}>
                        <span>分析维度：</span>
                        <Select className={common.yzy_margin} value={+sdfx.queryType} onChange={radioChange}>
                            <Select.Option value={3}>菜品分类</Select.Option>
                            <Select.Option value={2}>单品+套餐</Select.Option>
                            <Select.Option value={1}>单品+套餐明细</Select.Option>
                        </Select>
                    </div>
                    <div className={common.searchBlock} style={{marginRight:'20px'}}>
                        <span>选择就餐方式：</span>
                        <Select value={String(sdfx.eatType)} onChange={eatTypeChange} className={common.yzy_margin} style={{width:120}}>
                            <Select.Option value="-1">全选</Select.Option>
                            <Select.Option value="0">堂食</Select.Option>
                            <Select.Option value="2">打包外带</Select.Option>
                            <Select.Option value="3">自营外卖</Select.Option>
                        </Select>
                    </div>
                </div>
                <div style={{marginTop:20}}>
                    <div className={common.searchBlock}>
                        <Button type="primary" style={{marginRight:'20px'}} onClick={searchAction}>查询</Button>
                        <Button onClick={loadOut}>导出</Button>
                    </div>
                </div>

                {sdfx.list.length==0?
                    <Table
                        className={common.yzy}
                        style={{marginTop:'20px'}}
                        columns={sdfx.columns}
                        dataSource={sdfx.list}
                        bordered
                        size="small"
                        pagination={pagination}
                    />
                :
                    <Table
                        className={common.yzy}
                        style={{marginTop:'20px'}}
                        columns={sdfx.columns}
                        dataSource={sdfx.list}
                        bordered
                        size="small"
                        scroll={{x:sdfx.scrollX,y:400}}
                        pagination={pagination}
                    />
                }
                

                <form action={sdfx.linkOrigin+'report-api/report/export/analyse-food'} method="post"  id='formOrderExport'>
            
                    <input type="hidden" name="restaurantIds" value = {JSON.stringify(sdfx.restaurantIds)}/>
                    <input type="hidden" name="startTime" value = {new Date(sdfx.startTime).getTime()}/>
                    <input type="hidden" name="endTime" value = {new Date(sdfx.endTime).getTime()}/>
                    <input type="hidden" name="resIdOrgNameMap" value = {JSON.stringify(sdfx.resIdOrgNameMap)}/>
                    <input type="hidden" name="queryType" value = {+sdfx.queryType}/>
                    {sdfx.eatType!=-1&&<input type="hidden" name="eatType" value = {+sdfx.eatType}/>}
                    <input type="hidden" name="periods" value = {JSON.stringify(sdfx.periods)}/>

                </form>
            </TabPane>
            <TabPane tab="餐厅分析" key="2">
                <div className={styles.line1}>
                    <div className={styles.line1_1}>
                        选择分析时段：
                    </div>
                    <div className={styles.line1_2}>
                        <div className={styles.line1_2_0}>
                            <div className={styles.subline}>
                                <span className={styles.line1_2_1}>时段一：</span>
                                <Select style={{width:90}} value={String(sdfx.time1)} onChange={durationChange1}>
                                    {timeList1.map((v,i)=>(<Option key={String(v)}>{v}</Option>))}
                                </Select>
                                <span className={styles.line1_2_2}> -- </span>
                                <Select style={{width:90}} value={String(sdfx.time2)} onChange={durationChange2}>
                                    {timeList2.map((v,i)=>(<Option key={String(v)}>{v}</Option>))}
                                </Select>
                            </div>
                            <div className={styles.subline}>
                                <span className={styles.line1_2_1}>时段二：</span>
                                <Select style={{width:90}} value={String(sdfx.time3)} onChange={durationChange3}>
                                    {timeList1.map((v,i)=>(<Option key={String(v)}>{v}</Option>))}
                                </Select>
                                <span className={styles.line1_2_2}> -- </span>
                                <Select style={{width:90}} value={String(sdfx.time4)} onChange={durationChange4}>
                                    {timeList2.map((v,i)=>(<Option key={String(v)}>{v}</Option>))}
                                </Select>
                            </div>
                            <div className={styles.subline}>
                                <span className={styles.line1_2_1}>时段三：</span>
                                <Select style={{width:90}} value={String(sdfx.time5)} onChange={durationChange5}>
                                    {timeList1.map((v,i)=>(<Option key={String(v)}>{v}</Option>))}
                                </Select>
                                <span className={styles.line1_2_2}> -- </span>
                                <Select style={{width:90}} value={String(sdfx.time6)} onChange={durationChange6}>
                                    {timeList2.map((v,i)=>(<Option key={String(v)}>{v}</Option>))}
                                </Select>
                            </div>
                        </div>
                        <div className={styles.line1_2_0}>
                            <div className={styles.subline}>
                                <span className={styles.line1_2_1}>时段四：</span>
                                <Select style={{width:90}} value={String(sdfx.time7)} onChange={durationChange7}>
                                    {timeList1.map((v,i)=>(<Option key={String(v)}>{v}</Option>))}
                                </Select>
                                <span className={styles.line1_2_2}> -- </span>
                                <Select style={{width:90}} value={String(sdfx.time8)} onChange={durationChange8}>
                                    {timeList2.map((v,i)=>(<Option key={String(v)}>{v}</Option>))}
                                </Select>
                            </div>
                            <div className={styles.subline}>
                                <span className={styles.line1_2_1}>时段五：</span>
                                <Select style={{width:90}} value={String(sdfx.time9)} onChange={durationChange9}>
                                    {timeList1.map((v,i)=>(<Option key={String(v)}>{v}</Option>))}
                                </Select>
                                <span className={styles.line1_2_2}> -- </span>
                                <Select style={{width:90}} value={String(sdfx.time10)} onChange={durationChange10}>
                                    {timeList2.map((v,i)=>(<Option key={String(v)}>{v}</Option>))}
                                </Select>
                            </div>
                            <div className={styles.subline}>
                                <span className={styles.line1_2_1}>时段六：</span>
                                <Select style={{width:90}} value={String(sdfx.time11)} onChange={durationChange11}>
                                    {timeList1.map((v,i)=>(<Option key={String(v)}>{v}</Option>))}
                                </Select>
                                <span className={styles.line1_2_2}> -- </span>
                                <Select style={{width:90}} value={String(sdfx.time12)} onChange={durationChange12}>
                                    {timeList2.map((v,i)=>(<Option key={String(v)}>{v}</Option>))}
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className={styles.line2}>
                    <div className={styles.line2_1}>
                        选择分析日期：
                    </div>
                    <RangePicker
                        format="YYYY-MM-DD"
                        allowClear={false}
                        style={{width:250}}
                        value={[moment(sdfx.startTime),moment(sdfx.endTime)]}
                        onChange={rangeChange}
                    />
                    <div className={styles.line2_1}>
                        选择门店：
                    </div>
                    <TreeSelect {...tProps1} />
                    <div className={styles.line2_1}>
                        选择菜品：
                    </div>
                    <Select
                        mode="multiple"
						maxTagCount={1}
                        placeholder="选择菜品（允许多选）"
                        style={{minWidth:300}}
                        onChange={cpChange}
                    >
                        {sdfx.cpflList.length>0&&sdfx.cpflList.map((v,i)=>(
                            <Option key={String(v)}>{v}</Option>
                        ))}
                    </Select>
                </div>
                <div className={styles.line2}>
                    <Button type="primary" style={{marginRight:'20px'}} onClick={searchAction1}>查询</Button>
                    <Button onClick={loadOut1}>导出</Button>
                </div> */}
                <div>
                    <div className={common.searchBlock} style={{marginRight:'20px'}}>
                        <span>选择分析日期：</span>
                        <RangePicker
                            format="YYYY-MM-DD"
                            allowClear={false}
                            style={{width:250}}
                            value={[moment(sdfx.startTime),moment(sdfx.endTime)]}
                            onChange={rangeChange}
                        />
                    </div>
                    <div className={common.searchBlock} style={{marginRight:'20px'}}>
                        <span>选择门店：</span>
                        <TreeSelect {...tProps1} />
                    </div>
                    <div className={common.searchBlock} style={{marginRight:'20px'}}>
                        <span>选择菜品：</span>
                        <Select
                             className={common.yzy_margin}
                            mode="multiple"
                            maxTagCount={1}
                            placeholder="选择菜品（允许多选）"
                            style={{minWidth:300}}
                            onChange={cpChange}
                        >
                            {sdfx.cpflList.length>0&&sdfx.cpflList.map((v,i)=>(
                                <Option key={String(v)}>{v}</Option>
                            ))}
                        </Select>
                    </div>
                    <div className={common.searchBlock} style={{marginRight:'20px'}}>
                        <span>选择就餐方式：</span>
                        <Select value={String(sdfx.eatType)} onChange={eatTypeChange} className={common.yzy_margin} style={{width:120}}>
                            <Select.Option value="-1">全选</Select.Option>
                            <Select.Option value="0">堂食</Select.Option>
                            <Select.Option value="2">打包外带</Select.Option>
                            <Select.Option value="3">自营外卖</Select.Option>
                        </Select>
                    </div>
                </div>
                <div>
                    <div className={common.searchBlock} style={{marginTop:'20px'}}>
                        <Button type="primary" style={{marginRight:'20px'}} onClick={searchAction1}>查询</Button>
                        <Button onClick={loadOut1}>导出</Button>
                    </div>
                </div>

                {sdfx.list1.length==0?
                    <Table
                        className={common.yzy}
                        style={{marginTop:'20px'}}
                        columns={sdfx.columns1}
                        dataSource={sdfx.list1}
                        bordered
                        size="small"
                        pagination={pagination}
                    />
                :
                    <Table
                        className={common.yzy}
                        style={{marginTop:'20px'}}
                        columns={sdfx.columns1}
                        dataSource={sdfx.list1}
                        bordered
                        size="small"
                        scroll={{x:sdfx.scrollX1,y:400}}
                        pagination={pagination}
                    />
                }
                

                <form action={sdfx.linkOrigin+'report-api/report/export/analyse-restaurant'} method="post"  id='formOrderExport1'>
            
                    <input type="hidden" name="restaurantIds" value = {JSON.stringify(sdfx.restaurantIds1)}/>
                    <input type="hidden" name="startTime" value = {new Date(sdfx.startTime).getTime()}/>
                    <input type="hidden" name="endTime" value = {new Date(sdfx.endTime).getTime()}/>
                    <input type="hidden" name="resIdOrgNameMap" value = {JSON.stringify(sdfx.resIdOrgNameMap1)}/>
                    <input type="hidden" name="periods" value = {JSON.stringify(sdfx.periods)}/>
                    {sdfx.eatType!=-1&&<input type="hidden" name="eatType" value = {+sdfx.eatType}/>}
                    {sdfx.foodNames.length>0&&(<input type="hidden" name="foodNames" value = {JSON.stringify(sdfx.foodNames)}/>)}

                </form>
            </TabPane>
        </Tabs>
      </Header>
    );

}

SdfxPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,sdfx}) {
    return { menu,sdfx };
}

export default connect(mapStateToProps)(SdfxPage);

