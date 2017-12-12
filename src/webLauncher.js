import ui from './ui';
import Kakka from 'kakka-web';
import {
    API_PREFIX,
    apiAuthOk, apiAuthFail,
    apiPullTopics, apiTopics,
    apiCheckAuth, apiUser
} from './actions';

const {hook} = new Kakka({
    state: {
        user: null,
        initAuthCheck: false,
        topics: []
    },
    reducer: Kakka.switcher({
        [apiUser]: (user, state) => ({...state, user, initAuthCheck: true}),
        [apiTopics]: (topics, state) => ({...state, topics})
    }),
    actionGate: {
        prefix: API_PREFIX,
        host: '192.168.110.236'
    },
    ready() {
        apiPullTopics();
        setTimeout(() => {
            apiCheckAuth();
        }, 1000);
    }
});
