//#region Meteor
module Meteor {
    //#region Core
    /**
    * True if running in client environment
    **/
    export var isClient: bool;

    /**
    * True if running in server environment
    **/
    export var isServer: bool;

    /**
    * Run code when a client or a server starts
    * @param func A function to run on startup
    **/
    export function startup(func: Function);

    /**
* Generate an absolute URL pointing to the application. The server reads from the ROOT_URL environment variable to determine where it is running. This is taken care of automatically for apps deployed with meteor deploy, but must be provided when using meteor bundle
    * @param path A path to append to the root URL. Do not include a leading "/".
    * @param options options
**/
    export function absoluteUrl(path?: string, options?: AbsoluteUrlOptions);

    /**
* Meteor.settings contains any deployment-specific options that were provided using the --settings option for meteor run or meteor deploy. If you provide the --settings option, Meteor.settings will be the JSON object in the file you specify. Otherwise, Meteor.settings will be an empty object. If the object contains a key named public, then Meteor.settings.public will also be available on the client.
**/
    export var settings: any;

    export interface AbsoluteUrlOptions {
        /**
    * Create an HTTPS URL
    **/
        secure?: bool;

        /**
    * Replace localhost with 127.0.0.1. Useful for services that don't recognize localhost as a domain name.
    **/
        replaceLocalhost?: bool;

        /**
    * Override the default ROOT_URL from the server environment. For example: "http://foo.example.com" 
    **/
        rootUrl?: string;
    }
    //#endregion

    //#region Publish and subscribe
    /**
* Publish a record set
    * @param name Name of the attribute set. If null, the set has no name, and the record set is automatically sent to all connected clients.
    * @param func Function called on the server each time a client subscribes. Inside the function, this is the publish handler object, described below. If the client passed arguments to subscribe, the function is called with the same arguments.
**/
    export function publish(name: string, func: Function);

    /**
* Subscribe to a record set. Returns a handle that provides stop() and ready() methods.
* @param name Name of the subscription. Matches name of server's publish() call.
* @param argsOrCallbacks args:Optional arguments passed to publisher function on server. callbacks: Optional. May include onError and onReady callbacks. If a function is passed instead of an object, it is interpreted as an onReady callback.
**/
    export function subscribe(name: string, ...argsOrCallbacks: any[]): PublishHandler;

    export interface PublishHandler {
        /**
    * Access inside the publish function. The id of the logged-in user, or null if no user is logged in.
    **/
        userId: any;

        /**
    * Call inside the publish function. Informs the subscriber that a document has been added to the record set.
    * @param collection The name of the collection that contains the new document.
    * @param id The new document's ID.
    * @param fields The fields in the new document. If _id is present it is ignored.
    **/
        added(collection: string, id: string, fields: Object);

        /**
    * Call inside the publish function. Informs the subscriber that a document in the record set has been modified.
    * @param collection  The name of the collection that contains the changed document.
    * @param id  The changed document's ID.
    * @param fields The fields in the document that have changed, together with their new values. If a field is not present in fields it was left unchanged; if it is present in fields and has a value of undefined it was removed from the document. If _id is present it is ignored.
    **/
        changed(collection: string, id: string, fields: Object);

        /**
    * Call inside the publish function. Informs the subscriber that a document has been removed from the record set.
    * @param The name of the collection that the document has been removed from.
    * @param id The ID of the document that has been removed.
    **/
        removed(collection: string, id: string);

        /**
    * Call inside the publish function. Informs the subscriber that an initial, complete snapshot of the record set has been sent. This will trigger a call on the client to the onReady callback passed to Meteor.subscribe, if any.
    **/
        ready();

        /**
    * Call inside the publish function. Registers a callback function to run when the subscription is stopped.
    * @param func The callback function
    **/
        onStop(func: Function);

        /**
    * Call inside the publish function. Stops this client's subscription, triggering a call on the client to the onError callback passed to Meteor.subscribe, if any. If error is not a Meteor.Error, it will be mapped to Meteor.Error(500, "Internal server error").
    **/
        error(error: any);

        /**
    * Call inside the publish function. Stops this client's subscription; the onError callback is not invoked on the client.
    **/
        stop();
    }
    //#endregion

    //#region methods
    /**
* Defines functions that can be invoked over the network by clients.
* @param methods Dictionary whose keys are method names and values are functions.
**/
    export function methods(methods: Object);

    /**
* Invokes a method passing any number of arguments.
* @param name Name of method to invoke
* @param paramsOrAsyncCallback params:Optional method arguments, asyncCallback : Optional callback, which is called asynchronously with the error or result after the method is complete. If not provided, the method runs synchronously if possible (see below).
**/
    export function call(name: string, ...paramsOrAsyncCallback: any[]);

    /**
* Invoke a method passing an array of arguments.
* @param name Name of method to invoke
* @param params Method arguments
* @param options options
* @param asyncCallback Optional callback; same semantics as in Meteor.call.
**/
    export function apply(name: string, params: Array, options?: ApplyOptions, asyncCallback?: Function);


    export interface ApplyOptions {
        /**
* (Client only) If true, don't send this method until all previous method calls have completed, and don't send any subsequent method calls until this one is completed.
**/
        wait?: bool;

