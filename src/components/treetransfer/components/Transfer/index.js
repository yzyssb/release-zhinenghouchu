import React, {
	Component
} from 'react';
import
	Button
from 'antd/lib/button';
import {
	connect
} from 'react-redux';
import PropTypes from 'prop-types';
import Tree from '../../components/Tree';
import {
	MakeTreeData,
	TransTreeData,
	MergeArrayData
} from '../../util/MakeTreeData';
import {
	setLeftTreeArray,
	setRightTreeArray,
	setLeftTreeData,
	setRightTreeData,
	setLeftSelectedKey,
	setRightSelectedKey
} from '../../store/action';
//import '../../Style/transfer.less';
class Transfer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			btnType: ''
		};
	}
	/**
	 * 穿梭按钮操作
	 *@param {String} key 
	 */
	handleBtnClick = (key) => {
		let {
			allTreeArray,
			leftTreeArray,
			rightTreeArray,
			leftSelectedKey,
			rightSelectedKey,
			setRightTreeData,
			setLeftTreeData,
			setRightTreeArray,
			setLeftTreeArray
		} = this.props;
		let nodes;
		switch (key) {
			case 'allToRight':
				this.setState({
					btnType: 'allToRight'
				});
				setRightTreeData(MakeTreeData(allTreeArray));
				setLeftTreeData([]);
				setRightTreeArray(allTreeArray);
				setLeftTreeArray([]);
                setRightSelectedKey(allTreeArray);
                this.props.setRightSelectedKey([]);
                var defaultSelectKey = [];
                allTreeArray.map(function (item) {
                    defaultSelectKey.push(item.key)
                })
                localStorage.setItem("selectedRightKeys",defaultSelectKey);
                this.props.setRightSelectedKey(defaultSelectKey);
				break;
			case 'toRight':
				if(leftSelectedKey.length === 0){
					return;
				}
                // console.log(leftSelectedKey[i])
                let toRightArray = TransTreeData(leftSelectedKey, leftTreeArray);
                nodes = MergeArrayData(toRightArray.transferArray, rightTreeArray);
                setRightTreeArray(nodes);
                setRightTreeData(MakeTreeData(nodes));
                setLeftTreeArray(toRightArray.newArray);
                setLeftTreeData(MakeTreeData(toRightArray.newArray));
                var defaultSelectKey = [];
                nodes.map(function (item) {
                    defaultSelectKey.push(item.key)
                })
                localStorage.setItem("selectedRightKeys",defaultSelectKey);
                this.props.setRightSelectedKey(defaultSelectKey);
                this.props.setLeftSelectedKey([]);
				break;
			case 'tolLeft':
				if(rightSelectedKey.length === 0){
					return;
				}
                this.setState({
                    btnType: 'tolLeft'
                });
                let toLeftArray = TransTreeData(rightSelectedKey, rightTreeArray);
                nodes = MergeArrayData(toLeftArray.transferArray, leftTreeArray);
                setLeftTreeArray(nodes);
                setLeftTreeData(MakeTreeData(nodes));
                setRightTreeArray(toLeftArray.newArray);
                var defaultSelectKey = [];
                toLeftArray.newArray.map(function (item) {
                    defaultSelectKey.push(item.key)
                })
                localStorage.setItem("selectedRightKeys",defaultSelectKey);
                setRightTreeData(MakeTreeData(toLeftArray.newArray));
                this.props.setRightSelectedKey([]);
				break;
			case 'allToLeft':
				this.setState({
					btnType: 'allToLeft'
				});
				setRightTreeData([]);
				setLeftTreeData(MakeTreeData(allTreeArray));
				setRightTreeArray([]);
				setLeftTreeArray(allTreeArray);
                localStorage.setItem("selectedRightKeys","");
                this.props.setRightSelectedKey([]);
				break;
			default:
				break;
		}
	};
	/**
	 * 创建操作按钮渲染
	 * @param {Array} btns
	 */
	createBtns = (btns) => {
		let btnDom = [];
		return btns.map((item, index) => {
			let {
				name,
				className,
				key
			} = item;
			return ( <Button key = {key} className = {`transfer-btn ${className}`} onClick = {this.handleBtnClick.bind(this, key)} > 
						{name}
					</Button>
			);
		});
	};
	/**
	 * 树选择方法、
	 * @param {String} key // left - 左树 right - 右树
	 */
	treeSelectFun = (key) => {
		switch (key) {
			case 'left':
				return (selectedKeys, e) => {
					console.log(selectedKeys);
					this.props.setLeftSelectedKey(selectedKeys);
					// transTreeData(selectedKeys);
				};
				break;
			case 'right':
				return (selectedKeys, e) => {
					console.log(selectedKeys);
					this.props.setRightSelectedKey(selectedKeys);
                    localStorage.setItem("selectedRightKeys",selectedKeys);
					// transTreeData(selectedKeys);
				};
				break;
			default:
				break;
		}
	};

	render() {
		let {btns} = this.state;
		let {leftTitle,rightTitle,leftSelectedKey,rightSelectedKey,leftTreeData,rightTreeData,leftTreeArray,rightTreeArray,treeWidth,treeHeight,showSearch,transferBtns} = this.props;
		return (
			<div className = "tree-transfer" style={{"height":treeHeight}}>
				<div className = "tree-transfer-container" style={{"width":treeWidth}} >
					{leftTitle.length>0?<div className='tree-title'>{leftTitle}</div>:null}
					<Tree
					checkable
					style ={{"height":`${leftTitle.length>0?'calc(100% - 34px)':'100%'}`,"paddingTop":`${showSearch?'45px':'0px'}`}}
					data = {leftTreeData} 
					dataList = {leftTreeArray}
					// onSelect = {this.treeSelectFun('left')}
                    onCheck = {this.treeSelectFun('left')}
                    checkedKeys = {leftSelectedKey}
					/> 
				</div> 
				<div className = "tree-transfer-middle" >
					{this.createBtns(transferBtns)} 
				</div> 
				<div className = "tree-transfer-container" style={{"width":treeWidth}}>
					{rightTitle.length>0?<div className='tree-title'>{rightTitle}</div>:null}
					<Tree
					checkable
					style ={{"height":`${rightTitle.length>0?'calc(100% - 34px)':'100%'}`,"paddingTop":`${showSearch?'45px':'0px'}`}}
					data = {rightTreeData} 
					dataList = {rightTreeArray} 
					// onSelect = {this.treeSelectFun('right')}
                    onCheck = {this.treeSelectFun('right')}
                    checkedKeys = {rightSelectedKey}
                    defaultSelectedKeys={rightSelectedKey}
					/> 
				</div>
			</div>
		);
	}
}
Transfer.propTypes = {
	allTreeArray: PropTypes.array.isRequired,
	leftTreeArray: PropTypes.array.isRequired,
	rightTreeArray: PropTypes.array.isRequired,
	setLeftTreeArray: PropTypes.func.isRequired,
	setRightTreeArray: PropTypes.func.isRequired,
	leftTreeData: PropTypes.array.isRequired,
	rightTreeData: PropTypes.array.isRequired,
	setLeftTreeData: PropTypes.func.isRequired,
	setRightTreeData: PropTypes.func.isRequired,
	setLeftSelectedKey: PropTypes.func.isRequired,
	setRightSelectedKey: PropTypes.func.isRequired,
	leftSelectedKey: PropTypes.array.isRequired,
	rightSelectedKey: PropTypes.array.isRequired,
	leftTitle:PropTypes.string.isRequired,
	rightTitle:PropTypes.string.isRequired,
	treeWidth:PropTypes.number.isRequired,
	treeHeight:PropTypes.number.isRequired,
	showSearch:PropTypes.bool.isRequired,
	transferBtns:PropTypes.array.isRequired,
};
export default connect(
	(state) => ({
		allTreeArray: state.TreeTransferData.allTreeArray,
		leftTreeArray: state.TreeTransferData.leftTreeArray,
		rightTreeArray: state.TreeTransferData.rightTreeArray,
		leftTreeData: state.TreeTransferData.leftTreeData,
		rightTreeData: state.TreeTransferData.rightTreeData,
		leftSelectedKey: state.TreeTransferData.leftSelectedKey,
		rightSelectedKey: state.TreeTransferData.rightSelectedKey,
		leftTitle:state.TreeTransferData.leftTitle,
		rightTitle:state.TreeTransferData.rightTitle,
		treeWidth:state.TreeTransferData.treeWidth,
		treeHeight:state.TreeTransferData.treeHeight,
		showSearch: state.TreeTransferData.showSearch,
		transferBtns: state.TreeTransferData.transferBtns,
	}), {
		setLeftTreeArray,
		setRightTreeArray,
		setLeftTreeData,
		setRightTreeData,
		setLeftSelectedKey,
		setRightSelectedKey
	}
)(Transfer);