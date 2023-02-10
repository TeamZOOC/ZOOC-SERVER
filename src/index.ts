import express, { NextFunction, Request, Response } from 'express';
import webhook from './modules/test-message';
import router from './router';

const app = express(); // express 객체 받아옴
const PORT = 3000; // 사용할 port를 3000번으로 설정

app.use(express.json()); // express 에서 request body를 json 으로 받아오겠다.

app.use('/', router);

//* 에러 핸들링
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const errorMessage = webhook.slackMessage(
    req.method,
    req.url,
    error,
    req.body.userId
  );

  webhook.sendWebhook(errorMessage);
});

app.listen(PORT, () => {
  console.log(`
        #############################################
            🛡️ Server listening on port: ${PORT} 🛡️
        #############################################
    `);
});

export default app;
