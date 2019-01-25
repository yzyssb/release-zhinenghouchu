import Select from 'antd/lib/select';
import React, { PropTypes } from 'react';
import styles from './AddressSelect.less';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Row from 'antd/lib/row';
import Button from 'antd/lib/button';
import Col from 'antd/lib/col';
import Checkbox from 'antd/lib/checkbox';
const CheckboxGroup = Checkbox.Group;
import Modal from 'antd/lib/modal';

const addressselect = ({addressselect,dispatch,onOk,onCancel,noShowChooseModel,multiline,limitClick,pleaseHolder}) => {
	const formItemLayout = {
		labelCol: { span: 4 },
		wrapperCol: { span: 19 },
	};

	const {allData,modalVisible,leftIndex,resultData}=addressselect;

	// 点击省份
	function onLeftClick(index) {
		dispatch({
			type: 'addressselect/onlyArea',
			payload: {
				index: index
			}
		});

	}

	// 勾选省份
	function onLeftCheck(e) {

		dispatch({
			type: 'addressselect/goChecked',
			payload: e.target,

		});

	}

	// 勾选城市
	function onRightCheck(e) {

		dispatch({
			type: 'addressselect/childChecked',
			payload: e.target,

		});

	}

	const children =[];
	const children2 = [];
	var allChooseModel = [];
	
	if(allData) {

		// 左侧
		allData.map((j, k) => {

			var checked = true;
			var indeterminate = false;

			j.areadata.map((a, b) => {

				if (a.checked == false) {

					checked = false;
				
				}

				if (a.checked == true) {
					indeterminate = true;
				};
			})

			if(checked){
				indeterminate=false;
			}

			children.push(
			 	< li key = {k} > 
					< span className={k==leftIndex?styles.namespanselect:styles.namespan} onClick = {() => {onLeftClick(k)}} >{j.areaname} < /span>
					<Checkbox value={{index:k}} onChange={onLeftCheck} indeterminate={indeterminate} checked={checked} style={{marginLeft:'2px'}} / > 
				< /li>);
		})

		// 右侧			
		if( allData.length >leftIndex){

			if(allData[leftIndex].areadata){
				allData[leftIndex].areadata.map((j, k) => {
					if (j) {
						children2.push( 
							< li key = {j.areaid} > 
								< span className={styles.namespan} > {j.areaname} < /span>
								<Checkbox style={{marginLeft:'2px'}} checked={j.checked} value={{index:k}}  onChange = {onRightCheck}/ > 
							< /li>);
					}
				})
			}

		}

	//内层已选城市
	allData.map((a,b)=>{

		var chooseModel= [];

		var allChecked = true;
		a.areadata.map((c,d)=>{


			if (c.checked) {							
				chooseModel.push(c.areaname + ' ' );
			}else{

				allChecked = false;
			}



		})

		if (allChecked == true) {
			chooseModel = [];

			chooseModel.push(a.areaname + ' ');
		};

		chooseModel.map((e)=>{
			allChooseModel.push(e);
		})

	})
 }

 //	外层已选城市
 var allSaveChooseModel = [];
 
 if(resultData&&resultData.length>0){
 	resultData.map((a,b)=>{

		var chooseModel= [];

		if(!a.areadata || a.areadata.length==0){
			chooseModel.push(a.areaname + ' ');
		}else {
			a.areadata.map((c,d)=>{							
				chooseModel.push(c.areaname + ' ' );
			})
		}
		
		chooseModel.map((e)=>{
			allSaveChooseModel.push(e);
		})
	})
 }else{
 	if(pleaseHolder){
		allSaveChooseModel.push(pleaseHolder);
	}
 }

function handleOk(e){
    dispatch({
		type: 'addressselect/confirmModal',

	});

    if(onOk){
    	setTimeout(onOk,100);
    }
    
  }
 function handleCancel (e) {
    dispatch({
		type: 'addressselect/cancelModal',

	});

    if(onCancel){
    	setTimeout(onCancel,100);
    }

   
  }

  function showModal () {
  	if(limitClick=='yes'){
  		return;
  	}
    dispatch({
		type: 'addressselect/showModal',
	});
   
  }

	return (
		<div>
			<div onClick={showModal}>
				<div className=
					{
					 noShowChooseModel 
					 ? styles.noShow          
					 : multiline ? styles.showmultiline : styles.show
					 } >
				 	{allSaveChooseModel} 
				 </div>
			</div>
			<Modal title="选择地区" visible={modalVisible}
	          onOk={handleOk} onCancel={handleCancel} >
	          	<div >
					<Form.Item 
					  {...formItemLayout}
					  label="已选地区"
					  
					>
						<div className={styles.show} >{allChooseModel}</div>
					</Form.Item>

					< div className = {styles.clearfix}>
						< div className = {styles.fl + ' ' + styles.leftcont} >
							< ul > {children} < /ul> 
						< /div > 
						< div className = {styles.fl} > 
							{children2} 
						< /div> 
					< /div >
				</div>
	        </Modal>
        </div>
		
	);
}
export default addressselect;

