from werkzeug.security import generate_password_hash
from flask import Flask
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy


DEBUG = True
SECRET_KEY = '0c19e6ed-08a3-46cf-aecf-584f9213ee55'
SQLALCHEMY_DATABASE_URI = 'sqlite:///database.db'

app = Flask(__name__)
app.config.from_object(__name__)
db = SQLAlchemy(app)


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    login = db.Column(db.String(16), unique=True)
    password = db.Column(db.String(500), nullable=False)
    status = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(32), nullable=False)
    creator = db.Column(db.String(16), nullable=False)
    creation_date = db.Column(db.DateTime, default=datetime.now())

    def __repr__(self):
        return f'<user {self.id}>'


def create_root():
    if not User.query.all():
        root = User(
            login='root',
            password=generate_password_hash('root'),
            status=3,
            name='Root',
            creator='System'
        )
        db.session.add(root)
        db.session.commit()


# class Student(db.Model):
#     __tablename__ = 'students'
#     id = db.Column(db.Integer, primary_key=True)
#     group_id = db.Column(db.Integer, nullable=False)
#     name = db.Column(db.String(32), nullable=False)  # Фамилия Имя студента.
#     login = db.Column(db.String(16), unique=True)  # Номер зачётки.
#     creator = db.Column(db.String(16), nullable=False)
#     creation_date = db.Column(db.DateTime, default=datetime.now())

#     def __repr__(self):
#         return f'<student {self.id}>'


# class Subject(db.Model):
#     __tablename__ = 'subjects'
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(32), nullable=False)  # Название предмета.
#     creator = db.Column(db.String(16), nullable=False)
#     creation_date = db.Column(db.DateTime, default=datetime.now())

#     def __repr__(self):
#         return f'<subject {self.id}>'


# class Grade(db.Model):
#     __tablename__ = 'grades'
#     id = db.Column(db.Integer, primary_key=True)
#     subject_id = db.Column(db.String(32), nullable=False)  # Название предмета.
#     student_id = db.Column(db.Integer, nullable=False)  # Студент.
#     teacher_id = db.Column(db.String(16), nullable=False)  # Преподаватель.
#     creation_date = db.Column(db.DateTime, default=datetime.now())

#     def __repr__(self):
#         return f'<grade {self.id}>'


# class Logs(db.Model):
#     __tablename__ = 'logs'
#     id = db.Column(db.Integer, primary_key=True)
#     priority = db.Column(db.Integer, nullable=False)
#     creator = db.Column(db.String(16), nullable=False)
#     text = db.Column(db.String(500), nullable=False)
#     exception = db.Column(db.String(500))
#     creation_date = db.Column(db.DateTime, default=datetime.now())

#     def __repr__(self):
#         return f'<logs {self.id}>'


# def logger(priority: int, creator: str, text: str, exception: str = ''):
#     logs = Logs(priority=priority, creator=creator, text=text, exception=exception)
#     db.session.add(logs)
#     db.session.commit()

#     if DEBUG:
#         print(f'>>> {text}\n{exception}')


with app.app_context():
    db.create_all()
    create_root()