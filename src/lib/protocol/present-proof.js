import { createUUID, getCurrentTimestampMillis, encodeToBase64 } from '../../utils/util.js';
import { CONSTANTS } from '../../constants/constants.js';


export function createProposePresentation(did, to, jwe) {
    // Define the message object with the required fields
    const message = {
        id: createUUID(),
        typ: "application/didcomm-plain+json",
        type: "https://didcomm.org/present-proof/2.0/request-presentation",
        from: did,
        body: {
            goal_code: 'identity_verification',
            comment: comment,
            presentation_definition: {
                "id": "holder-suggested-definition",
                "input_descriptors": [
                    {
                        "id": "identity_credential",
                        "name": "Identity Credential",
                        "schema": [
                            {
                                "uri": "https://www.w3.org/2018/credentials#VerifiableCredential",  // schema is VC template
                            }
                        ]
                    }
                ]
            }
        },

        to: to,
        created_time: getCurrentTimestampMillis(),
    };

    // Convert the message object to a JSON string
    return JSON.stringify(message);
}


export function createRequestPresentation(did, to, jwe) {
    // Define the message object with the required fields
    const message = {
        id: createUUID(),
        typ: "application/didcomm-plain+json",
        type: "https://didcomm.org/present-proof/2.0/request-presentation",
        from: did,
        body: {
            // goal_code: 'identity_verification',
            // comment: comment,
            // will_confirm: isWillConfirm,
            // presentation_definition: {
            //     "id": "verifier-presentation-definition",
            //     "input_descriptors": [
            //         {
            //             "id": "identity_credential",
            //             "name": "Identity Credential",
            //             "purpose": "To verify your identity.",
            //             "schema": [
            //                 {
            //                     "uri": "https://www.w3.org/2018/credentials#VerifiableCredential", // schema is template
            //                 }
            //             ],
            //             "constraints": {
            //                 "fields": [
            //                     {
            //                         "path": [
            //                             "$.issuer",
            //                             "$.vc.issuer",
            //                             "$.iss"
            //                         ],
            //                         "purpose": "We can only verify bank accounts if they are attested by a trusted bank, auditor, or regulatory authority.",
            //                         "filter": {
            //                             "type": "string",
            //                             "pattern": "did:zid:"
            //                         }
            //                     },
            //                     {
            //                         "path": ["$.credentialSubject.name"],
            //                         "purpose": "The name must be present in the credential."
            //                     },
            //                     {
            //                         "path": ["$.credentialSubject.email"],
            //                         "purpose": "The email must be present in the credential."
            //                     }
            //                 ]
            //             }
            //         }
            //     ]
            // }
        },
        attachments: [
          {
            "id": "ed7d9b1f-9eed-4bde-b81c-3aa7485cf947",
            "media_type": "application/json",
            "format": "dif/presentation-exchange/definitions@v1.0",
            "data": {
              "json": {
                "options": {
                  "challenge": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
                  "domain": "4jt78h47fh47"
                },
                "presentation_definition": {
                  "id": "32f54163-7166-48f1-93d8-ff217bdb0654",
                  "frame": {
                    "@context": [
                      "https://www.w3.org/2018/credentials/v1",
                      "https://w3id.org/vaccination/v1",
                      "https://w3id.org/security/suites/bls12381-2020/v1"
                    ],
                    "type": [
                      "VerifiableCredential",
                      "VaccinationCertificate"
                    ],
                    "credentialSubject": {
                      "@explicit": true,
                      "type": [
                        "VaccinationEvent"
                      ],
                      "batchNumber": {},
                      "countryOfVaccination": {}
                    }
                  },
                  "input_descriptors": [
                    {
                      "id": "vaccination_input",
                      "name": "Vaccination Certificate",
                      "constraints": {
                        "fields": [
                          {
                            "path": [
                              "$.credentialSchema.id", "$.vc.credentialSchema.id"
                            ],
                            "filter": {
                              "type": "string",
                              "const": "https://w3id.org/vaccination/#VaccinationCertificate"
                            }
                          },
                          {
                            "path": [
                              "$.credentialSubject.batchNumber"
                            ],
                            "filter": {
                              "type": "string"
                            }
                          },
                          {
                            "path": [
                              "$.credentialSubject.countryOfVaccination"
                            ],
                            "filter": {
                              "type": "string"
                            }
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            }
          }
        ],
        to: to,
        created_time: getCurrentTimestampMillis(),
    };

    // Convert the message object to a JSON string
    return JSON.stringify(message);
}

export function createPresentation(did, to, jwe) {
    // Define the message object with the required fields
    const message = {
        id: createUUID(),
        typ: "application/didcomm-plain+json",
        type: "https://didcomm.org/present-proof/2.0/presentation",
        from: did,
        status: "ok",
        body: {
            goal_code: 'identity_verification',
            comment: comment,
        },
        attachments: [
            {
                id: "<attachment identifier>",
                media_type: "application/json",
                format: "<format-and-version>",
                data: {
                    sha256: "f8dca1d901d18c802e6a8ce1956d4b0d17f03d9dc5e4e1f618b6a022153ef373",
                    links: ["https://ibb.co/TtgKkZY"]
                }
            }
        ],
        to: to,
        thid: thid,
        created_time: getCurrentTimestampMillis(),
    };

    // Convert the message object to a JSON string
    return JSON.stringify(message);
}

export function createAck(did, to, jwe) {
    // Define the message object with the required fields
    const message = {
        id: createUUID(),
        typ: "application/didcomm-plain+json",
        type: "https://didcomm.org/present-proof/2.0/ack",
        from: did,
        status: "ok",
        body: {
            comment: comment,
        },
        to: to,
        thid: thid,
        created_time: getCurrentTimestampMillis(),
    };

    // Convert the message object to a JSON string
    return JSON.stringify(message);
}
