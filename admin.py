from werkzeug.security import generate_password_hash, check_password_hash
from flask import render_template, redirect, url_for, session, request, jsonify
from app import app, db, User


def add_admin(form):
    if check_admin_by_login(form['login']):
        return jsonify({ 'status': False })

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
            'type': 'add_admin',
            'name': admin.name
        })

    except Exception as ex:
        print('Ошибка добавления админа.')
    
    return jsonify({ 'status': False })


def check_admin_by_login(login: str):
    admin = User.query.filter_by(login=login).first()
    return admin if admin else False


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