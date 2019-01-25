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
const { MonthPicker } = DatePicker;
const RangePicker = DatePicker.RangePicker;
import Button from 'antd/lib/button';
import Table from 'antd/lib/table';
import Select from 'antd/lib/select';
const Option=Select.Option
import Radio from 'antd/lib/radio';
const RadioGroup = Radio.Group;
import styles from './MrcpxlphfxbPage.less';
import common from '../common.less';
import Breadcrumb from 'antd/lib/breadcrumb';
import Tree from 'antd/lib/tree';
import TreeSelect from 'antd/lib/tree-select';
const TreeNode = Tree.TreeNode;

function MrcpxlphfxbPage ({menu,dispatch,mrcpxlphfxb}) {
    const HeaderProps = {
        menu,
        dispatch,
    };

    const formItemLayout={
        labelCol: {
            span: 4,
        },
        wrapperCol: {
            span: 20,
        },
    }

    const pagination = {
        current:mrcpxlphfxb.current,
        pageSize: mrcpxlphfxb.size,
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger:true,
        onShowSizeChange:SizeChange,
    };

    function SizeChange(current, pageSize){
        dispatch({type: 'mrcpxlphfxb/updatePayload',payload:{size:pageSize,current:1,}});
    }

    function onPageChange(pageNo){
        console.log(pageNo)
        dispatch({type: 'mrcpxlphfxb/updatePayload',payload:{current:pageNo}});
    }


    function onChange(item,key){
        const year=key.split('-')[0],
            month=+(key.split('-')[1])
        dispatch({
            type:'mrcpxlphfxb/updatePayload',
            payload:{
                year:year,
                month:month
            }
        })
    }

    function multipleChange(key){
        let resIdOrgNameMap={},restaurantIds=[]
        mrcpxlphfxb.restaurantList.forEach((value,index)=>{
            key.forEach((val,idx)=>{
                if(val==value.id){
                    resIdOrgNameMap[value.id]=value.name
                    restaurantIds.push(String(value.id))
                }
            })
        })
        dispatch({
            type:'mrcpxlphfxb/updatePayload',
            payload:{restaurantIds:restaurantIds,resIdOrgNameMap:resIdOrgNameMap}
        })
    }

    function cateChange(e){
        console.log(e)
        dispatch({
            type:'mrcpxlphfxb/updatePayload',
            payload:{
                categoryName:e
            }
        })
    }

    function onSearch(){
        dispatch({
            type:'mrcpxlphfxb/updatePayload',
            payload:{
                current:1
            }
        })
        dispatch({
            type:'mrcpxlphfxb/fooddayDetail',
            payload:{}
        })
    }

    function numChange(e){
        dispatch({
            type:'mrcpxlphfxb/updatePayload',
            payload:{
                numType:+e
            }
        })
    }

    function typeChange(e){
        dispatch({
            type:'mrcpxlphfxb/updatePayload',
            payload:{
                queryType:+e
            }
        })
    }

    function getOutForm() {
        document.getElementById("formOrderExport").submit();
    }
    function getUserToken() {
        const userStatus = myApp._store.getState().account.token;
        return userStatus;
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
			type:'mrcpxlphfxb/updatePayload',
			payload:{
				value:value,
				restaurantIds:arr,
				resIdOrgNameMap:obj
			}
		})
	}
	
	function treeExpand(value){
		dispatch({
			type:'mrcpxlphfxb/updatePayload',
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
      treeData:[mrcpxlphfxb.obj1],
      value: mrcpxlphfxb.value,
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
	
    return(
      <Header {...HeaderProps}>
        <div style={{background:'#eee',padding:'10px 20px'}}>
            <Breadcrumb separator=">">
                <Breadcrumb.Item onClick={back} style={{cursor:'pointer'}}>菜品销量</Breadcrumb.Item>
                <Breadcrumb.Item>每日菜品销量排行</Breadcrumb.Item>
            </Breadcrumb>
        </div>
        <Spin spinning={mrcpxlphfxb.loading} style={{position:'absolute',width:'calc(100% - 50px)',height:'calc(100% - 70px)',paddingTop:'300px',zIndex:'99'}} size="large" />
        <div>
            <div className={common.yzy_search}>
                <div>
                    <div className={common.searchBlock}>
                        <span className={common.yzy_txt}>选择时间：</span>
                        <MonthPicker style={{width:200}} onChange={onChange} allowClear={false} defaultValue={moment(mrcpxlphfxb.year+'-'+mrcpxlphfxb.month, 'YYYY-MM')} format="YYYY-MM" />
                    </div>
                    <Select className={common.yzy_txt} onChange={numChange} value={String(mrcpxlphfxb.numType)}>
                        <Select.Option key="1">金额</Select.Option>
                        <Select.Option key="2">数量</Select.Option>
                    </Select>
                    <Select className={common.yzy_txt} onChange={typeChange} value={String(mrcpxlphfxb.queryType)}>
                        <Select.Option value="1">单品+套餐明细</Select.Option>
                        <Select.Option value="2">单品+套餐主项</Select.Option>
                    </Select>
                    <div className={common.searchBlock}>
                        <span className={common.yzy_txt}>选择分类：</span>
                        <Select className={common.yzy_cate} onChange={cateChange} value={mrcpxlphfxb.categoryName}>
                            <Option key="全部">全部</Option>
                            {mrcpxlphfxb.cateList&&mrcpxlphfxb.cateList.length>0&&mrcpxlphfxb.cateList.map((v,i)=>(
                                <Option key={v.value}>{v.value}</Option>
                            ))}
                            <Option key="套餐">套餐</Option>
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
            
        </div>
        {mrcpxlphfxb.Detail.length==0?
            <Table
              className={common.yzy}
              bordered
              dataSource={mrcpxlphfxb.Detail} 
              columns={mrcpxlphfxb.columns}
              pagination={pagination}
              size="small"
            />
        :
            <Table
              className={common.yzy}
              bordered
              dataSource={mrcpxlphfxb.Detail} 
              columns={mrcpxlphfxb.columns}
              pagination={pagination}
              scroll={{x:mrcpxlphfxb.scrollX,y:400}}
              size="small"
            />
        }
        

        <form action={mrcpxlphfxb.linkOrigin+'report-api/report/export/foodday'} method="post" id='formOrderExport'>

            <input type="hidden" name="restaurantIds" value = {JSON.stringify(mrcpxlphfxb.restaurantIds)} id='pay_way'/>
            {mrcpxlphfxb.categoryName!='全部'&&(<input type="hidden" name="categoryName" value = {mrcpxlphfxb.categoryName} />)}        
            <input type="hidden" name="numType" value = {JSON.stringify(+mrcpxlphfxb.numType)} />
            <input type="hidden" name="queryType" value = {JSON.stringify(+mrcpxlphfxb.queryType)} />
            <input type="hidden" name="year" value = {JSON.stringify(+mrcpxlphfxb.year)} />    
            <input type="hidden" name="month" value = {JSON.stringify(+mrcpxlphfxb.month)} />    
            <input type="hidden" name="resIdOrgNameMap" value = {JSON.stringify(mrcpxlphfxb.resIdOrgNameMap)} />

        </form>

      </Header>
    );

}

MrcpxlphfxbPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu,mrcpxlphfxb}) {
    return { menu,mrcpxlphfxb };
}

export default connect(mapStateToProps)(MrcpxlphfxbPage);

