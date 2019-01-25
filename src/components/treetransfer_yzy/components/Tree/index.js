import React, { Component } from 'react';

import Input from 'antd/lib/input';
import Tree from 'antd/lib/tree';

import { connect } from 'react-redux';
// import {  } from 'Store/action';
import PropTypes from 'prop-types';
const TreeNode = Tree.TreeNode;
const Search = Input.Search;

const dataList = [];
const getParentKey = (key, tree) => {
	let parentKey;
	for (let i = 0; i < tree.length; i++) {
		const node = tree[i];
		if (node.children) {
			if (node.children.some((item) => item.key === key)) {
				parentKey = node.key;
			} else if (getParentKey(key, node.children)) {
				parentKey = getParentKey(key, node.children);
			}
		}
	}
	return parentKey;
};

class SearchTree extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			expandedKeys: [],
			searchValue: '',
			autoExpandParent: true
		};
	}
	onExpand = (expandedKeys) => {
		this.setState({
			expandedKeys,
			autoExpandParent: false
		});
	};
	onChange = (e) => {
		const value = e.target.value;
		let expandedKeys;
		if (value === '') {
			expandedKeys = [];
		} else {
			expandedKeys = this.props.dataList
				.map((item) => {
					const titleText = `${item.key} ${item.title}`;
					if (titleText.indexOf(value) > -1) {
						return getParentKey(item.key, this.props.data);
					}
					return null;
				})
				.filter((item, i, self) => item && self.indexOf(item) === i);
		}
		this.setState({
			expandedKeys,
			searchValue: value,
			autoExpandParent: true
		});
	};
	render() {
		const { searchValue, expandedKeys, autoExpandParent } = this.state;
		let { onSelect,showSearch,placeholder,selectedKeys,onCheck,checkedKeys } = this.props;
		const loop = (data) =>
			data.map((item) => {
				const titleText = `${item.title}`;
				const index = titleText.indexOf(searchValue);
				const beforeStr = titleText.substr(0, index);
				const afterStr = titleText.substr(index + searchValue.length);
				const title =
					index > -1 ? (
						<span>
							{beforeStr}
							<span style={{ color: '#f50' }}>{searchValue}</span>
							{afterStr}
						</span>
					) : (
						<span>{titleText}</span>
					);
				if (item.children) {
					return (
						<TreeNode key={item.key} title={title} disableCheckbox={item.disableCheckbox}>
							{loop(item.children)}
						</TreeNode>
					);
				}
				return <TreeNode key={item.key} title={title} disableCheckbox={item.disableCheckbox} />;
			});
		return (
			<div style={this.props.style} className='tree-container'>
				{
					showSearch?<div className='tree-search'>
					<Search  placeholder={placeholder} onChange={this.onChange} />
					</div>:null
				}
				<Tree
					checkable
					showLine={true}
					onExpand={this.onExpand}
					// onSelect={onSelect}
					// selectedKeys={selectedKeys}
					expandedKeys={expandedKeys}
					autoExpandParent={autoExpandParent}
				    onCheck = {onCheck}
					checkedKeys ={checkedKeys}
				>
					{loop(this.props.data)}
				</Tree>
			</div>
		);
	}
}
SearchTree.propTypes = {
	showSearch:PropTypes.bool.isRequired,
	placeholder:PropTypes.string.isRequired,
	// onSelect:PropTypes.func.isRequired,
    onCheck:PropTypes.func.isRequired,
	// selectedKeys:PropTypes.array.isRequired,
    checkedKeys:PropTypes.array.isRequired,
};
export default connect((state) => ({
	showSearch: state.TreeTransferData.showSearch,
	placeholder: state.TreeTransferData.placeholder
}), {})(SearchTree);
