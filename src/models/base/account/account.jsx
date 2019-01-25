export default {

    namespace: 'account',

    state: {
        username:'',
        token:'',
        userid:'',
        userstatus:'',
        hasLogin(account){
            
            if(account.username){
                return true;
            }else{
                return false;
            }
            //return account.username;
        }
    },

    subscriptions: {

    },

    effects: {
        /**init({ payload }, { call, put }) {
            yield put({
                type: 'initAccount',
                payload: { page: 1, field: '', keyword: '', ...payload },
            });
            const { data } = yield call(query, parse(payload));
            if (data) {
                yield put({
                    type: 'querySuccess',
                    payload: {
                        list: data.data,
                        total: data.page.total,
                        current: data.page.current,
                    },
                });
            }
        }*/
    },

    reducers: {
        initAccount(state, action) {
            return { ...state, ...action.payload};
        },
        getAccount(state, action){
            return state.userid;
        },
        updatePayload(state,action){
            return { ...state, ...action.payload,};
        },
    },

};
