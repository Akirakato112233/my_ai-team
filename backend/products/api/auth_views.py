from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .helpers import error_response, parse_json_body, success_response


@csrf_exempt
@require_http_methods(["POST"])
def login(request):
    try:
        payload = parse_json_body(request)
    except ValueError as error:
        return error_response({"body": [str(error)]})

    username = str(payload.get("username", "")).strip()
    password = str(payload.get("password", "")).strip()
    errors = {}

    if not username:
        errors["username"] = ["Username is required."]
    if not password:
        errors["password"] = ["Password is required."]

    if errors:
        return error_response(errors)

    return success_response(
        {
            "message": "Login request accepted.",
            "user": {"username": username},
        }
    )
