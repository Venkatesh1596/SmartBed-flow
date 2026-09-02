import pytest
from app.main import app

@pytest.fixture(autouse=True)
def reset_overrides():
    # Save original just in case, but usually {} is safe
    original = app.dependency_overrides.copy()
    yield
    app.dependency_overrides = original
