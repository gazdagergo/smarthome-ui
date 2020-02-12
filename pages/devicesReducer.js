export const reduceDevicesState = data => (
  data.reduce(( acc, {name, params}) => (
    { ...acc, [name]: params }
  ), {})
)

const updateDevices = (state, { payload }) => ({
  ...state,
  ...reduceDevicesState(payload),
  loading: 'done'
})

const setDevice = (state, { payload }) => ({
  ...state,
  ...payload
})

const setLoading = state => ({ ...state, loading: 'loading' })

const setError = (state, { payload: error }) => ({
  ...state,
  loading: false,
  error
})

const ackError = state => ({ ...state, error: null })

export default (state, action) => {
  switch (action.type) {
    case 'UPDATE_DEVICES__REQUEST': return setLoading(state);
    case 'UPDATE_DEVICES__SUCCESS': return updateDevices(state, action);
    case 'UPDATE_DEVICES__ERROR': return setError(state, action);
    case 'SET_DEVICE': return setDevice(state, action);
    case 'SET_DEVICE__ERROR': return setError(state, action);
    case 'ERROR_ACK': return ackError(state);
    default: return state
  }
}