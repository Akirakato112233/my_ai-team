import json

from django.http import JsonResponse


def success_response(data, status_code=200):
    return JsonResponse({"status": "success", "data": data}, status=status_code)


def error_response(errors, status_code=400):
    return JsonResponse({"status": "error", "errors": errors}, status=status_code)


def parse_json_body(request):
    if not request.body:
        return {}

    try:
        return json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        raise ValueError("Invalid JSON body.")


def form_errors(form):
    return {
        field: [error["message"] for error in errors]
        for field, errors in form.errors.get_json_data().items()
    }
