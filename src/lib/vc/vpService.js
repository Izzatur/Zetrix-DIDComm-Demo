export function generateVP(vc, jws) {

    const vp = {
        "@context": [
            "https://www.w3.org/2018/credentials/v1"
        ],
        type: [
            "VerifiablePresentation"
        ],
        credentialRequest: null,
        credentialParse: [
            {
                parseType: "sel-disclose-SM2",
                format: "jws"
            }
        ],
        verifiableCredential: [
            vc
        ],
        "proof": null
    }

    return vp;
}

