import { createUUID, getCurrentTimestampMillis, encodeToBase64 } from '../../utils/util.js';
import { CONSTANTS } from '../../constants/constants.js';


export function createForward(did, recipientDid, jwe) {
    // Define the message object with the required fields
    const message = {
        id: createUUID(),
        typ: "application/didcomm-plain+json",
        type: "https://didcomm.org/routing/2.0/forward",
        from: did,
        body: {
            next: recipientDid
        },
        attachments: [
            {
                id: createUUID(),
                base64: encodeToBase64(jwe)
            }
        ],
        to: [CONSTANTS.MEDIATOR_DID],
        created_time: getCurrentTimestampMillis(),
    };

    // Convert the message object to a JSON string
    return JSON.stringify(message);
}
