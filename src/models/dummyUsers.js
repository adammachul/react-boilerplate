import User from './User';

export default function () {
    User.count().exec((err, count) => {
        if (count > 0) {
            return;
        }

        const user1 = new User({ email: 'user1@user1.com', profile: { name: 'Adam', gender: 'm', location: 'pl', website: '1.pl', picture: '1.jpg' } });
        const user2 = new User({ email: 'user2@user2.com', profile: { name: 'Ada', gender: 'w', location: 'pl', website: '2.pl', picture: '2.jpg' } });
        
        User.create([user1, user2], (error) => {
            if (!error) {
                console.log('Users loaded');
            }
        });
    });
}