        /**
* (Client only) This callback is invoked with the error or result of the method (just like asyncCallback) as soon as the error or result is available. The local cache may not yet reflect the writes performed by the method.
**/
        onResultReceived?: Function;
    }
    /**
* This class represents a symbolic error thrown by a method.
**/
    export class Error {
        /**
* This class represents a symbolic error thrown by a method.
* @param error A numeric error code, likely similar to an HTTP code (eg, 404, 500).
* @param reason Optional. A short human-readable summary of the error, like 'Not Found'.
* @param details Optional. Additional information about the error, like a textual stack trace.
**/
        constructor(error: number, reason?: string, details?: string);
    };

    export interface MethodHandler {
        /**
    * The id of the user that made this method call, or null if no user was logged in.
    **/
        userId: string;

        /**
    * Set the logged in user.
    * @param userId The value that should be returned by userId on this connection.
    **/
        setUserId(userId: string);

        /**
    * Access inside a method invocation. Boolean value, true if this invocation is a stub.
    **/
        isSimulation(): bool;

        /**
    * Call inside a method invocation. Allow subsequent method from this client to begin running in a new fiber.
    **/
        unblock();
    }
    //#endregion

    //#region Server connections
    /**
* Get the current connection status. A reactive data source.
**/
    export function status(): ServerStatus;

    /**
* Client Only. Force an immediate reconnection attempt if the client is not connected to the server.
* This method does nothing if the client is already connected.
**/
    export function reconnect();


    export function connect(url: string): ConnectResult;

    export interface ConnectResult {
        /**
* Subscribe to a record set. Returns a handle that provides stop() and ready() methods.
* @param name Name of the subscription. Matches name of server's publish() call.
* @param argsOrCallbacks args:Optional arguments passed to publisher function on server. callbacks: Optional. May include onError and onReady callbacks. If a function is passed instead of an object, it is interpreted as an onReady callback.
**/
        subscribe(name: string, ...argsOrCallbacks: any[]): PublishHandler;

        /**
* Invokes a method passing any number of arguments.
* @param name Name of method to invoke
* @param paramsOrAsyncCallback params:Optional method arguments, asyncCallback : Optional callback, which is called asynchronously with the error or result after the method is complete. If not provided, the method runs synchronously if possible (see below).
**/
        call(name: string, ...paramsOrAsyncCallback: any[]);

        /**
* Invoke a method passing an array of arguments.
* @param name Name of method to invoke
* @param params Method arguments
* @param options options
* @param asyncCallback Optional callback; same semantics as in Meteor.call.
**/
        apply(name: string, params: Array, options?: ApplyOptions, asyncCallback?: Function);

        /**
* Define client-only stubs for methods defined on the remote server. 
* @param methods Dictionary whose keys are method names and values are functions.
**/
        methods(methods: Object);

        /**
* Get the current connection status. 
**/
        status(): ServerStatus;

        /**
* Client Only. Force an immediate reconnection attempt if the client is not connected to the server.
* This method does nothing if the client is already connected.
**/
        reconnect();

        /**
*  Set this to a function to be called as the first step of reconnecting. This function can call methods which will be executed before any other outstanding methods. For example, this can be used to re-establish the appropriate authentication context on the new connection.
**/
        onReconnect: Function;
    }
    /**
* Instead of using callbacks to notify you on changes, this is a reactive data source. You can use it in a template or computation to get realtime updates.
**/
    export interface ServerStatus {
        /**
* True if currently connected to the server. If false, changes and method invocations will be queued up until the connection is reestablished.
**/
        connected: bool;

        /**
* Describes the current reconnection status. The possible values are connected (the connection is up and running), connecting (disconnected and trying to open a new connection), failed (permanently failed to connect; e.g., the client and server support different versions of DDP) and waiting (failed to connect and waiting to try to reconnect).
**/
        status: string;

        /**
* The number of times the client has tried to reconnect since the connection was lost. 0 when connected.
**/
        retryCount: number;

        /**
* The estimated time of the next reconnection attempt. To turn this into an interval until the next reconnection, use retryTime - (new Date()).getTime(). This key will be set only when status is waiting.
**/
        retryTime: number;

        /**
* If status is failed, a description of why the connection failed.
**/
        reason: string;
    }
    //#endregion

    //#region collections

    export class Collection {
        /**
* Constructor for a Collection
* @param name The name of the collection. If null, creates an unmanaged (unsynchronized) local collection.
* @param options options
**/
        constructor(name: string, options?: CreateOptions);

        /**
* Find the documents in a collection that match the selector.
* @param selector  The query. Mongo selector, or String
* @param options options
**/
        find(selector: any, options?: FindOptions): Cursor;

        /**
* Finds the first document that matches the selector, as ordered by sort and skip options.
* @param selector  The query. Mongo selector, or String
* @param options options
**/
        findOne(selector: any, options?: FindOptions): Object;

        /**
* Insert a document in the collection. Returns its unique _id.
* @param doc The document to insert. May not yet have an _id attribute, in which case Meteor will generate one for you.
* @param callback Optional. If present, called with an error object as the first argument and, if no error, the _id as the second.
**/
        insert(doc: Object, callback?: Function): any;

        /**
* Modify one or more documents in the collection
* @param selector Specifies which documents to modify
* @param modifier Specifies how to modify the documents
* @param options options
* @param callback Optional. If present, called with an error object as its argument.
**/
        update(selector: any, modifier: any, options?: UpdateOptions, callback?: Function);

