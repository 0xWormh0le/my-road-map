
import axios from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
    CHANGE_PASSWORD_BEGIN,
    CHANGE_PASSWORD_SUCCESS,
    CHANGE_PASSWORD_FAILURE,
    CHANGE_PASSWORD_DISMISS_ERROR,
    SET_CHANGE_PASSWORD_ERROR
} from '../../user/redux/constants';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function changePassword (args = {}) {
    return (dispatch, getState) => { // optionally you can have getState as the second argument
        dispatch({
            type: CHANGE_PASSWORD_BEGIN
        });

        const promise = new Promise((resolve, reject) => {
            const doRequest = axios.put(`${config.apiRootUrl}/auth/change-password`, args, createAxiosConfigWithAuth(getState()));
            doRequest.then(
                (res) => {
                    dispatch({
                        type: CHANGE_PASSWORD_SUCCESS,
                        data: res,
                    });
                    resolve(res);
                },
                // Use rejectHandler as the second argument so that render errors won't be caught.
                (err) => {
                    dispatch({
                        type: CHANGE_PASSWORD_FAILURE,
                        data: { error: err },
                    });
                    reject(err);
                },
            );
        });

        return promise;
    };
}

export function dismissChangePasswordError () {
    return {
        type: CHANGE_PASSWORD_DISMISS_ERROR,
    };
}

export function setChangeErrorMessage (errorMessage) {
    return {
        type: SET_CHANGE_PASSWORD_ERROR,
        data: { changePasswordError: errorMessage }
    }
}


export function useChangePassword () {
    const dispatch = useDispatch();

    const { changePasswordPending, changePasswordError } = useSelector(
        state => ({
            changePasswordPending: state.user.changePasswordPending,
            changePasswordError: state.user.changePasswordError
        }),
        shallowEqual,
    );

    const boundAction = useCallback((...args) => {
        return dispatch(changePassword(...args));
    }, [dispatch]);


    const boundSetErrorMessage = useCallback((...args) => {
        return dispatch(setChangeErrorMessage(...args));
    }, [dispatch]);

    const boundDismissError = useCallback(() => {
        return dispatch(dismissChangePasswordError());
    }, [dispatch]);


    return {
        changePassword: boundAction,
        changePasswordPending,
        changePasswordError,
        dismissChangePasswordError: boundDismissError,
        setChangePasswordErrorMessage: boundSetErrorMessage
    }
}

export function reducer (state, action) {
    switch (action.type) {
        case CHANGE_PASSWORD_BEGIN:
            // Just after a request is sent
            return {
                ...state,
                changePasswordPending: true,
                changePasswordError: null,
            };

        case CHANGE_PASSWORD_SUCCESS:
            // The request is success
            return {
                ...state,
                changePasswordPending: false,
                changePasswordError: null,

            };

        case SET_CHANGE_PASSWORD_ERROR:
            console.log("action.data:", action.data)
            return {
                ...state,
                changePasswordError: action.data.changePasswordError
            }

        case CHANGE_PASSWORD_FAILURE:
            // The request is failed
            return {
                ...state,
                changePasswordPending: false,
                changePasswordError: action.data.error.response.data.message,
            };



        default:
            return state;
    }
}
