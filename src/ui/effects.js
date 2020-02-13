import page from 'page';
import * as api from './api';

const InitFX = async (dispatch, { onClientId, onShips }) => {
  const { id, ships } = await api.getClientId();
  dispatch(onClientId, { clientId: id });
  dispatch(onShips, { ships });
};
export const Init = props => [InitFX, props];

const PageNavigateFX = (_, path) => {
  page.show(path);
};
export const PageNavigate = props => [PageNavigateFX, props];
