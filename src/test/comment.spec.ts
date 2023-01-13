import dotenv from 'dotenv';
import req from 'supertest';
import app from '../index';
import { expect } from 'chai';
import config from '../config';
dotenv.config();

describe('POST /comment/{recordId} ', () => {
  it('일반 댓글 작성하기 - 성공', async () => {
    await req(app)
      .post('/comment/33')
      .set('Content-Type', 'application/json')
      .set({ Authorization: `Bearer ${config.TEST_TOKEN}` })
      .send({
        content: '댓글 폼 미쳤다 ㄷㄷ',
      })
      .expect(201)
      .expect('Content-Type', /json/);
  });
});

describe('POST /comment/emoji/{recordId} ', () => {
  it('이모지 댓글 작성하기 - 성공', async () => {
    await req(app)
      .post('/comment/emoji/33')
      .set('Content-Type', 'application/json')
      .set({ Authorization: `Bearer ${config.TEST_TOKEN}` })
      .send({
        emoji: 2,
      })
      .expect(201)
      .expect('Content-Type', /json/);
  });
});

describe('댓글 삭제하기', () => {
  context('DELETE /comment/{commentId}', () => {
    it('댓글 삭제하기 - 성공', () => {
      req(app)
        .delete('/comment/52')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${config.TEST_TOKEN}`)
        .expect(200)
        .catch((err) => {
          console.error('----ERROR----\n', err);
        });
    });
  });
});
