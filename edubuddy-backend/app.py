from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
from datetime import datetime, timedelta
import bcrypt
import random
import os
import requests
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder='../app/dist', static_url_path='/')
CORS(app, origins=['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'])  # Enable CORS for frontend

@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/assets/<path:path>')
def serve_assets(path):
    return send_from_directory(os.path.join(app.static_folder, 'assets'), path)

@app.route('/<path:path>')
def serve_static(path):
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')


# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'edubuddy-secret-key-2024')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///edubuddy.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max file size

# Email configuration (using Gmail SMTP)
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME', '')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD', '')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_USERNAME', '')

# OpenRouter API for AI (free tier available)
OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY', '')

db = SQLAlchemy(app)
mail = Mail(app)

# Create upload directory
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'cours'), exist_ok=True)
os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'td'), exist_ok=True)
os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'tp'), exist_ok=True)
os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'examens'), exist_ok=True)

# ==================== DATABASE MODELS ====================

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=True)
    sector = db.Column(db.String(100), nullable=True)  # Web Design, Informatique Décisionnel et IA, Génie Informatique
    year = db.Column(db.String(20), nullable=True)  # 1ère année, 2ème année
    password_hash = db.Column(db.String(128), nullable=True)
    points = db.Column(db.Integer, default=0)
    streak_days = db.Column(db.Integer, default=0)
    last_study_date = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_verified = db.Column(db.Boolean, default=False)

class VerificationCode(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False)
    code = db.Column(db.String(6), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=False)

