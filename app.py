"""
=============================================================================
🏛️ NATIONAL TREASURY ICT ASSET INVENTORY MANAGEMENT SYSTEM
Features:
- Pure MySQL Database Backend (user: root, password: root123, db: treasury_db)
- Deployment-ready (Supports DATABASE_URL / PORT environment variables)
- Layout: Model -> Brand -> Serial Number -> Category -> Status -> Assigned To
- Add, Edit (Modal), and Delete Assets
- Single Search Bar with "Product Not Available" Banner
- CSV Export and CSV Import
=============================================================================
"""

from flask import Flask, render_template, request, redirect, url_for, session, Response, flash
from flask_sqlalchemy import SQLAlchemy
import os
import csv
import io
import re

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'national_treasury_secret_key_2026')

# =============================================================================
# 💾 DATABASE CONFIGURATION (Supports Local MySQL and Cloud DATABASE_URL)
# =============================================================================
MYSQL_USER = os.environ.get('DB_USER', 'root')
MYSQL_PASSWORD = os.environ.get('DB_PASSWORD', 'root123')
MYSQL_HOST = os.environ.get('DB_HOST', '127.0.0.1:3306')
MYSQL_DB = os.environ.get('DB_NAME', 'treasury_db')

default_uri = f'mysql+mysqlconnector://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}/{MYSQL_DB}?ssl_disabled=True'
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', default_uri)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Engine options for local and cloud compatibility
if "mysql" in app.config['SQLALCHEMY_DATABASE_URI']:
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        "connect_args": {"ssl_disabled": True}
    }

db = SQLAlchemy(app)

