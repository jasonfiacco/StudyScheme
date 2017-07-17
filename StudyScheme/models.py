from flask_sqlalchemy import SQLAlchemy
from StudyScheme import app
from datetime import datetime

db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    password = db.Column(db.String(120))

    goals = db.relationship('Goal', backref='user', lazy='dynamic')

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

class Goal(db.Model):
    __tablename__ = 'goal'
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(500))
    time = db.Column(db.DateTime)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __init__(self, description, time, user_id):
        self.descrpition = descrpition
        self.time = time
        self.user_id = user_id
