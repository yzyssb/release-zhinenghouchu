import React from 'react';
import Tree from 'antd/lib/tree';
import Form from "antd/lib/form/index";
import {Button, Modal, Tabs} from 'antd/lib';

const TabPane = Tabs.TabPane;

const TreeNode = Tree.TreeNode;

const treeData = [{
    title: '0-0',
    key: '0-0',
    children: [{
        title: '0-0-0',
        key: '0-0-0',
        children: [
            {title: '0-0-0-0', key: '0-0-0-0'},
            {title: '0-0-0-1', key: '0-0-0-1'},
            {title: '0-0-0-2', key: '0-0-0-2'},
        ],
    }, {
        title: '0-0-1',
        key: '0-0-1',
        children: [
            {title: '0-0-1-0', key: '0-0-1-0'},
            {title: '0-0-1-1', key: '0-0-1-1'},
            {title: '0-0-1-2', key: '0-0-1-2'},
        ],
    }, {
        title: '0-0-2',
        key: '0-0-2',
    }],
}, {
    title: '0-1',
    key: '0-1',
    children: [
        {title: '0-1-0-0', key: '0-1-0-0'},
        {title: '0-1-0-1', key: '0-1-0-1'},
        {title: '0-1-0-2', key: '0-1-0-2'},
    ],
}, {
    title: '0-2',
    key: '0-2',
}];

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

const _EditForm = ({visible, powers, posPowers, record, dispatch,zbgl, form: {getFieldDecorator, validateFields, getFieldsValue, resetFields}}) => {
    let _checkedKeys = record.powerCodeList || [];
    let _posCheckedKeys = _checkedKeys;


    const onOk = () => {
        let checkedPosKeys = zbgl.checkedPosKeys;

        let checkedKeys = zbgl.checkedKeys;

        dispatch({
            type: 'zbgl/updatePayload',
            payload: {checkedPowerCodes: [...checkedPosKeys, ...checkedKeys], powerModalVisible: false}
        })
    };
    const handCancel = () => {
        dispatch({
            type: 'zbgl/updatePayload',
            payload: {powerModalVisible: false,checkedKeys:zbgl.defaultKeys,checkedPosKeys:zbgl.defaultPosKeys}
        })
    };

    return (
        <Modal width='800px' visible={visible} title="权限管理" onCancel={handCancel} onOk={onOk} afterClose={() => {
            resetFields()
        }}>
            <Tabs defaultActiveKey="1">
                <TabPane tab="pos权限" key="1">
                    <PowerTree powers={posPowers} checkedKeys={zbgl.checkedPosKeys} onChange={(checkedKeys) => {
                        _posCheckedKeys = checkedKeys

                        dispatch({
                            type: 'zbgl/updatePayload',
                            payload:{
                                checkedPosKeys:checkedKeys,
                            }
                        });

                    }}/>
                </TabPane>
                <TabPane tab="云端权限" key="2">
                    <PowerTree powers={powers} checkedKeys={zbgl.checkedKeys} onChange={(checkedKeys) => {
                        _checkedKeys = checkedKeys

                        dispatch({
                            type: 'zbgl/updatePayload',
                            payload:{
                                checkedKeys:checkedKeys,
                            }
                        });
                    }}/>
                </TabPane>
            </Tabs>
        </Modal>
    );

};
export default Form.create()(_EditForm);