# =============================================================================
# 🏛️ ASSET MODEL
# =============================================================================
class Asset(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    model = db.Column(db.String(100), nullable=False)
    brand = db.Column(db.String(100), nullable=False)
    serial_number = db.Column(db.String(50), unique=True, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(30), default='In Store')
    assigned_to = db.Column(db.String(120), default='Unassigned')

# =============================================================================
# 🔐 AUTHENTICATION
# =============================================================================
ADMIN_USER = os.environ.get('ADMIN_USER', 'admin')
ADMIN_PASS = os.environ.get('ADMIN_PASS', 'Treasury@2026')

def validate_password_format(password):
    if len(password) < 8 or len(password) > 32:
        return False, "Password must be between 8 and 32 characters."
    if not re.search(r'[A-Z]', password):
        return False, "Password must include at least one uppercase letter (A-Z)."
    if not re.search(r'[a-z]', password):
        return False, "Password must include at least one lowercase letter (a-z)."
    if not re.search(r'[0-9]', password):
        return False, "Password must include at least one number (0-9)."
    
    special_characters = set("@$!%*?&#^~_-+=.()<>{}[],:;/\\|`'\"")
    if not any(char in special_characters for char in password):
        return False, "Password must include at least one special symbol (@$!%*?&# etc)."
    return True, "Valid"

# =============================================================================
# 🚦 ROUTES
# =============================================================================

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        user = request.form.get('username', '').strip()
        pw = request.form.get('password', '')

        valid, msg = validate_password_format(pw)
        if not valid:
            flash(msg, "danger")
            return render_template('login.html', user=user)

        if user == ADMIN_USER and pw == ADMIN_PASS:
            session['logged_in'] = True
            session['user'] = user
            return redirect(url_for('index'))
        else:
            flash("Invalid credentials.", "danger")
            return render_template('login.html', user=user)

    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    return redirect(url_for('login'))

@app.route('/')
def index():
    if not session.get('logged_in'):
        return redirect(url_for('login'))

    search = request.args.get('search', '').strip()
    cat_filter = request.args.get('cat_filter', 'All')

    query = Asset.query.order_by(Asset.model.asc(), Asset.brand.asc())

    if cat_filter and cat_filter != 'All':
        query = query.filter(Asset.category == cat_filter)

    if search:
        query = query.filter(
            (Asset.model.ilike(f'%{search}%')) |
            (Asset.brand.ilike(f'%{search}%')) |
            (Asset.serial_number.ilike(f'%{search}%')) |
            (Asset.assigned_to.ilike(f'%{search}%'))
        )

    assets = query.all()
    not_available = bool(search and len(assets) == 0)

    categories = ["Laptop", "CPU", "Printer", "Server", "Network", "Monitor", "Tablet"]
    return render_template(
        'index.html',
        assets=assets,
        search=search,
        current_cat=cat_filter,
        categories=categories,
        not_available=not_available
    )

@app.route('/add', methods=['POST'])
def add():
    if not session.get('logged_in'):
        return redirect(url_for('login'))

    model = request.form.get('model', '').strip()
    brand = request.form.get('brand', '').strip()
    sn = request.form.get('sn', '').strip()
    cat = request.form.get('category', '').strip()
    status = request.form.get('status', 'In Store')
    assigned = request.form.get('assigned_to', 'Unassigned').strip()

    if sn and model and brand and cat:
        existing = Asset.query.filter_by(serial_number=sn).first()
        if existing:
            flash(f"Serial Number '{sn}' already exists in registry!", "danger")
        else:
            db.session.add(Asset(
                model=model,
                brand=brand,
                serial_number=sn,
                category=cat,
                status=status,
                assigned_to=assigned
            ))
            db.session.commit()
            flash("Asset added successfully.", "success")
    return redirect(url_for('index'))

@app.route('/edit/<int:id>', methods=['POST'])
def edit(id):
    if not session.get('logged_in'):
        return redirect(url_for('login'))

    asset = Asset.query.get(id)
    if not asset:
        flash("Asset not found.", "danger")
        return redirect(url_for('index'))

    model = request.form.get('model', '').strip()
    brand = request.form.get('brand', '').strip()
    sn = request.form.get('sn', '').strip()
    cat = request.form.get('category', '').strip()
    status = request.form.get('status', 'In Store').strip()
    assigned = request.form.get('assigned_to', 'Unassigned').strip()

    if sn and model and brand and cat:
        existing = Asset.query.filter(Asset.serial_number == sn, Asset.id != id).first()
        if existing:
            flash(f"Cannot update: Serial Number '{sn}' is already registered to another asset!", "danger")
        else:
            asset.model = model
            asset.brand = brand
            asset.serial_number = sn
            asset.category = cat
            asset.status = status
            asset.assigned_to = assigned
            db.session.commit()
            flash(f"Asset '{sn}' updated successfully!", "success")
    return redirect(url_for('index'))

@app.route('/delete/<int:id>')
def delete(id):
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    asset = Asset.query.get(id)
    if asset:
        db.session.delete(asset)
        db.session.commit()
        flash("Asset deleted.", "info")
    return redirect(url_for('index'))

@app.route('/export')
def export_csv():
    if not session.get('logged_in'):
        return redirect(url_for('login'))

    assets = Asset.query.order_by(Asset.model.asc(), Asset.brand.asc()).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['Model', 'Brand', 'Serial Number', 'Category', 'Status', 'Assigned To'])
    for a in assets:
        writer.writerow([a.model, a.brand, a.serial_number, a.category, a.status, a.assigned_to])
    output.seek(0)
    return Response(
        output,
        mimetype="text/csv",
        headers={"Content-disposition": "attachment; filename=treasury_inventory.csv"}
    )

@app.route('/import', methods=['POST'])
def import_csv():
    if not session.get('logged_in'):
        return redirect(url_for('login'))

    file = request.files.get('file')
    if file:
        stream = io.StringIO(file.stream.read().decode("UTF8", errors="ignore"), newline=None)
        reader = csv.reader(stream)
        next(reader, None)
        for row in reader:
            if len(row) >= 4:
                model = row[0].strip()
                brand = row[1].strip()
                sn = row[2].strip()
                cat = row[3].strip()
                if sn and not Asset.query.filter_by(serial_number=sn).first():
                    db.session.add(Asset(
                        model=model,
                        brand=brand,
                        serial_number=sn,
                        category=cat,
                        status=row[4].strip() if len(row) > 4 else 'In Store',
                        assigned_to=row[5].strip() if len(row) > 5 else 'Unassigned'
                    ))
        db.session.commit()
        flash("CSV data imported successfully.", "success")
    return redirect(url_for('index'))

# =============================================================================
# 🚀 APP ENTRY POINT
# =============================================================================
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)