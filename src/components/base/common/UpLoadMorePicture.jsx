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

  handleCancel = () => {
    this.setState({ previewVisible: false })
  }


  onRemove = (file) => {
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

  handleChange = ({ fileList, file }) => {

    if (file.status === 'done') {
      this.setState({ fileList: fileList })
      this.props.onChange({
        previewImage: fileList
      });
    }else if (file.status === 'uploading'){
        this.setState({ fileList: fileList })

    }
  }

  beforeUpload = (file) => {
    const isJPEG = file.type === 'image/jpeg';
    const isJPG = file.type === 'image/jpg';
    const isPNG = file.type === 'image/png';
    const isGIF = file.type === 'image/gif';
    if (!(isJPG || isJPEG || isPNG || isGIF)) {
      message.error('请上传jpeg、jpg、png、gif格式的图片');
    }
    const isLt2M = file.size / 1024 < 5120;
    if (!isLt2M) {
      message.error('图片大小超过5M');
    }
    return (isJPG || isJPEG || isPNG || isGIF) && isLt2M;
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;

    var defaultFileList = [];
    var fileCount = 0;
    
    if (this.props.defaultUrl.length > 0 ) {
      

      for (var i = 0; i < this.props.defaultUrl.length; i++) {

       defaultFileList.push({
          uid: this.props.defaultUrl[i],
          name: 'default.png',
          status: 'done',
          url: this.props.defaultUrl[i],
        });

      }

      
      fileCount = defaultFileList.length;
                                                                                                                  
    } else {

      fileCount = fileList.length;
    }



    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">{this.props.info ? this.props.info : "点击添加"}</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          name='file'
          action={config.uploadUrl + getUserToken()}
          listType="picture-card"
          fileList={(fileList.length>0) ? fileList : defaultFileList}
          // fileList={defaultFileList == "" ? defaultFileList : fileList}

          onPreview={this.handlePreview}
          onRemove={this.onRemove}
          onChange={this.handleChange}
          beforeUpload={this.beforeUpload}
          withCredentials={true}
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
