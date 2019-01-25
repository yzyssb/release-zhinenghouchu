import React, {PropTypes} from 'react';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import styles from './../CpAddModal.less';
import Radio from 'antd/lib/radio';
import Button from 'antd/lib/button';
import Checkbox from 'antd/lib/checkbox';
import Rate from 'antd/lib/rate';
import UpLoadImage from '../../../../../components/base/common/UpLoadPicture';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const Modal = ({
                   visible, onOk, onCancel, currentItem, dispatch, lscpxx, lscpfl, lscpdw,
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

    const _food = {...lscpxx.food};
    const Option = Select.Option;

    const children = [];

    if (lscpfl.list.list > 0){
        lscpfl.list.map((i, j) => {

        children.push(
            <Option key={i.id}>{i.name}</Option>
        )

    });

    }

    function nextStep() {
        validateFields((errors) => {
            if (!!errors) {
                return false;
            }
            dispatch({type: 'lscpxx/nextStep', payload: {}});
            dispatch({type: 'lscpxx/updateFood', payload: {food: getFieldsValue()}});
            dispatch({type: 'lscpxx/queryFoodAdd', payload: {}});
        })
    }

    function prevStep() {
        dispatch({type: 'lscpxx/prevStep', payload: {}});
    }

    //处理商品图片
    function onImgChange(e) {

        if (e.previewImage && e.previewImage.length > 0 && e.previewImage[0].response && e.previewImage[0].response.data) {
            lscpxx.food.imgUrl = e.previewImage[0].response.data;
            dispatch({type: 'lscpxx/updatePayload', payload: {food: lscpxx.food}});
        }

    }

    function onImgRemove(e) {
        lscpxx.food.imgUrl = "";
        dispatch({type: 'lscpxx/updatePayload', payload: {food: lscpxx.food}});

    }

    const UpLoadImageGen = () =>
    <UpLoadImage defaultUrl={_food.imgUrl} onChange={(e) => {onImgChange(e)}} maxCount={1} info={"添加图片"} onRemove={(e) => {onImgRemove(e)}}> </UpLoadImage>

    return (
        <div style={{display: lscpxx.currentSteps == 2 ? "block" : "none"}}>
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
                            <Rate allowClear = {true}/>
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
                           <Rate allowClear = {true}/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="推荐菜"

                        extra="（此项选择后将在微信公众号品牌馆推荐菜品，提高曝光率）"
                    >
                        {getFieldDecorator('RecommendedDishes', {
                            initialValue: "",
                            rules: [
                                {required: false, message: ''}
                            ]
                        })(
                            <div>
                                <Checkbox defaultChecked={lscpxx.food.isCurrentPrice}>品牌馆推荐</Checkbox>
                            </div>
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
                            initialValue: (_food.status == null)?1:_food.status,
                            rules: [
                                {required: true, message: '状态'}
                            ]
                        })(
                            <RadioGroup value={_food.status}>
                                <Radio value={1}>在售</Radio>
                                <Radio value={2}>停售</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="其他"
                        
                       
                    >
                        {getFieldDecorator('isRanking', {
                            initialValue: _food.isRanking,
                            rules: [
                                {required: false, message: '参与销量排名'}
                            ]
                        })(
                            <Checkbox value={1}>参与销量排名</Checkbox>
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