class Document(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    file_size = db.Column(db.Integer, nullable=False)
    file_type = db.Column(db.String(50), nullable=False)
    sector = db.Column(db.String(100), nullable=False)
    year = db.Column(db.String(20), nullable=False)
    doc_type = db.Column(db.String(20), nullable=False)  # cours, td, tp, examens
    uploaded_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    upload_date = db.Column(db.DateTime, default=datetime.utcnow)
    download_count = db.Column(db.Integer, default=0)
    uploader = db.relationship('User', backref='documents')

class CommunityPost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    sector = db.Column(db.String(100), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    upvotes = db.Column(db.Integer, default=0)
    is_resolved = db.Column(db.Boolean, default=False)
    author = db.relationship('User', backref='posts')

class CommunityReply(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('community_post.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_accepted = db.Column(db.Boolean, default=False)
    post = db.relationship('CommunityPost', backref='replies')
    author = db.relationship('User', backref='replies')

class ChatMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    message = db.Column(db.Text, nullable=False)
    response = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class ActivityLog(db.Model):
    """Track user activity for streak calculations"""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    activity_type = db.Column(db.String(50), nullable=False)  # login, upload, chat, study
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    
    user = db.relationship('User', backref='activities')

# Create tables
with app.app_context():
    db.create_all()

# ==================== HELPER FUNCTIONS ====================

def is_edu_email(email):
    """Check if email is an educational email"""
    edu_domains = ['.edu', '.ac.', '.edu.', 'student.', 'school.', 'college.', 'university.']
    return any(domain in email.lower() for domain in edu_domains)

def generate_verification_code():
    """Generate 6-digit verification code"""
    return ''.join([str(random.randint(0, 9)) for _ in range(6)])

def send_verification_email(email, code):
    """Send verification code via email"""
    try:
        msg = Message('EduBuddy - Verification Code', recipients=[email])
        msg.body = f'''
Hello!

Your EduBuddy verification code is: {code}

This code will expire in 10 minutes.

If you didn't request this code, please ignore this email.

Best regards,
EduBuddy Team
        '''
        msg.html = f'''
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2E5CFF;">EduBuddy Verification</h2>
            <p>Hello!</p>
            <p>Your verification code is:</p>
            <div style="background: linear-gradient(135deg, #2E5CFF, #A259FF); color: white; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; border-radius: 10px; margin: 20px 0;">
                {code}
            </div>
            <p style="color: #666;">This code will expire in 10 minutes.</p>
            <p style="color: #999; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
        </div>
        '''
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

def get_ai_response(message):
    """Get AI response using OpenRouter API (free tier)"""
    try:
        if not OPENROUTER_API_KEY:
            # Fallback to simulated responses if no API key
            return get_simulated_response(message)
        
        headers = {
            'Authorization': f'Bearer {OPENROUTER_API_KEY}',
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://edubuddy.com',
            'X-Title': 'EduBuddy'
        }
        
        data = {
            'model': 'mistralai/mistral-7b-instruct:free',
            'messages': [
                {
                    'role': 'system',
                    'content': 'You are EduBuddy, a helpful AI study assistant. You help students understand concepts, solve problems, and learn effectively. Keep responses concise, clear, and educational. Use examples when helpful.'
                },
                {
                    'role': 'user',
                    'content': message
                }
            ]
        }
        
        response = requests.post(
            'https://openrouter.ai/api/v1/chat/completions',
            headers=headers,
            json=data,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            return result['choices'][0]['message']['content']
        else:
            return get_simulated_response(message)
            
    except Exception as e:
        print(f"AI API error: {e}")
        return get_simulated_response(message)

def get_simulated_response(message):
    """Simulated AI responses when API is not available"""
    message_lower = message.lower()
    
    if 'derivative' in message_lower or 'dérivée' in message_lower:
        return """A derivative measures how a function changes as its input changes. In simple terms:

1. **Geometric meaning**: It's the slope of the tangent line to a curve at a point
2. **Physical meaning**: It represents the rate of change (like velocity is the derivative of position)

**Example**: If f(x) = x², then f'(x) = 2x

At x = 3, the slope is 6, meaning the function is increasing rapidly there.

Would you like me to explain the rules for calculating derivatives?"""
    
    elif 'integral' in message_lower or 'intégrale' in message_lower:
        return """An integral is the opposite of a derivative - it represents the accumulation of quantities.

**Two main types**:
1. **Indefinite integral**: Finds the antiderivative (∫x dx = x²/2 + C)
2. **Definite integral**: Calculates the area under a curve between two points

**Real-world example**: If velocity is the derivative of position, then position is the integral of velocity.

Would you like to see how to solve a specific integral problem?"""
    
    elif 'python' in message_lower or 'programming' in message_lower or 'code' in message_lower:
        return """**Python Basics**:

```python
# Variables and printing
name = "Student"
age = 20
print(f"Hello {name}, you are {age} years old")

# Functions
def greet(name):
    return f"Hello, {name}!"

# Lists
numbers = [1, 2, 3, 4, 5]
squared = [x**2 for x in numbers]
```

**Key concepts**: Variables, functions, loops, conditionals, and data structures.

What specific Python topic would you like to explore?"""
    
    elif 'database' in message_lower or 'sql' in message_lower:
        return """**SQL Basics**:

```sql
-- Select data
SELECT * FROM students WHERE grade > 80;

-- Insert data
INSERT INTO students (name, email) VALUES ('John', 'john@edu.com');

-- Update data
UPDATE students SET grade = 90 WHERE id = 1;

-- Join tables
SELECT s.name, c.course_name 
FROM students s 
JOIN enrollments e ON s.id = e.student_id 
JOIN courses c ON e.course_id = c.id;
```

Would you like me to explain a specific SQL concept?"""
    
    elif 'web' in message_lower or 'html' in message_lower or 'css' in message_lower:
        return """**Web Development Basics**:

**HTML** (Structure):
```html
<div class="card">
  <h1>Hello World</h1>
  <p>This is a paragraph</p>
</div>
```

**CSS** (Styling):
```css
.card {
  background: white;
  padding: 20px;
  border-radius: 10px;
}
```

**JavaScript** (Interactivity):
```javascript
document.querySelector('.card').addEventListener('click', () => {
  alert('Card clicked!');
});
```

What aspect of web development interests you most?"""
    
    else:
        return """I'd be happy to help you with that! 

Could you provide more details about what you're studying? For example:
- The subject (Math, Programming, Science, etc.)
- The specific topic or concept
- What you've tried so far

This will help me give you a more targeted and helpful explanation. 📚✨"""


def get_user_activities(user_id):
    """Get all user activities from database for streak calculation"""
    activities = ActivityLog.query.filter_by(user_id=user_id).order_by(
        ActivityLog.created_at.desc()
    ).all()
    return activities


def log_user_activity(user_id, activity_type='study'):
    """Log a user activity for streak tracking"""
    activity = ActivityLog(user_id=user_id, activity_type=activity_type)
    db.session.add(activity)
    db.session.commit()


def calculate_streak_data(user_id):
    """Calculate streak statistics from user activities in the database"""
    # Get all activities for the user
    activities = get_user_activities(user_id)
    
    if not activities:
        return {
            'currentStreak': 0,
            'longestStreak': 0,
            'totalDays': 0,
            'thisWeek': 0,
            'thisMonth': 0
        }
    
    now = datetime.utcnow()
    today = now.date()
    
    # Extract unique dates from activities (convert to naive UTC date)
    active_dates = set()
    for activity in activities:
        # Convert timestamp to naive UTC object (strip timezone info if present)
        activity_date = activity.created_at.replace(tzinfo=None).date()
        active_dates.add(activity_date)
    
    # Calculate current streak (consecutive days ending today or yesterday)
    current_streak = 0
    check_date = today
    
    # Check if user was active today or yesterday to start counting
    if today not in active_dates and (today - timedelta(days=1)) not in active_dates:
        current_streak = 0
    else:
        # Start from today or yesterday and count backwards
        if today not in active_dates:
            check_date = today - timedelta(days=1)
        
        while check_date in active_dates:
            current_streak += 1
            check_date -= timedelta(days=1)
    
    # Calculate longest streak
    longest_streak = 0
    temp_streak = 0
    
    # Sort dates and iterate to find longest consecutive sequence
    sorted_dates = sorted(active_dates, reverse=True)
    for i, date in enumerate(sorted_dates):
        if i == 0:
            temp_streak = 1
        else:
            if sorted_dates[i-1] - date == timedelta(days=1):
                temp_streak += 1
            else:
                temp_streak = 1
        longest_streak = max(longest_streak, temp_streak)
    
    # Calculate total days active
    total_days_active = len(active_dates)
    
    # Calculate this week's activity
    week_start = today - timedelta(days=today.weekday())
    this_week = sum(1 for d in active_dates if week_start <= d <= today)
    
    # Calculate this month's activity
    month_start = today.replace(day=1)
    this_month = sum(1 for d in active_dates if month_start <= d <= today)
    
    return {
        'currentStreak': current_streak,
        'longestStreak': longest_streak,
        'totalDays': total_days_active,
        'thisWeek': this_week,
        'thisMonth': this_month
    }

# ==================== API ROUTES ====================

# Health check
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'EduBuddy API is running!'})

# ==================== AUTH ROUTES ====================

@app.route('/api/auth/send-code', methods=['POST'])
def send_code():
    data = request.get_json()
    email = data.get('email', '').lower().strip()
    
    if not email:
        return jsonify({'success': False, 'message': 'Email is required'}), 400
    
    if not is_edu_email(email):
        return jsonify({'success': False, 'message': 'Please use a valid .edu or academic email address'}), 400
    
    # Generate and save verification code
    code = generate_verification_code()
    expires_at = datetime.utcnow() + timedelta(minutes=10)
    
    # Delete old codes for this email
    VerificationCode.query.filter_by(email=email).delete()
    
    # Save new code
    verification = VerificationCode(email=email, code=code, expires_at=expires_at)
    db.session.add(verification)
    db.session.commit()
    
    # Send email (or simulate in development)
    mail_configured = (
        app.config['MAIL_USERNAME'] and 
        app.config['MAIL_PASSWORD'] and
        'your-email' not in app.config['MAIL_USERNAME'].lower() and
        'your-' not in app.config['MAIL_PASSWORD'].lower()
    )
    
    if mail_configured:
        email_sent = send_verification_email(email, code)
    else:
        # For development, just print the code
        print(f"\n{'='*50}")
        print(f"VERIFICATION CODE for {email}: {code}")
        print(f"{'='*50}\n")
        email_sent = True
    
    if email_sent:
        # Check if in development mode
        is_dev_mode = (
            app.config['MAIL_USERNAME'] and 
            app.config['MAIL_PASSWORD'] and
            'your-email' in app.config['MAIL_USERNAME'].lower()
        )
        
        if is_dev_mode:
            return jsonify({
                'success': True, 
                'message': f'Development mode: Your verification code is {code}',
                'dev_code': code,
                'note': 'In production, this would be sent to your email'
            })
        else:
            return jsonify({
                'success': True, 
                'message': 'Verification code sent! Check your email.',
                'dev_code': None
            })
    else:
        return jsonify({'success': False, 'message': 'Failed to send email. Please try again.'}), 500

# Development endpoint to retrieve verification code
@app.route('/api/auth/dev-get-code/<email>', methods=['GET'])
def get_dev_code(email):
    """Development only: retrieve the last verification code for an email"""
    email = email.lower().strip()
    
    # Only allow this in development mode (when email not configured)
    mail_configured = (
        app.config['MAIL_USERNAME'] and 
        app.config['MAIL_PASSWORD'] and
        'your-email' not in app.config['MAIL_USERNAME'].lower() and
        'your-' not in app.config['MAIL_PASSWORD'].lower()
    )
    
    if mail_configured:
        return jsonify({'success': False, 'message': 'Not available in production'}), 403
    
    # Find the latest verification code for this email
    verification = VerificationCode.query.filter_by(email=email).order_by(
        VerificationCode.created_at.desc()
    ).first()
    
    if not verification:
        return jsonify({'success': False, 'message': 'No code found for this email'}), 404
    
    if verification.expires_at < datetime.utcnow():
        return jsonify({'success': False, 'message': 'Code expired'}), 400
    
    return jsonify({
        'success': True, 
        'code': verification.code,
        'email': email,
        'message': 'Development mode: Here is your verification code'
    })

@app.route('/api/auth/verify', methods=['POST'])
def verify_code():
    data = request.get_json()
    email = data.get('email', '').lower().strip()
    code = data.get('code', '')
    
    if not email or not code:
        return jsonify({'success': False, 'message': 'Email and code are required'}), 400
    
    # Find valid verification code
    verification = VerificationCode.query.filter_by(
        email=email, 
        code=code
    ).filter(VerificationCode.expires_at > datetime.utcnow()).first()
    
    if not verification:
        return jsonify({'success': False, 'message': 'Invalid or expired code'}), 400
    
    # Check if user exists
    user = User.query.filter_by(email=email).first()
    
    if not user:
        # Create new user
        user = User(email=email, is_verified=True)
        db.session.add(user)
    else:
        user.is_verified = True
    
    # Delete used verification code
    db.session.delete(verification)
    db.session.commit()
    
    return jsonify({
        'success': True, 
        'message': 'Email verified successfully!',
        'is_new_user': user.name is None,
        'user': {
            'id': user.id,
            'email': user.email,
            'name': user.name,
            'points': user.points
        }
    })

@app.route('/api/auth/complete-profile', methods=['POST'])
def complete_profile():
    data = request.get_json()
    email = data.get('email', '').lower().strip()
    name = data.get('name', '').strip()
    sector = data.get('sector', '')
    year = data.get('year', '')
    
    if not all([email, name, sector, year]):
        return jsonify({'success': False, 'message': 'All fields are required'}), 400
    
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'success': False, 'message': 'User not found'}), 404
    
    user.name = name
    user.sector = sector
    user.year = year
    
    # Award points for completing profile
    user.points += 50
    
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Profile completed!',
        'user': {
            'id': user.id,
            'email': user.email,
            'name': user.name,
            'sector': user.sector,
            'year': user.year,
            'points': user.points
        }
    })

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email', '').lower().strip()
    
    user = User.query.filter_by(email=email).first()
    
    if not user:
        return jsonify({'success': False, 'message': 'User not found'}), 404
    
    # Log activity for login
    log_user_activity(user.id, 'login')
    
    return jsonify({
        'success': True,
        'user': {
            'id': user.id,
            'email': user.email,
            'name': user.name,
            'sector': user.sector,
            'year': user.year,
            'points': user.points,
            'streak_days': user.streak_days
        }
    })

