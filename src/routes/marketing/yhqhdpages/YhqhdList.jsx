import React, { PropTypes } from 'react';

import Header from '../../../components/Header';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import FilterComponent from "./FilterComponent"; //引入查询组件
import Table from 'antd/lib/table';
import Modal from 'antd/lib/modal';
import Button from 'antd/lib/button';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
const confirm = Modal.confirm;







function YhqhdList({ menu, dispatch, yhqhdConfig }) {
  const HeaderProps = {
    menu,
    dispatch,
  };

  const pagination = {
    total: yhqhdConfig.total,
    current: yhqhdConfig.current,
    pageSize: yhqhdConfig.size,
    onChange: (pageNo) => {
      onPageChange(pageNo)
    },
    showSizeChanger: true,
    onShowSizeChange: SizeChange,
  };


  function SizeChange(current, pageSize) {
    dispatch({ type: 'yhqhdConfig/updatePayload', payload: { size: pageSize, current: 1, offset: 0 } });
    dispatch({ type: 'yhqhdConfig/query', payload: {} });
  }

  function onPageChange(pageNo) {
    var offset = pageNo * yhqhdConfig.size - yhqhdConfig.size;
    dispatch({ type: 'yhqhdConfig/updatePayload', payload: { offset: offset, current: pageNo } });
    dispatch({ type: 'yhqhdConfig/query', payload: {} });
  }

  // 以上是分页数据=====================================


  const columns = [{
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width:80
  },
  {
    title: '优惠券名称',
    dataIndex: 'name',
    key: 'name',
    width: 180
  },
  {
    title: '优惠券类型',
    dataIndex: 'couponType',
    key: 'couponType',
    render: function (text, record, index) {
      if (record.couponType == 1) {
        return "代金券"
      } else if (record.couponType == 2) {
        return "菜品券"
      }
    }


  },
  {
    title: '优惠券种类',
    dataIndex: 'couponMold',
    key: 'couponMold',
    render: function (text, record, index) {
      if (record.couponMold == 1) {
        return "满减券"
      } else if (record.couponMold == 2) {
        return "直抵券"
      } else if (record.couponMold == 3) {
        return "折扣券"
      }
    }
  },
  {
    title: '优惠券说明',
    dataIndex: 'couponDesc',
    key: 'couponDesc',
    width: 200,
    render: function (text, record, index) {
      if (record.couponDesc.length <= 20) {
        return (<span title={record.couponDesc}>{record.couponDesc}</span>);
      } else {
        let showCouponDesc = record.couponDesc.slice(0, 20);
        return (<span title={record.couponDesc}>{showCouponDesc + "..."}</span>);
      }
    }
  },
  // {
  //   title: '优惠券面值',
  //   dataIndex: 'value',
  //   key: 'value',
  //   render: function (text, record, index) {
  //     return record.value / 100
  //   }
  // },
  {
    title: '已领取数量',
    dataIndex: 'receiveCount',
    key: 'receiveCount',
  },
  {
    title: '已核销数量',
    dataIndex: 'verifyCount',
    key: 'verifyCount',
  },
  {
    title: '有效日期',
    dataIndex: 'date',
    key: 'date',
    width: 180,
    render: function (text, record, index) {
      // 根据有效期类型展示固定日期还是相对有效期时间
      // 固定有效期
      if (record.periodValidityType == 1) {
        let startTime = yhqhdConfig.formatDate(record.periodValidityStart); // 参数是一个时间戳
        let endTime = yhqhdConfig.formatDate(record.periodValidityFinish); // 参数是一个时间戳
        return startTime + " 至 " + endTime
      } else if (record.periodValidityType == 2) {
        // 相对有效期
        return "发券日起第" + record.periodValidityDays + "天"
      }
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width:80,
    render: function (text, record, index) {
      if (record.status == 1) {
        return "启用"
      } else if (record.status == 2) {
        return "终止"
      } else if (record.status == 3) {
        return "过期"
      } else if (record.status == 4) {
        return "已删除"
      }
    }

  },

  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: 160,
    render: function (text, record, index) {
      return (
        <div>
          <a href="javascript:;" style={{ textDecoration: "none" }} onClick={() => { lookFn(record) }}>查看</a>
          <span className="ant-divider" />
          {record.status == 1 && <a href="javascript:;" onClick={() => { changeStatus(record) }}>终止</a>}
          {record.status == 2 && <a style={{ textDecoration: "none" }} href="javascript:;" onClick={() => { changeStatus(record) }}>启用</a>}
          {record.isUpdate == 1 && <div style={{display:"inline-block"}}> <span className="ant-divider" /> <a href="javascript:;" onClick={() => { editForm(record) }}>编辑</a></div>}
        </div>
      )
    }
  }];

  // 点击查看调用接口,在modal显示对应信息
  function lookFn(record) {
    // 每次点击查看先清空之前的数据

    dispatch({
      type: 'yhqhdConfig/updatePayload',
      payload: { currentRecord: {} }
    })

    // 调用详情接口
    dispatch({
      type: 'yhqhdConfig/getYhqDetail',
      payload: { id: record.id }
    })

    // 展示modal框
    dispatch({
      type: 'yhqhdConfig/updatePayload',
      payload: { viewVisible: true }
    })

  }

  // 改变终止或者启用状态
  function changeStatus(record) {
    // 获取要切换的状态
    let goalStatus;
    let title = '';
    if (record.status == 1) {
      goalStatus = "stop";
      title = '您确定要终止吗？';
    } else if (record.status == 2) {
      goalStatus = "open";
      title = '您确定要启用吗？';
    }

      confirm({
          content: title,
          iconType: 'question-circle',
          onOk() {
              dispatch({
                  type: "yhqhdConfig/changeYhqStatus",
                  payload: { id: record.id, goalStatus: goalStatus }
              });
          },
          onCancel() {
              console.log('Cancel');
          },
      });


  }

  // 点击编辑打开yhqhdeditform表单
  function editForm(record) {
    dispatch(routerRedux.push({
      pathname: '/yhqhdeditform',
      query: { id: record.id },
    }));
  }


  // 点击modal框的关闭
  function hiddenViewModal() {
    dispatch({
      type: 'yhqhdConfig/updatePayload',
      payload: { viewVisible: false }
    })
  }

  // 点击新增优惠券去优惠券form页面
  function toYhqhdForm() {
    // 初始化数据
    // 标记需要重置form
    dispatch({
      type: 'yhqhdConfig/updatePayload',
      payload: {
        resetForm: true,
        couponUseTimes:[],
        checkIndex:[1,1,1,1,1,1,1],
        index:[1,1,1,1,1,1,1],
        timeArray:[[],[],[],[],[],[],[]],
      }
    })

    dispatch({
      type: 'yhqhdConfig/discountGetData',
      payload: {}
    });

    dispatch(routerRedux.push({
      pathname: '/yhqhdform',
      query: {},
    }));
  }

    var monday = [];
    var tuesday = [];
    var wednesday = [];
    var thursday = [];
    var friday = [];
    var saturday = [];
    var sunday = [];
    yhqhdConfig.currentRecord && yhqhdConfig.currentRecord.couponUseTimes &&  yhqhdConfig.currentRecord.couponUseTimes.length>0 && yhqhdConfig.currentRecord.couponUseTimes.map((i)=>{
      
      if (i.week == 0){

          if (i.weekType == 1){
              sunday.push('周日全时段可用');
          }else{
              let time = [];
              i.applicableUseTimes.map((j)=>{

                  time.push(j.startTime + '~' + j.endTime);

              })
              sunday.push('周日' + time.join(','));
          }

      }

        if (i.week == 1){

            if (i.weekType == 1){
                monday.push('周一全时段可用');
            }else{
                let time = [];
                i.applicableUseTimes.map((j)=>{

                    time.push(j.startTime + '~' + j.endTime);

                })
                monday.push('周一' + time.join(','));
            }

        }

        if (i.week == 2){

            if (i.weekType == 1){
                tuesday.push('周二全时段可用');
            }else{
                let time = [];
                i.applicableUseTimes.map((j)=>{

                    time.push(j.startTime + '~' + j.endTime);

                })
                tuesday.push('周二' + time.join(','));
            }

        }

        if (i.week == 3){

            if (i.weekType == 1){
                wednesday.push('周三全时段可用');
            }else{
                let time = [];
                i.applicableUseTimes.map((j)=>{

                    time.push(j.startTime + '~' + j.endTime);

                })
                wednesday.push('周三' + time.join(','));
            }

        }

        if (i.week == 4){

            if (i.weekType == 1){
                thursday.push('周四全时段可用');
            }else{
                let time = [];
                i.applicableUseTimes.map((j)=>{

                    time.push(j.startTime + '~' + j.endTime);

                })
                thursday.push('周四' + time.join(','));
            }

        }

        if (i.week == 5){

            if (i.weekType == 1){
                friday.push('周五全时段可用');
            }else{
                let time = [];
                i.applicableUseTimes.map((j)=>{

                    time.push(j.startTime + '~' + j.endTime);

                })
                friday.push('周五' + time.join(','));
            }

        }

        if (i.week == 6){

            if (i.weekType == 1){
                saturday.push('周六全时段可用');
            }else{
                let time = [];
                i.applicableUseTimes.map((j)=>{

                    time.push(j.startTime + '~' + j.endTime);

                })
                saturday.push('周六' + time.join(','));
            }

        }
    })

    var usageScenes = [];

    yhqhdConfig.currentRecord && yhqhdConfig.currentRecord.usageScenes &&  yhqhdConfig.currentRecord.usageScenes.length>0 && yhqhdConfig.currentRecord.usageScenes.map((i)=>{

      if (i == 1){
          usageScenes.push('堂食');
      }

      if (i == 2){
          usageScenes.push('外带');
      }

      if (i == 4){
          usageScenes.push('自营外卖');
      }

    });

  return (
    <Header {...HeaderProps}>
      <div style={{ padding: "10px" }}>
        <FilterComponent dispatch={dispatch} yhqhdConfig={yhqhdConfig} />
        <div style={{ padding: "20px 0" }}>
          <Button type="primary" onClick={toYhqhdForm}>新增优惠券</Button>
        </div>
        <Table
          columns={columns}
          pagination={pagination}
          dataSource={yhqhdConfig.dataSource}
          rowKey={record => record.id}
          bordered />
      </div>

      {/*点击查看在modal中展示当前数据的详情*/}
      <Modal
        title="券详情"
        visible={yhqhdConfig.viewVisible}
        onCancel={hiddenViewModal}
        footer={null}
        width={600}
      >
        <div style={{ height: "350px", overflowY: "scroll" }}>
          <Row style={{ padding: "8px 0", background: "#e3f2f7" }} >
            <Col span="7" style={{ paddingRight: "10px", marginRight: "10px", textAlign: 'right', borderRight: "1px solid #fff" }}>优惠券名称:</Col>
            <Col span="10">
              {yhqhdConfig.currentRecord.name}
            </Col>
          </Row>
          <Row style={{ padding: "8px 0" }}>
            <Col span="7" span="7" style={{ paddingRight: "10px", marginRight: "10px", textAlign: 'right', borderRight: "1px solid #fff" }}>优惠券类型:</Col>
            <Col span="14">
              {yhqhdConfig.currentRecord.couponType == 1 ? "代金券" : "菜品券"}
            </Col>
          </Row>
          <Row style={{ padding: "8px 0", background: "#e3f2f7" }}>
            <Col span="7" span="7" style={{ paddingRight: "10px", marginRight: "10px", textAlign: 'right', borderRight: "1px solid #fff" }}>优惠券种类:</Col>
            <Col span="14">
              {yhqhdConfig.currentRecord.couponMold == 1 && "满减券"}
              {yhqhdConfig.currentRecord.couponMold == 2 && "直抵券"}
              {yhqhdConfig.currentRecord.couponMold == 3 && "折扣券"}
            </Col>
          </Row>
          <Row style={{ padding: "8px 0" }}>
            <Col span="7" span="7" style={{ paddingRight: "10px", marginRight: "10px", textAlign: 'right', borderRight: "1px solid #fff" }}>优惠券面值:</Col>
            <Col span="14">
              {yhqhdConfig.currentRecord.value / 100}
            </Col>
          </Row>
          <Row style={{ padding: "8px 0", background: "#e3f2f7" }}>
            <Col span="7" span="7" style={{ paddingRight: "10px", marginRight: "10px", textAlign: 'right', borderRight: "1px solid #fff" }}>最低消费:</Col>
            <Col span="14">
              {yhqhdConfig.currentRecord.minMoney / 100}
            </Col>
          </Row>
          <Row style={{ padding: "8px 0" }}>
            <Col span="7" span="7" style={{ paddingRight: "10px", marginRight: "10px", textAlign: 'right', borderRight: "1px solid #fff" }}>有效日期:</Col>
            <Col span="14">
              {  // 根据有效期类型展示固定日期还是相对有效期时间
                // 固定有效期
                yhqhdConfig.currentRecord.periodValidityType == 1 ?
                  yhqhdConfig.formatDate(yhqhdConfig.currentRecord.periodValidityStart) + " 至 " + yhqhdConfig.formatDate(yhqhdConfig.currentRecord.periodValidityFinish)
                  :
                  // 相对有效期
                  "发券日起第" + yhqhdConfig.currentRecord.periodValidityDays + "天"
              }
            </Col>
          </Row>
          <Row style={{ padding: "8px 0", background: "#e3f2f7" }}>
              <Col span="7" span="7" style={{ paddingRight: "10px", marginRight: "10px", textAlign: 'right', borderRight: "1px solid #fff" }}>可用时段:</Col>
              <Col span="14">
                  {monday}
              </Col>
              <Col span="7" span="7" style={{ paddingRight: "10px", marginRight: "10px", textAlign: 'right', borderRight: "1px solid #fff" }}></Col>
              <Col span="14">
                  {tuesday}
              </Col>
              <Col span="7" span="7" style={{ paddingRight: "10px", marginRight: "10px", textAlign: 'right', borderRight: "1px solid #fff" }}></Col>
              <Col span="14">
                  {wednesday}
              </Col>

              <Col span="7" span="7" style={{ paddingRight: "10px", marginRight: "10px", textAlign: 'right', borderRight: "1px solid #fff" }}></Col>
              <Col span="14">
                  {thursday}
              </Col>

              <Col span="7" span="7" style={{ paddingRight: "10px", marginRight: "10px", textAlign: 'right', borderRight: "1px solid #fff" }}></Col>
              <Col span="14">
                  {friday}
              </Col>

              <Col span="7" span="7" style={{ paddingRight: "10px", marginRight: "10px", textAlign: 'right', borderRight: "1px solid #fff" }}></Col>
              <Col span="14">
                  {saturday}
              </Col>

              <Col span="7" span="7" style={{ paddingRight: "10px", marginRight: "10px", textAlign: 'right', borderRight: "1px solid #fff" }}></Col>
              <Col span="14">
                  {sunday}
              </Col>

          </Row>

          <Row style={{ padding: "8px 0", background: "#fff" }}>
              <Col span="7" span="7" style={{ paddingRight: "10px", marginRight: "10px", textAlign: 'right', borderRight: "1px solid #fff" }}>使用场景:</Col>
              <Col span="14" >
                  {usageScenes.join('、')}
              </Col>
          </Row>


          {yhqhdConfig.currentRecord.couponType == 1 ?
            <Row style={{ padding: "8px 0", background: "#e3f2f7" }}>
              <Col span="7" span="7" style={{ paddingRight: "10px", marginRight: "10px", textAlign: 'right', borderRight: "1px solid #fff" }}>不适用菜品:</Col>
              <Col span="14">
                {yhqhdConfig.currentRecord.unapplicableFoodsName && yhqhdConfig.currentRecord.unapplicableFoodsName != "" && yhqhdConfig.currentRecord.unapplicableFoodsName != null && yhqhdConfig.currentRecord.unapplicableFoodsName.length > 0 &&
                  <div>
                    {yhqhdConfig.currentRecord.unapplicableFoodsName.map(function (item) {
                      return item + "  ,  "
                    })}
                  </div>
                } 
              </Col>
            </Row>
            :
            <Row style={{ padding: "8px 0", background: "#e3f2f7" }}>
              <Col span="7" span="7" style={{ paddingRight: "10px", marginRight: "10px", textAlign: 'right', borderRight: "1px solid #fff" }}>可用菜品:</Col>
              <Col span="14">
                {yhqhdConfig.currentRecord.unapplicableFoodsName && yhqhdConfig.currentRecord.unapplicableFoodsName != "" && yhqhdConfig.currentRecord.unapplicableFoodsName != null && yhqhdConfig.currentRecord.unapplicableFoodsName.length > 0 &&
                  <div>
                    {yhqhdConfig.currentRecord.unapplicableFoodsName.map(function (item) {
                      return item + "  ,  "
                    })}
                  </div>
                } 


              </Col>
            </Row>
          }


          <Row style={{ padding: "8px 0", background: "#fff" }}>
            <Col span="7" span="7" style={{ paddingRight: "10px", marginRight: "10px", textAlign: 'right', borderRight: "1px solid #fff" }}>适用门店:</Col>
            <Col span="14" >
              {yhqhdConfig.currentRecord.applicableRestaurantsName && yhqhdConfig.currentRecord.applicableRestaurantsName != "" && yhqhdConfig.currentRecord.applicableRestaurantsName != null && yhqhdConfig.currentRecord.applicableRestaurantsName.length>0 &&
             <div>
                {yhqhdConfig.currentRecord.applicableRestaurantsName.map(function(item){
                  return item+"  ,  "
                })}
             </div>
            } 
            </Col>
          </Row>

          <Row style={{ padding: "8px 0", background: "#e3f2f7" }}>
            <Col span="7" span="7" style={{ paddingRight: "10px", marginRight: "10px", textAlign: 'right', borderRight: "1px solid #fff" }}>优惠券说明:</Col>
            <Col span="14" >
              {yhqhdConfig.currentRecord.couponDesc}
            </Col>
          </Row>
        </div>
      </Modal>
    </Header>
  );
}

YhqhdList.propTypes = {
  menu: PropTypes.object,
};


function mapStateToProps({ menu, yhqhdConfig }) {
  return { menu, yhqhdConfig, menu };
}

export default connect(mapStateToProps)(YhqhdList);

