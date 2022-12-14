from flask import redirect, url_for, session
from app import app, db, create_root
import index, auth, admin


@app.route('/clear/', methods=['GET', 'SET'])
def clear():
    session.clear()
    return redirect(url_for('auth'))


if __name__ == '__main__':
    app.run()