@app.route('/api/user/profile', methods=['GET'])
def get_profile():
    user_id = request.args.get('user_id')
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'success': False, 'message': 'User not found'}), 404
    
    return jsonify({
        'success': True,
        'user': {
            'id': user.id,
            'email': user.email,
            'name': user.name,
            'sector': user.sector,
            'year': user.year,
            'points': user.points,
            'streak_days': user.streak_days,
            'document_count': len(user.documents)
        }
    })

@app.route('/api/user/stats', methods=['GET'])
def get_user_stats():
    user_id = request.args.get('user_id')
    
    if not user_id:
        return jsonify({'success': False, 'message': 'user_id is required'}), 400
    
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'success': False, 'message': 'User not found'}), 404
    
    # Use the new calculate_streak_data function which queries ActivityLog table
    stats = calculate_streak_data(user_id)
    
    # Update user's streak_days and last_study_date based on calculated data
    if stats['currentStreak'] > 0:
        user.streak_days = stats['currentStreak']
        # Get the most recent activity to update last_study_date
        latest_activity = ActivityLog.query.filter_by(user_id=user_id).order_by(
            ActivityLog.created_at.desc()
        ).first()
        if latest_activity:
            user.last_study_date = latest_activity.created_at
    
    db.session.commit()
    
    return jsonify({
        'success': True,
        'stats': stats
    })