        /**
* Remove documents from the collection
* @param selector Specifies which documents to remove
* @param callback Optional. If present, called with an error object as its argument.
**/
        remove(selector: any, callback?: Function);

        /**
* Allow users to write directly to this collection from client code, subject to limitations you define.
* @param options options
**/
        allow(options: AllowOptions);

        /**
* Override allow rules.
* @param options options
**/
        deny(options: DenyOptions);

        /**
* Create a Mongo-style ObjectID. If you don't specify a hexString, the ObjectID will generated randomly (not using MongoDB's ID construction rules).
        * the same API as the Node MongoDB driver ObjectID class
* It should be a nested class, Meteor.Collection.ObjectID, the below solution is just a work around. please refer to : http://stackoverflow.com/questions/13495107/any-way-to-nest-classes-in-typescript
        * @param hexString Optional. The 24-character hexadecimal contents of the ObjectID to create
**/
        static ObjectID(hexString?: string);
    }

    export interface Cursor {
        /**
* Call callback once for each matching document, sequentially and synchronously.
* @param callback Function to call.
**/
        forEach(callback: Function);

        /**
* Map callback over all matching documents. Returns an Array.
* @param callback  Function to call.
**/
        map(callback: Function);

        /**
* Return all matching documents as an Array.
**/
        fetch(): Array;

        /**
* Returns the number of documents that match a query.
**/
        count(): number;

        /**
* Resets the query cursor.
**/
        rewind();

        /**
* Watch a query. Receive callbacks as the result set changes.
* @param callback Functions to call to deliver the result set as it changes
**/
        observe(callbacks: ObserveCallbacks): LiveQueryHandler;


        observeChanges(callbacks: ObserveChangeCallbacks): LiveQueryHandler;

    }

    export interface LiveQueryHandler {
        stop();
    }

    export interface ObserveChangeCallbacks {
        added?: (id?: any, fields?: any) => any;
        addedBefore?: (id?: any, fields?: any, before?: any) => any;
        changed?: (id?: any, fields?: any) => any;
        movedBefore?: (id?: any, before?: any) => any;
        removed?: (id?: any) => any;
    }

    export interface ObserveCallbacks {
        added?: (document?: Object) => any;
        addedAt?: (document?: Object, atIndex?: number, before?: any) => any;
        changed?: (newDocument?: Object, oldDocument?: Object) => any;
        changedAt?: (newDocument?: Object, oldDocument?: Object, atIndex?: number) => any;
        removed?: (oldDocument?: Object) => any;
        removedAt?: (oldDocument?: Object, atIndex?: number) => any;
        movedTo?: (document?: Object, fromIndex?: number, toIndex?: number, before?: any) => any;
    }

    export interface DenyOptions {
        /**
* Functions that look at a proposed modification to the database and return true if it should be denied, even if an allow rule says otherwise.
**/
        insert?: Function;
        /**
* Functions that look at a proposed modification to the database and return true if it should be denied, even if an allow rule says otherwise.
**/
        update?: Function;
        /**
* Functions that look at a proposed modification to the database and return true if it should be denied, even if an allow rule says otherwise.
**/
        remove?: Function;
        /**
* Optional performance enhancement. Limits the fields that will be fetched from the database for inspection by your update and remove functions.
**/
        fetch?: string[];
        /**
* Overrides transform on the Collection. Pass null to disable transformation.
**/
        transform?: Function;
    }

    export interface AllowOptions {
        /**
* Functions that look at a proposed modification to the database and return true if it should be allowed.
**/
        insert?: Function;
        /**
* Functions that look at a proposed modification to the database and return true if it should be allowed.
**/
        update?: Function;
        /**
* Functions that look at a proposed modification to the database and return true if it should be allowed.
**/
        remove?: Function;
        /**
* Optional performance enhancement. Limits the fields that will be fetched from the database for inspection by your update and remove functions.
**/
        fetch?: string[];
        /**
* Overrides transform on the Collection. Pass null to disable transformation.
**/
        transform?: Function;
    }

    export interface UpdateOptions {
        /**
* True to modify all matching documents; false to only modify one of the matching documents (the default).
**/
        multi: bool;
    }

    export interface FindOptions {
        /**
* Sort order (default: natural order)
*        Sorts may be specified using your choice of several syntaxes:
*
* All of these do the same thing (sort in ascending order by
* key "a", breaking ties in descending order of key "b")
*
*[["a", "asc"], ["b", "desc"]]
*["a", ["b", "desc"]]
*{a: 1, b: -1}
*
*The last form will only work if your JavaScript implementation preserves the order of keys in objects. Most do, most of the time, but it's up to you to be sure.
**/
        sort?: any;

        /**
* Number of results to skip at the beginning
**/
        skip?: number;

        /**
* Maximum number of results to return
**/
        limit?: number;

        /**
* (Server only) Dictionary of fields to return or exclude.
**/
        fields?: any;

        /**
* (Client only) Default true; pass false to disable reactivity
**/
        reactive?: bool;

        /**
* Overrides transform on the Collection for this cursor. Pass null to disable transformation.
**/
        transform?: Function;
    }

    export interface CreateOptions {
        /**
* The Meteor connection that will manage this collection, defaults to Meteor if null. Unmanaged (name is null) collections cannot specify a manager.
**/
        manager?: Object;

        /**
*     The method of generating the _id fields of new documents in this collection. Possible values:
*
*        'STRING': random strings
*        'MONGO': random Meteor.Collection.ObjectID values
*
*    The default id generation technique is 'STRING'.
**/
        idGeneration?: string;

