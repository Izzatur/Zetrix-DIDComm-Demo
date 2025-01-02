import { createMediateRequest } from './protocol/coordinate-mediation';
import { createLiveDeliveryChange } from './protocol/message-pickup';
import { createQueries } from './protocol/discover-feature';
import { createForward } from './protocol/routing';
import { createBasicMessage } from './protocol/basicmessage';
import { createPing } from './protocol/trust-ping';
import { packAnonCrypt, packAuthCrypt } from './packMessage'
import { unpackAuthCrypt } from './unpackMessage'
import { CONSTANTS } from "@/constants/constants";
import { mapMutations } from "vuex";
import websocket from '@/utils/websocket';
import { setRecipientMessage } from '../lib/messageHandler'

export default {
    mixins: [websocket],
    data() {
        return {
            didData: sessionStorage.getItem("didData"),
            did: null,
            errorMsg: null,
        };
    },

    updated() {
    },

    methods: {
        ...mapMutations([
            "setMsgWrapper",
            "addToMsgWrapper"
        ]),

        async checkDid() {
            if (this.didData == null) {
                try {
                    const response = await this.$store.dispatch('zid/createZid');
                    if (response != null) {
                        const didData = {
                            id: response.id,
                            address: response.ztxAddress,
                            privateKey: response.ztxPrivateKey,
                        };
                        this.didData = JSON.stringify(didData)
                        this.did = didData.id
                        sessionStorage.setItem("didData", this.didData);
                        await this.mediateRequest()
                    }
                } catch (error) {
                    console.error('Error creating did:', error);
                    return null;
                }
            } else {
                this.did = JSON.parse(this.didData).id
                await this.mediateRequest()
            }
        },

        getMediatorDid() {
            this.$store
                .dispatch('zid/resolveMediator')
                .then((response) => {
                    if (response != null) {
                        console.log(response);
                    }
                })
        },

        async mediateRequest() {
            const message = createMediateRequest(this.did)
            this.$store.dispatch("addLogMessage", 'Establishing mediation with mediator: ' + CONSTANTS.MEDIATOR_DID);
            this.$store.dispatch("addLogMessage", 'DID Generated: ' + this.did);
            this.$store.dispatch("addSentMessage", message);
            const didDataJson = JSON.parse(this.didData)
            const skid = didDataJson.id + '#key-2'
            const jwe = packAuthCrypt(didDataJson.privateKey, CONSTANTS.MEDIATOR_PUB_KEY, skid, CONSTANTS.MEDIATOR_KID, message)
            const response = await this.sendMessageDidComm(jwe)
            this.$store.dispatch("addLogMessage", 'Message sent successfully.');
            if (response && response.recipients && response.iv && response.ciphertext) {
                // unpack message
                const respMessage = unpackAuthCrypt(response, didDataJson.privateKey, CONSTANTS.MEDIATOR_PUB_KEY)
                this.$store.dispatch("addReceivedMessage", respMessage);
                if (respMessage.type.includes('mediate-grant')) {
                    this.connectToWebsocket()
                }
            }
            else if (response && response.id && response.type && response.body) {
                // problem report
                this.$store.dispatch("addReceivedMessage", response);
            } else {
                this.$store.dispatch("addLogMessage", 'Failed to get response from mediator.');
            }
        },

        async queryDiscoverFeature(recipientDid, recipientPubKey) {
            const didDataJson = JSON.parse(sessionStorage.getItem("didData"))
            const message = createQueries(didDataJson.id, recipientDid)
            this.$store.dispatch("addSentMessage", message);
            const recipientMsg = setRecipientMessage(JSON.parse(message), recipientDid, 'Sent')
            this.$store.dispatch("addRecipientMessage", recipientMsg);
            const skid = didDataJson.id + '#key-2'
            const kid = recipientDid + '#key-2'

            const jwe = packAuthCrypt(didDataJson.privateKey, recipientPubKey, skid, kid, message)
            await this.forwardMessage(recipientDid, jwe)
        },

        async sendBasicMessage(recipientDid, recipientPubKey, content) {
            const didDataJson = JSON.parse(sessionStorage.getItem("didData"))
            const message = createBasicMessage(didDataJson.id, recipientDid, content)
            this.$store.dispatch("addSentMessage", message);
            const recipientMsg = setRecipientMessage(JSON.parse(message), recipientDid, 'Sent')
            this.$store.dispatch("addRecipientMessage", recipientMsg);
            const skid = didDataJson.id + '#key-2'
            const kid = recipientDid + '#key-2'

            const jwe = packAuthCrypt(didDataJson.privateKey, recipientPubKey, skid, kid, message)
            await this.forwardMessage(recipientDid, jwe)
        },

        async sendPing(recipientDid, recipientPubKey) {
            const didDataJson = JSON.parse(sessionStorage.getItem("didData"))
            const message = createPing(didDataJson.id, recipientDid)
            this.$store.dispatch("addSentMessage", message);
            const recipientMsg = setRecipientMessage(JSON.parse(message), recipientDid, 'Sent')
            this.$store.dispatch("addRecipientMessage", recipientMsg);
            const skid = didDataJson.id + '#key-2'
            const kid = recipientDid + '#key-2'

            const jwe = packAuthCrypt(didDataJson.privateKey, recipientPubKey, skid, kid, message)
            await this.forwardMessage(recipientDid, jwe)
        },

        async forwardMessage(recipientDid, recipientJwe) {
            const didDataJson = JSON.parse(sessionStorage.getItem("didData"))
            const message = createForward(didDataJson.id, recipientDid, JSON.stringify(recipientJwe))
            this.$store.dispatch("addSentMessage", message);
            const jwe = packAnonCrypt(CONSTANTS.MEDIATOR_PUB_KEY, CONSTANTS.MEDIATOR_KID, message)
            const response = await this.sendMessageDidComm(jwe)
            this.$store.dispatch("addLogMessage", 'Message sent successfully.');
            if (response && response.id && response.type && response.body) {
                // problem report
                this.$store.dispatch("addReceivedMessage", response);
            }
        },

        async sendMessageDidComm(jwe) {
            try {
                const response = await this.$store.dispatch('zid/sendMessage', { jwe });
                return response || null;
            } catch (error) {
                console.error('Error sending message:', error);
                return null;
            }
        },

        async addContact(recipient) {
            try {
                const response = await this.$store.dispatch('zid/resolveRecipient', { zid: recipient });
                if (response != null && response.document != null) {
                    const recipientPubKey = response.document.verificationMethod[1].publicKeyMultibase
                    if (recipientPubKey != null) {
                        this.$store.dispatch("addRecipient", { did: recipient, pubKey: recipientPubKey });
                        await this.queryDiscoverFeature(recipient, recipientPubKey)
                        return true
                    } else {
                        // recipient not support didcomm
                        this.errorMsg = 'Recipient DID not support DIDComm'
                        return false
                    }

                } else {
                    // recipient did not exist
                    this.errorMsg = 'Recipient DID not exist'
                    return false
                }
            } catch (error) {
                console.error('Error resolve recipient:', error);
                this.errorMsg = 'Error add contact: ' + error
                return false;
            }
        },

        async connectToWebsocket() {
            const message = createLiveDeliveryChange(this.did, true)
            const didDataJson = JSON.parse(this.didData)
            const skid = this.did + '#key-2'
            const jwe = packAuthCrypt(didDataJson.privateKey, CONSTANTS.MEDIATOR_PUB_KEY, skid, CONSTANTS.MEDIATOR_KID, message)
            this.$store.dispatch("addLogMessage", 'Connecting to mediator: ' + CONSTANTS.MEDIATOR_DID);
            this.$store.dispatch("addLogMessage", 'Discovered WS endpoint: ' + process.env.VUE_APP_WS_URL);
            this.connect(jwe, didDataJson)
        }
    },
};
