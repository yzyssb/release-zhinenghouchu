import React, {PropTypes} from 'react';
import Form from 'antd/lib/form';
import Select from 'antd/lib/select';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import styles from './LocationInfo.less';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Checkbox from 'antd/lib/checkbox';
import EditableTagGroup from './EditableTagGroup.jsx'
import {Map, Marker, NavigationControl, InfoWindow} from 'react-bmap';
const { TextArea } = Input;
import InputNumber from 'antd/lib/input-number';

const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 8,
    },
};

const buttonItemLayout = {
    wrapperCol: {span: 8, offset: 6},
}

const LocationInfo = ({
                          form: {
                              getFieldDecorator,
                              validateFields,
                              getFieldsValue,
                              resetFields,
                          },
                          dispatch, locationInfo, cityInfo,ctglBaseSetting
                      }) => {


    function handleSubmit(e) {
        if (e) {
            e.preventDefault();
        }

        validateFields((errors) => {
            if (!!errors) {
                return;
            }
        });


        dispatch({
            type: 'ctglBaseSetting/saveLocationInfo',
            payload: {},
        });

    }


    //处理所在城市

    //省份
    const Option = Select.Option;
    var provinceOptionHtml = [];

    var provinceValue = "请选择";

    provinceOptionHtml.push(<Option key={-1}>{"请选择"}</Option>)

    if (cityInfo.provinceList) {

        cityInfo.provinceList.map((j) => {

            provinceOptionHtml.push(<Option key={j.code}>{j.name}</Option>)

            if (locationInfo.province == j.code) {

                provinceValue = j.name;

               

            }

        })

    }

    function onProvinceChange(value) {

        if (parseInt(value) == locationInfo.province) {
            return;
        }

        dispatch({
            type: 'ctglBaseSetting/getCityList',
            payload: {
                code: parseInt(value),
            },
        });


        let provinceValue = '';

        cityInfo.provinceList.map((i)=>{

            if(i.code == value){
                provinceValue = i.name;
            }
        })

         dispatch({
                    type: 'ctglBaseSetting/updatePayload',
                    payload: {provinceText:provinceValue},
                });

    }

    //城市
    var cityOptionHtml = [];

    var cityValue = "请选择";

    cityOptionHtml.push(<Option key={-1}>{"请选择"}</Option>)

    if (cityInfo.cityList) {
        cityInfo.cityList.map((j) => {

            cityOptionHtml.push(<Option key={j.code}>{j.name}</Option>)
            if (locationInfo.city == j.code) {

                cityValue = j.name;
                 
            }

        })

       

    }

    function onCityChange(value) {

        if (parseInt(value) == locationInfo.city) {
            return;
        }

        dispatch({
            type: 'ctglBaseSetting/getCountryList',
            payload: {
                code: parseInt(value),
            },
        });
        let cityValue = '';

        cityInfo.cityList.map((i)=>{

            if(i.code == value){
                cityValue = i.name;
            }
        })

         dispatch({
                    type: 'ctglBaseSetting/updatePayload',
                    payload: {cityText:cityValue},
                });
    }

    //区县
    var countryOptionHtml = [];

    var countryValue = "请选择";

    countryOptionHtml.push(<Option key={-1}>{"请选择"}</Option>)

    if (cityInfo.countryList) {
        cityInfo.countryList.map((j) => {

            countryOptionHtml.push(<Option key={j.code}>{j.name}</Option>)
            if (locationInfo.country == j.code) {

                countryValue = j.name;
                
            }

        })

         

    }

    function onCountryChange(value) {

        if (parseInt(value) == locationInfo.country) {
            return;
        }

        dispatch({
            type: 'ctglBaseSetting/updateCountry',
            payload: {
                code: parseInt(value),
            },
        });

        let countryValue = '';

        cityInfo.countryList.map((i)=>{

            if(i.code == value){
                countryValue = i.name;
            }
        })
        
        dispatch({
                    type: 'ctglBaseSetting/updatePayload',
                    payload: {countryText:countryValue},
                });
    }


    //处理特色环境
    var environmentTagHtmlArr = [];

    if (locationInfo.environmentTagList) {
        locationInfo.environmentTagList.map((h, i) => {
            var valueobj = {index: i, id: h.value, name: h.key};
            environmentTagHtmlArr.push(
                <Col span={8} key={i}>
                    < Checkbox key={i} options={h.key} checked={h.checked} className={styles.checkbox}
                               value={valueobj} onChange={onEnvironmentTagChange}> {h.key} </Checkbox>
                </Col>
            );
        });
    }


    function onEnvironmentTagChange(e) {

        dispatch({
            type: 'ctglBaseSetting/updateEnvironmentTag',
            payload: {...e.target.value, checked: e.target.checked ? 1 : 0}
        });

    }


    function onLocationInputChange(value, key) {

        dispatch({
            type: 'ctglBaseSetting/updateLocationInput',
            payload: {value: value, key: key},
        });
    }

    function onBuiltAreaInput(value, key) {

        dispatch({
            type: 'ctglBaseSetting/updateLocationInput',
            payload: {value: value, key: key},
        });
    }

    //修改自定义标签
    function onEditableTagGroupChange(tags) {
        dispatch({
            type: 'ctglBaseSetting/updateCustomTags',
            payload: {tags: tags},
        });
    }
    function searchLocation() {
        dispatch({
            type: 'ctglBaseSetting/getLatLng',
            payload: {},
        });
    }

    return (
        <div>

            <Form onSubmit={handleSubmit}>

                <Form.Item
                    label="所在城市"
                    {...formItemLayout}
                >
                    <div>
                        <Row>
                            <Col span={8} key={1}>
                                <Select disabled value={provinceValue} style={{width: 100}} placeholder="请选择"
                                        onChange={onProvinceChange}>
                                    {provinceOptionHtml}
                                </Select>
                            </Col>
                            <Col span={8} key={2}>

                                <Select disabled value={cityValue} style={{width: 100, paddingleft: 10}} placeholder="请选择"
                                        onChange={onCityChange}>
                                    {cityOptionHtml}
                                </Select>
                            </Col>
                            <Col span={8} key={3}>
                                <Select disabled value={countryValue} style={{width: 100, paddingleft: 10}} placeholder="请选择"
                                        onChange={onCountryChange}>
                                    {countryOptionHtml}
                                </Select>
                            </Col>
                        </Row>


                    </div>

                </Form.Item>

                <Form.Item
                    label="*具体位置"
                    {...formItemLayout}
                >

                    <Input disabled value={locationInfo.addressDetail} type="text" size="default" onChange={(e) => {
                        onLocationInputChange(e.target.value, 'addressDetail')
                    }}/>
                    <Button disabled onClick={searchLocation}>定位</Button>

                </Form.Item>
                <Form.Item  label="地图" {...formItemLayout}>
                    {BMap.lushang180831!=true && <Map center={{lng: locationInfo.lng, lat: locationInfo.lat}} zoom="12" panTo={{lng: locationInfo.lng, lat: locationInfo.lat}}>
                        <Marker position={{lng: locationInfo.lng, lat:locationInfo.lat}} />
                        <NavigationControl/>
                        {/*<InfoWindow position={{lng: locationInfo.lng, lat: locationInfo.lat}}  title={locationInfo.addressDetail}/>*/}
                    </Map>}
                </Form.Item>
                <Form.Item
                    label="宣传语"
                    {...formItemLayout}
                >

                    <Input value={locationInfo.slogan} type="text" size="default" onChange={(e) => {
                        onLocationInputChange(e.target.value, 'slogan')
                    }}/>

                </Form.Item>

                <Form.Item
                    label="特色环境"
                    {...formItemLayout}
                >

                    {environmentTagHtmlArr}

                </Form.Item>

                <Form.Item
                    label="餐厅面积"
                    {...formItemLayout}
                >

                    <InputNumber min={0} max={Infinity} step={1} onChange = {(e)=>onBuiltAreaInput(e, 'builtArea')} value = {locationInfo.builtArea}/>

                </Form.Item>

                <Form.Item
                    label="自定义标签"
                    {...formItemLayout}
                >
                    <div className={styles.editabletaggroup}>
                        <EditableTagGroup tags={locationInfo.customTags} onChange={onEditableTagGroupChange}/>
                    </div>

                </Form.Item>

                <Form.Item
                    label="介绍"
                    {...formItemLayout}
                >

                    <TextArea value={locationInfo.description} placeholder="填写介绍，做多140字" maxLength="140"
                           autosize={{minRows: 3, maxRows: 6}} onChange={(e) => {
                        onLocationInputChange(e.target.value, 'description')
                    }}/>

                </Form.Item>

                <Form.Item
                    {...buttonItemLayout}
                >
                    <Button size="default" type="primary" htmlType="submit">保存</Button>
                </Form.Item>

            </Form>
        </div>
    );
    // function f() {
    //     return <Map center={{lng: 116.402544, lat: 39.928216}} zoom="12">
    //         <Marker position={{lng: 116.402544, lat: 39.928216}}/>
    //         <NavigationControl/>
    //         <InfoWindow position={{lng: 116.402544, lat: 39.928216}} text="内容" title="标题"/>
    //     </Map>;
    // }
};

LocationInfo.propTypes = {
    visible: PropTypes.any,
    form: PropTypes.object,
    item: PropTypes.object,
};

export default Form.create()(LocationInfo);