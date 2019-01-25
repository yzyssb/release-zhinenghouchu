import React, {PropTypes} from 'react';

import Modal from 'antd/lib/modal';
import Form from 'antd/lib/form';
import Select from 'antd/lib/select';
import Button from 'antd/lib/button';
import styles from './CpAddModal.less';
import Steps from 'antd/lib/steps';
import Row from 'antd/lib/row';

import FirstModal from "./modal/FirstModal";
import SecondModal from "./modal/SecondModal";
import ThridModal from "./modal/ThridModal";


const Step = Steps.Step;

const CpAddModal = ({

                        visible,
                        onOk,
                        onCancel,
                        currentItem,
                        dispatch,
                        cpfl,
                        cpxx,
                        cpdw,
                        gggl,
                        zfgl,
                        tcxx,
                        form: {
                            getFieldDecorator,
                            validateFields,
                            getFieldsValue,
                            resetFields,
                        }
                    }) => {

    const formItemLayout = {
        labelCol: {span: 6},
        wrapperCol: {span: 18},
    };

    function handleOk() {
    }

    const Option = Select.Option;

    const children = [];

    if (cpfl.list.length > 0){
        cpfl.list.map((i, j) => {

            children.push(
                <Option key={i.id}>{i.name}</Option>
            )

        });
    }

    const cpdwChildren = [];
    if (cpdw.list.length > 0 ){
        cpdw.list.map((i, j) => {

            cpdwChildren.push(
                <Option key={i.code}>{i.name}</Option>
            )

        });
    }


    const modalOpts = {
        title: cpxx.way == 'add'?'新增菜品信息':'编辑菜品信息',
        visible,
        onOk: handleOk,
        onCancel,
        currentItem,
        width: '60%',
        footer: null

    };

    const modalProps = {
        cpxx,
        cpfl,
        cpdw,
        gggl,
        zfgl,
        tcxx,
        dispatch,
    };


    return (
        <Modal style={{height:"600px",overflowY:"auto",paddingBottom:"0"}} {...modalOpts} key={cpxx.modalKey} afterClose={() => {
            // !!!!
            document.getElementById("firstForm").reset();
            document.getElementById("secondForm").reset();
            document.getElementById("thirdForm").reset();
            dispatch({
                type: 'cpxx/updatePayload', payload: {
                    modalKey: Date.now(),
                    currentSteps: 0,
                    onSpecs: 0,
                    onMethods: 0,
                    food: {
                        specs: [],
                        methods: [],
                    }
                }
            });
        }}>

            <div className={styles.pay}>
                <Steps current={cpxx.currentSteps} style={{padding: '30px 0'}}>
                    <Step title="基本信息" description=""/>
                    <Step title="价格提成" description=""/>
                    <Step title="图片其他" description=""/>
                    <Step title="添加成功" description=""/>
                </Steps>

                <FirstModal {...modalProps}    />
                <SecondModal {...modalProps}    />
                <ThridModal {...modalProps}    />

                <div style={{display: cpxx.currentSteps == 3 ? "block" : "none", textAlign: "center",fontSize:"20px",marginTop:"30px"}}>
                    <div className={styles.headerblock}>
                        <Row>操作成功!</Row>
                    </div>

                    <div style={{overflow:"hidden",padding: "0 30%",marginTop: "50px"}}>
                        <Button
                            type="primary"
                            style={{width: "30%",display:"block",margin: "0 auto"}}
                            onClick={() => {
                                dispatch({type: 'cpxx/updatePayload', payload: {modalVisible: false}});
                            }}>
                            确定
                        </Button>
                    </div>
                    
                </div>
            </div>
        </Modal>
    );
};

CpAddModal.propTypes = {
    visible: PropTypes.any,
    item: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
};

export default Form.create()(CpAddModal);
