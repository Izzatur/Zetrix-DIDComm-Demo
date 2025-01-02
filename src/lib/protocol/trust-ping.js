import { createUUID, getCurrentTimestampMillis } from '../../utils/util.js';


export function createPing(fromDid, toDid) {
    // Define the message object with the required fields
    const message = {
        id: createUUID(),
        typ: "application/didcomm-plain+json",
        type: "https://didcomm.org/trust-ping/2.0/ping",
        from: fromDid,
        body: {
            response_requested: true
        },
        to: [toDid],
        created_time: getCurrentTimestampMillis(),
    };

    // Convert the message object to a JSON string
    return JSON.stringify(message);
}

export function createPingResponse(fromDid, toDid, thid) {
    // Define the message object with the required fields
    const message = {
        id: createUUID(),
        typ: "application/didcomm-plain+json",
        type: "https://didcomm.org/trust-ping/2.0/ping-response",
        from: fromDid,
        body: {},
        to: [toDid],
        thid: thid,
        created_time: getCurrentTimestampMillis(),
    };

    // Convert the message object to a JSON string
    return JSON.stringify(message);
}