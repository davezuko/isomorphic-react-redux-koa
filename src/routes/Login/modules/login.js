import axios from 'axios'
import { browserHistory } from 'react-router'
import Cookies from 'js-cookie'
import { FETCHED_AUTH_TOKEN } from '../../../store/rootReducers/auth'
import { FETCHED_USER_ID } from '../../../store/rootReducers/user'
import { ERROR_OCCURRED } from '../../../store/rootReducers/error'

// ------------------------------------
// Constants
// ------------------------------------
export const SUBMIT_LOGIN_FORM = 'SUBMIT_LOGIN_FORM'
export const SUBMIT_LOGIN_FORM_PENDING = `${SUBMIT_LOGIN_FORM}_PENDING`
export const SUBMIT_LOGIN_FORM_FULFILLED = `${SUBMIT_LOGIN_FORM}_FULFILLED`
export const SUBMIT_LOGIN_FORM_REJECTED = `${SUBMIT_LOGIN_FORM}_REJECTED`

export const fetchedAuthToken = (authToken) => ({
  type: FETCHED_AUTH_TOKEN,
  payload: { authToken }
})

export const fetchedUserId = (id) => ({
  type: FETCHED_USER_ID,
  payload: { id }
})

export const submitLoginForm = (promise) => ({
  type: SUBMIT_LOGIN_FORM,
  payload: promise
})

// ------------------------------------
// Actions
// ------------------------------------
export const login = () => (dispatch, getState) => {
  let formData = getState().form.loginForm.values

  if (!formData.rememberMe) formData.ttl = 10800 // set ttl to 3h if not remember me

  formData = JSON.stringify(formData)

  dispatch(submitLoginForm(
    axios
      .post('Users/login', formData)
      .then((response) => {
        const authToken = response.data.id

        axios.defaults.headers.common['Authorization'] = authToken
        Cookies.set('authToken', authToken, {
          expires: response.data.ttl / 60 / 60 / 24 // seconds to days
        })

        dispatch(fetchedAuthToken(authToken))
        dispatch(fetchedUserId(response.data.userId))

        browserHistory.push('semesters')
      })
      .catch((err) => {
        dispatch({ type: ERROR_OCCURRED, payload: err })
        throw err
      })
  ))
}

export const actions = {
  login,
  fetchedAuthToken,
  fetchedUserId,
  submitLoginForm
}

const LOGIN_ACTION_HANDLERS = {
  [SUBMIT_LOGIN_FORM_PENDING]: (state) => ({ ...state, submitting: true }),
  [SUBMIT_LOGIN_FORM_FULFILLED]: (state) => ({ ...state, submitting: false }),
  [SUBMIT_LOGIN_FORM_REJECTED]: (state) => ({ ...state, submitting: false })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { submitting: false }
export default function loginReducer (state = initialState, action) {
  const handler = LOGIN_ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
