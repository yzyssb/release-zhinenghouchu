import React, {PropTypes} from 'react';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import styles from './../CpAddModal.less';
import Radio from 'antd/lib/radio';
import Button from 'antd/lib/button';
import Checkbox from 'antd/lib/checkbox';
import {Col, Row} from 'antd/lib';
import InputNumber from 'antd/lib/input-number';
import Table from 'antd/lib/table';
import message from 'antd/lib/message';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const Modal = ({
                   visible, onOk, onCancel, currentItem, dispatch, lscpxx, lscpfl, lscpdw, lsgggl, lszfgl,lstcxx,
                   form: {
                       getFieldDecorator,
                       validateFields,
                       getFieldsValue,
                       resetFields,
                       setFieldsValue,
                       getFieldValue,
                   }
               }) => {

    const formItemLayout = {
        labelCol: {span: 3},
        wrapperCol: {span: 21},
    };

    const Option = Select.Option;

    const children = [];

    if (lstcxx.printList) {
        lstcxx.printList.map((i, j) => {

        children.push(
            <Option key={i.key} value={i.key}>{i.value}</Option>
        )

    });
    }

    const childrenCpdw = [];

    if (lscpdw.all && lscpdw.all.length > 0){
        lscpdw.all.map((i,j) => {

            childrenCpdw.push(
                <Option key={i.key} value={i.key}>{i.value}</Option>
            )

        });
    }

    function nextStep() {
        validateFields((errors) => {
            if (!!errors) {
                return false;
            }

            if (typeof(lscpxx.price)=="undefined"){
                message.warning('请填写价格');
                return;
            }

            if (typeof(lscpxx.vipPrice)=="undefined"){
                message.warning('请填写会员价');
                return;
            }

            if (lscpxx.vipPrice > lscpxx.price) {
                message.warning('会员价格不能比售价高');
                return;
            }
           
            let value = getFieldsValue();
        

            var isRepeat = false;

            // lscpxx.specList.map((i)=>{

            //     if(i.price == null ||i.vipPrice == null || i.boxNum == null){

            //         isRepeat =true;
            //     }

            // })
            
            lscpxx.specList.map((i)=>{

                if(i.name == null || i.name == ""){

                    isRepeat = true;
                }

            })

            if(isRepeat == true)
            {
                message.warning('规格名称为空或重复');
                return;
            }     


            var isDefault = true;
           
            if (lscpxx.specList && lscpxx.specList.length > 0) {

                lscpxx.specList.map((i)=>{

                if(i.isDefault == true){

                    isDefault = false;
                }

                })
              
                if(isDefault == true)
                {
                    message.warning('请选择默认规格');
                    return;
                }   
            }

                

            value.specs && value.specs.map((item, i) => {
                item.isDefault = item.isDefault ? 1 : 0;
                item.price = item.price * 100;
                item.vipPrice = item.vipPrice * 100;
            });

            value.methods && value.methods.map((item, i) => {
                item.pricingMoney = item.pricingMoney * 100;
            });

            dispatch({type: 'lscpxx/updateFood', payload: {food: value}});

            dispatch({type: 'lscpxx/nextStep', payload: {}});
        })
    }

    function prevStep() {
        dispatch({type: 'lscpxx/prevStep', payload: {}});
    }

 
    const onSpecs = (e) => {

        if (e.target.checked == false) {

            dispatch({
                type: 'lscpxx/updatePayload', payload: {
                    specList: []
                }
            })

            return;
        }

        if(lscpxx.specList.length == 0){
            dispatch({
                type: 'lscpxx/updatePayload', payload: {
                    specList: [{index:0,specId:0,name:'',price:0,vipPrice:0,boxNum:0,isDefault:0}]
                }
            })

        }
        dispatch({
            type: 'lscpxx/updatePayload', payload: {
                onSpecs: e.target.checked
            }
        })
    };

    // 做法操作
    const addMethod = (e) => {
        let selectMethod = lszfgl.idItem[getFieldValue("selectMethod")];
        if (selectMethod) {
            lscpxx.food.methods.push({
                    methodId: selectMethod.id,
                    name: selectMethod.name,
                    pricingType: selectMethod.pricingType,
                    pricingRate: selectMethod.pricingRate,
                    pricingMoney: selectMethod.pricingMoney,
                }
            );
            dispatch({
                type: 'lscpxx/updatePayload', payload: {
                    food: lscpxx.food
                }
            });
        }
    };
    const deleteMethod = (item, index) => {
        // array.splice(i, 1);
        lscpxx.food.methods.splice(index, 1);
        dispatch({
            type: 'lscpxx/updatePayload', payload: {
                food: lscpxx.food
            }
        });
    };
    const onMethods = (e) => {
        dispatch({
            type: 'lscpxx/updatePayload', payload: {
                onMethods: !e.target.value
            }
        })
    };

    //限制小数点后只能输入两位
      function onChangeValueFormatter(value){
          var regex = "^[0-9]*(\.[0-9]{0,2})?$";
          var patt = new RegExp(regex);
          let isPatt = patt.test(value);
          let valueNew = value;

          if(!isPatt&valueNew){

            valueNew = valueNew.substring(0,valueNew.length-1);
          }

          return valueNew;
      }


      var printCategoryName = '';
      if (lstcxx.printList) {
        lstcxx.printList.map((i) =>{
            if (lscpxx.food.printCategoryId == i.key ) {

                printCategoryName = i.value;

            }

        })
      }

      function onAdd(index){
        
        lscpxx.specList.push({index: lscpxx.specList.length});
        dispatch({
            type: 'lscpxx/updatePayload', payload: {
                specList: lscpxx.specList
            }
        })

      }

      function managerOperateHandle(record,index){

             let handlebtn = [];
             handlebtn.push(
                <span key={index} >
                    <a onClick={()=>onAdd(index)}>增加</a>
                    <span className="ant-divider"/>
                    
                        <a onClick = {()=>{

                            lscpxx.specList.splice(index,1);

                            lscpxx.specList.map((i,j)=>{

                                i.index = j;
                            });

                            dispatch({
                                type: 'lscpxx/updatePayload', payload: {
                                    specList: lscpxx.specList
                                }
                            })


                        }}>删除</a>
                 
                </span>);

            return handlebtn;

      }
      function onSelect(e,index){
        
        var name = '';
        lsgggl.all.map((j)=>{
         
            if (e == j.key) {
                name = j.value;

            }
        });

        var isRepeat = false;
        lscpxx.specList.map((i)=>{

            if (i.specId == e) {
                isRepeat = true;
              
            }
           
        })

        if (isRepeat) {

            message.warning('添加的'+ name +'规格重复');
            return;
        }

        lscpxx.specList[index].specId = e;
        lscpxx.specList[index].name = name ;
        lscpxx.specList[index].price = 0;
        lscpxx.specList[index].vipPrice = 0;
        lscpxx.specList[index].boxNum = 0;
        lscpxx.specList[index].isDefault = 0;

        dispatch({
            type: 'lscpxx/updatePayload', payload: {
                specList: lscpxx.specList
            }
        })


      }

      function managerSpecHandle(record,index){

             let handlebtn = [];
             
             

             handlebtn.push(
                <Select placeholder="请选择" defaultValue = {lscpxx.specList[index].name} style={{width: 80}} onChange = {(e)=>onSelect(e,index)}>
                    {lsgggl.all.map(item => <Option key={item.key}>{item.value}</Option>)}
                </Select>)

            return handlebtn;

      }

      function managerPriceHandle(record,index){

             let handlebtn = [];
             handlebtn.push(
                <InputNumber value = {(lscpxx.specList[index].price != null)?lscpxx.specList[index].price:0} min={0} max={Infinity} step={0.01} formatter={onChangeValueFormatter}  onChange = {(e)=>{
                    var list = lscpxx.specList;
                    list[index].price = e;

                    if (list[index].isDefault ==1) {
                        dispatch({
                            type: 'lscpxx/updatePayload', payload: {
                                price:  e,
                            }
                        })
                    }
                    dispatch({
                        type: 'lscpxx/updatePayload', payload: {
                            specList:  list
                        }
                    })
                }}>
                </InputNumber>);

            return handlebtn;

      }

      function managerVipPriceHandle(record,index){

             let handlebtn = [];
             handlebtn.push(
                <InputNumber value = {(lscpxx.specList[index].vipPrice != null)?lscpxx.specList[index].vipPrice:0} min={0} max={Infinity} step={0.01} formatter={onChangeValueFormatter} onChange = {(e)=>{
                    var list = lscpxx.specList;
                    list[index].vipPrice = e;

                     if (list[index].isDefault ==1) {
                        dispatch({
                            type: 'lscpxx/updatePayload', payload: {
                                vipPrice:  e,
                            }
                        })
                    }

                    dispatch({
                        type: 'lscpxx/updatePayload', payload: {
                            specList:  list
                        }
                    })
                }}>
                </InputNumber>);

            return handlebtn;

      }

    function managerDefaultHandle(record,index){
        
             let handlebtn = [];
             handlebtn.push(
                <Radio onChange = {
                    (e)=>{
                        
                         var list = lscpxx.specList;
                         // list[index].isDefault = e.target.checked ?'1':0;
                         list.map((i)=>{
                            if (e.target.checked == true) {
                                
                                
                                if (i.index == index) {
                                      i.isDefault =1;
                                        dispatch({
                                            type: 'lscpxx/updatePayload', payload: {
                                                price:  record.price,
                                                vipPrice:record.vipPrice,
                                            }
                                        })
                                }else{
                                      i.isDefault = 0;
                                }
                            
                            }
                          
                           
                         })
                         dispatch({
                            type: 'lscpxx/updatePayload', payload: {
                                specList:  list
                            }
                        })
                    }
                }  checked = {(lscpxx.specList[index].isDefault == 1)?true:false}>
                </Radio>);

            return handlebtn;

      }

      //限制小数点后只能输入两位
      function onChangeValueFormatter(value){
          var regex = "^[0-9]*(\.[0-9]{0,2})?$";
          var patt = new RegExp(regex);
          let isPatt = patt.test(value);
          let valueNew = value;

          if(!isPatt && valueNew){

            valueNew = valueNew.substring(0,valueNew.length-1);
          }

          return valueNew;
      }

      function managerBoxNumHandle(record,index){
             let handlebtn = [];
             handlebtn.push(
                <InputNumber value = {(lscpxx.specList[index].boxNum != null)?lscpxx.specList[index].boxNum:0} onChange = {(e)=>{
                    var list = lscpxx.specList;
                    list[index].boxNum = e;
                    dispatch({
                        type: 'lscpxx/updatePayload', payload: {
                            specList:  list
                        }
                    })
                }}>
                </InputNumber>);

            return handlebtn;

      }

      const columns = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width:80,
        },
        {
            title: '操作',
            dataIndex: 'operate',
            key: 'operate',
            render: (text, record, index) => (
                managerOperateHandle(record, index)
            ),
            width:120,
        }, {
            title: '规格',
            dataIndex: 'name',
            key: 'name',
            render: (text, record, index) => (
                managerSpecHandle(record, index)
            ),
            
        }, {
            title: '价格',
            dataIndex: 'price',
            key: 'price',
            render: (text, record, index) => (
                managerPriceHandle(record, index)
            ),
        }, {
            title: '会员价',
            dataIndex: 'vipPrice',
            key: 'vipPrice',
            render: (text, record, index) => (
                managerVipPriceHandle(record, index)
            ),
        }, 
        {
            title: '餐盒数',
            dataIndex: 'boxNum',
            key: 'boxNum',
            render: (text, record, index) => (
                managerBoxNumHandle(record, index)
            ),
        }, {
            title: '默认',
            key: 'operation',
            dataIndex: 'operation',
            render: (text, record, index) => (
                managerDefaultHandle(record, index)
            ),
             width:80,
        }
    ];

          
    return (
        <div style={{display: lscpxx.currentSteps == 1 ? "block" : "none"}}>
            <div className={styles.headerblock}>
                <Form id={"secondForm"}>
                    <FormItem
                        {...formItemLayout}
                        label="菜品单位"
                        
                        extra="选择所需菜品类别，不能不选！"
                    >
                        {getFieldDecorator('unitId', {
                            initialValue: lscpxx.food.unitId,
                            rules: [
                                {required: true, message: '请选择菜品单位'}
                            ]
                        })(
                            <Select placeholder="请选择">
                                {childrenCpdw}
                            </Select>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="称重菜"
                        
                        extra="称重菜的菜品单位要与电子秤设置的单位保持一致"
                    >
                        {getFieldDecorator('isWeigh', {
                            initialValue: "",
                            rules: [
                                {required: false, message: ''}
                            ]
                        })(
                            <Checkbox checked={lscpxx.food.isWeigh} onChange={(e) => {
                                dispatch({type: 'lscpxx/updateFood', payload: {food: {isWeigh: e.target.value ? 0 : 1}}});
                            }}>称重菜</Checkbox>
                        )}
                    </FormItem>

                    <FormItem style= {{display:'none'}}
                        {...formItemLayout}
                        label="必选菜"
                        
                        extra="选择人数后，会按人数自动添加必选菜品，数量与人数相同本功能适用于扫码点餐（含预订）"
                    >
                        {getFieldDecorator('isMust', {
                            initialValue: lscpxx.food.isMust,
                            rules: [
                                {required: false, message: ''}
                            ]
                        })(
                            <RadioGroup >
                                <Radio value={1}>是</Radio>
                                <Radio value={0}>否</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="起售数"
                        
                        extra="套餐如使用该菜品，则该起售数不生效"
                    >
                        {getFieldDecorator('baseCount', {
                            initialValue: lscpxx.food.baseCount,
                            rules: [
                                {required: false, message: '请选择菜品单位'}
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="多规格"
                        
                    
                    >
                        {getFieldDecorator('Spec', {
                            initialValue: "",
                            rules: [
                                {required: false, message: '请选择菜品单位'}
                            ]
                        })(
                            <Checkbox onChange={onSpecs} defaultChecked={lscpxx.specList && lscpxx.specList.length > 0}></Checkbox>
                        )}
                    </FormItem>
                    <div style={{display: (lscpxx.onSpecs ? "block" : "none")}} className={styles.divList}>

                    <FormItem
                        {...formItemLayout}
                        label="规格结果"
                        
                        
                    >
                        {getFieldDecorator('spec', {
                            initialValue: "",
                            rules: [
                                {required: false, message: '请选择菜品单位'}
                            ]
                        })(
                            <Table className={styles.table}
                               columns={columns}
                               dataSource={lscpxx.specList}
                               rowKey={record => record.index}
                               pagination={false}
                               bordered/>
                                )}
                    </FormItem>
                    
                </div>
                    <FormItem
                        {...formItemLayout}
                        label="做法"
                        
                        
                    >
                        {getFieldDecorator('Method', {
                            initialValue: "",
                            rules: [
                                {required: false, message: '请选择菜品单位'}
                            ]
                        })(
                            <Checkbox onChange={onMethods} defaultChecked={lscpxx.food.methods && lscpxx.food.methods.length > 0}></Checkbox>
                        )}
                    </FormItem>
                    <div style={{display: (lscpxx.onMethods ? "block" : "none")}} className={styles.divList}>
                        <FormItem
                            {...formItemLayout}
                            label="做法模板"
                        >
                            {getFieldDecorator("selectMethod", {
                                initialValue: '',
                                rules: [
                                    {required: false, message: ''}
                                ]
                            })(
                                <Select placeholder="请选择" style={{width: 150}}>
                                    {lszfgl.all.map(item => <Option key={item.id}>{item.name}</Option>)}
                                </Select>
                            )}
                            <Button type="primary" style={{margin: '0 auto'}} onClick={addMethod}>选择模板</Button>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="做法结果">
                            <Row gutter={8}>
                                <Col span={1}></Col>
                                <Col span={4}>做法</Col>
                                <Col span={6}>加价类型</Col>
                                <Col span={6}>比例/金额</Col>
                                <Col span={2}>操作</Col>
                            </Row>
                            {lscpxx.food.methods.map((item, index) => {
                                return (<Row gutter={8}>
                                    <Col span={1}>{index}</Col>
                                    <Col span={4}>
                                        {getFieldDecorator(`methods[${index}][methodId]`, {
                                            initialValue: item.methodId,
                                            rules: [
                                                {required: false, message: ''}
                                            ]
                                        })(
                                            <Input style={{display: "none"}}/>
                                        )}
                                        {getFieldDecorator(`methods[${index}][name]`, {
                                            initialValue: item.name,
                                            rules: [
                                                {required: false, message: ''}
                                            ]
                                        })(
                                            <Input disabled={true}/>
                                        )}
                                    </Col>
                                    <Col span={6}>
                                        {getFieldDecorator(`methods[${index}][pricingType]`, {
                                            initialValue: item.pricingType,
                                            rules: [
                                                {required: false, message: ''}
                                            ]
                                        })(
                                            <Input style={{display: "none"}}/>
                                        )}
                                        {getFieldDecorator(`methods[${index}][pricingName]`, {
                                            initialValue: {"0": "不加价", "1": "比例加价", "2": "固定加价"}[item.pricingType],
                                            rules: [
                                                {required: false, message: ''}
                                            ]
                                        })(
                                            <Input disabled={true}/>
                                        )}
                                    </Col>
                                    <Col span={6}>
                                        {getFieldDecorator(`methods[${index}][pricingRate]`, {
                                            initialValue: item.pricingRate,
                                            rules: [
                                                {required: false, message: ''}
                                            ]
                                        })(
                                            <Input style={{display: item.pricingType == "1" ? "block" : "none"}}/>
                                        )}
                                        {getFieldDecorator(`methods[${index}][pricingMoney]`, {
                                            initialValue: item.pricingMoney/100,
                                            rules: [
                                                {required: false, message: ''}
                                            ]
                                        })(
                                            <Input style={{display: item.pricingType == "2" ? "block" : "none"}}/>
                                        )}
                                    </Col>
                                    <Col span={2}>
                                        <a onClick={() => {
                                            deleteMethod(item, index)
                                        }}>删除</a>
                                    </Col>
                                </Row>)
                            })}
                        </FormItem>
                    </div>

                    <FormItem
                        {...formItemLayout}
                        label="*价格"
                        
                        extra="此项为必填项，请填写物品单价，如：1.5，2..."
                    >
                         <InputNumber className={styles.inputnumber} min={0} max={Infinity} step={0.01} formatter={onChangeValueFormatter}  value = {lscpxx.price} onChange= {(e)=>{
                                
                                dispatch({
                                    type: 'lscpxx/updatePayload', payload: {
                                        price: e,
                                    }
                                })

                          
                            }}/>

                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="时令菜"
                        
                        extra=""
                    >
                        {getFieldDecorator('isCurrentPrice', {
                            initialValue: "",
                            rules: [
                                {required: false, message: ''}
                            ]
                        })(
                            <div>
                                <Checkbox defaultChecked={lscpxx.food.isCurrentPrice}>时令菜</Checkbox>
                            </div>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="*会员价"
                        
                        extra="此项为必填项，请填写会员价，如：1.5，2..."
                    >
                        <InputNumber className={styles.inputnumber} min={0} max={Infinity} step={0.01} formatter={onChangeValueFormatter}  value = {lscpxx.vipPrice} onChange= {(e)=>{
                                
                                dispatch({
                                    type: 'lscpxx/updatePayload', payload: {
                                        vipPrice: e,
                                    }
                                })

                          
                            }}/>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="菜品出品部门"
                        
                        extra="套餐如使用该菜品，则该起售数不生效"
                    >
                        {getFieldDecorator('printCategoryId', {
                            initialValue: lscpxx.food.printCategoryId,
                            rules: [
                                {required: true, message: '菜品出品部门'}
                            ]
                        })(
                            <Select placeholder="请选择">
                                {children}
                            </Select>
                        )}
                    </FormItem>

                    <FormItem style= {{display:'none'}}
                        {...formItemLayout}
                        label="菜品提成"
                        
                        extra="此项为必选项，不选默认为停用！"
                    >
                        {getFieldDecorator('percent', {
                            initialValue: lscpxx.food.percent,
                            rules: [
                                {required: false, message: ''}
                            ]
                        })(
                            <RadioGroup>
                                <Radio value={1}>是</Radio>
                                <Radio value={2}>否</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>

                    <FormItem style = {{display:'none'}}
                        {...formItemLayout}
                        label="预估成本"
                        
                        extra="系统已优先根据本菜成本卡的配置匹配成本，若需要修改，请前往 库存管理-成本卡管理"
                    >
                        {getFieldDecorator('estimateCost', {
                            initialValue: lscpxx.food.estimateCost,
                            rules: [
                                {required: false, message: '预估成本'}
                            ]
                        })(
                            <Input/>
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
                    下一步
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
