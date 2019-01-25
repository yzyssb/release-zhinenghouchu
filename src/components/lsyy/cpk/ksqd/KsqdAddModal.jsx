import React, { PropTypes } from 'react';

import Modal from 'antd/lib/modal';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import DatePicker from 'antd/lib/date-picker';
import styles from './KsqdAddModal.less';
import Tree from 'antd/lib/tree';

const TreeNode = Tree.TreeNode;

const FormItem = Form.Item;

const RangePicker = DatePicker.RangePicker;
import moment from 'moment';
import Radio from 'antd/lib/radio';
const RadioGroup = Radio.Group;



class PowerTree extends React.Component {
    state = {
        expandedKeys: [],
        autoExpandParent: true,
        checkedKeys: this.props.checkedKeys.map((item) => item + ""),
        selectedKeys: [],
    };
    onExpand = (expandedKeys) => {
        console.log('onExpand', arguments);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };
    onCheck = (checkedKeys) => {
        console.log('onCheck', checkedKeys);
        this.setState({checkedKeys});
        this.props.onChange(checkedKeys);
        // this.props.onChange([...checkedKeys, ...this.expandedKeys]);
    };
    onSelect = (selectedKeys, info) => {
        console.log('onSelect', info);
        this.setState({selectedKeys});
    };
    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode title={item.title} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} />;
        });
    };

    render() {
        return (
            <Tree
                checkable
                onExpand={this.onExpand}
                expandedKeys={this.state.expandedKeys}
                autoExpandParent={this.state.autoExpandParent}
                onCheck={this.onCheck}
                checkedKeys={this.props.checkedKeys}
                onSelect={this.onSelect}
                selectedKeys={this.state.selectedKeys}
            >
                {this.renderTreeNodes(this.props.powers)}
            </Tree>
        );
    }
}

class FoodTree extends React.Component {
    state = {
        expandedKeys: [],
        autoExpandParent: true,
        checkedKeys: this.props.checkedKeys.map((item) => item + ""),
        selectedKeys: [],
    };
    onExpand = (expandedKeys) => {
        console.log('onExpand', arguments);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };
    onCheck = (checkedKeys) => {
        console.log('onCheck', checkedKeys);
        this.setState({checkedKeys});
        this.props.onChange(checkedKeys);
        // this.props.onChange([...checkedKeys, ...this.expandedKeys]);
    };
    onSelect = (selectedKeys, info) => {
        console.log('onSelect', info);
        this.setState({selectedKeys});
    };
    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.singles) {
                return (
                    <TreeNode title={item.title} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.singles)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} />;
        });
    };

    render() {
        return (
            <Tree
                checkable
                onExpand={this.onExpand}
                expandedKeys={this.state.expandedKeys}
                autoExpandParent={this.state.autoExpandParent}
                onCheck={this.onCheck}
                checkedKeys={this.props.checkedKeys}
                onSelect={this.onSelect}
                selectedKeys={this.state.selectedKeys}
            >
                {this.renderTreeNodes(this.props.powers)}
            </Tree>
        );
    }
}


