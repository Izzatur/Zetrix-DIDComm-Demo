import { createUUID, getCurrentTimestampMillis, encodeToBase64 } from '../../utils/util.js';

export function createAck(did, to, jwe) {
    // Define the message object with the required fields
    const message = {
        id: createUUID(),
        typ: "application/didcomm-plain+json",
        type: "https://didcomm.org/report-problem/2.0/problem-report",
        from: did,
        body: {
            code: code,
            comment: comment,
            description: {
                en: "One or more fields in the Verifiable Presentation failed validation.",
                code: "failed_constraints"
            },
            details: {
                field_errors: [
                    {
                        field: "$.credentialSubject.name",
                        error: "Missing required field"
                    },
                    {
                        field: "$.credentialSubject.email",
                        error: "Invalid email format"
                    }
                ],
                received_presentation_id: "presentation-78901"
            }
        },
        to: to,
        thid: thid,
        created_time: getCurrentTimestampMillis(),
    };

    // Convert the message object to a JSON string
    return JSON.stringify(message);
}
