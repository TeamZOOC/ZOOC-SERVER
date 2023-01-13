import Slack from 'slack-node';
const webhookUri =
  'https://hooks.slack.com/services/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'; // Webhook URL

const slack = new Slack();
slack.setWebhook(webhookUri);

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
  } ${JSON.stringify(error)}`;
};

const webhook = { sendWebhook, slackMessage };

export default webhook;