        /**
* An optional transformation function. Documents will be passed through this function before being returned from fetch or findOne, and before being passed to callbacks of observe, allow, and deny.
**/
        transform?: Function;
    }


    //#endregion

    //#region Accounts
    /**
* Get the current user record, or null if no user is logged in. A reactive data source.
**/
    export function user(): User;

    /**
* Get the current user id, or null if no user is logged in. A reactive data source.
**/
    export function userId(): any;

    /**
* A Meteor.Collection containing user documents.
**/
    export var users: Collection;

    /**
* Client Only. True if a login method (such as Meteor.loginWithPassword, Meteor.loginWithFacebook, or Accounts.createUser) is currently in progress. A reactive data source.
**/
    export function loggingIn(): bool;

    /**
* Client Only. Log the user out.
* @param callback Optional callback. Called with no arguments on success, or with a single Error argument on failure.
**/
    export function logout(callback?: Function);

    /**
* Log the user in with a password.
* @param user Either a string interpreted as a username or an email; or an object with a single key: email, username or id.
* @param password The user's password. This is not sent in plain text over the wire ¡ª it is secured with SRP.
* @param callback Optional callback. Called with no arguments on success, or with a single Error argument on failure.
**/
    export function loginWithPassword(user: any, password: string, callback?: Function);

    /**
* Log the user in using an external service.
* @param options options
* @param callback Optional callback. Called with no arguments on success, or with a single Error argument on failure.
**/
    export function loginWithFacebook(options?: LoginWithExternalServiceOptions, callback?: Function);

    /**
* Log the user in using an external service.
* @param options options
* @param callback Optional callback. Called with no arguments on success, or with a single Error argument on failure.
**/
    export function loginWithGithub(options?: LoginWithExternalServiceOptions, callback?: Function);

    /**
* Log the user in using an external service.
* @param options options
* @param callback Optional callback. Called with no arguments on success, or with a single Error argument on failure.
**/
    export function loginWithGoogle(options?: LoginWithExternalServiceOptions, callback?: Function);

    /**
* Log the user in using an external service.
* @param options options
* @param callback Optional callback. Called with no arguments on success, or with a single Error argument on failure.
**/
    export function loginWithMeetup(options?: LoginWithExternalServiceOptions, callback?: Function);

    /**
* Log the user in using an external service.
* @param options options
* @param callback Optional callback. Called with no arguments on success, or with a single Error argument on failure.
**/
    export function loginWithTwitter(options?: LoginWithExternalServiceOptions, callback?: Function);

    /**
* Log the user in using an external service.
* @param options options
* @param callback Optional callback. Called with no arguments on success, or with a single Error argument on failure.
**/
    export function loginWithWeibo(options?: LoginWithExternalServiceOptions, callback?: Function);

    export interface LoginWithExternalServiceOptions {
        /**
* A list of permissions to request from the user.
**/
        requestPermissions?: string[];

        /**
* If true, asks the user for permission to act on their behalf when offline. This stores an additional offline token in the services field of the user document. Currently only supported with Google.
**/
        requestOfflineToken?: bool;
    }

    export interface User {
        _id: string;
        username: string;
        emails: Email[];
        createdAt: Date;
        profile: BaseProfile;
        services: Object;
    }

    export interface Email {
        address: string;
        verified: bool;
    }

    export interface BaseProfile {
        name: string;
    }
    //#endregion

    //#region Templates
    /**
* Create DOM nodes that automatically update themselves as data changes.
* @param htmlFunc Function that generates HTML to be rendered. Called immediately and re-run whenever data changes. May also be a string of HTML instead of a function.
**/
    export function render(htmlFunc: any): HTMLElement;

    /**
* Create DOM nodes that automatically update themselves based on the results of a database query.
* @param observable Query cursor to observe as a reactive source of ordered documents.
* @param docFunc Render function to be called for each document.
* @param elseFunc Optional. Render function to be called when query is empty.
**/
    export function renderList(observable: Cursor, docFunc: (document: Object) => string, elseFunc?: () => string): HTMLElement;
    //#endregion

    //#region Timers
    /**
* Call a function in the future after waiting for a specified delay.
* @param func The function to run
* @param delay Number of milliseconds to wait before calling function
**/
    export function setTimeout(func: Function, delay: number): number;

    /**
* Call a function repeatedly, with a time delay between calls.
* @param func The function to run
* @param delay Number of milliseconds to wait between each function call.
**/
    export function setInterval(func: Function, delay: number): number;

    /**
* Cancel a function call scheduled by Meteor.setTimeout.
* @param id The handle returned by Meteor.setTimeout
**/
    export function clearTimeout(id: number);

    /**
* Cancel a repeating function call scheduled by Meteor.setInterval.
* @param id The handle returned by Meteor.setInterval
**/
    export function clearInterval(id: number);
    //#endregion

    //#region http
    module http {
        /**
* Perform an outbound HTTP request.
* @param method The HTTP method to use: "GET", "POST", "PUT", or "DELETE".
* @param url The URL to retrieve.
* @param options options
* @param asyncCallback Optional callback. If passed, the method runs asynchronously, instead of synchronously, and calls asyncCallback. On the client, this callback is required.
**/
        export function call(method: string, url: string, options?: HttpOptions, asyncCallback?: (error: any, result: HttpResult) => any): HttpResult;

