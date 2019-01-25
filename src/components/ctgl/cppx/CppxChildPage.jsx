import React, { PropTypes } from 'react';
import Form from 'antd/lib/form';
import Select from 'antd/lib/select';
import Button from 'antd/lib/button';
import Spin from 'antd/lib/spin';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import DatePicker from 'antd/lib/date-picker';
import styles from './CppxChildPage.less';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
import moment from 'moment';
import Table from 'antd/lib/table';
import Popconfirm from 'antd/lib/popconfirm';

import Checkbox from 'antd/lib/checkbox';
import Radio from 'antd/lib/radio';
import message from 'antd/lib/message';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Modal from 'antd/lib/modal';
const CheckboxGroup = Checkbox.Group;
import SydcppxPage from '../../../routes/ctgl/sydcppx/SydcppxPage';
import WxctcppxPage from '../../smdc/wxctcppx/WxctcppxPage';

const CppxChildPage=({
                    dispatch,
                         cppx,
                    deskQrCode,
                    ctglBaseSetting,
                }) => {
    function handleModeChange(e){
        dispatch({
            type:'cppx/updatePayload',
            payload:{
                radioValue:e.target.value
            }
        })
    }


    return (
        <div>
            <Radio.Group onChange={handleModeChange} value={String(cppx.radioValue)} style={{ marginBottom: 8 }}>
                <Radio.Button value="1">收银端排序</Radio.Button>
                <Radio.Button value="2">微信点餐排序</Radio.Button>
            </Radio.Group>

            {cppx.radioValue==1?(
                <SydcppxPage />
            ):(
                <WxctcppxPage />
            )}


        </div>
    );
};


CppxChildPage.propTypes = {
    visible: PropTypes.any,
    form: PropTypes.object,
    item: PropTypes.object,
};

export default Form.create()(CppxChildPage);