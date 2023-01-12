import { expect } from 'chai';
import app from '../index';
import dotenv from 'dotenv';
import req from 'supertest';
dotenv.config();

describe('GET /family/mypage', () => {
  it('마이페이지 조회 - 성공', (done) => {
    req(app)
      .get('/family/mypage')
      .set({ Authorization: `Bearer ${process.env.TEST_TOKEN}` })
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => {
        done();
      })
      .catch((err) => {
        console.error('----ERROR----\n', err);
        done(err);
      });
  });
});
