import React, { PropTypes } from 'react';
import { connect } from 'dva';
import Table from 'antd/lib/table';
import Modal from 'antd/lib/modal';
import Button from 'antd/lib/button';
import Radio from 'antd/lib/radio';
const RadioGroup = Radio.Group;
import Select from 'antd/lib/select';
const WxctcppxPage = ({
	deskQrCode,
	dispatch,
}) => {
    const pagination = {
        pageSize: deskQrCode.wx_total,
        hideOnSinglePage:true
    };
    const subPagination = {
        pageSize: deskQrCode.wx_subtotal,
        hideOnSinglePage:true
    };
	const columns=[
		{
			title:'',
			dataIndex:'key',
			key:'key'
		},
		{
			title:'菜品分类',
			dataIndex:'name',
			key:'name'
		},
		{
			title:'操作',
			dataIndex:'action',
			key:'action',
			render:(text,record,index)=>{
		        if(deskQrCode.dataSource.length==1){
		          return (
		            <span key={index}>
		              ----
		            </span>
		          )
		        }else{
		          if(index==0){
		            return (
		              <span key={index}>
		                <a onClick={()=>{move(text,record,index,'self',2)}}>下移</a>
		                <span className="ant-divider" />
		                <a onClick={()=>{showCates(text,record,index)}}>展开分类</a>
		              </span>
		            )
		          }else if(index>0&&index<deskQrCode.dataSource.length-1){
		            return (
		              <span key={index}>
		                <a onClick={()=>{move(text,record,index,'self',3)}}>置顶</a>
		                <span className="ant-divider" />
		                <a onClick={()=>{move(text,record,index,'self',1)}}>上移</a>
		                <span className="ant-divider" />
		                <a onClick={()=>{move(text,record,index,'self',2)}}>下移</a>
		                <span className="ant-divider" />
		                <a onClick={()=>{showCates(text,record,index)}}>展开分类</a>
		              </span>
		            )
		          }else if(index==deskQrCode.dataSource.length-1){
		            return (
		              <span key={index}>
		                <a onClick={()=>{move(text,record,index,'self',3)}}>置顶</a>
		                <span className="ant-divider" />
		                <a onClick={()=>{move(text,record,index,'self',1)}}>上移</a>
		                <span className="ant-divider" />
		                <a onClick={()=>{showCates(text,record,index)}}>展开分类</a>
		              </span>
		            )
		          }
		        }
			}
		},
		{
			title:'状态',
			dataIndex:'orderNo',
			key:'orderNo',
      render:(text,record,index)=>(
        <RadioGroup onChange={()=>radioChange(text,record,index)} value={deskQrCode.defaultValue[index]<0?'1':'0'}>
          <Radio value="0">显示</Radio>
          <Radio value="1">隐藏</Radio>
        </RadioGroup>
      )
		}
	]

  function radioChange(text,record,index){
    console.log(deskQrCode.defaultValue)
    dispatch({
        type:'deskQrCode/moveAndSort',
        payload:{type:record.orderNo<0?'5':'4',categoryId:record.id}
    })
  }

  function subRadioChange(text,record,index){
    console.log(text,record,index)
    dispatch({
        type:'deskQrCode/subMoveAndSort',
        payload:{type:record.orderNo<0?'5':'4',categoryId:deskQrCode.cpCateId,foodId:record.id}
    })
  }

	function move(text,record,index,origin,type){
	    dispatch({
	      type:'deskQrCode/moveAndSort',
	      payload:{type:type,categoryId:record.id}
	    })
	}

	function subMove(text,record,index,origin,type){
	    dispatch({
	      type:'deskQrCode/subMoveAndSort',
	      payload:{type:type,categoryId:deskQrCode.cpCateId,foodId:record.id}
	    })
	}
//modal columns
  const subColumns=[
    {
      title:'',
      dataIndex:'key',
      key:'key'
    },
    {
      title:'名称',
      dataIndex:'name',
      key:'name'
    },
    {
      title:'操作',
      dataIndex:'action',
      key:'action',
      render:(text,record,index)=>{
        var dataSource=deskQrCode.subDataSource
        if(dataSource.length==1){
          return (
            <span key={index}>
              ----
            </span>
          )
        }else{
          if(index==0){
            return (
              <span key={index}>
                <a onClick={()=>{subMove(text,record,index,'sub',2)}}>下移</a>
              </span>
            )
          }else if(index>0&&index<dataSource.length-1){
            return (
              <span key={index}>
                <a onClick={()=>{subMove(text,record,index,'sub',3)}}>置顶</a>
                <span className="ant-divider" />
                <a onClick={()=>{subMove(text,record,index,'sub',1)}}>上移</a>
                <span className="ant-divider" />
                <a onClick={()=>{subMove(text,record,index,'sub',2)}}>下移</a>
              </span>
            )
          }else if(index==dataSource.length-1){
            return (
              <span key={index}>
                <a onClick={()=>{subMove(text,record,index,'sub',3)}}>置顶</a>
                <span className="ant-divider" />
                <a onClick={()=>{subMove(text,record,index,'sub',1)}}>上移</a>
              </span>
            )
          }
        }
      }
    },
    {
      title:'状态',
      dataIndex:'orderNo',
      key:'orderNo',
      render:(text,record,index)=>(
        <RadioGroup onChange={()=>subRadioChange(text,record,index)} value={deskQrCode.subDefaultValue[index]<0?'1':'0'}>
          <Radio value="0">显示</Radio>
          <Radio value="1">隐藏</Radio>
        </RadioGroup>
      )
    }
  ]
  
  //展开分类
  const confirm=Modal.confirm
  function showCates(text,record,index){
  	console.log(text,record,index)
    dispatch({
      type: 'deskQrCode/showCates',
      payload: { categoryId:record.id }
    })
    dispatch({
      type: 'deskQrCode/updatePayload',
      payload: { cpCateId:record.id,title:record.name,visible:true }
    })
  }

  //modal 关闭
  function ModalHidden(){
    dispatch({
      type: 'deskQrCode/getListSuccess',
      payload: {}
    })
  }

  //modal 确定
  function ModalConfirm(){
    dispatch({
      type: 'deskQrCode/getListSuccess',
      payload: {}
    })
  }

  function onChange111(){
    console.log(11)
  }

    var children = [];

    if (deskQrCode.businessList && deskQrCode.businessList.length > 0){
        deskQrCode.businessList.map((i, j) => {

            children.push(
                <Option key={i.id} value={i.id}>{i.name + '(' + i.startHour +'-' + i.endHour +  ')'}</Option>
            )

        });
    }

    return (
    	<div>

            <div style={{marginLeft:30,marginTop:5,marginBottom:10,display:deskQrCode.typeOrigin ==1?'none':'block'}}>
                <span>按时段排序</span>
                <Select onChange = {(e)=>{

                    dispatch({
                        type: 'deskQrCode/updatePayload',
                        payload: {selectId:e},
                    });

                    dispatch({
                        type: 'deskQrCode/getList',
                        payload: {},
                    });


                }} style = {{marginLeft:20,width:200}} defaultValue = {deskQrCode.businessList.length >0 && deskQrCode.businessList[0].id}>
                    {children}
                </Select>
            </div>
    		<Table 
	            dataSource={deskQrCode.dataSource} 
	            columns={columns}
              pagination={pagination}
	        />
          	<Modal
              width="60%"
              visible={deskQrCode.visible}
              title={deskQrCode.title}
              onCancel={ModalHidden}
              footer={[
                  <Button key="submit" type="primary" onClick={ModalConfirm}>确认</Button>,
              ]}
          >
            <Table 
              dataSource={deskQrCode.subDataSource} 
              columns={subColumns}
              pagination={subPagination}
            />
          </Modal>
        </div>
    );
};

WxctcppxPage.propTypes = {
	
};

function mapStateToProps({ deskQrCode }) {
    return { deskQrCode };
}

export default connect(mapStateToProps)(WxctcppxPage);