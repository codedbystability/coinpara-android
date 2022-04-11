let dropdownAlertRef;

export const setDropdownAlert = (ref) => {
  dropdownAlertRef = ref;
};

const show = (type, title, message, { data, duration } = {}) => {
  dropdownAlertRef.show({ type, title, message, data, duration });
};

export default {
  show,
};
