from flask import Flask

app = Flask(__name__)
app.config.from_object(__name__)

app.config.update(dict(
    SECRET_KEY='development key',
    USERNAME='admin',
    PASSWORD='default',
    SQLALCHEMY_DATABASE_URI='',
    SQLALCHEMY_TRACK_MODIFICATIONS = False
))
app.config.from_envvar('STUDYSCHEME_SETTINGS', silent=True)

from StudyScheme.views import *

if __name__ == '__main__':
    app.run()
