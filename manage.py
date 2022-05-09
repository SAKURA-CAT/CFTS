#!/usr/bin/env python3
"""Django's command-line utility for administrative tasks."""
import os


def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'CFTS.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    # 修改以下格式实现django的相关操作
    execute_from_command_line(['/opt/project/manage.py', 'startapp', 'transfer'])


if __name__ == '__main__':
    main()
