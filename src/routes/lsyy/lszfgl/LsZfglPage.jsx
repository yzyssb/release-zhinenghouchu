import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import Checkbox from 'antd/lib/checkbox';
import Table from 'antd/lib/table';
import Pagination from 'antd/lib/pagination';
import styles from "./LsZfglPage.less";
import Modal from 'antd/lib/modal';
import { Popconfirm } from 'antd/lib';
const CheckboxGroup = Checkbox.Group;
const confirm = Modal.confirm;
import Select from 'antd/lib/select';
const Option=Select.Option
import message from 'antd/lib/message';


function LsZfglPage({ menu, dispatch, lszfglConfig }) {

  const HeaderProps = {
    menu,
    dispatch,
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '支付类型',
      dataIndex: 'payMethodTypeName',
      key: 'payMethodTypeName',
    }, {
      title: '支付名称',
      dataIndex: 'payMethodName',
      key: 'payMethodName',
    },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      render: function (text, record, index) {
        return (
          <span>
            {record.state == 2 ? "停用" : "启用"}
          </span>
        )
      }
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      // render: function (text, record, index) {
      //   return (<span key={record.id}>
      //     <a href="javascript:;" onClick={() => { clickEdit(text, record, index) }}>修改</a>
      //     <span className="ant-divider" />
      //     <a href="javascript:;" onClick={() => { showDeleteConfirm(text, record, index) }}>删除</a>
      //   </span>
      //   )
      // }
      render: (text, record, index) => (
        managerHandle(record, index)
      ),
    }
  ];

  // 点击分页时请求数据pageNumber代表点击的数字
  function onChangeShowPage(pageNumber) {
    let pageForm = lszfglConfig.pageForm;
    pageForm.offset = (pageNumber - 1) * 10;
    dispatch({
      type: 'lszfglConfig/updatePayload',
      payload: { pageForm, current: pageNumber }
    });

    dispatch({
      type: 'lszfglConfig/query',
      payload: {}
    });
  }

  // 点击新增跳转到ZfglPageForm.jsx页面
  function toZfglForm() {
    dispatch(routerRedux.push({
      pathname: "/lszfglForm",
      query: { type: "zfglForm" }
    }));
    // 每次点击新增都要重置lszfglConfig中editData中的数据
    let restoresData = lszfglConfig.restoresData();
    dispatch({
      type: 'lszfglConfig/updatePayload',
      payload: { editData: restoresData, way: "add", checkName: 0 }
    });
  }

  // 点击列表中的修改按钮
  // function clickEdit(text, record, index) {
  //   // 每次点击修改把当前的数据直接付给editData,并标记从哪个入口进入的
  //   let restoresData = lszfglConfig.restoresData();
  //   dispatch({
  //     type: 'lszfglConfig/updatePayload',
  //     payload: { editData: record, way: "edit", checkName: 0 }
  //   });

  //   // 然后再跳转页面
  //   dispatch(routerRedux.push({
  //     pathname: "/zfglForm",
  //     query: {
  //       type: 'zfglForm',
  //     }
  //   }));
  // }

  // // 点击删除按钮删除对应的列表数据
  // function showDeleteConfirm(text, record, index) {
  //   var resultIndex = index + 1;
  //   confirm({
  //     title: '确定删除第' + resultIndex + '条数据吗?',
  //     content: '',
  //     okText: 'Yes',
  //     okType: 'danger',
  //     cancelText: 'No',
  //     onOk() {
  //       //发送删除请求 
  //       dispatch({
  //         type: 'lszfglConfig/delPayMethod',
  //         payload: { id: record.id }
  //       });
  //     },
  //     onCancel() {
  //       // 点击了取消
  //     },
  //   });
  // }

  // 新删除和新修改样式

  // 确认用户选择的是编辑还是删除
  function managerHandle(record, index) {
    let handlebtn = [];
    handlebtn.push(
      <span key={index}>
        <a onClick={() => {
          edit(record)
        }}>编辑</a>
        <span className="ant-divider" />
        <Popconfirm okText="确定" cancelText="取消" title="确定要删除吗？" onConfirm={() => onOperate(record)}>
          <a>删除</a>
        </Popconfirm>
      </span>);

    return handlebtn;
  }

  // 执行删除
  function onOperate(record) {
    // 删除指定的数据，然后更新
    //发送删除请求 
    dispatch({
      type: 'lszfglConfig/delPayMethod',
      payload: { id: record.id }
    });
  }

  // 执行编辑
  const edit = (record) => {
    // 每次点击修改把当前的数据直接付给editData,并标记从哪个入口进入的
    // let restoresData = lszfglConfig.restoresData();

    // 通过id去请求详情

    // dispatch({
    //   type: 'lszfglConfig/updatePayload',
    //   payload: { editData: record, way: "edit", checkName: 0 }
    // });

    dispatch({
      type: 'lszfglConfig/updatePayload',
      payload: { way: "edit", checkName: 0 }
    });

    dispatch({
      type: 'lszfglConfig/getDetail',
      payload: { id: record.id }
    });

    // 然后再跳转页面
    dispatch(routerRedux.push({
      pathname: "/lszfglForm",
      query: {
        type: 'zfglForm',
      }
    }));
  };

  const pagination = {
    total: lszfglConfig.total,
    current: lszfglConfig.current,
    pageSize: lszfglConfig.size,

    onChange: (pageNo) => {
      onPageChange(pageNo)
    },
    showSizeChanger: true,
    onShowSizeChange: SizeChange,
    showTotal: (total) => { return `共 ${total} 条` },
  };

  function SizeChange(current, pageSize) {


    dispatch({ type: 'lszfglConfig/updatePayload', payload: { size: pageSize, current: 1, offset: 0,selectedRowKeys:[],selectedRows:[] } });
    dispatch({ type: 'lszfglConfig/query', payload: {} });


  }

  function onPageChange(pageNo) {

    var offset = pageNo * lszfglConfig.size - lszfglConfig.size;
    dispatch({ type: 'lszfglConfig/updatePayload', payload: { offset: offset, current: pageNo,selectedRowKeys:[],selectedRows:[] } });
    dispatch({ type: 'lszfglConfig/query', payload: {} });


  }

  function brandIdChange(e) {
    
    dispatch({
      type: 'lszfglConfig/updatePayload',
      payload: {
        brandId: +e,

        selectedRowKeys:[],
        selectedRows:[]
      }
    })
    sessionStorage.setItem('brandId_lszfglConfig',+e)
    dispatch({
      type: 'lszfglConfig/chooseBrandUrl',
      payload: {}
    })
  }

  const rowSelection={
    selectedRowKeys:lszfglConfig.selectedRowKeys,
    onChange:(key1,key2)=>{
      console.log(key1,key2)
      dispatch({
        type: 'lszfglConfig/updatePayload',
        payload: {
          selectedRowKeys: key1,
          selectedRows: key2,
        }
      })
    }
  }

  function allotComments(){
    if(lszfglConfig.selectedRowKeys.length==0){
        message.error('请至少选择一个原因备注')
        return
    }
    var arr=[]
    for(var i=0;i<lszfglConfig.selectedRows.length;i++){
        arr.push(lszfglConfig.dataSource[lszfglConfig.selectedRows[i].key-1].payMethodName)
    }
    dispatch({
        type:'lszfglConfig/updatePayload',
        payload:{
            allotModal_key1:arr.join(','),
            allotModal_key2:'',
            allotModal_key3:'1',
            checkedList:[],
            checkAll:false,
            allotModalVisible:true
        }
    })
}

