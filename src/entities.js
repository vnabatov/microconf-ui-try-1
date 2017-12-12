import Kakka from 'kakka-core';
import uuid from 'uuid/v4';

const {entity, field} = Kakka({});

@entity({table: 'users'})
export class User {
    @field() id;
    @field() name;
    @field() email;
    @field() info;
    @field() cookie;

    constructor(name, email, info) {
        this.id = uuid();
        this.name = name;
        this.email = email;
        this.info = info;
        this.cookie = uuid();
    }
}

@entity({table: 'topics'})
export class Topic {
    @field() id;
    @field() title;
    @field() description;
    @field() tags;
    @field() banner;
    @field() votes;

    constructor(title, dscr, tags = [], banner = null) {
        this.id = uuid();
        this.title = title;
        this.description = dscr;
        this.tags = tags;
        this.banner = banner;
        this.votes = [];
    }
}
