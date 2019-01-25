import React, {PropTypes} from 'react';
import Form from 'antd/lib/form';
import Select from 'antd/lib/select';
import Button from 'antd/lib/button';
import Spin from 'antd/lib/spin';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import DatePicker from 'antd/lib/date-picker';
import styles from './ZfglPage.less';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
import moment from 'moment';
import Table from 'antd/lib/table';
import ZfAddModal from './ZfAddModal';
import ZfEditModal from './ZfEditModal';
import Popconfirm from 'antd/lib/popconfirm';

const formItemLayout = {
    labelCol: {
        span: 5,
    },
    wrapperCol: {
        span: 12,
    },
};

const ZfglPage = ({
                      form: {
                          getFieldDecorator,
                          validateFields,
                          getFieldsValue,
                          resetFields,
                      },
                      dispatch, zfgl,
                      pageNo,
                      total,
                      current,
                      dataSource,

                  }) => {


    function handleSubmit(e) {
        if (e) {
            e.preventDefault();
        }

        validateFields((errors) => {
            if (!!errors) {
                return;
            }
        });

        var data = {...getFieldsValue()};

        //dispatch({type: 'orderlist/recoverOrderTime',payload:{}});

    }

    function onCuisineChange(value) {


    }


    function goeditgoods(record) {
        

        dispatch({
            type: 'zfgl/updatePayload',
            payload: {

                foodMethodItemEdit: record,
                modalEditVisible: true,
                currentSelectValue:record.pricingType+"",
                currentSelectValue1:record.status+"",
                id:record.id,
                isAdd:false,
                issueId:record.issueId,
            }
        });

    }

    function onOperate(record) {

        dispatch({
            type: 'zfgl/deleteZF',
            payload: {deleteId: record.id}
        });

    }


    function managerHandle(record, index) {

        var handlebtn = [];

        handlebtn.push(<span key={index}><a onClick={() => {
            goeditgoods(record)
        }}>编辑</a>
             <span className="ant-divider"/>
             <Popconfirm okText="确定" cancelText="取消" title="确定要删除吗？" onConfirm={() => onOperate(record)}>
                  <a disabled={zfgl.manageType ==1?true:false}>删除</a>
             </Popconfirm>
          </span>)

        return handlebtn;
    }

    function managerStatus(record, index) {

        var text;

        if (record.status == 1) {

            text = "启用";
        } else {
            text = "停用";
        }

        return text;
    }

    function managerPricingType(record,index){
        var text = '不加价';
        if (record.pricingType == 0) {
            text = '不加价';

        }else if (record.pricingType == 1) {
            text = '按比例';

        }else if (record.pricingType == 2) {
            text = '固定金额';

        }

        return text;
    }

    function managerRate(record,index){

        var text  = '';

        if (record.pricingMoney) {

            text  = record.pricingMoney/100 + '元';
        }else if (record.pricingRate) {

            text = record.pricingRate + '%';
        }else{

            text = '0元';
        }

        return text;
    }

    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
        }, {
            title: '做法名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (text, record, index) => (
                managerStatus(record, index)
            ),
        }, {
            title: '默认加价方式',
            dataIndex: 'pricingType',
            key: 'pricingType',
            render: (text, record, index) => (
                managerPricingType(record, index)
            ),
        }, {
            title: '默认加价金额/加价比例',
            dataIndex: 'pricingRate',
            key: 'pricingRate',
            render: (text, record, index) => (
                managerRate(record, index)
            ),
        }, {
            title: '关联菜品数量',
            dataIndex: 'foodCount',
            key: 'foodCount',
        }, {
            title: '操作',
            key: 'operation',
            dataIndex: 'operation',
            render: (text, record, index) => (
                managerHandle(record, index)
            ),
        }
    ];

    const pagination = {
        total: zfgl.total,
        current: zfgl.current,
        pageSize: zfgl.size,
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger: true,
        onShowSizeChange: SizeChange,
        showTotal:(total)=>{return `共 ${total} 条`},
    };

    function SizeChange(current, pageSize) {

        
        dispatch({type: 'zfgl/updatePayload', payload: {size: pageSize, current: 1, offset: 0}});
        dispatch({type: 'zfgl/query', payload: {}});


    }

    function onPageChange(pageNo) {
        
        var offset = pageNo * zfgl.size - zfgl.size;
        dispatch({type: 'zfgl/updatePayload', payload: {offset: offset, current: pageNo}});
        dispatch({type: 'zfgl/query', payload: {}});


    }


    function addReasonClick() {

        dispatch({type: 'zfgl/updatePayload', payload: {modalVisible: true}});

    }

    function addZFClick() {

        dispatch({type: 'zfgl/updatePayload', payload: {isAdd:true,modalVisible: true,currentSelectValue:0,currentSelectValue1:0,id:0,foodMethodAddItem:{}}});

    }4

    function onClear() {
        dispatch({type: 'zfgl/updatePayload', payload: {keyword: ""}});
    }

    function onButtonSearch() {
        dispatch({type: 'zfgl/query', payload: {}});
    }

    function onKeywordChange(e) {
        dispatch({type: 'zfgl/updatePayload', payload: {keyword: e.target.value}});
    }

    const CpdwAddModalProps = {
        visible: zfgl.modalVisible,
        dispatch,
        onOk() {

            dispatch({
                type: 'zfgl/addFoodMethodUrl',
                payload: {modalVisible: false}
            });
        },
        onCancel() {
            dispatch({
                type: 'zfgl/updatePayload',
                payload: {modalVisible: false}
            });
        },
        zfgl,
    };
    const CpdwAddModalProps1 = {
        visible: zfgl.modalEditVisible,
        dispatch,
        onOk() {

            dispatch({
                type: 'zfgl/editFoodMethodUrl',
                payload: {modalEditVisible: false}
            });
        },
        onCancel() {
            dispatch({
                type: 'zfgl/updatePayload',
                payload: {modalEditVisible: false}
            });
        },
        zfgl,
    };
    return (
        <div className={styles.search}>

            <div style={{marginLeft: 20}}><span>做法名称</span><Input style={{marginLeft: 20, width: 220}}
                                                                  onChange={onKeywordChange} value={zfgl.keyword} onPressEnter = {onButtonSearch}/>
                <Button type="primary" style={{marginLeft: 40}} onClick={onButtonSearch}>搜索</Button>
                <Button style={{marginLeft: 10, marginRight: 20}} onClick={onClear}>重置</Button>
            </div>


            <Button disabled={zfgl.manageType ==1?true:false} style={{marginLeft: 10, marginTop: 20}} onClick={addZFClick}>新增做法</Button>

            <Table className={styles.table}
                   columns={columns}
                   dataSource={zfgl.list}
                   rowKey={record => record.id}
                   pagination={pagination}
                   bordered/>
            <ZfAddModal  {...CpdwAddModalProps} />
            <ZfEditModal{...CpdwAddModalProps1} />

        </div>
    );
};


ZfglPage.propTypes = {
    visible: PropTypes.any,
    form: PropTypes.object,
    item: PropTypes.object,
};

export default Form.create()(ZfglPage);