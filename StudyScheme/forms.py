from wtforms import Form, BooleanField, StringField, PasswordField, validators

class RegistrationForm(Form):
    username = StringField('Username', [validators.Length(min=4, max=25)])
    password = StringField('New Password', [validators.DataRequired(), validators.EqualTo('password_confirm', message='Passwords must match')])
    password_confirm = PasswordField('Repeat Password')

class LoginForm(Form):
    username = StringField('Username')
    password = StringField('Password')
