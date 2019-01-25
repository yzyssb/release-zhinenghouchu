import React from 'react';
import Tag from 'antd/lib/tag';
import Input from 'antd/lib/input';
import Tooltip from 'antd/lib/tooltip';
import Icon from 'antd/lib/icon';


export default class EditableTagGroup extends React.Component {
    state = {
        tags: [],
        inputVisible: false,
        inputValue: '',
    };

    handleClose = (removedTag) => {

        let tags = this.props.tags ? this.props.tags : this.state.tags;
        tags = tags.filter(tag => tag !== removedTag);
        console.log(tags);
        this.setState({tags});
        if (this.props.onChange) {
            this.props.onChange(tags);
        }
    }

    showInput = () => {
        this.setState({inputVisible: true}, () => this.input.focus());
    }

    handleInputChange = (e) => {
        this.setState({inputValue: e.target.value});
    }

    handleInputConfirm = () => {
        const state = this.state;
        const inputValue = state.inputValue;
        let tags = this.props.tags ? this.props.tags : this.state.tags;
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue];
        }
        console.log(tags);
        this.setState({
            tags,
            inputVisible: false,
            inputValue: '',
        });
        if (this.props.onChange) {
            this.props.onChange(tags);
        }
    }

    saveInputRef = input => this.input = input

    render() {
        const {inputVisible, inputValue} = this.state;
        const tags = this.props.tags ? this.props.tags : this.state.tags;
        return (
            <div className="clearfix">
                {tags.map((tag, index) => {
                    const isLongTag = tag&&tag.length > 2000;
                    const tagElem = (
                        <Tag key={tag} closable={true} afterClose={() => this.handleClose(tag)} style = {{margin:5,lineHeight:'30px',height:30}}>
                            {isLongTag ? `${tag.slice(0, 2000)}...` : tag}
                        </Tag>
                    );
                    return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
                })}
                {inputVisible && (
                    <Input
                        ref={this.saveInputRef}
                        type="text"
                        size="small"
                        style={{width: 78}}
                        value={inputValue}
                        onChange={this.handleInputChange}
                        onBlur={this.handleInputConfirm}
                        onPressEnter={this.handleInputConfirm}
                    />
                )}
                {!inputVisible && (
                    <Tag
                        onClick={this.showInput}
                        style={{background: '#fff', borderStyle: 'dashed',display:'none'}}
                    >
                        <Icon type="plus"/> New Tag
                    </Tag>
                )}
            </div>
        );
    }
}