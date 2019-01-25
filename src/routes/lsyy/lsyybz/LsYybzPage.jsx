import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import Yybz_Child from '../../../components/lsyy/lsyybz/Yybz_Child';
import Tabs from 'antd/lib/tabs';
const TabPane = Tabs.TabPane;
import Select from 'antd/lib/select';
const Option = Select.Option;
import Modal from 'antd/lib/modal';
import Checkbox from 'antd/lib/checkbox';
const CheckboxGroup = Checkbox.Group;
import styles from './LsYybzPage.less';
import message from 'antd/lib/message';
import ReasonAddModal from '../../../components/lsyy/lsyybz/ReasonAddModal';
import Button from 'antd/lib/button';
import Icon from 'antd/lib/icon';

function LsYybzPage({ menu, lsyybz, dispatch, }) {

  const {
       modalVisible,

    } = lsyybz



  const HeaderProps = {
    menu,
    dispatch,
  };


  const ReasonAddModalProps = {
    visible: modalVisible,
    dispatch,
    onOk() {
    },
    onCancel() {
      dispatch({
        type: 'lsyybz/updatePayload',
        payload: { modalVisible: false }
      });
    },
    lsyybz,
  };

  const lsyybzchildProps = {
    dispatch,
    lsyybz
  }

  function brandIdChange(e) {
    dispatch({
      type: 'lsyybz/updatePayload',
      payload: {
        brandId: +e,

        selectedRowKeys: [],
        selectedRows: [],
      }
    })
    sessionStorage.setItem('brandId_lsyybz', +e)
    dispatch({
      type: 'lsyybz/chooseBrandUrl',
      payload: {}
    })
  }

  function closeModal() {
    dispatch({
      type: 'lsyybz/updatePayload',
      payload: {
        allotModalVisible: false
      }
    })
  }

  function closeResModal() {
    var arr = []
    for (var i = 0; i < lsyybz.plainOptions.length; i++) {
      for (var j = 0; j < lsyybz.checkedList.length; j++) {
        if (lsyybz.plainOptions[i].value == lsyybz.checkedList[j]) {
          arr.push(lsyybz.plainOptions[i].label)
        }
      }
    }
    dispatch({
      type: 'lsyybz/updatePayload',
      payload: {
        resModalVisible: false,
        allotModal_key2: arr.join('、')
      }
    })
  }

  function key3Change(e) {
    dispatch({
      type: 'lsyybz/updatePayload',
      payload: {
        allotModal_key3: e
      }
    })
  }

  function chooseRes() {
    dispatch({
      type: 'lsyybz/updatePayload',
      payload: {
        // allotModal_key2:'',
        resModalVisible: true
      }
    })
  }

  function onCheckAllChange(e) {
    var arr = []
    if (lsyybz.plainOptions.length > 0) {
      lsyybz.plainOptions.map(v => {
        arr.push(+v.value)
      })
    }
    dispatch({
      type: 'lsyybz/updatePayload',
      payload: {
        checkedList: e.target.checked ? arr : [],
        indeterminate: false,
        checkAll: e.target.checked,
      }
    })
  }

  function resChange(checkedList) {
    dispatch({
      type: 'lsyybz/updatePayload',
      payload: {
        checkedList,
        indeterminate: !!checkedList.length && (checkedList.length < lsyybz.plainOptions.length),
        checkAll: checkedList.length === lsyybz.plainOptions.length,
      }
    })
  }

  function confirmAction() {
    if (lsyybz.allotModal_key2.length == 0) {
      message.error('请先选择门店')
      return
    }
    dispatch({
      type: 'lsyybz/commentAllotComments',
      payload: {}
    })
    dispatch({
      type: 'lsyybz/updatePayload',
      payload: {
        allotModalVisible: false,
      }
    })
  }

  function cancelAction() {
    dispatch({
      type: 'lsyybz/updatePayload',
      payload: {
        allotModalVisible: false,
      }
    })
  }

  function cancelResModal() {
    dispatch({
      type: 'lsyybz/updatePayload',
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
          <Select style={{ minWidth: 200 }} value={String(lsyybz.brandId)} onChange={brandIdChange}>
            {lsyybz.brandList.length > 0 && lsyybz.brandList.map((v, i) => (
              <Option key={v.key}>{v.value}</Option>
            ))}
          </Select>
        </div>
        <Yybz_Child {...lsyybzchildProps}>
        </Yybz_Child>
        <ReasonAddModal  {...ReasonAddModalProps} />

        <Modal
          title="原因备注快速分配至门店"
          visible={lsyybz.allotModalVisible}
          onCancel={closeModal}
          footer={null}
        >
          <div style={{ color: '#999', lineHeight: '30px', fontSize: 12 }}>已选择原因备注</div>
          <div style={{ lineHeight: '20px', paddingLeft: 10, marginBottom: 10, maxHeight: 200, overflowY: 'scroll' }}>{lsyybz.allotModal_key1}</div>

          <div style={{ color: '#999', lineHeight: '30px', fontSize: 12 }}>选择门店（点击所选门店可重新选择）</div>
          {lsyybz.allotModal_key2.length == 0 ? (
            <div style={{ border: '1px solid #eee', borderRadius: '4px', textAlign: 'center', margin: '0 0 10px 10px', padding: 10, cursor: 'pointer' }} onClick={chooseRes}>
              <span style={{ fontSize: 30, display: 'inline-block', width: 40, height: 40, borderRadius: '50%', lineHeight: '33px', border: '1px solid #ddd' }}>+</span><br />点击选择门店
            </div>
          ) : (
              <div style={{ lineHeight: '20px', paddingLeft: 10, marginBottom: 10, cursor: 'pointer', maxHeight: 200, overflowY: 'scroll' }} onClick={chooseRes}>{lsyybz.allotModal_key2}</div>
            )}

          <div style={{ color: '#999', lineHeight: '30px', fontSize: 12 }}>分配方式</div>
          <Select style={{ width: 200, marginLeft: 10 }} value={String(lsyybz.allotModal_key3)} onChange={key3Change}>
            <Option key="1">合并店铺原因备注</Option>
            <Option key="2">完全替换店铺原因备注</Option>
          </Select>

          <div style={{ padding: '30px 0 10px 0', textAlign: 'center' }}>
            <Button style={{ marginRight: 50 }} onClick={cancelAction}>取消</Button>
            <Button type="primary" onClick={confirmAction}>立即分配</Button>
          </div>
        </Modal>

        <Modal
          title="选择门店"
          visible={lsyybz.resModalVisible}
          onCancel={cancelResModal}
          footer={null}
          afterClose={() => {
            var arr = lsyybz.allotModal_key2.split('、'), arr1 = []
            if (arr.length > 0 && lsyybz.plainOptions.length > 0) {
              lsyybz.plainOptions.map(v => {
                arr.map(vv => {
                  if (v.label == vv && arr1.indexOf(v.value) == -1) {
                    arr1.push(v.value)
                  }
                })
              })
            }
            dispatch({
              type: 'lsyybz/updatePayload',
              payload: {
                checkedList: arr1,
                checkAll: arr1.length == lsyybz.plainOptions.length,
              }
            })
          }}
        >
          <div style={{ background: '#eee', lineHeight: '40px', marginBottom: 20, padding: '0 10px' }}>
            <Checkbox
              // indeterminate={lsyybz.indeterminate}
              onChange={onCheckAllChange}
              checked={lsyybz.checkAll}
            >
              <span>全选</span>
            </Checkbox>
          </div>
          <CheckboxGroup options={lsyybz.plainOptions} className={styles.checkbox_yzy} value={lsyybz.checkedList} onChange={resChange} />
          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <Button style={{ marginRight: 50 }} onClick={cancelResModal}>取消</Button>
            <Button type="primary" onClick={closeResModal}>确定</Button>
          </div>
        </Modal>
      </div>

    </Header>
  );

}

LsYybzPage.propTypes = {
  menu: PropTypes.object,
};

function mapStateToProps({ menu, lsyybz }) {
  return { menu, lsyybz };
}

export default connect(mapStateToProps)(LsYybzPage);

