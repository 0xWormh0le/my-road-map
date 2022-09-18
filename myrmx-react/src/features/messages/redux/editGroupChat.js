import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import axios from 'axios';
import {

    MESSAGES_GET_GROUP_CHAT_BEGIN,
    MESSAGES_GET_GROUP_CHAT_SUCCESS,
    MESSAGES_GET_GROUP_CHAT_FAILURE,
    MESSAGES_GET_GROUP_CHAT_DISMISS_ERROR,

    MESSAGES_EDIT_GROUP_CHAT_BEGIN,
    MESSAGES_EDIT_GROUP_CHAT_SUCCESS,
    MESSAGES_EDIT_GROUP_CHAT_FAILURE,
    MESSAGES_EDIT_GROUP_CHAT_DISMISS_ERROR,
} from './constants';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function getGroupChat (args = {}) {
    return (dispatch, getState) => {
        dispatch({
            type: MESSAGES_GET_GROUP_CHAT_BEGIN,
        });

        const chatId = args.chatId;
        const promise = new Promise((resolve, reject) => {
            const doRequest = axios.get(`${config.apiRootUrl}/messages/groups/${chatId}`, {
                params: {
                },
                ...createAxiosConfigWithAuth(getState())
            });
            doRequest.then(
                (res) => {
                    dispatch({
                        type: MESSAGES_GET_GROUP_CHAT_SUCCESS,
                        data: res.data,
                    });
                    resolve(res.data);
                },
                // Use rejectHandler as the second argument so that render errors won't be caught.
                (err) => {
                    dispatch({
                        type: MESSAGES_GET_GROUP_CHAT_FAILURE,
                        data: { error: err },
                    });
                    reject(err);
                },
            );
        });

        return promise;
    };
}

export function editGroupChat (args = {}) {
    return (dispatch, getState) => {
        dispatch({
            type: MESSAGES_EDIT_GROUP_CHAT_BEGIN,
        });

        const id = args.id;
        const promise = new Promise((resolve, reject) => {
            const doRequest = axios.patch(`${config.apiRootUrl}/messages/groups/${id}/`, args, createAxiosConfigWithAuth(getState()));
            doRequest.then(
                (res) => {
                    dispatch({
                        type: MESSAGES_EDIT_GROUP_CHAT_SUCCESS,
                        data: res.data,
                    });
                    resolve(res.data);
                },
                // Use rejectHandler as the second argument so that render errors won't be caught.
                (err) => {
                    dispatch({
                        type: MESSAGES_EDIT_GROUP_CHAT_FAILURE,
                        data: { error: err.message },
                    });
                    reject(err);
                },
            );
        });

        return promise;
    };
}

export function dismissEditGroupChatError () {
    return {
        type: MESSAGES_EDIT_GROUP_CHAT_DISMISS_ERROR,
    };
}

export function dismissGetGroupChatError () {
    return {
        type: MESSAGES_GET_GROUP_CHAT_DISMISS_ERROR,
    };
}

export function useEditGroupChat () {
    const dispatch = useDispatch();

    const { editGroupChatPending, editGroupChatError } = useSelector(
        state => ({
            editGroupChatPending: state.messages.editGroupChatPending,
            editGroupChatError: state.messages.editGroupChatError,
        }),
        shallowEqual,
    );

    const boundAction = useCallback((...args) => {
        return dispatch(editGroupChat(...args));
    }, [dispatch]);

    const boundDismissError = useCallback(() => {
        return dispatch(dismissEditGroupChatError());
    }, [dispatch]);

    return {
        editGroupChat: boundAction,
        editGroupChatPending,
        editGroupChatError,
        dismissEditGroupChatError: boundDismissError,
    };
}

export function useGetGroupChat () {
    const dispatch = useDispatch();

    const { getGroupChatPending, getGroupChatError } = useSelector(
        state => ({
            groupChat: state.messages.getGroupChat,
            getGroupChatPending: state.messages.getGroupChatPending,
            getGroupChatError: state.messages.getGroupChatError,
        }),
        shallowEqual,
    );

    const boundAction = useCallback((...args) => {
        return dispatch(getGroupChat(...args));
    }, [dispatch]);

    const boundDismissError = useCallback(() => {
        return dispatch(dismissGetGroupChatError());
    }, [dispatch]);

    return {
        getGroupChat:boundAction,
        getGroupChatPending,
        getGroupChatError,
        dismissGetGroupChatError: boundDismissError,
    };
}

export function reducer (state, action) {
    switch (action.type) {

        case MESSAGES_GET_GROUP_CHAT_BEGIN:
            // Just after a request is sent
            return {
                ...state,
                getGroupChatPending: true,
                getGroupChatError: null,
            };

        case MESSAGES_GET_GROUP_CHAT_SUCCESS:
            // The request is success
            return {
                ...state,
                getGroupChat: action.data,
                getGroupChatPending: false,
                getGroupChatError: null,
            };

        case MESSAGES_GET_GROUP_CHAT_FAILURE:
            // The request is failed
            return {
                ...state,
                getGroupChatPending: false,
                getGroupChatError: action.data.error,
            };

        case MESSAGES_GET_GROUP_CHAT_DISMISS_ERROR:
            // Dismiss the request failure error
            return {
                ...state,
                getGroupChatPending: false,
                getGroupChatError: null,
            };


        case MESSAGES_EDIT_GROUP_CHAT_BEGIN:
            // Just after a request is sent
            return {
                ...state,
                editGroupChatPending: true,
                editGroupChatError: null,
            };

        case MESSAGES_EDIT_GROUP_CHAT_SUCCESS:
            // The request is success
            return {
                ...state,
                getGroupChat: action.data,
                editGroupChatPending: false,
                editGroupChatError: null,
            };

        case MESSAGES_EDIT_GROUP_CHAT_FAILURE:
            // The request is failed
            return {
                ...state,
                editGroupChatPending: false,
                editGroupChatError: action.data.error,
            };

        case MESSAGES_EDIT_GROUP_CHAT_DISMISS_ERROR:
            // Dismiss the request failure error
            return {
                ...state,
                editGroupChatError: null,
            };

        default:
            return state;
    }
}