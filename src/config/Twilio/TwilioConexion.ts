import twilio, {Twilio} from "twilio"

import 'dotenv/config'

const accountSid: string = process.env['TWILIO_ACCOUNT_SID'] || '';
const authToken: string = process.env['TWILIO_AUTH_TOKEN'] || '';

const twilioService: Twilio = twilio("AC03e74efedba25889cd7db201022941fa", authToken);

export default twilioService;