function closeModal(){
  dispatch({
    type: 'lszfglConfig/updatePayload',
    payload: {
      allotModalVisible:false
    }
  })
}

function closeResModal(){
  var arr=[]
  for(var i=0;i<lszfglConfig.plainOptions.length;i++){
    for(var j=0;j<lszfglConfig.checkedList.length;j++){
      if(lszfglConfig.plainOptions[i].value==lszfglConfig.checkedList[j]){
        arr.push(lszfglConfig.plainOptions[i].label)
      }
    }
  }
  dispatch({
    type: 'lszfglConfig/updatePayload',
    payload: {
      resModalVisible:false,
      allotModal_key2:arr.join('、')
    }
  })
}

function key3Change(e){
  dispatch({
    type: 'lszfglConfig/updatePayload',
    payload: {
      allotModal_key3:e
    }
  })
}

function chooseRes(){
  dispatch({
    type: 'lszfglConfig/updatePayload',
    payload: {
      // allotModal_key2:'',
      resModalVisible:true
    }
  })
}

function onCheckAllChange(e){
  var arr=[]
  if(lszfglConfig.plainOptions.length>0){
    lszfglConfig.plainOptions.map(v=>{
      arr.push(+v.value)
    })
  }
  dispatch({
    type:'lszfglConfig/updatePayload',
    payload:{
      checkedList: e.target.checked ? arr : [],
      indeterminate: false,
      checkAll: e.target.checked,
    }
  })
}

function resChange(checkedList){
  dispatch({
    type:'lszfglConfig/updatePayload',
    payload:{
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < lszfglConfig.plainOptions.length),
      checkAll: checkedList.length === lszfglConfig.plainOptions.length,
    }
  })
}

function confirmAction(){
  if(lszfglConfig.allotModal_key2.length==0){
    message.error('请先选择门店')
    return
  }
  dispatch({
    type:'lszfglConfig/payTypeAllotPayMethod',
    payload:{}
  })
  dispatch({
    type:'lszfglConfig/updatePayload',
    payload:{
      allotModalVisible:false,
    }
  })
}

