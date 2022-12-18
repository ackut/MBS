from werkzeug.security import generate_password_hash, check_password_hash
from flask import render_template, redirect, url_for, session, request, jsonify
from app import app, db, User


def add_admin(form):
    if check_user_by_login(form['login']):
        return jsonify({
            'status': False,
            'exception': 'Администратор с таким логином уже существует'
        })

    try:
        admin = User(
            login=form['login'],
            password=generate_password_hash(form['password']),
            status=3,
            name=form['name'],
            creator=session['user_login']
        )
        db.session.add(admin)
        db.session.commit()

        return jsonify({
            'status': True,
            'type': 'admin',
            'action': 'add',
            'name': admin.name
        })

    except Exception as ex:
        return jsonify({
            'status': False,
            'exception': 'Произошла неизвестная ошибка'
        })


def check_user_by_login(login: str):
    user = User.query.filter_by(login=login).first()
    return user if user else False


@app.route('/admin/', methods=['GET', 'POST'])
def admin():
    if request.is_json:
        if request.args:
            type = request.args.get('type')

            if type == 'add_admin':
                return add_admin(request.args)

    if session.get('user_status') != 3:
        return redirect(url_for('index'))

    context = {
        'title': 'Админка',
        'User': User
    }

    return render_template('admin.html', context=context)
