from StudyScheme import app
from flask import Flask, request, session, jsonify, g, redirect, url_for, abort, \
    render_template, flash
import os
from .models import User, Major, Course, db
from .forms import *
from flask_login import LoginManager, login_user, logout_user, current_user, login_required

db.init_app(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"


@app.route('/')
def main():
    return redirect(url_for('index'))


@app.route('/index')
def index():
    return render_template('index.html')

@login_manager.user_loader
def user_loader(user_id):
    """Given user_id, return the associated User object."""
    return User.query.get(int(user_id))


@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegistrationForm(request.form)
    if request.method == 'POST' and form.validate():
        if not User.query.filter_by(username=form.username.data).first():
            new_user = User(form.username.data, form.password.data)
            new_user.authenticated = True
            db.session.add(new_user)
            db.session.commit()
            flash('User successfully registered')
            login_user(new_user, remember=True)
            return redirect(url_for('editor'))
        else:
            flash('User already exists')
    return render_template('register.html', form=form)

@app.route('/login', methods=['GET', 'POST'])
def login():
    """For GET requests, display login form, for POSTS, login the user by processing data."""
    form = LoginForm(request.form)
    if request.method == 'POST' and form.validate():
        registered_user = User.query.filter_by(username=form.username.data, password=form.password.data).first()
        if registered_user:
            registered_user.authenticated = True
            login_user(registered_user, remember=True)
            return redirect(url_for('editor'))
        else:
            flash('Username or password is invalid')
    return render_template('login.html', form=form)

@app.route('/logout')
@login_required
def logout():
    current_user.authenticated = False
    logout_user()
    return redirect("index")

@app.route('/editor', methods=['GET'])
@login_required
def editor():
    return render_template('editor.html')

@app.route('/academic_manager', methods=['GET'])
@login_required
def academic_manager():
    if request.method == 'GET':
        return jsonify({'id': current_user.id, 'credits_needed': current_user.total_credits_needed, 'majors': [jsonify_major(major) for major in current_user.majors], 'courses': [jsonify_course(course) for course in current_user.courses] })

@app.route('/academic_manager/create_major', methods=['POST'])
@login_required
def create_major():
    #if not request.json:
     #   abort(400)

    new_major = Major(' ', 0, current_user.id)
    db.session.add(new_major)
    db.session.commit()
    return jsonify( {'major': jsonify_major(new_major)} ), 201

@app.route('/academic_manager/update_majors', methods=['PUT'])
@login_required
def update_majors():
     for updated_major in request.json['majors']:
         major = Major.query.get(int(updated_major['id']))
         major.name = updated_major['name']
         major.credits_needed = updated_major['credits_needed']
         db.session.commit()
     return jsonify({'majors': [jsonify_major(major) for major in current_user.majors]}), 200

@app.route('/academic_manager/delete_major', methods=['DELETE'])
@login_required
def delete_major():
    if not request.json:
        abort(400)
    major = Major.query.get(int(request.json['id']))
    db.session.delete(major)
    db.session.commit()
    return jsonify({'majors': [jsonify_major(major) for major in current_user.majors]}), 202

def jsonify_major(major):
    new_major = {}
    new_major['id'] = major.id
    new_major['name'] = major.name
    new_major['credits_needed'] = major.credits_needed
    course_ids = []
    for course in major.courses:
        course_ids.append(course.id)
    new_major['courses'] = course_ids
    return new_major

#Course controllers
@app.route('/academic_manager/create_course', methods=['POST'])
@login_required
def create_course():
    if not request.json['semester']:
        abort(400)
    new_course = Course(' ', 1, request.json['semester'], -1, -1, current_user.id)
    db.session.add(new_course)
    db.session.commit()
    return jsonify( {'course': jsonify_course(new_course)} ), 201

@app.route('/academic_manager/update_courses', methods=['PUT'])
@login_required
def update_courses():
     for updated_course in request.json['courses']:
         course = Course.query.get(int(updated_course['id']))
         course.name = updated_course['name']
         course.credits = updated_course['credits']
         course.semester = updated_course['semester']
         course.anticipated_grade = updated_course['anticipated_grade']
         course.actual_grade = updated_course['actual_grade']
         course.majors = list(Major.query.filter(Major.id.in_(updated_course['majors'])).all())
         db.session.commit()
     return jsonify({'courses': [jsonify_course(course) for course in current_user.courses]}), 200

@app.route('/academic_manager/delete_course', methods=['DELETE'])
@login_required
def delete_course():
    if not request.json['semester']:
        abort(400)
    course = Course.query.get(int(request.json['id']))
    db.session.delete(course)
    db.session.commit()
    return jsonify({'courses': [jsonify_course(course) for course in current_user.courses]}), 202

def jsonify_course(course):
    new_course = {}
    new_course['id'] = course.id
    new_course['name'] = course.name
    new_course['credits'] = course.credits
    new_course['semester'] = course.semester
    new_course['anticipated_grade'] = course.anticipated_grade
    new_course['actual_grade'] = course.actual_grade
    major_ids = []
    for major in course.majors:
        major_ids.append(major.id)
    new_course['majors'] = major_ids
    return new_course

@app.route('/academic_manager/update_user', methods=['PUT'])
@login_required
def updated_user():
    current_user.total_credits_needed = int(request.json['creditsNeeded'])
    db.session.commit()
    return jsonify({'id': current_user.id} ), 200