const KsqdAddModal = ({

  visible,
  onOk,
  onCancel,
  currentItem,
  dispatch,
  lsksqd,ctglBaseSetting,
}) => {
  

 

  const Option = Select.Option;
  
  
 function handleOk(){

     dispatch({
            type: 'lsksqd/updatePayload',
            payload:{
              modalVisible:false,
            }
          });

     dispatch({
            type: 'lsksqd/queryAdd',
            payload:{
            
            }
          });


 }

  function handleWeekChange(e){


    dispatch({
            type: 'lsksqd/updatePayload',
            payload:{
             week:e
            }
          });
  }

 function handleTimeChange(e){


      var time  = childrenTime[e];

      console.log(time)
      
      dispatch({
            type: 'lsksqd/updatePayload',
            payload:{
             startHour:time.start.split(':')[0],
             startMin:time.start.split(':')[1],
             endHour:time.end.split(':')[0],
             endMin:time.end.split(':')[1],
            }
          });
    
  }

  function onInputChange(e){

    dispatch({
            type: 'lsksqd/updatePayload',
            payload:{
             timeName:e.target.value,
            }
          });

  }
  
  const modalOpts = {
    title:lsksqd.isAdd?"新增可售清单":"编辑可售清单",
    visible,
    onOk:handleOk,
    onCancel,
    currentItem,
    width:'60%',
    okText:"确定",
    cancelText:"取消"
  };


  var hours = ctglBaseSetting.baseInfo.businessHours;

  var children = [];
  var childrenTime = [];
  if (hours) {
    hours.map((i,j)=>{
     children.push (  
               <Option key={j}>{i.startHour + '-' + i.endHour}</Option>
           )
     var object = {};
     object.start = i.startHour;
     object.end = i.endHour;
     childrenTime.push(object)
  })
  }

       const convert = (data) => {
            data.map((item) => {
                if (item.singles) {
                    convert(item.singles);
                }
                item.id = item.key;
                item.name = item.title;
            })
        };

     var timeValue = '';
     if ( lsksqd.startHour && lsksqd.endHour && lsksqd.startMin && lsksqd.endMin) {

      timeValue = lsksqd.startHour + ':' +lsksqd.startMin +"-"+ lsksqd.endHour + ":" + lsksqd.endMin;
      
     } else{

      timeValue = '';
     }

     var weekValue = getWeekValue(lsksqd.week);

     function getWeekValue(text){
      var str = '';
      if (text == 1) {
        str = '周日'

      }else if (text == 2) {
        str = '周一'

      }else if (text == 3) {
        str = '周二'

      }else if (text == 4) {
        str = '周三'

      }else if (text == 5) {
        str = '周四'

      }else if (text == 6) {
        str = '周五'

      }else if (text == 7) {
        str = '周六'

      }

      return str;

     }

     let _checkedFoodKeys = lsksqd._checkedFoodKeys;
     let _checkedFoodComboKeys =lsksqd._checkedFoodComboKeys;
     
     // _checkedFoodKeys.map((i,j)=>{
     //    if (i.indexOf('1-')!=-1) {
     //      _checkedFoodKeys.splice(j,1);
     //    }
     //
     // })
     
  return (
    <Modal style={{height:"600px",overflowY:"auto",paddingBottom:"0"}} {...modalOpts} >


        <div className={styles.pay}>   
            <div className={styles.tabList}>
                <p className={styles.tabLeftName}>时段名称</p>
                <Input className={styles.tabRight} onChange = {onInputChange} value = {lsksqd.timeName}/>
            </div>
            <div className={styles.tabList}>
                <p className={styles.tabLeftName}>星期</p>
                <Select className={styles.tabRight}  onChange={handleWeekChange} value = {weekValue}>
                    <Option value="2">周一</Option>
                    <Option value="3">周二</Option>
                    <Option value="4">周三</Option>
                    <Option value="5">周四</Option>
                    <Option value="6">周五</Option>
                    <Option value="7">周六</Option>
                    <Option value="1">周日</Option>
                </Select>
            </div>
            <div className={styles.tabList}>
                <p className={styles.tabLeftName}>时段</p>
                <Select className={styles.tabRight} onChange={handleTimeChange} value = {timeValue}>
                {children}
                </Select>
            </div>
            <div style={{width: "100%",overflow: "hidden",marginTop:"24px"}}>
                <div style={{width:'40%',float:'left',marginLeft:"20%"}}>
                    <p style={{paddingLeft:"24px"}}>菜品树</p>
                    <FoodTree powers={lsksqd.foodDetail} checkedKeys={_checkedFoodKeys} onChange={(checkedKeys) => {
                    _checkedFoodKeys = checkedKeys
                      dispatch({
                        type: 'lsksqd/updatePayload',
                        payload:{
                          _checkedFoodKeys:_checkedFoodKeys,
                        }
                      });

                      var parentTree = [];

                       lsksqd.foodDetail.map((i)=>{

                        var child = [];


                        if (i.singles) {

                          i.singles.map((j)=>{
                           
                            if (_checkedFoodKeys.indexOf(j.categoryId+'-'+j.id) != -1) {

                              var object = {};
                              object.id = j.id;
                              object.name = j.name;
                              child.push(object);
                            }

                        })

                          if(child.length >0){

                            var item = {};

                            item.details = child;
                            item.name = i.name;
                            item.id = i.id;

                            parentTree.push(item)
                          }

                        }

                        
                    
                    })
                       dispatch({'type':'lsksqd/updatePayload',payload:{selectFoodDetail:parentTree}})
                       

                    }}/>
                </div>
                <div style={{width:'40%',float:'left'}}>
                    <p style={{paddingLeft:"24px"}}>套餐树</p>
                    <PowerTree powers={lsksqd.comboDetail} checkedKeys={_checkedFoodComboKeys} onChange={(checkedKeys) => {
                    _checkedFoodComboKeys = checkedKeys

                      dispatch({
                        type: 'lsksqd/updatePayload',
                        payload:{
                          _checkedFoodComboKeys:_checkedFoodComboKeys,
                        }
                      });


                    var parentTree1 = [];

                   

                      lsksqd.comboDetail.map((j)=>{

                        if (_checkedFoodComboKeys.indexOf(''+j.id) != -1) {

                              parentTree1.push(j);

                        }
                      })
                      

                     dispatch({'type':'lsksqd/updatePayload',payload:{selectComboDetail:parentTree1}})
                   
                    }}/>
                </div>
            </div>
        </div>

    </Modal>
  );
};

KsqdAddModal.propTypes = {
  visible: PropTypes.any,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Form.create()(KsqdAddModal);
