import React, { PropTypes } from 'react';
import Form from 'antd/lib/form';
import Select from 'antd/lib/select';
import Button from 'antd/lib/button';
import Spin from 'antd/lib/spin';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import DatePicker from 'antd/lib/date-picker';
import styles from './KsqdPage.less';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
import moment from 'moment';
import Table from 'antd/lib/table';
import Popconfirm from 'antd/lib/popconfirm';

import Checkbox from 'antd/lib/checkbox';
import Radio from 'antd/lib/radio';
import message from 'antd/lib/message';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Modal from 'antd/lib/modal';
const CheckboxGroup = Checkbox.Group;
import SydcppxPage from '../../../../routes/ctgl/sydcppx/SydcppxPage';
import WxctcppxPage from '../../../smdc/wxctcppx/WxctcppxPage';

const KsqdPage=({
	dispatch,
	lsksqd,
	deskQrCode,
	ctglBaseSetting,
}) => {
	function handleModeChange(e){
		dispatch({
			type:'lsksqd/updatePayload',
			payload:{
				radioValue:e.target.value,
				type:e.target.value,
			}
		})
	}

	
	function fenpeiAction(){

        dispatch({
            type:'lsksqd/querySelectAllRestaurant',
            payload:{
                visible_yzy:true
            }
        })

		dispatch({
			type:'lsksqd/updatePayload',
			payload:{
				visible_yzy:true
			}
		})
	}
	
	function handleCancel(){
		dispatch({
			type:'lsksqd/updatePayload',
			payload:{
				visible_yzy:false,
			}
		})

	}

	function handleOk(){
		dispatch({
			type:'lsksqd/updatePayload',
			payload:{
				visible_yzy:false
			}
		})
		dispatch({
			type:'lsksqd/allot2restaurant_yzy',
			payload:{}
		})
	}

    const columns = [
      {
            title: '关联菜品',
            key: 'foodList',
            dataIndex: 'foodList',
            render: (text, record, index) => {


            	let newRestaurantList = lsksqd.restaurantList;

            	let indeterminate = false;

            	let checkAll = false;

            	let checkArr = [];
            	record.infoList && record.infoList.map((i)=>{

            		if (i.checked == true){
                        checkArr.push(i);
					}

				})
                
                if (checkArr.length != 0 && checkArr.length<record.infoList.length){

                    indeterminate = true;

                } else if (checkArr.length != 0 && checkArr.length == record.infoList.length){

                    checkAll = true;

                }

                return <Checkbox indeterminate={indeterminate} checked={checkAll} onChange = {(e)=>{

                	if (e.target.checked) {

                        newRestaurantList.map((i)=>{

                            if(i.id == record.id){

                            	if (i.infoList){

                                    i.infoList.map((j)=>{

                                    	j.checked = true;

                                    })

								}
								i.checkAll = true;
							}

						})

					}else{
                        newRestaurantList.map((i)=>{

                            if(i.id == record.id){

                                if (i.infoList){

                                    i.infoList.map((j)=>{

                                        j.checked = false;

                                    })

                                }

                                i.checkAll = false;
                            }

                        })
					}


                    dispatch({
                        type:'lsksqd/updatePayload',
                        payload:{
                            restaurantList:newRestaurantList,

                        }
                    })

				}}>{record.name}</Checkbox>

            }
        }, {
            title: '操作',
            key: 'operation',
            dataIndex: 'operation',
            render: (text, record, index) => {

            	let htmlBtn = [];

            	if (record.infoList) {

                    record.infoList.map((i)=>{

                        htmlBtn.push(

                            <Checkbox value = {i.id} checked = {i.checked} onChange = {(e)=>{

                            	
                                let newRestaurantList = lsksqd.restaurantList;
                            	if (e.target.checked) {

                                    newRestaurantList.map((i)=>{

                                        if(i.id == record.id){

                                            if (i.infoList){

                                                i.infoList.map((j)=>{

                                                	if (j.id == e.target.value) {
                                                        j.checked = true;
													}


                                                })

                                            }

                                        }

                                    })




                                }else{
                                    newRestaurantList.map((i)=>{

                                        if(i.id == record.id){

                                            if (i.infoList){

                                                i.infoList.map((j)=>{

                                                    if (j.id == e.target.value) {
                                                        j.checked = false;
                                                    }

                                                })

                                            }


                                        }

                                    })
                                }

                                dispatch({
                                    type:'lsksqd/updatePayload',
                                    payload:{
                                        restaurantList:newRestaurantList,

                                    }
                                })




							}}>
                                {i.name +'(' + i.startHour + '-' + i.endHour  +  ')'}
                            </Checkbox>

                        )
                    })

				}


            	return htmlBtn;
            }
        }
    ];

    function addZero(number){

        return number <10 ? '0' + number : number;

    }

	return (
		<div>
			<p style={{paddingLeft:10,color:'#999'}}>该排序仅为品牌菜品库排序，不直接影响店铺排序。需要使用“分配店铺”功能，将排序分配给对应店铺。</p>
			<Radio.Group onChange={handleModeChange} value={String(lsksqd.radioValue)} style={{ marginBottom: 8 }}>
			  <Radio.Button value="1">收银端排序</Radio.Button>
			  <Radio.Button value="2">微信点餐排序</Radio.Button>
			</Radio.Group>
			<div style={{textAlign:'right',marginBottom:10}}>
				<Button type="primary" onClick={fenpeiAction}>{lsksqd.type == '1'?'收银端排序分配到门店':'微信端排序分配到门店'}</Button>
			</div>
			{lsksqd.radioValue==1?(
				<SydcppxPage />
			):(
				<WxctcppxPage />
			)}

			<Modal
			  title="分配门店"
			  width="60%"
			  visible={lsksqd.visible_yzy}
			  onCancel={handleCancel}
			  footer={null}
              destroyOnClose = {true}
			>
				<p style={{background:'#eee',padding:10,border:'1px solid #ddd'}}>
					<span>选择店铺</span>
					<Checkbox style={{float:'right'}} onChange={(e)=>{
                        let newRestaurantList = lsksqd.restaurantList;

                        if (e.target.checked){

                            newRestaurantList.map((i=>{

                                i.checkAll = true;
                                i.infoList && i.infoList.map((j)=>{

                                    j.checked = true;
                                })
                            }))
                        }else{
                            newRestaurantList.map((i=>{

                                i.checkAll = false;
                                i.infoList && i.infoList.map((j)=>{

                                    j.checked = false;
                                })
                            }))
                        }

                        dispatch({
                            type:'lsksqd/updatePayload',
                            payload:{
                                restaurantList:newRestaurantList
                            }
                        })

					}}>全选</Checkbox>
				</p>

                <Table
					showHeader = {false}
                       columns={columns}
                       dataSource={lsksqd.restaurantList}
                       rowKey={record => record.id}
                       pagination={false}
                       bordered />

                <div style={{textAlign:'center',marginTop:20}}>
                    <Button onClick={handleCancel}>取消</Button>
                    <Button style={{marginLeft:30}} type="primary" onClick={handleOk}>确定分配</Button>
                </div>

			</Modal>
		</div>
	);
};

   
KsqdPage.propTypes = {
	visible: PropTypes.any,
	form: PropTypes.object,
	item: PropTypes.object,
};

export default Form.create()(KsqdPage);