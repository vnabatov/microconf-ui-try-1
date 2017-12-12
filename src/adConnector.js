import ActiveDirectory from 'activedirectory';

const config = {
    url: 'ldap://directoryservice.wiley.com',
    baseDN: 'dc=wiley,dc=com'
};
const ad = new ActiveDirectory(config);

function tryAuth(username, password) {
    return new Promise((res, rej) => {
        ad.authenticate(username, password, (err, auth) => {
            if (err) {
                rej(err);
                return;
            }
            if (auth) {
                res();
            } else {
                rej();
            }
        });
    })
}

function getUser(username) {
    return new Promise((res, rej) => {
        ad.findUser(username, (err, user) => {
            if (err) {
                rej(err);
                return;
            }

            if (! user) rej('User: ' + username + ' not found.');
            else res(user);
        });
    })
}

export function ssoAuthUser(username, password) {
    return getUser(username)
        .catch(() => getUser(username.substr(0, username.indexOf("@"))))
        .then(user => {
            return tryAuth(user.userPrincipalName, password)
                .then(() => user)
        })
}
