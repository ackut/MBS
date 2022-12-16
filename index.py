from flask import render_template, redirect, url_for, session
from app import app


@app.route('/', methods=['GET', 'POST'])
def index():
    if not session.get('user_status'):
        return redirect(url_for('auth'))

    context = {
        'title': 'Таблица'
    }

    return render_template('index.html', context=context)