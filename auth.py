from flask import render_template, redirect, url_for, session, request
from app import app, User


def get_user_by_login(login: str):
    user = User.query.filter_by(login=login).first()
    if user:
        return user
    return False


def auth_user(user: User):
    session['user_status'] = user.status


@app.route('/auth/', methods=['GET', 'POST'])
def auth():
    if request.method == 'POST':
        user_login = request.form.get('login')
        user_password = request.form.get('password')
        
        if not user_login or not user_password:
            return False

        user = get_user_by_login(user_login)
        auth_user(user)

        
    if 'user_status' in session:
        if session['user_status'] == 3:
            return redirect(url_for('admin'))

        return redirect(url_for('index'))


    return render_template('auth.html', title='Авторизация')