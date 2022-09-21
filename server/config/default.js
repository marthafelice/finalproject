module.exports = {
  'host': 'localhost',
  'port': 3030,
  'public': '../public/',
  'paginate': {
    'default': 10, 'max': 50
  },
  'authentication': {
    'entity': 'login',
    'service': 'logins',
    'secret': 'kF33p2tTZVYKnkJNRujdXWWCEb4=',
    'authStrategies': ['jwt', 'local'],
    'jwtOptions': {
      'header': {
        'typ': 'access'
      }, 'audience': 'https://yourdomain.com', 'issuer': 'feathers', 'algorithm': 'HS256', 'expiresIn': '1d'
    },
    'local': {
      'usernameField': 'email', 'passwordField': 'password'
    }
  },
  mongodb: 'mongodb://127.0.0.1:27017,127.0.0.1:27018,127.0.0.1:27019,127.0.0.1.2720/salondb?replicaSet=repset0&serverSelectionTimeoutMS=2000&connectTimeoutMS=30000&maxIdleTimeMS=600000',

  /* s3: {
    endpoint: 'https://s3.us-west-2.amazonaws.com/',
    region: 'us-west-2',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucket: 'violove'
  }*/
};
