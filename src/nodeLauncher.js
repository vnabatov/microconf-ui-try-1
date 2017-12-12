import Kakka from 'kakka-node';
import {
    API_PREFIX,
    apiFail, fail,
    apiTryAuth, apiAuthOk, apiAuthFail, apiUser, apiCheckAuth,
    apiPullTopics, apiTopics, apiVoteTopic, apiUnvoteTopic
} from './actions';
import {ssoAuthUser} from './adConnector';
import {User, Topic} from './entities';

const {hook, fire} = new Kakka({
    actionGate: {
        prefix: API_PREFIX,
        putActions: [apiUser]
    },
    storage: {
        db: 'microconf'
    }
});

function updateUserInDB(rawUser) {
    return User.pull((q, r) => q.filter(r.row('email').eq(rawUser.mail)))
        .then(users => {
            if (users.length === 0) {
                const user = new User(rawUser.cn, rawUser.mail, rawUser);

                return user.put()
                    .then(res => {
                        if (res.inserted !== 1) throw new Error('not inserted');
                        return user;
                    })
            } else {
                return users[0];
            }
        })
}

function authorizedUser(cookie) {
    return User.pull((q, r) => q.filter(r.row('cookie').eq(cookie)))
        .then(users => {
            if (users.length !== 1) throw new Error(`Incorrect user cookie ${cookie}`);

            return users[0];
        })
}

function checkIsCookieExists(cookie) {
    if (!cookie) throw new Error('Undefined user cookie');
    return cookie;
}

hook(apiCheckAuth, action => {
    Promise.resolve(action.clientStorage.cookie)
        .then(checkIsCookieExists)
        .then(authorizedUser)
        .then(user => {
            return apiUser({
                id: user.id,
                name: user.name,
                cookie: user.cookie
            })
        })
        .catch(err => {
            fail(err);
            return apiUser();
        })
        .then(respAction => {
            action.response(respAction)
        })
})

hook(apiTryAuth, action => {
    const {login, pwd} = action.payload;

    ssoAuthUser(login, pwd)
        .then(updateUserInDB)
        .then(user => {
            action.response(
                apiUser({
                    id: user.id,
                    name: user.name,
                    cookie: user.cookie
                })
            );
            action.response(
                apiAuthOk()
            )
        })
        .catch(err => {
            fail(err);
            action.response(apiAuthFail());
        })
});

// todo, split to two action for pull and for update
hook(apiPullTopics, action => {
    Topic.pull(q => q.orderBy("title").slice(0,100))
        .then(topicList => {
            const list = apiTopics(topicList);
            
            return action.key // todo, need is* method
                ? action.responseAction(list) 
                : list
        })
        .catch(err => {
            fail(err);
            return action.responseAction(apiFail())
        })
        .then(fire)
});

hook(apiVoteTopic, action => {
    Promise.resolve(action.clientStorage.cookie)
        .then(checkIsCookieExists)
        .then(authorizedUser)
        .then(user => {
            return Topic.get(action.payload)
                .then(topic => {
                    if (topic.votes.indexOf(user.id) === -1) {
                        return Topic.update(topic.id, {votes: [...topic.votes, user.id]})
                    }
                })
        })
        .then(() => apiPullTopics())
        .catch(err => {
            fail(err);
        })
});

hook(apiUnvoteTopic, action => {
    Promise.resolve(action.clientStorage.cookie)
        .then(checkIsCookieExists)
        .then(authorizedUser)
        .then(user => {
            return Topic.get(action.payload)
                .then(topic => {
                    const votes = topic.votes.filter(item => item !== user.id);
                    return Topic.update(topic.id, {votes})
                })
        })
        .then(() => apiPullTopics())
        .catch(err => {
            fail(err);
        })
});

hook(fail, action => console.log(action.payload));
