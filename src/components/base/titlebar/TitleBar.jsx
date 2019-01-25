import React, { PropTypes } from 'react';
import Button from 'antd/lib/button';
import Menu from 'antd/lib/menu';
import Icon from 'antd/lib/icon';
import Modal from 'antd/lib/modal';
import styles from './TitleBar.less';

const TitleBar = (callbackFn) => {

    var titleBarHtml=[];

    function confirm() {
    	if(callbackFn.needsave&&callbackFn.needsave=='no'){
    		window.history.back();
    	}else{
    		Modal.confirm({
				title: '是否保存？',
				okText: '保存',
				cancelText: '不保存',
				onCancel(){
					window.history.back();
				},
				onOk(){
					callbackFn.titleBarCallback();
	
				}
			});
    	}	
	}
    return (
        <div className={styles.titleBar}>
            <Button type="primary" className={styles.backBtn}  onClick={confirm}>返回</Button>
            <p className={styles.title}>{callbackFn.titleName}</p>
        </div>
    );

}

export default TitleBar;
