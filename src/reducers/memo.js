import * as types from 'actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
    post: {
        status: '',
        error: -1
    },
    list: {
        status: '',
        error: undefined,
        data: [],
        dataMap: [],
        isLast: false
    },
    remove: {
        status: '',
        error: -1
    },
    edit: {
        status: '',
        error: -1,
        newMemo: undefined
    },
    star: {
        status: '',
        error: -1,
        memo: undefined
    }
};

export default function memo(state, action) {
    if(typeof state === 'undefined') {
        state = initialState;
    }

    let index;

    switch(action.type) {
        /* MEMO_POST */
        case types.MEMO_POST:
            return update(state, {
                post: {
                    status: { $set: 'WAITING' },
                    error: { $set: '-1' }
                }
            });
        case types.MEMO_POST_SUCCESS:
            return update(state, {
                post: {
                    status: { $set: 'SUCCESS' }
                }
            });
        case types.MEMO_POST_FAILURE:
            return update(state, {
                post: {
                    status: { $set: 'ERROR' },
                    error: { $set: action.error }
                }
            });

        /* MEMO_LIST */
        case types.MEMO_LIST:
            return update(state, {
                list: {
                    status: { $set: 'WAITING' },
                    error: { $set: undefined }
                }
            });
        case types.MEMO_LIST_SUCCESS:
            let map = action.data.map(
                (memo) => {
                    return memo._id;
                }
            );

            if(action.isInitial) {
                return update(state, {
                    list: {
                        status: { $set: 'SUCCESS' },
                        data: { $set: action.data },
                        dataMap: { $set: map },
                        isLast: { $set: action.data.length < 6 }
                    }
                });
            } else {
                if(action.listType === 'old' ) {
                    return update(state, {
                        list: {
                            status: { $set: 'SUCCESS' },
                            data: { $push: action.data },
                            dataMap: { $push: map },
                            isLast: { $set: (action.data.length < 6)}
                        }
                    });
                } else {
                    return update(state, {
                        list: {
                            status: { $set: 'SUCCESS' },
                            data: { $unshift: action.data },
                            dataMap: { $unshift: map }
                        }
                    });
                }
            }
            return state;
        case types.MEMO_LIST_FAILURE:
            return update(state, {
                list: {
                    status: { $set: 'FAILURE '},
                    error: { $set: action.error }
                }
            });

        /* MEMO REMOVE */
        case types.MEMO_REMOVE:
            return update(state, {
                remove: {
                    status: { $set: 'WAITING' },
                    error: { $set: -1 }
                }
            });
        case types.MEMO_REMOVE_SUCCESS:
            return update(state, {
                remove: {
                    status: { $set: 'SUCCESS' },
                },
            });
        case types.MEMO_REMOVE_FAILURE:
            return update(state, {
                remove: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
            });
        case types.MEMO_REMOVE_FROM_DATA:
            index = state.list.dataMap.indexOf(action.id);
            return update(state, {
                list: {
                    data: {
                        $splice: [[index, 1]],
                    },
                    dataMap: {
                        $splice: [[index, 1]]
                    }
                }
            });

        /* EDIT */
        case types.MEMO_EDIT:
            return update(state, {
                edit: {
                    status: { $set: 'WAITING' },
                    error: { $set: -1 },
                    newMemo: { $set: undefined }
                }
            });
        case types.MEMO_EDIT_SUCCESS:
            index = state.list.dataMap.indexOf(action.id);
            return update(state, {
                edit: {
                    status: { $set: 'SUCCESS' },
                    newMemo: { $set: action.memo }
                },
                list: {
                    data: {
                        [index]: { $set: action.memo }
                    }
                }
            });
        case types.MEMO_EDIT_FAILURE:
            return update(state, {
                edit: {
                    status: { $set : 'FAILURE' },
                    error: { $set: action.error }
                }
            });

        case types.MEMO_STAR:
            return update(state, {
                star: {
                    status: { $set: 'WAITING' }
                }
            });
        case types.MEMO_STAR_SUCCESS:
            index = state.list.dataMap.indexOf(action.id);
            return update(state, {
                star: {
                    status: { $set: 'SUCCESS' },
                },
                list: {
                    data: {
                        [index]: { $set: action.memo }
                    }
                }
            });
        case types.MEMO_STAR_FAILURE:
            return update(state, {
                star: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
            });
        case types.MEMO_CLEAR:
            return update(state, {
                list: {
                    data: { $set: [] }
                }
            });
        default:
            return state;
    }
}
