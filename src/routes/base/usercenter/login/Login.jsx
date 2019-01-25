import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Icon from 'antd/lib/icon';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Button from 'antd/lib/button';
import Spin from 'antd/lib/spin';
import Upload from 'antd/lib/upload';
import message from 'antd/lib/message';

import { connect } from 'dva';
import styles from './Login.less';

import UpLoadImage from '../../../../components/base/common/UpLoadImage';
import { routerRedux } from 'dva/router';

const Registration = ({
  field, keyword,
  onSearch,
  onAdd,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  }, dispatch, login,
}) => {
  function getInitialState() {
    return {
      passwordDirty: false,
    };
  }

  function handleSubmit(e) {
    e.preventDefault();
    validateFields((errors) => {
      if (!errors) {
        return;
      }
    });


    dispatch({ type: 'login/queryLogin', payload: getFieldsValue() });

    resetFields(['captcha']);

  }

  function registerClick() {

    dispatch(routerRedux.push({
      pathname: '/register',
      query: {},
    }));
  }

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };
  const catchcode = "data:image/png;base64," + login.captchBase;
  return (
    <Form horizontal onSubmit={handleSubmit}>
      <Form.Item
        {...formItemLayout}
        label="用户名"
        
      >
        {getFieldDecorator('userName', {
          initialValue: keyword || '',
          rules: [{
            required: true, message: '请输入用户名',
          }],
        })(
          <Input onFocus={() => { dispatch({ type: 'login/onblurSuccess' }); }} />
        )}
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        label="密 码"
        
      >
        {getFieldDecorator('password', {
          rules: [{
            required: true, message: '请输入密码',
          }],
        })(
          <Input type="password" />
        )}
      </Form.Item>

      <Form.Item
        {...formItemLayout}
        label="验证码"
      >
        <Row gutter={8}>
          <Col span={12}>
            {getFieldDecorator('captcha', {
              initialValue: '',
              rules: [{ required: true, message: '请输入验证码' }],
            })(
              <Input size="large" onFocus={() => { dispatch({ type: 'login/onblurSuccess' }); }} />
            )}
          </Col>
          <img src={catchcode} width="100" height="32" onClick={() => { dispatch({ type: 'login/queryCaptchaCode' }); }} />
        </Row>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" disabled={login.btnstatus} size="large" className={styles.onser}>登录</Button>

      </Form.Item>

      <Form.Item>
        <a onClick={registerClick} className={styles.registerBtn}>注册</a>
      </Form.Item>
    </Form>
  );

}
Registration.propTypes = {
  form: PropTypes.object.isRequired,
  onSearch: PropTypes.func,
  onAdd: PropTypes.func,
  field: PropTypes.string,
  keyword: PropTypes.string,
};

const RegistrationForm = Form.create()(Registration);

const login = ({ dispatch, login, fnselect }) => {
  function onShowRichText(e) {
    richEdit.show("<p>asdfasdfasdf</p>", dispatch, "menu/onShowRich");
  };

  return (
    <div className={styles.loginwrap}>

        {/*<div style={{ display: login.loadingstatus }} className={styles.loading}>
        <Spin />
      </div>
      <div className={styles.wrapw}>
        <h2 className={styles.h2}>餐饮云后台</h2>
        <RegistrationForm dispatch={dispatch} login={login}>
        </RegistrationForm>
        <div style={{ display: login.captchstatus }} className={styles.showerr}>{login.msg}</div>
      </div>*/}
    </div>



  )

}



function mapStateToProps({ login, fnselect }) {
  return { login, fnselect };
}

export default connect(mapStateToProps)(login);




