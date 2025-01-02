import { createUUID, getCurrentTimestampMillis } from '../../utils/util.js';
import { CONSTANTS } from '../../constants/constants.js';


export function createLiveDeliveryChange(did, isLive) {
    // Define the message object with the required fields
    const message = {
        id: createUUID(),
        typ: "application/didcomm-plain+json",
        type: "https://didcomm.org/messagepickup/3.0/live-delivery-change",
        from: did,
        body: {
            live_delivery: isLive
        },
        to: [CONSTANTS.MEDIATOR_DID],
        created_time: getCurrentTimestampMillis(),
    };

    // Convert the message object to a JSON string
    return JSON.stringify(message);
}
