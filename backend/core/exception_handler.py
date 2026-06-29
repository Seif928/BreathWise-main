from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging
import traceback

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    response = exception_handler(exc, context)

    # If response is None, it means DRF didn't handle it (it's a 500 error)
    if response is None:
        logger.error(f"Unhandled Exception: {str(exc)}")
        logger.error(traceback.format_exc())
        
        return Response({
            'error': 'A server error occurred.',
            'detail': str(exc) if context.get('request').user.is_staff else 'Internal server error. Please try again later.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return response
