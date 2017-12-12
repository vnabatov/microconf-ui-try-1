import React, {Component} from 'react';
import { Route, Switch } from 'react-router-dom';
import Kakka from 'kakka-web';
import './style.css';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import DatePicker from 'material-ui/DatePicker';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import {
    apiTryAuth, apiAuthFail,
    apiVoteTopic, apiUnvoteTopic
} from './actions';

class Vote extends Component {
    render() {
        return (
            <IconButton onClick={() => this.props.doVote()}>
                <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z"/>
                </svg>
            </IconButton>
        )
    }
}

class Unvote extends Component {
    render() {
        return (
            <IconButton onClick={() => this.props.doUnvote()}>
                <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v1.91l.01.01L1 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/>
            </svg>
            </IconButton>
        )
    }
}

@Kakka.React.Container(
    {
        doVote: apiVoteTopic,
        doUnvote: apiUnvoteTopic
    },
    Kakka.switcher({}),
    state => ({user: state.user})
)
class TopicCard extends Component {
    render() {
        const {topic, user} = this.props;
        const counter = topic.votes.length;
        const alreadyVoted = !!topic.votes.filter(uid => uid === user.id).length;
        return (
            <Card>
                <CardTitle title={topic.title} />
                {
                    topic.description 
                        ? <CardText>{topic.description}</CardText>
                        : null
                }
                <CardActions>
                    {
                        !alreadyVoted ?
                            <div className="layoutLeft">
                                <Vote doVote={() => this.props.doVote(topic.id)} />
                            </div>
                        : null
                    }
                    {
                        alreadyVoted ?
                            <div className="layoutLeft">
                                <Unvote doUnvote={() => this.props.doUnvote(topic.id)} />
                            </div>
                        : null
                    }
                    <div className="layoutRight">
                        <div className="voteCounter">votes: {counter}</div>
                    </div>
                    <div className="layoutClear"></div>
                </CardActions>
            </Card>
        )
    }
}

class TopicEditView extends Component {
    render() {
        const {topic} = this.props;
        return (
            <div>
                <TextField id="topic-title" defaultValue={topic.title} /><br />
                <TextField id="topic-description" defaultValue={topic.description} /><br />
            </div>
        )
    }
}

@Kakka.React.Container(
    {
        topics: []
    },
    Kakka.switcher({}),
    state => ({topics: state.topics})
)
class TopicListView extends Component {
    topicView(topic) {
        return (
            <div key={topic.id}
                style={{
                    margin: 20,

                }}
            >
                <TopicCard topic={topic} />
            </div>
        )
    }
    render() {
        const {topics} = this.props;
        return (
            <div>
                {
                    topics.map(this.topicView)
                }
            </div>
        )
    }
}

@Kakka.React.Container(
    {
        fail: false,
        inProgress: false,
        doLogin: apiTryAuth
    },
    Kakka.switcher({
        [apiAuthFail]: () => ({fail: true, inProgress: false}),
        [apiTryAuth]: () => ({fail: false, inProgress: true})
    })
)
class LoginView extends Component {
    render() {
        const {fail, inProgress} = this.props;
        const style = {
            margin: 12
        };
        return (
            <div style={{
                width: 256,
                margin: 'auto',
                marginTop: 75
            }}>
                <TextField
                    hintText="Login Field"
                    ref="login"
                /><br />
                <TextField
                    hintText="Password Field"
                    type="password"
                    ref="pwd"
                /><br />

                <RaisedButton label="login" primary={true} style={style} onClick={() =>
                    this.props.doLogin({
                        login: this.refs.login.getValue(),
                        pwd: this.refs.pwd.getValue()
                    })
                } />

                <div style={{
                    paddingTop: 30,
                    textAlign: 'center'
                }}>
                    {
                        fail ?
                            <div style={{color: 'red'}}>incorrect login or password</div>
                        : null
                    }
                    {
                        inProgress ?
                            <div style={{fontSize: 13}}>try to auth in wiley ActiveDirectory service</div>
                        : null
                    }
                </div>
            </div>
        )
    }
}

class WelcomeView extends Component {
    render() {
        return (
            <div style={{
                margin: 'auto',
                width: 300,
                marginTop: 170,
                textAlign: 'center',
            }}>
                <h1>Microconf</h1>
                <div>loading ...</div>
            </div>
        )
    }
}

class AppBarUserTextName extends Component {
    render() {
        return (
            <div style={{
                color: 'floralwhite',
                padding: 16,
                fontWeight: 'bold'
            }}>
                {this.props.children}
            </div>
        )
    }
}

@Kakka.React.Container(
    {},
    Kakka.switcher({}),
    state => ({user: state.user})
)
class MainLayout extends Component {
    render() {
        const {user} = this.props;

        return (
            <div>
                <AppBar
                    title="Microconf"
                    showMenuIconButton={false}
                    iconElementRight={<AppBarUserTextName>{user.name}</AppBarUserTextName>}
                >
                </AppBar>
                {this.props.children}
            </div>
        )
    }
}

@Kakka.React.Root
@Kakka.React.Container(
    {},
    Kakka.switcher({}),
    state => ({state})
)
class RootView extends Component {
    render() {
        const {state} = this.props;
        const showWelcomeView = !(state && state.initAuthCheck); // todo, state init value issue
        const user = state && state.user;
        return (
            <MuiThemeProvider>
                <div>
                    {
                        showWelcomeView 
                            ? <WelcomeView />
                            : user
                                ? <MainLayout><TopicListView /></MainLayout>
                                : <LoginView />
                    }
                </div>
            </MuiThemeProvider>
        )
    }
}

/*

<div>{JSON.stringify(state)}</div>

                    <Switch>
                        <Route exact path='/'>
                            <TopicListView topics={this.props.topics} />
                        </Route>
                        <Route exact path='/auth' component={LoginView} />
                    </Switch>
*/