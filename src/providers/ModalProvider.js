
let modalRef;

export const setModalRef = (ref) => modalRef = ref;

const show = (content = null, dismiss = true, presentation =  "overFullScreen") => modalRef.show(content, dismiss, presentation);
const hide = () => modalRef.hide();

export default {
  show,
  hide,
};
