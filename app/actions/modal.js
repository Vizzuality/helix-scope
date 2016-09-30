export const SET_SHARE_MODAL = 'SET_SHARE_MODAL';
export const SET_MENU_MODAL = 'SET_MENU_MODAL';

export function setShareModal(status) {
  return {
    type: SET_SHARE_MODAL,
    payload: status
  };
}

export function setMenuModal(status) {
  return {
    type: SET_MENU_MODAL,
    payload: status
  };
}
