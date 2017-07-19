from wtforms import Form, BooleanField, StringField, PasswordField, validators

class RegistrationForm(Form):
    username = StringField('Username', [validators.Length(min=4, max=25)])
    password = StringField('New Password', [validators.DataRequired(), validators.EqualTo('password_confirm', message='Passwords must match')])
    password_confirm = PasswordField('Repeat Password')

class LoginForm(Form):
    username = StringField('Username')
    password = StringField('Password')

class AcademicManagerForm(Form):
    total_credits_needed = IntegerField('Total Credits Needed')
    majors = FieldList(FormField(MajorForm))
    courses = FieldList(FormField(CourseForm))

class MajorForm(Form):
    name = StringField('Major')
    credits_needed = IntegerField('Credits Needed')

class CourseForm(Form):
    name = StringField('Course Title', [validators.Length(min=4, max=25)])
    credits = IntegerField('Credits')
    contributes_to = StringField('Contributes To')
    anticipated_grade = StringField('Anticipated Grade')
    actual_grade = StringField('Actual Grade')
