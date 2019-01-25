import React, { PropTypes } from 'react';
import styles from './ReserveCode.less';




const ReserveCode = () => {

    return (<div>

        <div className={styles.topBack}>
            <h5 className={styles.uiLabel}>如何预定二维码?</h5>
            <h5 className={styles.uiLabel}>1.你可以将二维码下载,印刷到你发的宣传单,名片上,让客人扫描二维码进行预定</h5>
            <h5 className={styles.uiLabel}>2.您可以将链接地址配置到餐厅公众号菜单上，在微信上实现菜品预订。</h5>
        </div>

        <div className={styles.bottomBack}>
            <div className={styles.imgTop}></div>
            <img className={styles.codeImg} src={'https://gss0.bdstatic.com/94o3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=7bcb659c9745d688a302b5a29cf91a23/2934349b033b5bb571dc8c5133d3d539b600bc12.jpg'}/>
            <div className={styles.imgTop}></div>
            <div>
                <input className={styles.text} id={'text'}/>
            </div>
            <div className={styles.imgTop}></div>
            <button className={styles.copy} onClick={copy}>复制</button>

        </div>



    </div>);
};

function copy() {
    var val=document.getElementById("text");
    val.select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
}

ReserveCode.propTypes = {

};

export default ReserveCode;