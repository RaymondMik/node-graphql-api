const users = [
   {
      id: '1111',
      name: 'Patrick',
      email: 'patrick@example.com'
   },
   {
      id: '1112',
      name: 'Mike',
      email: 'mike@example.com'
   },
   {
      id: '1113',
      name: 'John',
      email: 'john@example.com',
      age: 39
   }
];

const posts = [
   {
      id: '2221',
      title: 'Nice post',
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      published: true,
      author: '1111'
   },
   {
      id: '2222',
      title: 'Awesome post',
      body: 'Dolor sit amet.',
      published: true,
      author: '1112'
   },
   {
      id: '2223',
      title: 'Cute post',
      body: 'Consectetur adipiscing elit.',
      published: false,
      author: '1113'
   },
];

const comments = [
   {
      id: '3331',
      text: 'Really cool!!!',
      author: '1111',
      post: '2221'
   },
   {
      id: '3332',
      text: 'Not bad',
      author: '1112',
      post: '2221'
   },
   {
      id: '3333',
      text: 'Great!!!',
      author: '1112',
      post: '2221'
   },
   {
      id: '3334',
      text: 'Viagra Cialis add',
      author: '1113',
      post: '2221'
   },
];

const db = {users, posts, comments}

export default db
