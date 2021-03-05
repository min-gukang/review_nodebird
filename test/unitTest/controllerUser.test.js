const { addFollowing } = require('../../controllers/user');
jest.mock('../../models/user'); // User보다 위에 있어야 mock으로 가짜로 만들고 require한다. 
const User = require('../../models/user');

describe('addFollowing', () => {
    const req = {
        user: { id : 1} ,
        params: { id: 2 }, 
    };
    const res = {
        status: jest.fn(() => res),
        send: jest.fn()
    }
    const next = jest.fn();
    test('사용자를 찾아 팔로잉을 추가하고 sucess를 응답해야함.', async() => {
        User.findOne.mockReturnValue(Promise.resolve({ //controller/user에 다음 속성과 값을 강제 대입시킴.  
            id: 1, 
            name: 'zerocho', 
            addFollowing(value) {
                return Promise.resolve(true);
            }   
        }))
        await addFollowing(req, res, next);
        expect(res.send).toBeCalledWith('success');
    });
    test('사용자가 없으면 404와 no user를 응답해야함.', async () => {
        User.findOne.mockReturnValue(Promise.resolve(null));
        await addFollowing(req, res, next);
        expect(res.status).toBeCalledWith(404);
        expect(res.send).toBeCalledWith('no user'); //이거 왜 success뜨지? 
    });
    test('데이터베이스 접근 시 에러가 생기면 next(err)를 호출해야함', async () => {
        const error = '테스트용 에러';
        User.findOne.mockReturnValue(Promise.reject(error));
        await addFollowing(req, res, next);
        expect(next).toBeCalledWith(error);
    });
})