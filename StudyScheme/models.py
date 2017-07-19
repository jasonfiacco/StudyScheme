from flask_sqlalchemy import SQLAlchemy
from StudyScheme import app
from datetime import datetime

db = SQLAlchemy(app)


user_major = db.Table('user_major',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('major_id', db.Integer, db.ForeignKey('major.id'))
)

course_major = db.Table('course_major',
    db.Column('course_id', db.Integer, db.ForeignKey('course.id')),
    db.Column('major_id', db.Integer, db.ForeignKey('major.id'))
)

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    password = db.Column(db.String(120))
    total_credits_needed = db.Column(db.Integer)

    majors = db.relationship('Major', backref='user', lazy='dynamic')
    user_courses = db.relationship('User_Course', backref='user', lazy='dynamic')

    university_id = db.Column(db.Integer, db.ForeignKey('university.id'))

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
        return True

    def is_anonymous(self):
        """Anonymous users aren't supported."""
        return False

class Major(db.Model):
    __tablename__ = 'major'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(60))
    credits_needed = db.Column(db.Integer)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __init__(self, name, credits_needed, user_id):
        self.name = name
        self.credits_needed = credits_needed
        self.user_id = user_id


class Course(db.Model):
    __tablename__ = 'course'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(60))
    credit = db.Column(db.Integer)

    user_courses = db.relationship('User_Course', backref='course', lazy='dynamic')
    majors = db.relationship('Major', secondary=course_major, backref='courses')

    university_id = db.Column(db.Integer, db.ForeignKey('university.id'))

class User_Course(db.Model):
    __tablename__ = 'user_course'
    id = db.Column(db.Integer, primary_key=True)
    anticipated_grade = db.Column(db.Integer)
    actual_grade = db.Column(db.Integer)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'))

class University(db.Model):
    __tablename__ = 'university'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))

    courses = db.relationship('Course', backref='university', lazy='dynamic')
    users = db.relationship('User', backref='university', lazy='dynamic')
