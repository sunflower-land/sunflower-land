import mitt from "mitt";

/**
 * Global event bus using the 'mitt' library.
 * Allows communication between different parts of the application.
 * https://github.com/developit/mitt
 */

const eventBus = mitt();

export default eventBus;
