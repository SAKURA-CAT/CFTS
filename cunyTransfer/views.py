from django.shortcuts import render, HttpResponse
from django.http import FileResponse
from django.views.decorators.csrf import csrf_exempt
from CFTS.settings import DEBUG
import json
import os
if DEBUG:
    local_path = os.path.dirname(__file__)
    save_path = os.path.join(local_path, "../tmp")
else:
    save_path = "/tmp"


# 开场主页面
def index(request):
    return render(request, "index.html")


# 文件列表页面
def show(request):
    return render(request, "show.html")


# 向前端传递文件信息
def fileInfo(request):
    def get_FileSize(filePath):
        fsize = os.path.getsize(os.path.join(local_path, "../tmp", filePath))
        fsize = fsize / float(1024 * 1024)
        return round(fsize, 2).__str__() + "MB"
    file_list = os.listdir(save_path)
    file_info = []
    for file in file_list:
        file_format = "unknown" if len(file.split('.')) == 1 else file.split('.')[-1]
        file_info.append({"file_id": len(file_info) + 1,
                          "file_name": file,
                          "file_format": file_format,
                          "file_size": get_FileSize(file)})
    # print(file_info)
    return HttpResponse(json.dumps(file_info, ensure_ascii=False), content_type="application/json charset=utf-8")


# 前端选择文件删除
def deleteFile(request):
    file_name = request.GET.get("file_name")
    os.remove(os.path.join(save_path, file_name))
    return HttpResponse(json.dumps({"status": True}, ensure_ascii=False), content_type="application/json charset=utf-8")


# 前端请求文件下载
@csrf_exempt
def downloadFile(request):
    try:
        filename = request.POST.dict()["file_name"]
        # filename = "test.jpeg"
        file = open(os.path.join(save_path, filename), 'rb')
        response = FileResponse(file)
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = f"attachment;filename={filename}"
        return response
    except KeyError:
        return HttpResponse(json.dumps({"status": True}, ensure_ascii=False), content_type="application/json charset=utf-8")


# 前端上传并保存文件
@csrf_exempt
def getFile(request):
    res = request.FILES  # 获得前端传输到的FILES
    file = res.dict()['file']
    file_name = file.name  # 文件名
    data = file.file.read()  # 得到的文件字节流
    with open(os.path.join(save_path, file_name), 'wb') as f:
        f.write(data)
    return HttpResponse(json.dumps({"status": True}, ensure_ascii=False), content_type="application/json charset=utf-8")


# 测试
def test(request):
    return render(request, "test.html")
