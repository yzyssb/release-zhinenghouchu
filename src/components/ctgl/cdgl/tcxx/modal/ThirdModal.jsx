import React, {PropTypes} from 'react';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import styles from './../TcAddModal.less';
import Radio from 'antd/lib/radio';
import Button from 'antd/lib/button';
import Checkbox from 'antd/lib/checkbox';
import Rate from 'antd/lib/rate';
import UpLoadImage from '../../../../../components/base/common/UpLoadPicture';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const Modal = ({
                   visible, onOk, onCancel, currentItem, dispatch, tcxx,cpfl,
                   form: {
                       getFieldDecorator,
                       validateFields,
                       getFieldsValue,
                       resetFields,
                   }
               }) => {

    const formItemLayout = {
        labelCol: {span: 4},
        wrapperCol: {span: 19},
    };

    const _food = {...tcxx.food};

    var isRanking = _food.isRanking == '1'?'true':'false';

    const Option = Select.Option;



    const children = [];

    cpfl.list.map((i, j) => {

        children.push(
            <Option key={i.id}>{i.name}</Option>
        )

    });

    function nextStep() {
        validateFields((errors) => {
            if (!!errors) {
                return false;
            }
            dispatch({type: 'tcxx/updatePayload',payload:{currentSteps:3}});
            dispatch({type: 'tcxx/updateFood', payload: {food: getFieldsValue()}});
            dispatch({type: 'tcxx/queryFoodComboAdd',payload:{}});
        })
    }

    function prevStep() {
        dispatch({type: 'tcxx/updatePayload',payload:{currentSteps:1}});
    }

    //处理商品图片
    function onImgChange(e) {

        if (e.previewImage && e.previewImage.length > 0 && e.previewImage[0].response && e.previewImage[0].response.data) {
            tcxx.food.imgUrl = e.previewImage[0].response.data;
            dispatch({type: 'tcxx/updatePayload', payload: {food: tcxx.food}});
        }

    }

    function onImgRemove(e) {
        tcxx.food.imgUrl = "";
        dispatch({type: 'tcxx/updatePayload', payload: {food: tcxx.food}});

    }

     const UpLoadImageGen = () =>
       <UpLoadImage defaultUrl={_food.imgUrl} onChange= {(e)=>{onImgChange(e)}} maxCount = {1} info={"添加图片"} onRemove = {(e)=>{onImgRemove(e)}}> </UpLoadImage>


    return (
        <div style={{display: tcxx.currentSteps == 2 ? "block" : "none"}}>
            <div className={styles.headerblock}>
                <Form id={"thirdForm"}>
                    <FormItem
                        {...formItemLayout}
                        label="图片"
                        
                    >
                        {getFieldDecorator('image', {
                            initialValue: "",
                            rules: [
                                {required: false, message: '图片'}
                            ]
                        })(
                            <UpLoadImageGen />
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="辣度"
                        
                    >
                        {getFieldDecorator('spicyValue', {
                            initialValue: _food.spicyValue,
                            rules: [
                                {required: false, message: '请选择辣度'}
                            ]
                        })(
                            <Rate/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="推荐度"
                        
                    >
                        {getFieldDecorator('recommendValue', {
                            initialValue: _food.recommendValue,
                            rules: [
                                {required: false, message: '请选择推荐度'}
                            ]
                        })(
                            <Rate/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="简介"
                        
                    >
                        {getFieldDecorator('remark', {
                            initialValue: _food.remark,
                            rules: [
                                {required: false, message: '简介'}
                            ]
                        })(
                            <Input type='textarea'/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="状态"
                        
                        extra="（此项为必选项，不选默认为在售！）"
                    >
                        {getFieldDecorator('status', {
                            initialValue: _food.status,
                            rules: [
                                {required: true, message: '状态'}
                            ]
                        })(
                            <RadioGroup defaultValue={_food.status}>
                                <Radio value={1}>在售</Radio>
                                <Radio value={2}>停售</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="其他"
                        
                        extra="（此项为必选项！）"
                    >
                        {getFieldDecorator('isRanking', {
                            initialValue: isRanking,
                            rules: [
                                {required: true, message: '参与销量排名'}
                            ]
                        })(
                            <Checkbox defaultChecked={isRanking}>参与销量排名</Checkbox>
                        )}
                    </FormItem>

                </Form>
            </div>
            <div style={{overflow:"hidden",padding: "0 30%"}}>
                <Button
                    type="primary"
                    style={{margin: '0 auto',width: "30%",float: "left"}}
                    onClick={prevStep}>
                    上一步
                </Button>
                <Button
                    type="primary"
                    style={{margin: '0 auto',width: "30%",float: "right"}}
                    onClick={nextStep}>
                    完成
                </Button>
            </div>
            
        </div>


    );
};

Modal.propTypes = {
    visible: PropTypes.any,
    item: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
};

export default Form.create()(Modal);
