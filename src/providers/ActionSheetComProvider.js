let actionSheetRef;

export const setActionSheetRef = (ref) => {
  actionSheetRef = ref;
};

const show = ({
                title = "",
                options = [],
                onAction = null,
                animate = true,
              }) => {

  actionSheetRef.show(title, options, onAction, animate);
};

const hide = () => actionSheetRef.hide();

export default {
  show,
  hide,
};