# ==================== DOCUMENT ROUTES ====================

@app.route('/api/documents/upload', methods=['POST'])
def upload_document():
    if 'file' not in request.files:
        return jsonify({'success': False, 'message': 'No file provided'}), 400
    
    file = request.files['file']
    user_id = request.form.get('user_id')
    sector = request.form.get('sector')
    year = request.form.get('year')
    doc_type = request.form.get('doc_type')  # cours, td, tp, examens
    
    if not all([user_id, sector, year, doc_type]):
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400
    
    if file.filename == '':
        return jsonify({'success': False, 'message': 'No file selected'}), 400
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({'success': False, 'message': 'User not found'}), 404
    
    # Generate unique filename
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    safe_filename = f"{timestamp}_{file.filename}"
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], doc_type, safe_filename)
    
    # Save file
    file.save(file_path)
    
    # Save to database
    document = Document(
        filename=safe_filename,
        original_filename=file.filename,
        file_path=file_path,
        file_size=os.path.getsize(file_path),
        file_type=file.content_type or 'application/octet-stream',
        sector=sector,
        year=year,
        doc_type=doc_type,
        uploaded_by=user_id
    )
    db.session.add(document)
    
    # Award points for uploading (100 points per upload)
    user.points += 100
    
    # Log activity for upload
    log_user_activity(user_id, 'upload')
    
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'File uploaded successfully! You earned 100 points!',
        'document': {
            'id': document.id,
            'filename': document.original_filename,
            'points_earned': 100,
            'total_points': user.points
        }
    })

