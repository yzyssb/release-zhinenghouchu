import { httpPost,httpPostWithParam } from '../../../services/HttpService';
import { config } from '../../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message'


export default{
	namespace:'tzzx',
	state:{
        offset:0,
        size:10,
        total:0,
        current:1,

        brandId:0,
        brandList:[],

        editFroms:{},

        addNoticeVisible:false,
        lookNoticerVisible:false,
        inputArr:[null],

        phoneList:[],

        list:[],

        messageType:'1',

        presetTasks:[],

        sendRestaurants:[],

        roleTabData:[],

        roleAllData:[],

        restaurantList:[],

        roleSelectedRowKeys:[],

        checkedKeys:[],

        isAdd:true,

        selectData:[],


	},

	 subscriptions: {
		setup({ dispatch, history }) {
		    history.listen(location => {
    			if (location.pathname === '/tzzx') {
                    dispatch({
                        type:'brandListUrl',
                        payload:{}
                    })
                    dispatch({
                        type:'storeById',
                        payload:{}
                    })
                    // 获取角色tab框数据
                    dispatch({
                        type: "roleTabData",
                        payload: {}
                    })
                    dispatch({
                        type: "roleAllData",
                        payload: {}
                    })

                    dispatch({
                        type: "updatePayload",
                        payload: {
                            offset:0,
                            size:10,
                            current:1
                        }
                    })
                }
            });
        },
    },

    effects: {
        * brandListUrl({payload}, {select, call, put}) {
            const {data} = yield call(httpPost, config.brandListUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            brandList:data.data,
                            brandId:data.data.length>0?data.data[0].key:0,
                            brandName:data.data.length>0?data.data[0].value:''
                        }
                    });
                    yield put({
                        type: 'sendManageQueryByBrandId',
                        payload: {}
                    });


                } else {
                    message.error(data.msg)
                }
            }
        },
        //通知列表
        * sendManageQueryByBrandId({payload}, {select, call, put}) {
            const tzzx=yield select(({tzzx})=>tzzx)
            payload.offset = tzzx.offset;
            payload.size = tzzx.size;

            const {data} = yield call(httpPost, config.sendManageQueryByBrandId+'?brandId='+tzzx.brandId, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            list:data.data
                        },
                    });
                    yield put({
                        type: 'storeById',
                        payload: {},
                    });
                } else {
                    message.error(data.msg)
                }
            }
        },
        //添加与编辑
        * sendManageAddUpdate({payload}, {select, call, put}) {
            const tzzx=yield select(({tzzx})=>tzzx)

            let presetTasks = [];
            tzzx.roleSelectedRowKeys.map((i)=>{

                let object = {};
                tzzx.roleAllData.map((j)=>{

                    if (i == j.id){
                        object.sendPhoneId = j.id;
                        object.brandName = j.brandName?j.brandName:"";
                        object.name = j.name?j.name:"";
                        object.phone = j.phone?j.phone:"";
                        object.post = j.dutyName?j.dutyName:"";
                        object.restaurantName = j.nodeName?j.nodeName:"";
                    }
                })
                presetTasks.push(object);
            })

            payload.presetTasks = presetTasks;

            let sendRestaurants = [];

            tzzx.checkedKeys.map((i)=>{

                let object = {};
                tzzx.restaurantList.map((j)=>{

                    if (i == j.key){
                        object.brandId = tzzx.brandId;
                        object.restaurantId = j.key;
                    }
                })
                sendRestaurants.push(object);
            })

            payload.sendRestaurants = sendRestaurants;

            payload.messageType = tzzx.messageType;

            const {data} = yield call(httpPost, config.sendManageAddUpdate, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    if(Object.keys(tzzx.editFroms).length>0){
                        message.success('修改成功')
                    }else{
                        message.success('添加成功')
                    }
                    yield put({
                        type: 'sendManageQueryByBrandId',
                        payload: {},
                    });
                } else {
                    message.error(data.msg)
                }
            }
        },
        //删除
        * sendManageDeleteById({payload}, {select, call, put}) {
            const {data} = yield call(httpPost, config.sendManageDeleteById+'?id='+payload.id, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    message.success('删除成功')
                    yield put({
                        type: 'sendManageQueryByBrandId',
                        payload: {},
                    });
                } else {
                    message.error(data.msg)
                }
            }
        },
        *storeById({ payload }, { select, call, put }) {
            yield put({ type: 'showLoading' });
            let brandId = yield select(({tzzx})=>tzzx.brandId)
            let brandName = yield select(({tzzx})=>tzzx.brandName)
            const orderListUrl = config.storeById;
            const { data } = yield call(httpPost, orderListUrl + brandId, payload);
            if (data) {

                if (data.code == config.MSGCODE_SUCCESS) {

                    var targetChildren = data.data;
                    var result = [];

                    let obj = {};
                    obj.value = brandId;
                    obj.key = brandId;
                    obj.title = brandName;
                    obj.label = brandName;

                   if (targetChildren && targetChildren.length > 0) {
                        obj.children = [];
                       targetChildren.map((i)=> {
                            let childrenObj = {};
                            childrenObj.value = i.key;
                            childrenObj.key = i.key;
                            childrenObj.title = i.value;
                            childrenObj.label = i.value;
                            obj.children.push(childrenObj);
                        })
                    }
                    result.push(obj);

                    }

                    yield put({
                        type: 'updatePayload',
                        payload: {
                            treeData: result,
                            restaurantList:data.data,
                        }
                    });

                } else {
                    yield put({ type: 'hideLoading' });
                    message.error(data.msg)
                }
        },
        // 表单页面获取角色框tab列表数据
        *roleTabData({ payload }, { select, call, put }) {

            const orderListUrl = config.roleTabDataUrl;
            payload.brandId = yield select(({tzzx})=>tzzx.brandId)
            const { data } = yield call(httpPost, orderListUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {

                    let newRoleTabData = [];
                    data.data.length>0&&data.data.map((i)=>{

                        if (i.phone){
                            newRoleTabData.push(i);
                        }
                    })

                    yield put({
                        type: 'updatePayload',
                        payload: {
                            roleTabData: newRoleTabData,
                            // roleSelectedRowKeys
                        }
                    });
                } else {
                    message.error(data.msg);
                }
            }
        },

        // 表单页面获取角色框tab列表数据
        *roleAllData({ payload }, { select, call, put }) {

            const orderListUrl = config.roleTabDataUrl;
            payload.brandId = yield select(({tzzx})=>tzzx.brandId)
            const { data } = yield call(httpPost, orderListUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {

                    let newRoleTabData = [];
                    data.data.length>0&&data.data.map((i)=>{

                        if (i.phone){
                            newRoleTabData.push(i);
                        }
                    })

                    yield put({
                        type: 'updatePayload',
                        payload: {
                            roleAllData: newRoleTabData,
                            // roleSelectedRowKeys
                        }
                    });
                } else {
                    message.error(data.msg);
                }
            }
        },

	},
	reducers:{
	
	    updatePayload(state,action){
			return { ...state, ...action.payload,};
	 	},
		
	}
}