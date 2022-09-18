from ckeditor_uploader.utils import get_media_url, storage
from ckeditor_uploader.views import get_upload_filename
from rest_framework.response import Response
from rest_framework.views import APIView


class CKEditorUploadAPIView(APIView):
    def post(self, request, *args, **kwargs):
        uploaded_file = self.request.data['upload']
        filepath = get_upload_filename(uploaded_file.name, request)
        saved_path = storage.save(filepath, uploaded_file)
        return Response({
            "url": get_media_url(saved_path)
        })
