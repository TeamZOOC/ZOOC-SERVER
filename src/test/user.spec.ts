import { expect } from 'chai';
import app from '../index';
import req from 'supertest';
import config from '../config';

describe('유저 프로필 수정하기', () => {
  context('GET /alarm/list', () => {
    it('유저 프로필 수정 성공', (done) => {
      req(app)
        .patch('/user/profile?photo=false')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${config.TEST_TOKEN}`)
        .send({
          nickName: '별명',
        })
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

describe('유저 탈퇴', () => {
  context('DELETE /user', () => {
    it('유저 탈퇴 성공', () => {
      req(app)
        .delete('/user')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${config.TEST_TOKEN}`)
        .expect(200)
        .catch((err) => {
          console.error('----ERROR----\n', err);
        });
    });
  });
});
