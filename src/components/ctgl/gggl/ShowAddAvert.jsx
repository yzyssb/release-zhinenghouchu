import React, { PropTypes } from 'react';
import Modal from 'antd/lib/modal';
import Form from 'antd/lib/form';
const FormItem = Form.Item;
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import Button from 'antd/lib/button';
import UpLoadImage from '../../../components/base/common/UpLoadPicture';



const ShowAddAvert = ({ advertManagerPage, dispatch, onCancel, record, form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
    setFieldsValue,
}, }) => {
    const modalOpts = {
        title: advertManagerPage.way == "add" ? '添加广告' : "修改广告",
        visible: advertManagerPage.isShow,
        onCancel,

        footer: [
            <Button key="back" onClick={handCancel}>取消</Button>,
            <Button key="submit" type="primary" onClick={handleOk}>确认</Button>
        ]

    };

    function handCancel() {

        record.photoUrl = advertManagerPage.imageUrl;
        dispatch({
            type: 'advertManagerPage/updateShow',
            payload: { isShow: false ,record:record}
        });
    }


    // 重置form
    // 每次重载页面时检测advertManagerPage.isResetForm的值，如果为真就重置数据，一定要加延时
    if (advertManagerPage.isResetForm) {
        setTimeout(function () { resetFormTimeout(resetFields, dispatch) }, 20);
    }
    function resetFormTimeout(resetFields, dispatch) {
        if (resetFields) {
            resetFields();
        }
        if (dispatch) {
            dispatch({
                type: 'advertManagerPage/updatePayload',
                payload: { isResetForm: false }
            });
        }
    }



    function handleOk() {
        validateFields((errors) => {
            if (!!errors) {
                return false;
            }

            let value = getFieldsValue();
            let ruleName = value.rule_name;
            let ruleUrl = value.rule_url;

            dispatch({
                type: 'advertManagerPage/updatePayload',
                payload: {
                    isShow: false,
                    rule_name: ruleName,
                    rule_url: ruleUrl,
                }
            });

            // 判断新增还是修改
            dispatch({
                type: 'advertManagerPage/addAvert',
                payload: {

                }
            });

        });
    }


    const formItemLayout = {
        labelCol: {
            span: 5,
        },
        wrapperCol: {
            span: 16,
        },
    };

    function handleChange(value) {
        dispatch({
            type: 'advertManagerPage/updatePayload',
            payload: { client: value, }

        });
    }

    // 删除图片
    function onImgRemove(e) {
        console.log("删除图片")
        record.photoUrl = '';
        dispatch({
            type: 'advertManagerPage/updatePayload',
            payload: { record: record, }
        });
    };


    // 图片改变时
    function onImgChange(e) {
        console.log("图片改变")
        if (e.previewImage && e.previewImage.length > 0 && e.previewImage[0].response && e.previewImage[0].response.data) {
            record.photoUrl = e.previewImage[0].response.data;
            dispatch({ type: 'advertManagerPage/updatePayload', payload: { record:record } });
        }
    };

    const UpLoadImageGen = () =>
    <UpLoadImage defaultUrl={record.photoUrl} maxCount={1} onChange={(e) => { onImgChange(e) }} info={"添加图片"} onRemove={(e) => { onImgRemove(e) }}> </UpLoadImage>

    return (
        <Modal {...modalOpts} key={advertManagerPage.modalKey} afterClose={() => {

            dispatch({
                type:'advertManagerPage/updatePayload', payload: {
                    modalKey: Date.now(),

                }
            });
        }}>
            <div>
                <Form horizontal>
                    <FormItem{...formItemLayout} label="广告名称" >
                        {getFieldDecorator('rule_name', {
                            initialValue: advertManagerPage.way == "add" ? "" : record.adDetails,
                            rules: [
                                {
                                    required: true,
                                    message: '请填写广告名称'
                                }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>


                    <FormItem{...formItemLayout} label="横屏位置" >
                        {getFieldDecorator('client', {
                            initialValue: advertManagerPage.way == "add" ? 1 : record.adType,
                            rules: [
                                {
                                    required: true,
                                    message: '横屏位置'
                                }
                            ]
                        })(
                            <Select style={{ width: 120 }} onChange={handleChange}>
                                <Option value={1}>确认订单</Option>
                                <Option value={2}>人数选择</Option>
                                <Option value={3}>支付成功</Option>
                                <Option value={4}>注册框</Option>
                            </Select>
                        )}
                    </FormItem>


                    <FormItem{...formItemLayout} label="URL超链接" >
                        {getFieldDecorator('rule_url', {
                            initialValue: advertManagerPage.way == "add" ? "" : record.linkAddress,

                        })(
                            <Input />
                        )}
                    </FormItem>

                    
                        {/* {advertManagerPage.way == "add" ?
                            <UpLoadImage defaultUrl="" maxCount={1} onChange={(e) => { onImgChange(e) }} info={"添加图片"} onRemove={(e) => { onImgRemove(e) }}></UpLoadImage>
                            :
                            <UpLoadImage defaultUrl={record.photoUrl} maxCount={1} onChange={(e) => { onImgChange(e) }} info={"添加图片"} onRemove={(e) => { onImgRemove(e) }}> </UpLoadImage>
                        } */}

                        <div style = {{marginLeft:20}}>
                            <label style = {{float:'left',marginRight:20}}>广告图片:</label> <UpLoadImageGen />
                        </div>


                        <div>
                                
                        </div>
              


                </Form>

            </div>


        </Modal>

    );
};



ShowAddAvert.propTypes = {

};

//export default ShowAddAvert;
export default Form.create()(ShowAddAvert);