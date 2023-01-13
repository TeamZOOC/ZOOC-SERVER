import { expect } from 'chai';
import app from '../index';
import req from 'supertest';
import config from '../config';

describe('가족 정보 가져오기', () => {
  context('GET /family', () => {
    it('가족 정보 가져오기 성공', (done) => {
      req(app)
        .get('/family')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${config.TEST_TOKEN}`)
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

describe('가족에 반려동물 등록하기', () => {
  context('POST /family/pets/{familyId}', () => {
    it('반려동물 등록하기', async () => {
      await req(app)
        .post('/family/pet/1')
        .set('Content-Type', 'application/json')
        .set({ Authorization: `Bearer ${process.env.TEST_TOKEN}` })
        .send({
          id: 300,
          name: '정준서',
          photo:
            'https://zooc-bucket.s3.ap-northeast-2.amazonaws.com/images/1673509386419_KakaoTalk_20221217_112329127.jpg',
        })
        .expect(201)
        .expect('Content-Type', /json/);
    });
  });
});