@app.route('/api/documents', methods=['GET'])
def get_documents():
    sector = request.args.get('sector')
    year = request.args.get('year')
    doc_type = request.args.get('doc_type')
    
    query = Document.query
    
    if sector:
        query = query.filter_by(sector=sector)
    if year:
        query = query.filter_by(year=year)
    if doc_type:
        query = query.filter_by(doc_type=doc_type)
    
    documents = query.order_by(Document.upload_date.desc()).all()
    
    return jsonify({
        'success': True,
        'documents': [{
            'id': d.id,
            'filename': d.original_filename,
            'sector': d.sector,
            'year': d.year,
            'doc_type': d.doc_type,
            'upload_date': d.upload_date.isoformat(),
            'uploader_name': d.uploader.name if d.uploader else 'Unknown',
            'download_count': d.download_count,
            'file_size': d.file_size
        } for d in documents]
    })

@app.route('/api/documents/download/<int:doc_id>', methods=['GET'])
def download_document(doc_id):
    document = Document.query.get(doc_id)
    if not document:
        return jsonify({'success': False, 'message': 'Document not found'}), 404
    
    document.download_count += 1
    db.session.commit()
    
    directory = os.path.dirname(document.file_path)
    filename = os.path.basename(document.file_path)
    
    return send_from_directory(directory, filename, as_attachment=True, download_name=document.original_filename)

# ==================== COMMUNITY ROUTES ====================

@app.route('/api/community/posts', methods=['GET'])
def get_posts():
    sector = request.args.get('sector')
    
    query = CommunityPost.query
    if sector:
        query = query.filter_by(sector=sector)
    
    posts = query.order_by(CommunityPost.created_at.desc()).all()
    
    return jsonify({
        'success': True,
        'posts': [{
            'id': p.id,
            'title': p.title,
            'content': p.content,
            'author_name': p.author.name if p.author else 'Anonymous',
            'author_id': p.author_id,
            'sector': p.sector,
            'created_at': p.created_at.isoformat(),
            'upvotes': p.upvotes,
            'is_resolved': p.is_resolved,
            'reply_count': len(p.replies)
        } for p in posts]
    })

