import React, { PropTypes } from 'react';
import styles from './ShowCodePage.less';
import Modal from 'antd/lib/modal';
import QRCode from 'qrcode.react';


const ShowCodePage = ({deskQrCode,dispatch,onCancel}) =>{


    const modalOpts = {
        title:'查看二维码',
        visible:deskQrCode.isShow,
        footer:null,
        onCancel,
        okText:"确定",
        cancelText:"取消"
    };



    return (
         <Modal {...modalOpts} >

            <div>
                {/*src={deskQrCode.qrCode}*/}
                {/*<img className={styles.qrCode} id={"img"} src={getUrl}/>*/}
                <QRCode value={deskQrCode.qrCode} className={styles.qrCode} />

                {/*<h5 className={styles.deskCode}>{deskQrCode.num}号桌</h5>*/}
            </div>

         </Modal>

    );
};



ShowCodePage.propTypes = {

};

export default ShowCodePage;