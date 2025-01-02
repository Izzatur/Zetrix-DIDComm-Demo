import { createUUID, getCurrentTimestampMillis } from '../../utils/util.js';


export function createQueries(fromDid, toDid) {
    // Define the message object with the required fields
    const message = {
        id: createUUID(),
        typ: "application/didcomm-plain+json",
        type: "https://didcomm.org/discover-features/2.0/queries",
        from: fromDid,
        body: {
            queries: [
                {
                    "feature-type": "protocol",
                    match: "https://didcomm.org/*"
                }
            ]
        },
        to: [toDid],
        created_time: getCurrentTimestampMillis(),
    };

    // Convert the message object to a JSON string
    return JSON.stringify(message);
}

export function createDisclose(fromDid, toDid, thid) {
    // Define the message object with the required fields
    const message = {
        id: createUUID(),
        typ: "application/didcomm-plain+json",
        type: "https://didcomm.org/discover-features/2.0/disclose",
        from: fromDid,
        body: {
            disclosures: [
                {
                    "feature-type": "protocol",
                    id: "https://didcomm.org/discover-features/2.0"
                },
                {
                    "feature-type": "protocol",
                    id: "https://didcomm.org/trust-ping/2.0"
                },
                {
                    "feature-type": "protocol",
                    id: "https://didcomm.org/basicmessage/2.0"
                },
            ]
        },
        to: [toDid],
        thid: thid,
        created_time: getCurrentTimestampMillis(),
    };

    // Convert the message object to a JSON string
    return JSON.stringify(message);
}