        /**
* Send an HTTP GET request. Equivalent to Meteor.http.call("GET", ...).
**/
        export function get (url: string, options?: HttpOptions, asyncCallback?: (error: any, result: HttpResult) => any): HttpResult;
        /**
* Send an HTTP GET request. Equivalent to Meteor.http.call("POST", ...).
**/
        export function post (url: string, options?: HttpOptions, asyncCallback?: (error: any, result: HttpResult) => any): HttpResult;
        /**
* Send an HTTP GET request. Equivalent to Meteor.http.call("PUT", ...).
**/
        export function put(url: string, options?: HttpOptions, asyncCallback?: (error: any, result: HttpResult) => any): HttpResult;
        /**
* Send an HTTP DELETE request. Equivalent to Meteor.http.call("DELETE", ...). (Named del to avoid conflict with JavaScript's delete.)
**/
        export function del(url: string, options?: HttpOptions, asyncCallback?: (error: any, result: HttpResult) => any): HttpResult;

        export interface HttpOptions {
            /**
* String to use as the HTTP request body.
**/
            content?: string;
            /**
* JSON-able object to stringify and use as the HTTP request body. Overwrites content.
**/
            data?: Object;
            /**
* Query string to go in the URL. Overwrites any query string in url.
**/
            query?: string;
            /**
* Dictionary of request parameters to be encoded and placed in the URL (for GETs) or request body (for POSTs). If content or data is specified, params will always be placed in the URL.
**/
            params?: Object;
            /**
* HTTP basic authentication string of the form "username:password"
**/
            auth?: string;
            /**
* Dictionary of strings, headers to add to the HTTP request.
**/
            headers?: Object;
            /**
* Maximum time in milliseconds to wait for the request before failing. There is no timeout by default.
**/
            timeout?: number;
            /**
* If true, transparently follow HTTP redirects. Cannot be set to false on the client.
**/
            followRedirects?: bool;
        }

        export interface HttpResult {
            /**
* Numeric HTTP result status code, or null on error.
**/
            statusCode: number;
            /**
* The body of the HTTP response as a string.
**/
            content: string;
            /**
* If the response headers indicate JSON content, this contains the body of the document parsed as a JSON object.
**/
            data: Object;
            /**
* A dictionary of HTTP headers from the response.
**/
            headers: Object;
            /**
* Error object if the request failed. Matches the error callback parameter.
**/
            error: any;
        }
    }
    //#endregion
}
//#endregion

//#region Session
/**
* Client Only. Session provides a global object on the client that you can use to store an arbitrary set of key-value pairs. Use it to store things like the currently selected item in a list.
*
* What's special about Session is that it's reactive. If you call Session.get("currentList") from inside a template, the template will automatically be rerendered whenever Session.set("currentList", x) is called.
**/
module Session {
    /**
* Set a variable in the session. Notify any listeners that the value has changed (eg: redraw templates, and rerun any Deps.autorun computations, that called Session.get on this key.)
* @param key The key to set, eg, selectedItem
* @param value The new value for key
**/
    export function set (key: string, value: any);

    /**
* Set a variable in the session if it is undefined. Otherwise works exactly the same as Session.set.
* @param key The key to set, eg, selectedItem
* @param value The new value for key
    **/
    export function setDefault(key: string, value: any);

    /**
* Get the value of a session variable. If inside a reactive computation, invalidate the computation the next time the value of the variable is changed by Session.set. This returns a clone of the session value, so if it's an object or an array, mutating the returned value has no effect on the value stored in the session.
* @param key  The name of the session variable to return
**/
    export function get (key: string): any;

    /**
* Test if a session variable is equal to a value. If inside a reactive computation, invalidate the computation the next time the variable changes to or from the value.
    * @param key  The name of the session variable to test
    * @param value String, Number, Boolean, null, or undefined , The value to test against
**/
    export function equals(key: string, value: any);
}
//#endregion

//#region Accounts
module Accounts {
    //#region Accounts
    /**
* Set global accounts options.
* @param options options
**/
    export function config(options: ConfigOptions);

    export module ui {
        /**
* Configure the behavior of {{loginButtons}}.
* @param options options
**/
        export function config(options: UIConfigOptions);
        export interface UIConfigOptions {
            /**
* Which permissions to request from the user for each external service.
**/
            requestPermissions?: Object;
            /**
* To ask the user for permission to act on their behalf when offline, map the relevant external service to true. Currently only supported with Google. See Meteor.loginWithExternalService for more details.
**/
            requestOfflineToken?: Object;
            /**
* Which fields to display in the user creation form. One of 'USERNAME_AND_EMAIL', 'USERNAME_AND_OPTIONAL_EMAIL', 'USERNAME_ONLY', or 'EMAIL_ONLY' (default).
**/
            passwordSignupFields?: string;
        }
    }

    /**
* Set restrictions on new user creation.
* @param func Called whenever a new user is created. Takes the new user object, and returns true to allow the creation or false to abort.
**/
    export function validateNewUser(func: Function);

    /**
* Customize new user creation.
* @param func Called whenever a new user is created. Return the new user object, or throw an Error to abort the creation.
**/
    export function onCreateUser(func: Function);