function cancelAction(){
  dispatch({
    type:'lszfglConfig/updatePayload',
    payload:{
      allotModalVisible:false,
    }
  })
}

function cancelResModal() {
  dispatch({
    type: 'lszfglConfig/updatePayload',
    payload: {
      resModalVisible: false,
    }
  })
}

  return (
    <Header {...HeaderProps}>
      <div>
        <div>
          请选择品牌：
          <Select style={{ minWidth: 200 }} value={String(lszfglConfig.brandId)} onChange={brandIdChange}>
            {lszfglConfig.brandList.length > 0 && lszfglConfig.brandList.map((v, i) => (
              <Option key={v.key}>{v.value}</Option>
            ))}
          </Select>
        </div>
        <Button type="primary" className={styles.buttonMargin} onClick={toZfglForm}>新增</Button>
        <Button style={{marginLeft:20}}  onClick = {allotComments}>快速分配至门店</Button>
        <Table
          columns={columns}
          rowSelection={rowSelection}
          pagination={pagination}
          rowKey={record => record.id}
          dataSource={lszfglConfig.dataSource}
          bordered
        />
        
        <Modal
          title="支付方式快速分配至门店"
          visible={lszfglConfig.allotModalVisible}
          onCancel={closeModal}
          footer={null}
        >
          <div style={{color:'#999',lineHeight:'30px',fontSize:12}}>已选择支付方式</div>
          <div style={{lineHeight:'20px',paddingLeft:10,marginBottom:10,maxHeight:200,overflowY:'scroll'}}>{lszfglConfig.allotModal_key1}</div>

          <div style={{color:'#999',lineHeight:'30px',fontSize:12}}>选择门店（点击所选门店可重新选择）</div>
          {lszfglConfig.allotModal_key2.length==0?(
            <div style={{border:'1px solid #eee',borderRadius:'4px',textAlign:'center',margin:'0 0 10px 10px',padding:10,cursor:'pointer'}} onClick={chooseRes}>
              <span style={{fontSize:30,display:'inline-block',width:40,height:40,borderRadius:'50%',lineHeight:'33px',border:'1px solid #ddd'}}>+</span><br />点击选择门店
            </div>
          ):(
            <div style={{lineHeight:'20px',paddingLeft:10,marginBottom:10,cursor:'pointer',maxHeight:200,overflowY:'scroll'}} onClick={chooseRes}>{lszfglConfig.allotModal_key2}</div>
          )}
          
          <div style={{color:'#999',lineHeight:'30px',fontSize:12}}>分配方式</div>
          <Select style={{width:200,marginLeft:10}} value={String(lszfglConfig.allotModal_key3)} onChange={key3Change}>
            <Option key="1">合并店铺支付方式</Option>
            <Option key="2">完全替换店铺支付方式</Option>
          </Select>

          <div style={{padding:'30px 0 10px 0',textAlign:'center'}}>
            <Button style={{marginRight:50}} onClick={cancelAction}>取消</Button>
            <Button type="primary" onClick={confirmAction}>立即分配</Button>
          </div>
        </Modal>

        <Modal
          title="选择门店"
          visible={lszfglConfig.resModalVisible}
          onCancel={cancelResModal}
          footer={null}
          afterClose={() => {
            var arr = lszfglConfig.allotModal_key2.split('、'), arr1 = []
            if (arr.length > 0 && lszfglConfig.plainOptions.length > 0) {
              lszfglConfig.plainOptions.map(v => {
                arr.map(vv => {
                  if (v.label == vv && arr1.indexOf(v.value) == -1) {
                    arr1.push(v.value)
                  }
                })
              })
            }
            dispatch({
              type: 'lszfglConfig/updatePayload',
              payload: {
                checkedList: arr1,
                checkAll: arr1.length == lszfglConfig.plainOptions.length,
              }
            })
          }}
        >
          <div style={{ background:'#eee',lineHeight:'40px',marginBottom:20,padding:'0 10px' }}>
            <Checkbox
              // indeterminate={lszfglConfig.indeterminate}
              onChange={onCheckAllChange}
              checked={lszfglConfig.checkAll}
            >
              <span>全选</span>
            </Checkbox>
          </div>
          <CheckboxGroup options={lszfglConfig.plainOptions} className={styles.checkbox_yzy} value={lszfglConfig.checkedList} onChange={resChange} />
          <div style={{marginTop:20,textAlign:'center'}}>
            <Button style={{ marginRight: 50 }} onClick={cancelResModal}>取消</Button>
            <Button type="primary" onClick={closeResModal}>确定</Button>
          </div>
        </Modal>

      </div>
    </Header>
  );
}

LsZfglPage.propTypes = {
  menu: PropTypes.object,
};

function mapStateToProps({ menu, lszfglConfig }) {
  return { menu, lszfglConfig };
}

export default connect(mapStateToProps)(LsZfglPage);
