// import React, { PropTypes } from 'react';
// import { connect } from 'dva';
// import { routerRedux } from 'dva/router';
// import Button from 'antd/lib/button';
// import Modal from 'antd/lib/modal';
// import Table from 'antd/lib/table';
// import Radio from 'antd/lib/radio';
// import Pagination from 'antd/lib/pagination';
// import Breadcrumb from 'antd/lib/breadcrumb';
// import Form from 'antd/lib/form';
// import Icon from 'antd/lib/icon';
// import Input from 'antd/lib/input';
// import Checkbox from 'antd/lib/checkbox';
// import Col from 'antd/lib/col';
// import Row from 'antd/lib/row';
// import { Popconfirm } from 'antd/lib';



// // 上面只是表单，把表单放到下面的页面中
// function editStoreModal({ menu, dispatch, cpfjfEditConfig }) {
 


//   const columns = [
//     {
//       title: '序号',
//       dataIndex: 'id',
//       key: 'id',
//       render: function (text, record, index) {
//         return <span key={record.id}>{index + 1}</span>
//       }
//     }, {
//       title: '门店名称',
//       dataIndex: 'name',
//       key: 'name',
//     }
//   ];






  // 点击取消关闭modal
  function handleCancel() {
    console.log("点击了取消")
    // dispatch({
    //   type: 'cpfjfEditConfig/updatePayload',
    //   payload: { storeModalVisible: false, selectedRows: [], selectedRowKeys: [] }
    // });
  }

//   // 点击确定执行后面的逻辑
  function handleOk() {
    console.log("点击了确定");
    // // 关闭modal
    // dispatch({
    //   type: 'cpfjfEditConfig/updatePayload',
    //   payload: { storeModalVisible: false }
    // });

  }

    // console.log(cpfjfEditConfig.selectedRows)
    // // 
    // let payload = {};
    // payload.userIdList = [];
    // payload.touchscreenId = cpfjfEditConfig.query.id;
    // // 循环拿到选中项的id
    // cpfjfEditConfig.selectedRows.map(function (item, index) {
    //   payload.userIdList.push(item.id)
    // });





//   }


//   // 以下是modal部分
//   const modalColumns = [
//     {
//       title: '序号',
//       dataIndex: 'id',
//       key: 'id',
//       render: function (text, record, index) {
//         return <span key={record.id}>{index + 1}</span>
//       }
//     },
//     {
//       title: '店员姓名',
//       dataIndex: 'realName',
//       key: 'realName',
//     }, {
//       title: '手机号码',
//       dataIndex: 'phone',
//       key: 'phone',

//     }];

//   const rowSelection = {
//     selectedRowKeys: cpfjfEditConfig.selectedRowKeys,
//     onChange: (selectedRowKeys, selectedRows) => {
//       dispatch({
//         type: 'cpfjfEditConfig/updatePayload',
//         payload: { selectedRows, selectedRowKeys }
//       });
//     },
//     getCheckboxProps: record => ({

//       name: record.name,
//     }),
//   };

//   // 切换分页时把选中的项在视觉上清空
//   function changeTable() {
//     console.log("changeTable");
//     dispatch({
//       type: 'cpfjfEditConfig/updatePayload',
//       payload: { selectedRows: [], selectedRowKeys: [] }
//     });
//   }



//   return (

//     <Modal
//       title="选择店员"
//       visible={cpfjfEditConfig.storeModalVisible}
//       onOk={handleOk}
//       onCancel={handleCancel}
//     >
//     1234646
//       {/* <Table rowKey={record => record.id} onChange={changeTable} rowSelection={rowSelection} columns={columns} dataSource={cpfjfEditConfig.storeList} /> */}
//     </Modal>


//   );
// }

// editStoreModal.propTypes = {
//   menu: PropTypes.object,
// };

// function mapStateToProps({ menu, cpfjfEditConfig }) {
//   return { menu, cpfjfEditConfig };
// }

// export default connect(mapStateToProps)(editStoreModal);





import React, { PropTypes } from 'react';
// import Header from '../../../components/Header';
// import { connect } from 'dva';
// import LeftMenu from '../../../components/LeftMenu';
// import { routerRedux } from 'dva/router';
// import Button from 'antd/lib/button';
import message from 'antd/lib/message';
import Modal from 'antd/lib/modal';
// import Table from 'antd/lib/table';
// import Input from 'antd/lib/input';
// import Select from 'antd/lib/select';
// import Icon from 'antd/lib/icon';
// import Switch from 'antd/lib/switch';
// import Tree from 'antd/lib/tree';
// import Col from 'antd/lib/col';
// import Row from 'antd/lib/row';
// import Form from 'antd/lib/form';
// import Collapse from 'antd/lib/collapse';
// import DatePicker from 'antd/lib/date-picker';
// import moment from 'moment';
// import styles from "./ZcglPage.less";

// const FormItem = Form.Item;
// const Option = Select.Option;
// const MonthPicker = DatePicker.MonthPicker;
// const RangePicker = DatePicker.RangePicker;
// const dateFormat = 'YYYY/MM/DD h:mm:ss a';


// form表单
const storeModal = ({
  dispatch, cpfjfEditConfig
}) => {
 


  //点击取消隐藏弹框
  function handleCancel() {
    dispatch({
      type: 'cpfjfEditConfig/updatePayload',
      payload: { storeModalVisible: false }
    });
    // 充值所有组件
    resetFields()
  }



  return (
    <Modal
      width="800px"
      visible={cpfjfEditConfig.storeModalVisible}
      title={"请选择门店"}
      onOk={handleOk}
      onCancel={handleCancel}
    >

    123456
    </Modal>
  );

}


storeModal.propTypes = {
  form: PropTypes.object.isRequired,
  onSearch: PropTypes.func,
  onAdd: PropTypes.func,
  field: PropTypes.string,
  keyword: PropTypes.string,
};


function mapStateToProps({ cpfjfEditConfig }) {
  return { cpfjfEditConfig };
}

export default storeModal;



// 循环，如果返回的数据和页面显示的数据不一致的时候，比较两者的区别 都为大类的时候，如果key相同








