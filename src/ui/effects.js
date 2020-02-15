import page from 'page';
import * as api from './api';

const InitFX = async (dispatch, { onClientId, onShips }) => {
  const { id, ships } = await api.getClientId();
  dispatch(onClientId, { clientId: id });
  dispatch(onShips, { ships });
};
export const Init = props => [InitFX, props];

const GetPlayersFX = async (dispatch, { clientId, onUpdatePlayerList }) => {
  const players = await api.getPlayers(clientId);
  dispatch(onUpdatePlayerList, { players });
};
export const GetPlayers = props => [GetPlayersFX, props];

const PageNavigateFX = (_, path) => {
  page.show(path);
};
export const PageNavigate = props => [PageNavigateFX, props];

const WebsocketSendFX = (_, { payload }) => {
  const event = new CustomEvent('cyj:ws:send', {
    detail: payload,
  });
  document.dispatchEvent(event);
};
export const WebsocketSend = props => [WebsocketSendFX, props];