    export interface ConfigOptions {
        /**
* New users with an email address will receive an address verification email.
**/
        sendVerificationEmail?: bool;
        /**
* Calls to createUser from the client will be rejected. In addition, if you are using accounts-ui, the "Create account" link will not be available.
**/
        forbidClientAccountCreation?: bool;
    }
    //#endregion

    //#region Passwords
    /**
* Create a new user.
* @param options options
* @param callback Client only, optional callback. Called with no arguments on success, or with a single Error argument on failure.
**/
    export function createUser(options: CreateUserOptions, callback?: Function): any;

    export interface CreateUserOptions {
        /**
* A unique name for this user.
**/
        username?: string;
        /**
* The user's email address.
**/
        email?: string;
        /**
* The user's password. This is not sent in plain text over the wire.
**/
        password?: string;
        /**
* The user's profile, typically including the name field.
**/
        profile?: Meteor.BaseProfile;
    }

    /**
* Change the current user's password. Must be logged in.
* @param oldPassword The user's current password. This is not sent in plain text over the wire.
* @param newPassword A new password for the user. This is not sent in plain text over the wire.
* @param callback Optional callback. Called with no arguments on success, or with a single Error argument on failure.
**/
    export function changePassword(oldPassword: string, newPassword: string, callback?: Function);

    /**
* Request a forgot password email.
* @param options options
* @param callback Optional callback. Called with no arguments on success, or with a single Error argument on failure.
**/
    export function forgotPassword(options: ForgetPasswordOptions, callback?: Function);
    export interface ForgetPasswordOptions {
        /**
* The email address to send a password reset link.
**/
        email?: string;
    }

    /**
* Reset the password for a user using a token received in email. Logs the user in afterwards.
* @param token The token retrieved from the reset password URL.
* @param newPassword A new password for the user. This is not sent in plain text over the wire.
* @param callback Optional callback. Called with no arguments on success, or with a single Error argument on failure.
**/
    export function resetPassword(token: string, newPassword: string, callback?: Function);

    /**
* Forcibly change the password for a user.
* @param userId The id of the user to update.
* @param newPassword A new password for the user.
**/
    export function setPassword(userId: string, newPassword: string);

    /**
* Marks the user's email address as verified. Logs the user in afterwards.
* @param token The token retrieved from the verification URL.
* @param callback Optional callback. Called with no arguments on success, or with a single Error argument on failure.
**/
    export function verifyEmail(token: string, callback?: Function);

    /**
* Send an email with a link the user can use to reset their password.
* @param userId The id of the user to send email to.
* @param email Optional. Which address of the user's to send the email to. This address must be in the user's emails list. Defaults to the first email in the list.
**/
    export function sendResetPasswordEmail(userId: string, email?: string);

    /**
* Send an email with a link the user can use to set their initial password.
* @param userId The id of the user to send email to.
* @param email Optional. Which address of the user's to send the email to. This address must be in the user's emails list. Defaults to the first email in the list.
**/
    export function sendEnrollmentEmail(userId: string, email?: string);

    /**
* Send an email with a link the user can use verify their email address.
* @param userId The id of the user to send email to.
* @param email Optional. Which address of the user's to send the email to. This address must be in the user's emails list. Defaults to the first unverified email in the list.
**/
    export function sendVerificationEmail(userId: string, email?: string);

    /**
* Options to customize emails sent from the Accounts system.
**/
    export var emailTemplates: EmailTemplates;
    export interface EmailTemplates {
        /**
* A String with an RFC5322 From address. By default, the email is sent from no-reply@meteor.com. If you wish to receive email from users asking for help with their account, be sure to set this to an email address that you can receive email at.
**/
        from: string;
        /**
* The public name of your application. Defaults to the DNS name of the application (eg: awesome.meteor.com).
**/
        siteName: string;
        /**
* An Object with two fields:
*    resetPassword.subject: A Function that takes a user object and returns a String for the subject line of a reset password email.
*    resetPassword.text: A Function that takes a user object and a url, and returns the body text for a reset password email.
**/
        resetPassword: SubjectAndText;
        /**
* An Object with two fields:
*    resetPassword.subject: A Function that takes a user object and returns a String for the subject line of a reset password email.
*    resetPassword.text: A Function that takes a user object and a url, and returns the body text for a reset password email.
**/
        enrollAccount: SubjectAndText;
        /**
* An Object with two fields:
*    resetPassword.subject: A Function that takes a user object and returns a String for the subject line of a reset password email.
*    resetPassword.text: A Function that takes a user object and a url, and returns the body text for a reset password email.
**/
        verifyEmail: SubjectAndText;
    }
    export interface SubjectAndText {
        /**
* A Function that takes a user object and returns a String for the subject line of a reset password email.
**/
        subject: (user: Meteor.User) => string;
        /**
*  A Function that takes a user object and a url, and returns the body text for a reset password email.
**/
        text: (user: Meteor.User, url: string) => string;
    }
    //#endregion
}
//#endregion

//#region Templates
/**
* A template that you declare as <template name="foo"> ... </template> can be accessed as the function Template.foo, which returns a string of HTML when called.
*
*The same template may occur many times on the page, and these occurrences are called template instances. Template instances have a life cycle of being created, put into the document, and later taken out of the document and destroyed. Meteor manages these stages for you, including determining when a template instance has been removed or replaced and should be cleaned up. You can associate data with a template instance, and you can access its DOM nodes when it is in the document.
*
*Additionally, Meteor will maintain a template instance and its state even if its surrounding HTML is re-rendered into new DOM nodes. As long as the structure of template invocations is the same, Meteor will not consider any instances to have been created or destroyed. You can request that the same DOM nodes be retained as well using preserve and constant.
*
*There are a number of callbacks and directives that you can specify on a named template and that apply to all instances of the template. They are described below.
**/

