import Upload from 'antd/lib/upload';
import Button from 'antd/lib/button';
import Icon from 'antd/lib/icon';
import Modal from 'antd/lib/modal';
import React from 'react';
import { config } from '../../../services/HttpService';
import message from 'antd/lib/message';
import { getUserName, getUserId, getUserToken } from '../../../services/CommonService';

export default class PicturesWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
  };

  handleCancel = () => 
    {
      this.setState({ previewVisible: false })
    }


  onRemove= (file) => 
    {
      this.props.onRemove({
        removeImage: file
      });

    }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
      
    });
  }

  handleChange = ({ fileList,file }) => 

    { 

      this.setState({ fileList:fileList})
       if (file.status === 'done') {
              this.props.onChange({
                previewImage: fileList
              });
            }
    }

  

  render() {
    const { previewVisible, previewImage, fileList } = this.state;

    var defaultFileList=null;
    var fileCount=0;

    if( this.props.defaultUrl){
      defaultFileList=[];
      defaultFileList.push({
          uid: -1,
          name: 'default.png',
          status: 'done',
          url: this.props.defaultUrl,
        });
      fileCount=1;
      
    }else {

      fileCount=fileList.length;
    }
    


    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">{this.props.info ?this.props.info:"点击添加"}</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          name = 'file'
          action={config.uploadFileUrl+getUserToken()}
          listType="picture-card"
          fileList={defaultFileList?defaultFileList:fileList}
          onPreview={this.handlePreview}
          onRemove = {this.onRemove}
          onChange={this.handleChange}
          withCredentials = {true}
        >
          {fileCount >= this.props.maxCount ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
