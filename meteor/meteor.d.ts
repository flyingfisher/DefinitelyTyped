interface Meteor {
    /**
    * True if running in client environment
    **/
    isClient: bool;
    /**
    * True if running in server environment
    **/
    isServer: bool;
    startup(func: Function);
    absoluteUrl(path?: string, options?: AbsoluteUrlOptions);
}

interface AbsoluteUrlOptions {
    secure?: bool;
    replaceLocalhost?: bool;
    rootUrl?: string;
}

declare var Meteor: Meteor;