import Slack from 'slack-node';
import config from '../config';

const slack = new Slack();
slack.setWebhook(config.SLACK_WEBHOOK_URI);

const sendWebhook = async (message: string) => {
  slack.webhook(
    {
      text: message,
    },
    function (err, response) {
      // console.log(response);
    }
  );
};

const slackMessage = (
  method: string,
  originalUrl: string,
  error: any,
  uid?: number
): string => {
  return `[에러] [${method}] ${originalUrl} ${
    uid ? `[유저아이디]: ${uid}` : 'req.user 없음'
  } 
  ${error.message}`;
};

const webhook = { sendWebhook, slackMessage };

export default webhook;
