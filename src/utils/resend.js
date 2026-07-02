import resend from 'resend' ;

const resendClient = new resend(process.env.RESEND_API_KEY) ;

export default resendClient ;