interface ITemplate {
    /**
* Call a template function by name to produce HTML.
* @param data Optional. The data context object with which to call the template.
**/
    (data?: Object): any;

    /**
* Provide a callback when an instance of a template is rendered.
**/
    rendered: Function;

    /**
* Provide a callback when an instance of a template is created.
**/
    created: Function;

    /**
* Provide a callback when an instance of a template is destroyed.
**/
    destroyed: Function;

    /**
* Specify event handlers for this template.
    * @param eventMap Event handlers to associate with this template.
**/
    events(eventMap: Object);

    /**
* Specify template helpers available to this template.
* @param helpers Dictionary of helper functions by name.
**/
    helpers(helpers: Object);

    /**
* Specify rules for preserving individual DOM elements on re-render.
    * @param selectors Array of CSS selectors that each match at most one element, such as ['.thing1', '.thing2'], or, alternatively, a dictionary of selectors and node-labeling functions (see below).
**/
    preserve(selectors: any);
}

interface TemplateInstance {
    /**
* Find all elements matching selector in this template instance.
* @param selector The CSS selector to match, scoped to the template contents.
**/
    findAll(selector: string): HTMLElement[];

    /**
* Find one element matching selector in this template instance.
* @param selector The CSS selector to match, scoped to the template contents.
**/
    find(selector: string): HTMLElement;

    /**
* The first top-level DOM node in this template instance.
**/
    firstNode: HTMLElement;

    /**
* The last top-level DOM node in this template instance.
**/
    lastNode: HTMLElement;

    /**
* The data context of this instance's latest invocation.
**/
    data: any;
}

declare var Template: any;

//#endregion

//#region Event
interface MeteorEvent {
    /**
* The event's type, such as "click", "blur" or "keypress".
**/
    type: string;
    /**
* The element that originated the event.
**/
    target: HTMLElement;
    /**
* The element currently handling the event. This is the element that matched the selector in the event map. For events that bubble, it may be target or an ancestor of target, and its value changes as the event bubbles.
**/
    currentTarget: HTMLElement;
    /**
* For mouse events, the number of the mouse button (1=left, 2=middle, 3=right). For key events, a character or key code.
**/
    which: number;
    /**
* Prevent the event from propagating (bubbling) up to other elements. Other event handlers matching the same element are still fired, in this and other event maps.
**/
    stopPropagation();
    /**
* Prevent all additional event handlers from being run on this event, including other handlers in this event map, handlers reached by bubbling, and handlers in other event maps.
**/
    stopImmediatePropagation();
    /**
* Prevents the action the browser would normally take in response to this event, such as following a link or submitting a form. Further handlers are still called, but cannot reverse the effect.
**/
    preventDefault();
    /**
* Returns whether stopPropagation() has been called for this event.
**/
    isPropagationStopped(): bool;
    /**
* Returns whether stopImmediatePropagation() has been called for this event.
**/
    isImmediatePropagationStopped(): bool;
    /**
* Returns whether preventDefault() has been called for this event.
**/
    isDefaultPrevented(): bool;
}
//#endregion

//#region Deps
/**
* Meteor has a simple dependency tracking system which allows it to automatically rerun templates and other computations whenever Session variables, database queries, and other data sources change.
*
*Unlike most other systems, you don't have to manually declare these dependencies ¡ª it "just works". The mechanism is simple and efficient. When you call a function that supports reactive updates (such as a database query), it automatically saves the current Computation object, if any (representing, for example, the current template being rendered). Later, when the data changes, the function can "invalidate" the Computation, causing it to rerun (rerendering the template).
*
*Applications will find Deps.autorun useful, while more advanced facilities such as Deps.Dependency and onInvalidate callbacks are intended primarily for package authors implementing new reactive data sources.
**/
module Deps {
    /**
* Run a function now and rerun it later whenever its dependencies change. Returns a Computation object that can be used to stop or observe the rerunning.
* @param runFunc The function to run. It receives one argument: the Computation object that will be returned.
**/
    export function autorun(runFunc: (computation?: Computation) => any): Computation;

    /**
* Process all reactive updates immediately and ensure that all invalidated computations are rerun.
**/
    export function flush();

    /**
* Run a function without tracking dependencies.
* @param func A function to call immediately.
**/
    export function nonreactive(func: Function);

    /**
* True if there is a current computation, meaning that dependencies on reactive data sources will be tracked and potentially cause the current computation to be rerun.
**/
    export var active: bool;

    /**
* The current computation, or null if there isn't one. The current computation is the Deps.Computation object created by the innermost active call to Deps.autorun, and it's the computation that gains dependencies when reactive data sources are accessed.
**/
    export var currentComputation: Computation;

    /**
* Registers a new onInvalidate callback on the current computation (which must exist), to be called immediately when the current computation is invalidated or stopped.
* @param callback A callback function that will be invoked as func(c), where c is the computation on which the callback is registered.
**/
    export function onInvalidate(callback: (computation?: Computation) => any);

