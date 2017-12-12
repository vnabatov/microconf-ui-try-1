import Kakka from 'kakka-core';

const {def} = Kakka({});

// todo, need to solve misunderstanding with def / Kakka.def

export const API_PREFIX = 'API/';

export const apiPullTopics = def(`${API_PREFIX}TOPICS_PULL`);
export const apiTopics = Kakka.def(`${API_PREFIX}TOPICS`);

export const apiVoteTopic =  def(`${API_PREFIX}TOPIC_VOTE`);
export const apiUnvoteTopic =  def(`${API_PREFIX}TOPIC_UNVOTE`);

export const apiTryAuth = def(`${API_PREFIX}TRY_AUTH`);
export const apiAuthOk = Kakka.def(`${API_PREFIX}AUTH_OK`);
export const apiAuthFail = Kakka.def(`${API_PREFIX}AUTH_FAIL`);
export const apiUser = Kakka.def(`${API_PREFIX}USER`);
export const apiCheckAuth = def(`${API_PREFIX}CHECK_AUTH`);

export const apiFail = Kakka.def(`${API_PREFIX}FAIL`);

export const fail = def();

const addTopic = def('TOPIC_ADD');
const removeTopic = def('TOPIC_REMOVE');
const changeTopic = def('TOPIC_CHANGE');
