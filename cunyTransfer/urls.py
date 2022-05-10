"""
@author: cuny
@file: urls.py
@time: 2022/5/9 20:55
@description: 
传输页面的url，定义在transfer/路由下的所有路由
"""
from django.urls import path
from . import views


urlpatterns = [
    path(r'index', views.index, name='index'),
    path(r'show', views.show, name="show"),
    path(r'findFile', views.fileInfo, name="findFile"),
    path(r'getFile', views.getFile, name="getFile"),
    path(r'downloadFile', views.downloadFile, name="downloadFIle"),
    path(r'deleteFile', views.deleteFile, name="deleteFile"),
    path(r'test', views.test, name="test"),
]