@app.route('/api/community/post', methods=['POST'])
def create_post():
    data = request.get_json()
    title = data.get('title', '').strip()
    content = data.get('content', '').strip()
    author_id = data.get('author_id')
    sector = data.get('sector')
    
    if not all([title, content, author_id]):
        return jsonify({'success': False, 'message': 'Title, content, and author are required'}), 400
    
    post = CommunityPost(
        title=title,
        content=content,
        author_id=author_id,
        sector=sector
    )
    db.session.add(post)
    
    # Award points for posting
    user = User.query.get(author_id)
    if user:
        user.points += 25
    
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Post created successfully! You earned 25 points!',
        'post': {
            'id': post.id,
            'title': post.title,
            'points_earned': 25,
            'total_points': user.points if user else 0
        }
    })

@app.route('/api/community/reply', methods=['POST'])
def create_reply():
    data = request.get_json()
    post_id = data.get('post_id')
    content = data.get('content', '').strip()
    author_id = data.get('author_id')
    
    if not all([post_id, content, author_id]):
        return jsonify({'success': False, 'message': 'Post ID, content, and author are required'}), 400
    
    reply = CommunityReply(
        post_id=post_id,
        content=content,
        author_id=author_id
    )
    db.session.add(reply)
    
    # Award points for replying
    user = User.query.get(author_id)
    if user:
        user.points += 15
    
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Reply posted! You earned 15 points!',
        'points_earned': 15,
        'total_points': user.points if user else 0
    })

@app.route('/api/community/post/<int:post_id>', methods=['GET'])
def get_post_details(post_id):
    post = CommunityPost.query.get(post_id)
    if not post:
        return jsonify({'success': False, 'message': 'Post not found'}), 404
    
    return jsonify({
        'success': True,
        'post': {
            'id': post.id,
            'title': post.title,
            'content': post.content,
            'author_name': post.author.name if post.author else 'Anonymous',
            'author_id': post.author_id,
            'sector': post.sector,
            'created_at': post.created_at.isoformat(),
            'upvotes': post.upvotes,
            'is_resolved': post.is_resolved,
            'replies': [{
                'id': r.id,
                'content': r.content,
                'author_name': r.author.name if r.author else 'Anonymous',
                'created_at': r.created_at.isoformat(),
                'is_accepted': r.is_accepted
            } for r in post.replies]
        }
    })

# ==================== AI CHAT ROUTES ====================

@app.route('/api/ai/chat', methods=['POST'])
def ai_chat():
    data = request.get_json()
    message = data.get('message', '').strip()
    user_id = data.get('user_id')
    
    if not message:
        return jsonify({'success': False, 'message': 'Message is required'}), 400
    
    # Get AI response
    response = get_ai_response(message)
    
    # Save chat history
    chat = ChatMessage(
        user_id=user_id,
        message=message,
        response=response
    )
    db.session.add(chat)
    
    # Log activity for chat/study
    if user_id:
        log_user_activity(user_id, 'chat')
    
    db.session.commit()
    
    return jsonify({
        'success': True,
        'response': response
    })

@app.route('/api/ai/chat-history', methods=['GET'])
def get_chat_history():
    user_id = request.args.get('user_id')
    
    if not user_id:
        return jsonify({'success': False, 'message': 'User ID is required'}), 400
    
    chats = ChatMessage.query.filter_by(user_id=user_id).order_by(ChatMessage.created_at.desc()).limit(50).all()
    
    return jsonify({
        'success': True,
        'chats': [{
            'id': c.id,
            'message': c.message,
            'response': c.response,
            'created_at': c.created_at.isoformat()
        } for c in chats]
    })

# ==================== LEADERBOARD ROUTES ====================

@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    users = User.query.order_by(User.points.desc()).limit(20).all()
    
    return jsonify({
        'success': True,
        'leaderboard': [{
            'id': u.id,
            'name': u.name or 'Anonymous',
            'points': u.points,
            'streak_days': u.streak_days,
            'document_count': len(u.documents)
        } for u in users]
    })

# ==================== STATIC FILES (React Frontend) ====================

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    """Serve React frontend for all non-API routes"""
    if path.startswith('api/'):
        return jsonify({'error': 'Not found'}), 404
    
    # Check if file exists in static folder
    static_file = os.path.join('static', path)
    if path and os.path.exists(static_file) and os.path.isfile(static_file):
        return send_from_directory('static', path)
    
    # Serve index.html for all routes (SPA behavior)
    return send_from_directory('static', 'index.html')

# ==================== MAIN ====================

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
