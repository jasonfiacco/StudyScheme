from flask_sqlalchemy import SQLAlchemy
from StudyScheme import app
from datetime import datetime

db = SQLAlchemy(app)

major_course = db.Table('major_course',
    db.Column('major_id', db.Integer, db.ForeignKey('major.id')),
    db.Column('course_id', db.Integer, db.ForeignKey('course.id'))
)

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    password = db.Column(db.String(120))
    total_credits_needed = db.Column(db.Integer)
    authenticated = db.Column(db.Boolean, default=False)

    majors = db.relationship('Major', backref='user', lazy='dynamic')
    courses = db.relationship('Course', backref='user', lazy='dynamic')

    def __init__(self, username, password):
        self.username = username
        self.password = password

    def __repr__(self):
        return '<User %r>' % self.username

    def is_active(self):
        return True

    def get_id(self):
        """Return username to satisfy Flask-Login's requirements."""
        return str(self.id).encode("utf-8").decode("utf-8")

    def is_authenticated(self):
        """Return True if user is authenticated."""
        return self.authenticated

    def is_anonymous(self):
        """Anonymous users aren't supported."""
        return False

class Major(db.Model):
    __tablename__ = 'major'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(60))
    credits_needed = db.Column(db.Integer)

    courses = db.relationship('Course', secondary=major_course, back_populates='majors')


    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __init__(self, name, credits_needed, user_id):
        self.name = name
        self.credits_needed = credits_needed
        self.user_id = user_id


class Course(db.Model):
    __tablename__ = 'course'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(60))
    credits = db.Column(db.Integer)
    semester = db.Column(db.Integer)
    anticipated_grade = db.Column(db.Integer)
    actual_grade = db.Column(db.Integer)

    majors = db.relationship('Major', secondary=major_course, back_populates="courses")

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __init__(self, name, credits, semester, anticipated_grade, actual_grade, user_id):
        self.name = name
        self.credits = credits
        self.semester = semester
        self.anticipated_grade = anticipated_grade
        self.actual_grade = actual_grade
        self.user_id = user_id