    /**
* Schedules a function to be called during the next flush, or later in the current flush if one is in progress, after all invalidated computations have been rerun. The function will be run once and not on subsequent flushes unless afterFlush is called again.
* @param callback A function to call at flush time.
**/
    export function afterFlush(callback: Function);

    /**
*Declares that the current computation depends on dependency. The current computation, if there is one, becomes a dependent of dependency, meaning it will be invalidated and rerun the next time dependency changes.
*
*Returns true if this results in dependency gaining a new dependent (or false if this relationship already exists or there is no current computation).
*
* @param dependency The dependency for this computation to depend on.
**/
    export function depend(dependency: Dependency): bool;

    /**
* A Dependency represents an atomic unit of reactive data that a computation might depend on. Reactive data sources such as Session or Minimongo internally create different Dependency objects for different pieces of data, each of which may be depended on by multiple computations. When the data changes, the computations are invalidated.
**/
    export interface Dependency {
        /**
* Invalidate all dependent computations immediately and remove them as dependents.
**/
        changed();

        /**
* Adds computation as a dependent of this Dependency, recording the fact that the computation depends on this Dependency.
*
*Returns true if the computation was not already a dependent of this Dependency.
*
* @param computation The computation to add, or null to use the current computation (in which case there must be a current computation).
**/
        addDependent(computation: Computation): bool;

        /**
* True if this Dependency has one or more dependent Computations, which would be invalidated if this Dependency were to change.
**/
        hasDependents(): bool;
    }
    export interface Computation {
        /**
* Prevents this computation from rerunning.
**/
        stop();

        /**
* Invalidates this computation so that it will be rerun.
**/
        invalidate();

        /**
* Registers callback to run when this computation is next invalidated, or runs it immediately if the computation is already invalidated. The callback is run exactly once and not upon future invalidations unless onInvalidate is called again after the computation becomes valid again.
* @param callback Function to be called on invalidation. Receives one argument, the computation that was invalidated.
**/
        onInvalidate(callback: (computation?: Computation) => any);

        /**
* True if this computation has been stopped.
**/
        stopped: bool;

        /**
* True if this computation has been invalidated (and not yet rerun), or if it has been stopped.
**/
        invalidated: bool;

        /**
* True during the initial run of the computation at the time Deps.autorun is called, and false on subsequent reruns and at other times.
**/
        firstRun: bool;
    }
}

//#endregion

//#region EJSON
module EJSON {
    /**
* Parse a string into an EJSON value. Throws an error if the string is not valid EJSON.
* @param str A string to parse into an EJSON value.
**/
    export function parse(str: string): any;

    /**
* Serialize a value to a string.
*
*For EJSON values, the serialization fully represents the value. For non-EJSON values, serializes the same way as JSON.stringify.
*
* @param val A value to stringify.
**/
    export function stringify(val: any): string;

    /**
* Deserialize an EJSON value from its plain JSON representation.
    * @param val A value to deserialize into EJSON.
**/
    export function fromJSONValue(val: any): any;

    /**
* Serialize an EJSON-compatible value into its plain JSON representation.
* @param val A value to serialize to plain JSON.
**/
    export function toJSONValue(val: any): any;

    /**
* Return true if a and b are equal to each other. Return false otherwise. Uses the equals method on a if present, otherwise performs a deep comparison.
* @param a EJSON-compatible object 
* @param b EJSON-compatible object 
**/
    export function equals(a: any, b: any): bool;

    /**
* Return a deep copy of val.
* @param val A value to copy.
**/
    export function clone(val: any): any;

    /**
* Allocate a new buffer of binary data that EJSON can serialize.
* @param size The number of bytes of binary data to allocate.
**/
    export function newBinary(size: number): any;

    /**
* Add a custom datatype to EJSON.
* @param name A tag for your custom type; must be unique among custom data types defined in your project, and must match the result of your type's typeName method.
* @param factory A function that deserializes a JSON-compatible value into an instance of your type. This should match the serialization performed by your type's toJSONValue method.
**/
    export function addType(name: string, factory: () => EJSONTypeFactory);

    export interface EJSONTypeFactory {
        /**
* Return a value r such that this.equals(r) is true, and modifications to r do not affect this and vice versa.
**/
        clone(): any;

        /**
* Return true if other has a value equal to this; false otherwise.
* @param  other Another object to compare this to.
**/
        equals(other: any): bool;

        /**
* Return the tag used to identify this type. This must match the tag used to register this type with EJSON.addType.
**/
        typeName(): string;

        /**
* Serialize this instance into a JSON-compatible value.
**/
        toJSONValue(): any;
    }
}
//#endregion

//#region Email
module Email{
    /**
* Send an email. Throws an Error on failure to contact mail server or if mail server returns an error.
* @param options options
**/
    export function send(options: EmailOptions): any;

    export interface EmailOptions{
        /**
* RFC5322 "From:" address (required)
**/
        from: string;
        /**
* String or Array of strings  .RFC5322 "To:" address[es]
**/
        to?: any;
        /**
* RFC5322 "Cc:" address[es]
**/
        cc?: any;
        /**
* RFC5322 "Bcc:" address[es]
**/
        bcc?: any;
        /**
* RFC5322 "Reply-To:" address[es]
**/
        replyTo?: any;
        /**
* RFC5322 "Subject:" line
**/
        subject?: string;
        /**
* RFC5322 mail body (plain text)
**/
        text?: string;
        /**
* RFC5322 mail body (HTML)
**/
        html?: string;
    }
}
//#endregion