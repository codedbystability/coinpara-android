let actionSheetRef;

export const setActionSheetRef = (ref) => {
  actionSheetRef = ref;
};

const show = ({
                title = "",
                options = [],
                onAction = null,
                animate = true,
                oldActive = null,
              }) => {

  actionSheetRef.show(title, options, onAction, animate, oldActive);
};

const hide = () => actionSheetRef.hide();

export default {
  show,
  hide,
};
