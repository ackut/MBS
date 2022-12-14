from flask import render_template, redirect, url_for, session
from app import app


@app.route('/admin/', methods=['GET', 'POST'])
def admin():
    if session.get('user_status') != 3:
        return redirect(url_for('index'))

    return render_template('admin.html', title='Админка')