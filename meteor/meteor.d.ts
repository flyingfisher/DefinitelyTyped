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


    export interface ApplyOptions{
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

    export interface ConnectResult{
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
        onReconnect:Function;
    }
    /**
* Instead of using callbacks to notify you on changes, this is a reactive data source. You can use it in a template or computation to get realtime updates.
**/
    export interface ServerStatus{
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
    }
    export interface Cursor{

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

    export interface UpdateOptions{
        /**
* True to modify all matching documents; false to only modify one of the matching documents (the default).
**/
        multi: bool;
    }

    export interface FindOptions{
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

    export interface CreateOptions{
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
}