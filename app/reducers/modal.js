import { SET_SHARE_MODAL, SET_MENU_MODAL } from 'actions/modal';

const initialState = {
  shareModalOpen: false,
  menuModalOpen: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_SHARE_MODAL: {
      return Object.assign({}, state, {
        shareModalOpen: action.payload
      });
    }
    case SET_MENU_MODAL: {
      return Object.assign({}, state, {
        menuModalOpen: action.payload
      });
    }

    default:
      return state;
  }
}
