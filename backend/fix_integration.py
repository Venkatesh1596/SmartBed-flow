import os

filepath = 'app/tests/test_integration.py'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

setup_db_code = """
    bed = Bed(name="T101", ward_id=ward.id, state=BedState.OCCUPIED)
    db.add(bed)
    db.commit()

    from app.models.user import User, Role
    role = Role(name="ADMIN")
    db.add(role)
    db.commit()
    db.refresh(role)
    user = User(username="testadmin", hashed_password="dummy", role_id=role.id)
    db.add(user)
    db.commit()

    db.close()
    yield"""

text = text.replace('    bed = Bed(name="T101", ward_id=ward.id, state=BedState.OCCUPIED)\n    db.add(bed)\n    db.commit()\n    db.close()\n    yield', setup_db_code)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)
