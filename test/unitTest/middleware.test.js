const { isLoggedIn, isNotLoggedIn } = require('../../routes/middleware');

describe('isLoggedIn', () => { //그룹화 
    const res = {
        status: jest.fn(() => res),
        send: jest.fn()
    };
    const next = jest.fn(() => null);
    test('로그인 되어 있으면 isLoggedIn이 next를 호출해야 합니다.', () => {
        //가짜를 만들어서 테스트한다 => 모킹
        const req = {
            isAuthenticated: jest.fn(() => true),
        }
        isLoggedIn(req, res, next); //테스트를 할때 req, res, next가 정의가 안되어 있기 때문에 가짜 데이터로 정의한다. 

        expect(next).toBeCalledTimes(1);
    });

    test('로그인이 되어 있지 않으면 isLoggedIn이 에러를 뱉어야 합니다.', () => {
        const req = {
            isAuthenticated: jest.fn(() => false)
        }
        isLoggedIn(req, res, next); 
        expect(res.status).toBeCalledWith(403); // 이 res가 어디 res인지 감이 안잡히네.. 
        expect(res.send).toBeCalledWith('로그인 필요')
    });
});

describe('isNotLoggedIn', () => {
    const res = {
        redirect: jest.fn()
    }
    const next = jest.fn();
    test('로그인 상태가 아니면 isNotLoggedIn은 next를 호출해야 합니다', () => {
        const req = {
            isAuthenticated: jest.fn(() => false),
        };
        isNotLoggedIn(req, res, next);
        expect(next).toBeCalledTimes(1);
    })

    test('로그인 상태이면 isNotLoggedIn은 error를 url로 표시해야 합니다', () => {
        const req = {
            isAuthenticated: jest.fn(() => true),
        }
        const message = encodeURIComponent('로그인한 상태입니다.');
        isNotLoggedIn(req, res, next);

        //이 res.redirect가 내가 정의한 거로는 그냥 함수호출만 햇는데, 왜 /?error와 같다고 나오지??
        expect(res.redirect).toBeCalledWith(`/?error=${message}`); 
    })
})