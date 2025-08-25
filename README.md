# Community Help Hub - Backend

This is the Node.js + Express.js backend for the Community Help Hub application.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment setup**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Start the server**
   ```bash
   # Development mode (with nodemon)
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/helpapp
JWT_SECRET=yourSuperSecretJWTKeyForCommunityHelpHub2024
NODE_ENV=development
```

### MongoDB Setup

1. **Local MongoDB**
   ```bash
   # Install MongoDB locally
   # Start MongoDB service
   mongod
   
   # Update .env
   MONGO_URI=mongodb://localhost:27017/helpapp
   ```

2. **MongoDB Atlas (Cloud)**
   - Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Get connection string
   - Update `.env` with your connection string

## 📁 Project Structure

```
src/
├── config/          # Configuration files
│   └── db.js       # MongoDB connection
├── controllers/     # Business logic
│   ├── authController.js    # Authentication logic
│   ├── postController.js    # Post operations
│   └── userController.js    # User operations
├── middleware/      # Custom middleware
│   └── authMiddleware.js    # JWT authentication
├── models/          # MongoDB schemas
│   ├── User.js     # User model
│   ├── Post.js     # Post model
│   └── Comment.js  # Comment model
├── routes/          # API endpoints
│   ├── authRoutes.js       # Authentication routes
│   ├── postRoutes.js       # Post routes
│   └── userRoutes.js       # User routes
├── app.js          # Express app configuration
└── server.js       # Server entry point
```

## 🗄️ Database Models

### User Model
```javascript
{
  name: String,        // User's full name
  email: String,       // Unique email address
  password: String,    // Hashed password
  phone: String,       // Phone number
  location: String,    // User's location
  avatar: String,      // Profile picture URL
  createdAt: Date,     // Account creation date
  updatedAt: Date      // Last update date
}
```

### Post Model
```javascript
{
  userId: ObjectId,    // Reference to User
  category: String,    // Help category
  title: String,       // Post title
  description: String, // Detailed description
  location: String,    // Where help is needed
  status: String,      // Post status (open, in-progress, resolved, closed)
  urgency: String,     // Urgency level (low, medium, high, critical)
  images: [String],    // Image URLs
  tags: [String],      // Search tags
  createdAt: Date,     // Post creation date
  updatedAt: Date      // Last update date
}
```

### Comment Model
```javascript
{
  postId: ObjectId,    // Reference to Post
  userId: ObjectId,    // Reference to User
  comment: String,     // Comment text
  isHelpful: Boolean,  // Marked as helpful
  status: String,      // Comment status
  createdAt: Date,     // Comment creation date
  updatedAt: Date      // Last update date
}
```

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/register` | User registration | Public |
| POST | `/login` | User login | Public |
| GET | `/profile` | Get user profile | Private |

### Post Routes (`/api/posts`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all posts | Public |
| POST | `/` | Create new post | Private |
| GET | `/:id` | Get post details | Public |
| PUT | `/:id` | Update post | Private (Owner) |
| DELETE | `/:id` | Delete post | Private (Owner) |
| GET | `/user/:userId` | Get user's posts | Public |

### User Routes (`/api/users`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/me` | Get current user profile | Private |
| PUT | `/me` | Update user profile | Private |
| GET | `/:id` | Get user by ID | Public |

## 🔐 Authentication

### JWT Token Structure
```javascript
{
  "id": "user_id_here",
  "iat": 1234567890,
  "exp": 1234567890 + (30 * 24 * 60 * 60 * 1000) // 30 days
}
```

### Protected Routes
All private routes require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Password Security
- Passwords are hashed using bcrypt with salt rounds of 10
- Minimum password length: 6 characters
- Passwords are never stored in plain text

## 🛡️ Security Features

- **CORS**: Cross-origin resource sharing enabled
- **Input Validation**: Request data validation and sanitization
- **Error Handling**: Comprehensive error handling with proper HTTP status codes
- **Rate Limiting**: Basic rate limiting (can be enhanced)
- **Helmet**: Security headers (can be added)

## 🧪 Testing

### Manual Testing
Use tools like Postman or curl to test the API:

```bash
# Test health endpoint
curl http://localhost:5000/health

# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "1234567890",
    "location": "New York"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## 🚀 Deployment

### Production Considerations

1. **Environment Variables**
   ```env
   NODE_ENV=production
   PORT=5000
   MONGO_URI=your_production_mongodb_uri
   JWT_SECRET=your_production_jwt_secret
   ```

2. **Process Manager**
   ```bash
   # Install PM2
   npm install -g pm2
   
   # Start with PM2
   pm2 start src/server.js --name "community-help-hub"
   
   # Monitor
   pm2 monit
   ```

3. **Reverse Proxy (Nginx)**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🔍 Monitoring & Logging

### Health Check
- Endpoint: `GET /health`
- Returns server status and basic info

### Error Logging
- All errors are logged to console
- Consider adding Winston or similar for production logging

## 🚧 Development

### Adding New Features

1. **Create Model** (if needed)
   - Add schema in `src/models/`
   - Define validation rules

2. **Create Controller**
   - Add business logic in `src/controllers/`
   - Handle request/response

3. **Create Routes**
   - Add endpoints in `src/routes/`
   - Apply middleware as needed

4. **Update App**
   - Register new routes in `src/app.js`

### Code Style
- Use ES6+ features
- Follow Node.js best practices
- Use async/await for asynchronous operations
- Proper error handling with try-catch

## 📚 Dependencies

### Production Dependencies
- `express`: Web framework
- `mongoose`: MongoDB ODM
- `bcryptjs`: Password hashing
- `jsonwebtoken`: JWT authentication
- `cors`: Cross-origin resource sharing
- `dotenv`: Environment variable management

### Development Dependencies
- `nodemon`: Auto-restart on file changes

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check MongoDB service is running
   - Verify connection string in `.env`
   - Check network connectivity

2. **JWT Token Invalid**
   - Verify JWT_SECRET in `.env`
   - Check token expiration
   - Ensure proper Authorization header format

3. **CORS Issues**
   - Verify CORS configuration
   - Check frontend URL in allowed origins

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Happy Coding! 🎉**
