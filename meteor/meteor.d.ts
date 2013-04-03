module Meteor {
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
        wait: bool;

        /**
* (Client only) This callback is invoked with the error or result of the method (just like asyncCallback) as soon as the error or result is available. The local cache may not yet reflect the writes performed by the method.
**/
        onResultReceived: Function;
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
}