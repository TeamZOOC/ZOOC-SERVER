import dotenv from 'dotenv';
import req from 'supertest';
import app from '../index';
import { expect } from 'chai';
import config from '../config';
dotenv.config();

describe('GET /record/mission/{familyId}', () => {
  it('완료되지 않은 미션 전체 조회 - 성공', (done) => {
    req(app)
      .get('/record/mission/1')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${config.TEST_TOKEN}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => {
        done();
      })
      .catch((err) => {
        console.error('######Error >>', err);
        done(err);
      });
  });
});

describe('GET /record/pet/{familyId}', () => {
  it('펫 전체 조회 - 성공', (done) => {
    req(app)
      .get('/record/pet/1')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${config.TEST_TOKEN}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => {
        done();
      })
      .catch((err) => {
        console.error('######Error >>', err);
        done(err);
      });
  });
});

describe('GET /record/detail/1/33', () => {
  it('기록 상세보기 - 성공', (done) => {
    req(app)
      .get('/record/detail/1/33')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${config.TEST_TOKEN}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => {
        done();
      })
      .catch((err) => {
        console.error('######Error >>', err);
        done(err);
      });
  });
});

describe('GET /record/{familyId}/{petId}', () => {
  it('[아요] 기록 전체보기 - 성공', (done) => {
    req(app)
      .get('/record/9/25')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${config.TEST_TOKEN}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => {
        done();
      })
      .catch((err) => {
        console.error('######Error >>', err);
        done(err);
      });
  });
});

describe('GET /record/aos/1/1', () => {
  it('[안드] 기록 전체보기 - 성공', (done) => {
    req(app)
      .get('/record/aos/1/1')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${config.TEST_TOKEN}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => {
        done();
      })
      .catch((err) => {
        console.error('######Error >>', err);
        done(err);
      });
  });
});

describe('기록 삭제하기', () => {
  context('DELETE /record/35', () => {
    it('기록 삭제 - 성공', () => {
      req(app)
        .delete('/record/35')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${config.TEST_TOKEN}`)
        .expect(200)
        .catch((err) => {
          console.error('----ERROR----\n', err);
        });
    });
  });
});
