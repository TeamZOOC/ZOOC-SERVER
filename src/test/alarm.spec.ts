import { expect } from 'chai';
import app from '../index';
import req from 'supertest';
import config from '../config';

describe('알림 리스트 불러오기', () => {
  context('GET /alarm/list', () => {
    it('받은 알림 조회 성공', (done) => {
      req(app)
        .get('/alarm/list')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${config.TEST_TOKEN}`)
        .expect(200)
        .expect('Content-type', /json/)
        .then((res) => {
          done();
        })
        .catch((err) => {
          console.error('----ERROR----\n', err);
          done(err);
        });
    });
  });
});
