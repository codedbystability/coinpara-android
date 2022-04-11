import store from "../reducers/createReducers";
import { hideLoading, showLoading } from "../actions/shell";

const show = ({ isActive = true, name = "" } = {}) =>   store.dispatch(showLoading({ isActive, name }));

const hide = ({ isActive = true, name = "" } = {}) => store.dispatch(hideLoading({ isActive, name }));

export default {
  show,
  hide,
};
